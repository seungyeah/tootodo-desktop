<script lang="ts">
    import { Button } from "$ui";
    import PageTemplete from "$components/PageTemplete.svelte";
    import {
        endOfMonth,
        endOfWeek,
        getLocalTimeZone,
        startOfWeek,
        today,
    } from "@internationalized/date";
    import {
        WeeklyChat,
        Plan,
        Result,
        TaskList,
        DurationPicker,
    } from "$components/schedule";
    import Memo from "$components/memo/Memo.svelte";
    import { currentTime } from "$store";
    import { createTreeView } from "@melt-ui/svelte";
    import { setContext } from "svelte";

    import { writable } from "svelte/store";
    import { invoke } from "@tauri-apps/api/core";
    import {
        type DateRange,
        getThisWeekRange,
        parseDateRangeFromURL,
    } from "$lib/utils";
    import { goto } from "$app/navigation";
    import WeeklyTaskPlan from "$components/schedule/WeeklyTaskPlan.svelte";
    import HabitList from "$components/schedule/HabitList.svelte";
    import AddTaskOrHabit from "$components/schedule/AddTaskOrHabit.svelte";

    let data = $state({ tasks: [] });
    let changeMode = $state(false);
    let weekRange = writable<DateRange>(getThisWeekRange());
    const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let selectedWeek = $state(null);
    let isTransitioning = $state(false);

    function setQuery(duration) {
        $weekRange = duration;
        const startDate = $weekRange.start;
        const endDate = $weekRange.end;
        const searchParams = new URLSearchParams({ startDate, endDate });
        goto(`?${searchParams.toString()}`);
    }

    let monday_date = $derived(
        $weekRange?.start?.day ||
            startOfWeek(today(getLocalTimeZone()), "fr-FR").day,
    );

    $effect(() => {
        invoke("fetch_tasks", {
            startDate: $weekRange.start.toString(),
            endDate: $weekRange.end.toString(),
        })
            .then((tasks) => {
                data.tasks = tasks;
            })
            .catch(console.error);
    });

    // treeview
    let treeItems = $derived(writable(data?.tasks || []));
    setContext("treeItems", treeItems);

    const ctx = createTreeView({
        defaultExpanded: [],
    });

    const {
        elements: { tree },
    } = ctx;

    setContext("tree", ctx);

    function sort_tasks() {
        // duration 기준으로 정렬 (startDate가 빠른 것부터 정렬 -> endDate가 느린것부터 정렬)
        return (a, b) => {
            const diff = new Date(a.startDate) - new Date(b.startDate);
            if (diff === 0) {
                return new Date(b.endDate) - new Date(a.endDate);
            } else {
                return diff;
            }
        };
    }

    ///////// scroll
    let scrollPosition = $state({ scrollTop: 0 });
    let taskListComponent = $state();
    let weeklyTaskPlanComponents = $state([]);

    function handleScroll(e) {
        scrollPosition = {
            scrollTop: e.target.scrollTop,
        };

        if (taskListComponent) {
            taskListComponent.updateScrollPosition(scrollPosition);
        }

        weeklyTaskPlanComponents.forEach((component) => {
            if (component) {
                component.updateScrollPosition(scrollPosition);
            }
        });
    }

    // handle task
    let newTaskTitle = $state("");

    function handleCreateTask() {
        invoke("create_task", {
            title: newTaskTitle,
            parent_id: "",
            startDate: $weekRange.start.toString(),
            endDate: $weekRange.end.toString(),
        }).then((newTask) => {
            $treeItems = [...$treeItems, { task: newTask, subtasks: [] }];
            newTaskTitle = "";
        });
    }

    function handleWeekSelect(weekIndex) {
        isTransitioning = true;
        setTimeout(() => {
            selectedWeek = weekIndex;
            isTransitioning = false;
        }, 400); // match transition duration
    }

    function handleBackToWeekly() {
        isTransitioning = true;
        setTimeout(() => {
            selectedWeek = null;
            isTransitioning = false;
        }, 400);
    }
</script>

<PageTemplete {changeMode}>
    <!-- side: memo -->
    {#snippet side()}
        <div
            class="p-2 px-3 rounded-l-lg bg-white h-full w-full max-w-full border-neutral-400"
        >
            <Memo />
        </div>
    {/snippet}

    <!-- main: schedule-->
    <!-- weekly -->
    {#snippet main_side()}
        {#if selectedWeek === null}
            <div
                {...$tree}
                class="h-full relative flex flex-col space-y-4 pt-1 w-1/3 min-w-[310px] rounded-l-lg p-2 pr-3.5"
            >
                <DurationPicker
                    update={(weekRange: DateRange) => setQuery(weekRange)}
                />

                <!-- task list -->
                <div
                    class="flex-col flex h-[calc(40%+50px)] min-h-[calc(40%+50px)] space-y-1.5 -translate-y-1 p-0 w-full rounded-lg shadow-md bg-white"
                >
                    <TaskList
                        bind:this={taskListComponent}
                        treeItems={$treeItems}
                        on:scroll={handleScroll}
                    />
                    <!-- task filter -->
                    <div
                        class="flex justify-between items-center p-4 bg-neutral-100 h-10 rounded-b-lg"
                    >
                        Critical Path
                        <Button
                            variant="ghost"
                            size="sm"
                            class="aspect-square rounded-full bg-white h-7"
                        ></Button>
                        Status
                        <Button
                            variant="ghost"
                            size="sm"
                            class="aspect-square rounded-full bg-white h-7"
                        ></Button>
                    </div>
                </div>

                <div class="h-[92px] flex flex-col">
                    <HabitList />
                </div>

                <div
                    class="h-[calc(60%-226px)] min-h-[calc(60%-226px)] flex flex-col"
                >
                    <AddTaskOrHabit
                        bind:newTaskTitle
                        onSubmit={handleCreateTask}
                    />
                </div>
            </div>
        {:else}
            <div
                class="h-full relative flex flex-col space-y-0.5 pt-1 w-1/3 min-w-[310px] rounded-l-lg bg-white p-2"
            >
                <Button
                    variant="ghost"
                    class="self-start mb-2"
                    onclick={handleBackToWeekly}>← Back to Weekly</Button
                >
                <h2 class="text-lg font-semibold mb-4">
                    {weeks[selectedWeek]} Details
                </h2>
                <!-- Add your week detail components here -->
            </div>
        {/if}
    {/snippet}

    {#snippet main()}
        <div class="relative w-full h-full overflow-hidden">
            <div
                class="w-full h-full transition-transform duration-300 ease-in-out"
                class:translate-x-[-100%]={selectedWeek !== null ||
                    isTransitioning}
            >
                <div
                    class="grid grid-cols-[7] grid-flow-col gap-1 w-full h-full p-2 max-w-full overflow-x-clip
                    border-2 border-neutral-700"
                >
                    {#each weeks as week, i}
                        {@const isToday = i === $currentTime?.getDay() - 1}
                        <div
                            class="flex flex-col justify-between space-y-1 h-full w-full"
                            class:today={isToday}
                        >
                            <div class="flex-col space-y-1 h-[calc(40%+48px)]">
                                <!-- date -->
                                <button
                                    class="px-1.5 h-11 w-full font-digital text-center text-base text-neutral-950"
                                    onclick={() => handleWeekSelect(i)}
                                >
                                    <span class="mr-1">
                                        {week}
                                    </span>
                                    {#key monday_date}
                                        {#if $weekRange.start.day < $weekRange.end.day}
                                            {monday_date + i}
                                        {:else}
                                            {endOfMonth($weekRange.start)
                                                .day === 31 &&
                                            monday_date + i > 31
                                                ? monday_date + i - 31
                                                : endOfMonth($weekRange.start)
                                                        .day === 30 &&
                                                    monday_date + i > 30
                                                  ? monday_date + i - 30
                                                  : monday_date + i}
                                        {/if}
                                    {/key}
                                    {#if isToday}
                                        <div
                                            class="absolute top-[40px] w-[80%] border-2 rounded-full border-dotted border-neutral-400"
                                        ></div>
                                    {/if}
                                </button>

                                <!-- plan, schedule -->
                                <div class="h-[calc(100%-52px)] rounded-md">
                                    <WeeklyTaskPlan
                                        bind:this={weeklyTaskPlanComponents[i]}
                                        treeItems={$treeItems}
                                        on:scroll={handleScroll}
                                    ></WeeklyTaskPlan>
                                </div>
                            </div>

                            <!-- result -->
                            <div
                                class="h-[calc(60%-56px)] min-h-[calc(60%-56px)] rounded-md"
                            >
                                <Result taskTree={$treeItems} />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            {#if selectedWeek !== null || isTransitioning}
                <div
                    class="absolute top-0 left-0 w-full h-full border-2 border-neutral-700 transition-transform duration-300 ease-in-out"
                    class:translate-x-0={selectedWeek !== null}
                    class:translate-x-[100%]={isTransitioning &&
                        selectedWeek === null}
                >
                    <WeeklyChat
                        weekIndex={selectedWeek}
                        weekTasks={$treeItems.filter((item) => true)}
                    />
                </div>
            {/if}
        </div>
    {/snippet}
</PageTemplete>

<style>
    .today {
        @apply p-1 h-[calc(100%+8px)] -translate-y-2 shadow-lg text-neutral-950 border-[3px] border-neutral-100 border-double;
    }

    .chat {
        @apply fixed z-50 h-[calc(100vh-120px)] w-full  min-w-[250px] rounded-lg  bg-neutral-50 shadow-lg shadow-emerald-950 sm:h-[calc(100vh-80px)];
    }

    .time {
        @apply w-[50px] translate-y-1 scale-90 font-mono text-xs font-light text-neutral-400;
    }

    /* scroll bar */
    ::-webkit-scrollbar {
        width: 0.3rem;
        height: 0.4rem;
    }

    ::-webkit-scrollbar-track {
        @apply absolute  bg-neutral-100 rounded-full;
    }

    ::-webkit-scrollbar-thumb {
        @apply absolute  bg-neutral-300/80 rounded-full;
    }

    ::-webkit-scrollbar-thumb:hover {
        @apply absolute bg-neutral-500/80 rounded-full;
    }

    /* Add transition styles */
    :global(.transition-all) {
        transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .transition-transform {
        transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>
