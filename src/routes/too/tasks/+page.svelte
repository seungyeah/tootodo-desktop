<script lang="ts">
    import PageTemplete from "$components/PageTemplete.svelte";
    import {createTreeView} from "@melt-ui/svelte";
    import {
        onMount,
        setContext,
    } from "svelte";
    import TaskGantt from "$components/task/TaskGanttMain.svelte";
    import TaskCreateChat from "$components/task/TaskCreateChat.svelte";
    import DurationPicker from "$components/task/DurationPicker.svelte";
    import {goto} from "$app/navigation";
    import {derived, writable, type Writable} from "svelte/store";
    import {postApi, delApi, patchApi} from "$lib/api.js";
    import {type Task} from "$lib/schema";
    import {
        type DateRange,
        getThis3WeeksRange,
        parseDateRangeFromURL,
    } from "$lib/utils";
    import TaskTree from "$components/task/TaskTree.svelte";
    import type {
        TaskCreationMode,
        TaskDeleteOption,
        TaskTreeItem,
    } from "$lib/type.js";
    import {invoke} from "@tauri-apps/api/core";
    import {page} from "$app/state";
    import TwoOptTab from "$components/TwoOptTab.svelte";
    import Tab from "$components/TwoOptTab.svelte";
    import {ScrollArea, Table} from "$ui";
    import {CalendarDays, Clock, Clock1, Diamond, Milestone, Square, SquareCheck} from "lucide-svelte";

    let changeMode = $state(true);

    let treeItems = writable([]);
    setContext("treeItems", treeItems);

    // treeview
    const ctx = createTreeView({
        // expand all tasks that have subtasks
        //defaultExpanded: $treeItems.map((item) => item.subtasks?.length ? item.task.id: null),
        defaultExpanded: [],
    });

    const {
        elements: {tree},
    } = ctx;

    setContext("tree", ctx);

    ///////// duration select
    let initialDateRange = parseDateRangeFromURL() || getThis3WeeksRange();

    const selectedDateRange = writable<DateRange>(initialDateRange);
    setContext("selectedDateRange", selectedDateRange);

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get("startDate") || !urlParams.get("endDate")) {
            await setQuery(getThis3WeeksRange());
        }
    });

    ///////// req api
    async function setQuery(duration) {
        $selectedDateRange = duration;
        const startDate = duration.start;
        const endDate = duration.end;
        const searchParams = new URLSearchParams({startDate, endDate});
        goto(`?${searchParams.toString()}`);

    }

    $effect(() => {
        const {start, end} = $selectedDateRange;

        invoke("fetch_tasks", {
            startDate: start.toString(),
            endDate: end.toString(),
        })
            .then((tasks) => {
                $treeItems = tasks;
            })
            .catch(console.error);
    });


    async function handleUpdateTask({task, updateData}) {
        console.info("update task", updateData);

        // task가 변경되지 않았을 경우, 무시
        const hasChanged = Object.entries(updateData).some(([key, value]) => {
            return !(key in task) || task[key] !== value;
        });

        if (!hasChanged) {
            console.info("nothing changed");
            return;
        }

        // 변경된 task를 api로 전송
        const {id, parent_id} = task;

        try {
            const res = await patchApi({
                path: `/tasks/${id}`,
                data: updateData,
            });

            const updatedTask = res.data?.task;

            treeItems.update(($tasks) => {
                if (parent_id) {
                    // Find the parent task using parent_id
                    const parentItem = findTaskById($tasks, parent_id);
                    if (parentItem && parentItem.subtasks) {
                        // Update the subtask with the updated task
                        const subtaskIndex = parentItem.subtasks.findIndex(
                            (item) => item.task.id === id,
                        );
                        if (subtaskIndex !== -1) {
                            parentItem.subtasks[subtaskIndex].task =
                                updatedTask;
                            //console.info(parentItem.subtasks[subtaskIndex].task);
                        }
                    }
                } else {
                    // Update the task with the updated task
                    const index = $tasks.findIndex(
                        (item) => item.task.id === id,
                    );
                    if (index !== -1) {
                        $tasks[index].task = updatedTask;
                        //console.info($tasks[index].task);
                    }
                }

                return $tasks;
            });
            await tick();
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    async function handleCreateTask(task: Task, mode: TaskCreationMode) {
        if (!task) {
            return;
        }

        let formattedTask: Partial<Task> = {};
        formattedTask.startDate = formatDate(task.startDate);
        formattedTask.endDate = formatDate(task.endDate);
        formattedTask.parent_id = "";

        if (mode === "CREATE_TASK_WITH_TITLE") {
            formattedTask.title = task.title;
        } else {
            formattedTask.title = "";

            if (mode === "CREATE_TASK_FROM_TASK") {
                formattedTask.parent_id = task?.parent_id;
            }

            if (mode === "CREATE_SUBTASK_FROM_TASK") {
                formattedTask.parent_id = task.id;
            }
        }

        invoke("create_task", {...formattedTask})
            .then(async (newTask) => {
                if (
                    mode === "CREATE_TASK_FROM_TASK" ||
                    mode === "CREATE_SUBTASK_FROM_TASK"
                ) {
                    treeItems.update(($tasks) => {
                        const parentItem = findTaskById(
                            $tasks,
                            formattedTask.parent_id,
                        );
                        if (parentItem) {
                            if (!parentItem.subtasks) {
                                parentItem.subtasks = [];
                            }
                            parentItem.subtasks.push({task: newTask});
                        }
                        return $tasks;
                    });
                } else {
                    console.log(newTask);
                    $treeItems = [
                        ...$treeItems,
                        {task: newTask, subtasks: []},
                    ];
                }

                await tick();
            })
            .catch((e) => console.error("Fail to fetch tasks", e));
    }

    async function handleDeleteTask(task: Task, option: TaskDeleteOption) {
        const {id, parent_id} = task;
        try {
            await delApi({path: `/tasks/${id}`, data: option});

            treeItems.update(($tasks) => {
                if (parent_id) {
                    // Find the parent task using parent_id
                    const parentItem = findTaskById($tasks, parent_id);
                    if (parentItem && parentItem.subtasks) {
                        // Remove the subtask from the parent's subtasks
                        parentItem.subtasks = parentItem.subtasks.filter(
                            (item) => item.task.id !== id,
                        );
                    }
                } else {
                    // If no parent_id, remove the task from the root level
                    if (option === "CONVERT_SUBTASK_TO_TASK") {
                        // Find the task to remove from the root level
                        const itemToRemove = $tasks.find(
                            (item) => item.task.id === id,
                        );

                        if (itemToRemove) {
                            const subtasks = itemToRemove.subtasks || [];

                            $tasks = $tasks.filter(
                                (item) => item.task.id !== id,
                            );

                            // Convert each subtask into a root-level task and add to $tasks
                            const convertedTasks = subtasks.map((subtask) => ({
                                task: subtask.task, // Assuming subtask has a 'task' property
                                subtasks: [], // Initialize with empty subtasks
                            }));

                            // Append the converted subtasks to the root tasks
                            $tasks = [...$tasks, ...convertedTasks];
                        }
                    } else {
                        // If option is not "CONVERT_SUBTASK_TO_TASK", simply remove the task
                        $tasks = $tasks.filter((item) => item.task.id !== id);
                    }
                }

                return $tasks;
            });

            await tick();
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    setContext("handleUpdateTask", handleUpdateTask);
    setContext("handleDeleteTask", handleDeleteTask);
    setContext("handleCreateTask", handleCreateTask);

    function formatDate(date: string | null): string | null {
        return date ? new Date(date).toISOString().split("T")[0] : null;
    }

    function findTaskById(
        items: TaskTreeItem[],
        taskId: string,
    ): TaskTreeItem | null {
        for (let item of items) {
            if (item.task.id === taskId) {
                return item;
            } else if (item.subtasks && item.subtasks.length > 0) {
                const found = findTaskById(item.subtasks, taskId);
                if (found) return found;
            }
        }
        return null;
    }

    ///////// scroll
    let scrollPosition = {scrollTop: 0, scrollLeft: 0};
    let sideComponent;
    let mainComponent;

    function handleScroll(e) {
        scrollPosition = {
            scrollTop: e.detail.scrollTop,
            scrollLeft: e.detail.scrollLeft,
        };
        mainComponent.updateScrollPosition(scrollPosition);
        sideComponent.updateScrollPosition(scrollPosition);
    }
</script>

<PageTemplete {changeMode}>
    {#snippet side()}
        <div class="flex flex-col w-[calc(100%-8px)] -translate-x-1 h-full px-2 py-2 ">
            <TaskCreateChat
                    on:create={handleCreateTask}
                    on:update={handleUpdateTask}
            />
        </div>
    {/snippet}

    {#snippet main_side()}
        <div class="flex flex-col w-1/3 ">
            <!--filter-->
            <div class="flex w-full h-10 ">
                <DurationPicker update={(newRange)=>setQuery(newRange)}/>
            </div>
            <!--task list-->
            <TwoOptTab class="w-full h-full mt-2">
                {#snippet tab1()}
                    <div
                            {...$tree}
                            class=" w-full bg-white h-[calc(100%-70px)] max-h-[calc(100%-70px)] "
                    >
                        <TaskTree
                                bind:treeItems={$treeItems}
                                bind:this={sideComponent}
                                bind:scrollPosition
                                on:scroll={handleScroll}
                                on:update={handleUpdateTask}
                        />
                    </div>
                {/snippet}
                {#snippet tab2()}
                    <div
                            {...$tree}
                            class=" w-full bg-white h-[calc(100%-70px)] max-h-[calc(100%-70px)] "
                    >
                        <TaskTree
                                bind:treeItems={$treeItems}
                                bind:this={sideComponent}
                                bind:scrollPosition
                                on:scroll={handleScroll}
                                on:update={handleUpdateTask}
                        />
                    </div>
                {/snippet}
            </TwoOptTab>
        </div>
    {/snippet}

    {#snippet main()}
        <!-- today position line, gantt chart -->
        <div
                {...$tree}
                class="w-full h-full font-mono"
        >
            <TaskGantt
                    bind:this={mainComponent}
                    on:scroll={handleScroll}
                    bind:treeItems={$treeItems}
            />
        </div>
    {/snippet}

    {#snippet change_main()}
        <ScrollArea class="w-full h-full border-2 border-zinc-700 px-2 max-h-full overflow-y-auto">
            <Table.Root class="relative table-fixed ">
                <Table.Header >
                    <Table.Row>
                        <Table.Head class="w-60  min-w-60 max-w-60 ">Title</Table.Head>
                        <Table.Head class="w-7">
                            <SquareCheck size="20"/>
                        </Table.Head>
                        <Table.Head class="w-7">
                            <Milestone size="20"/>
                        </Table.Head>
                        <Table.Head class="w-7 ">
                            <Diamond size="20"/>
                        </Table.Head>
                        <Table.Head class="w-full">
                            <CalendarDays size="20" class="m-auto"/>
                        </Table.Head>
                        <Table.Head class="w-32 min-w-32 max-w-32">
                            <Clock size="20" class="m-auto"/>
                        </Table.Head>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {#each Array(22) as _}
                        <Table.Row>
                            <Table.Cell class=" font-medium">INV001</Table.Cell>
                            <Table.Cell>
                                <Square size="20"/>
                            </Table.Cell>
                            <Table.Cell>
                                <Square size="20" fill="#b03956" class="text-black/70"/>
                            </Table.Cell>
                            <Table.Cell>
                                <Diamond size="20" fill="black"/>
                            </Table.Cell>
                            <Table.Cell>from - to</Table.Cell>
                            <Table.Cell class="font-digital">2:30 / 15:30</Table.Cell>
                        </Table.Row>
                    {/each}

                </Table.Body>

            </Table.Root>
        </ScrollArea>
    {/snippet}
</PageTemplete>