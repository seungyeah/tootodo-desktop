<script lang="ts">
    import {Button, Tabs} from "$ui";
    import PageTemplete from "$components/PageTemplete.svelte";
    import {
        endOfMonth, endOfWeek,
        getLocalTimeZone,
        startOfWeek,
        today,
    } from "@internationalized/date";
    import {
        WeeklyChat,
        Plan,
        Result,
        ScheduleList,
        ScheduleHeader, DurationPicker,
    } from "$components/schedule";
    import Memo from "$components/memo/Memo.svelte";
    import {Columns3, MessageSquareMore, Rows3, Send} from "lucide-svelte";
    import {currentTime} from "$store";
    import {createTreeView} from "@melt-ui/svelte";

    import {onMount, setContext, tick} from "svelte";

    import {writable} from "svelte/store";
    import {invoke} from "@tauri-apps/api/core";
    import {type DateRange, getThisWeekRange, parseDateRangeFromURL} from "$lib/utils";
    import {goto} from "$app/navigation";

    let data = $state({tasks: []});
    let changeMode = $state(false);
    let weekRange = writable<DateRange>(getThisWeekRange());
    const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    onMount(() => {
        $weekRange = parseDateRangeFromURL() || getThisWeekRange();
        setQuery($weekRange);
    });

    function setQuery(duration) {
        $weekRange = duration;
        const startDate = $weekRange.start;
        const endDate = $weekRange.end;
        const searchParams = new URLSearchParams({startDate, endDate});
        goto(`?${searchParams.toString()}`);
    }

    let monday_date = $derived($weekRange?.start?.day || startOfWeek(today(getLocalTimeZone()), "fr-FR").day);

    $effect(() => {
        invoke("fetch_tasks", {
            startDate: $weekRange.start.toString(),
            endDate: $weekRange.end.toString(),
        })
            .then((tasks) => {
                data.tasks = tasks;
                console.log("tasks", tasks);
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
        elements: {tree},
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
    let scrollPosition = $state({scrollTop: 0});
    let planComponent = $state();
    let scheduleListComponent = $state();

    function handleScroll(e) {
        scrollPosition = {
            scrollTop: e.detail.scrollTop,
        };
        scheduleListComponent.updateScrollPosition(scrollPosition);
        planComponent.updateScrollPosition(scrollPosition);
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
            $treeItems = [
                ...$treeItems,
                {task: newTask, subtasks: []},
            ];
            newTaskTitle = "";
        });
    }
</script>

<PageTemplete {changeMode}>
    <!-- side: memo -->
    {#snippet side()}
        <div
                class="shadow p-2 rounded-l-lg bg-white h-full w-full max-w-full border-b-4 border-double border-zinc-400"
        >
            <Memo/>
        </div>
    {/snippet}

    <!-- main: schedule-->

    {#snippet main_side()}
        <div
                {...$tree}
                class="relative flex flex-col space-y-0.5 pt-1  w-1/3 max-w-[300px] min-w-[240px] rounded-l-lg bg-white p-2"
        >
            <DurationPicker update={(weekRange:DateRange) => setQuery(weekRange)}/>
            <div
                    class="flex-col flex border-x-2 w-full h-[calc(100%-44px)] max-h-[calc(100%-44px)] rounded-lg border-zinc-700"
            >
                <div
                        class="rounded-b-lg pr-1 border-zinc-700 h-[calc(100%-48px)]"
                >
                    <ScheduleList
                            bind:this={scheduleListComponent}
                            on:scroll={handleScroll}
                            treeItems={$treeItems}
                    />
                </div>

                <input
                        class="absolute left-0 z-10 bottom-0 h-11  w-[calc(100%-16px)] border-2 border-t-2 px-2 mx-2 mb-2 py-1 rounded-t-lg bg-white  border-zinc-700"
                        bind:value={newTaskTitle}
                        placeholder="Search & Add Task.."
                />
            </div>

            <Button
                    variant="outline"
                    size="sm"
                    class="absolute  z-10  bottom-3 right-3"
                    onclick={handleCreateTask}>
                <Send/>
            </Button
            >
        </div>
    {/snippet}

    {#snippet main()}
            <!--            <div class="fixed top-4 right-4 w-[calc(100%-32px)] z-10">-->
            <!--                <ScheduleHeader bind:openSide></ScheduleHeader>-->
            <!--            </div>-->

            <div
                    class="flex flex-col w-full h-full max-w-full overflow-x-clip border-2 border-zinc-700"
            >
                <!-- weeks Tab -->
                <div class="relative w-full h-full flex justify-between">
                    <div
                            class="absolute h-10 w-full rounded-lg rounded-t-none border-b-[2.5px] border-zinc-700 bg-zinc-100/20"
                    ></div>
                    {#each weeks as week, i}
                        <div
                                class="mt-2 text-[0.9rem] w-full font-digital  text-center flex flex-col items-center text-zinc-400"
                                class:today={i === $currentTime?.getDay()-1}
                        >
                            <div class="flex px-1.5 h-6 bg-white">
								<span class="mr-1 h-10">
									{week}
								</span>
                                {#key monday_date}
                                    {#if $weekRange.start.day < $weekRange.end.day}
                                        {monday_date + i}
                                    {:else}
                                        {endOfMonth($weekRange.start).day ===
                                        31 && monday_date + i > 31
                                            ? monday_date + i - 31
                                            : endOfMonth($weekRange.start)
                                                .day === 30 &&
                                            monday_date + i > 30
                                                ? monday_date + i - 30
                                                : monday_date + i}
                                    {/if}
                                {/key}
                            </div>
                            {#if i === $currentTime?.getDay() - 1}
                                <div
                                        class="absolute top-[22px] w-[90%] border-2 h-1 rounded-full border-dotted border-zinc-700"
                                ></div>
                            {/if}
                        </div>
                    {/each}
                </div>

                <!-- schedule Tab-->
                <div class="w-full h-11 flex justify-center">
                    <Tabs.Root value="do" class="h-[42px] w-full">
                        <Tabs.List
                                class="w-[150px] fixed rounded-full shadow bottom-2  right-2 z-10 border-zinc-700 bg-secondary/85">
                            <Tabs.Trigger
                                    value="plan"
                                    class=" rounded-full text-secondary-foreground "
                            >
                                <Rows3
                                        size={20}
                                />
                            </Tabs.Trigger
                            >
                            <Tabs.Trigger
                                    value="do"
                                    class=" rounded-full text-secondary-foreground "
                            >
                                <MessageSquareMore
                                        size={20}
                                />
                            </Tabs.Trigger
                            >
                            <Tabs.Trigger
                                    value="result"
                                    class=" rounded-full text-secondary-foreground"
                            >
                                <Columns3
                                        size={20}
                                />
                            </Tabs.Trigger
                            >
                        </Tabs.List>

                        <Tabs.Content
                                {...$tree}
                                value="plan"
                                class="-translate-y-[calc(100vh-178px)] w-full  "
                        >
                            <div class=" h-[calc(100vh-190px)]">
                                <Plan
                                        treeItems={$treeItems}
                                        bind:scrollPosition
                                        bind:this={planComponent}
                                        on:scroll={handleScroll}
                                />
                            </div>
                        </Tabs.Content>

                        <Tabs.Content
                                value="do"
                                class="-translate-y-[calc(100vh-182px)] h-[calc(100vh-150px)] w-full   "
                        >
                            <WeeklyChat taskTree={$treeItems}/>
                        </Tabs.Content>

                        <Tabs.Content
                                value="result"
                                class="-translate-y-[calc(100vh-182px)] h-[calc(100vh-156px)] w-full "
                        >
                            <Result taskTree={$treeItems}/>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
    {/snippet}
</PageTemplete>

<style>
    .today {
        @apply text-zinc-950 border-[3px] border-double border-zinc-500 -translate-y-1;
    }

    .chat {
        @apply fixed z-50 h-[calc(100vh-120px)] w-full  min-w-[250px] rounded-lg  bg-zinc-50 shadow-lg shadow-emerald-950 sm:h-[calc(100vh-80px)];
    }

    .time {
        @apply w-[50px] translate-y-1 scale-90 font-mono text-xs font-light text-zinc-400;
    }

    /* scroll bar */
    ::-webkit-scrollbar {
        width: 0.1rem;
        height: 0.4rem;
    }

    ::-webkit-scrollbar-track {
        @apply absolute bg-zinc-200/80 rounded-full;
    }

    ::-webkit-scrollbar-thumb {
        @apply absolute bg-zinc-600/80 rounded-full;
    }

    ::-webkit-scrollbar-thumb:hover {
        @apply absolute bg-zinc-900/80 rounded-full;
    }
</style>
