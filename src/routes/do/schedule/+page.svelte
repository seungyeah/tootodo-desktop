<script lang="ts">
    import { Button, Label } from "$ui";
    import PageTemplete from "$components/PageTemplete.svelte";
    import {
        endOfMonth,
        getLocalTimeZone,
        startOfWeek,
        today,
    } from "@internationalized/date";
    import {
        WeeklyChat,
        Result,
        TaskList,
        DurationPicker,
    } from "$components/schedule";
    import Memo from "$components/memo/Memo.svelte";
    import { currentTime } from "$store";
    import { onMount, setContext } from "svelte";

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
    import ShowRecord from "$components/tenMTable/showRecord.svelte";
    import PlanRecord from "$components/tenMTable/planRecord.svelte";
    import PomoIcon from "$components/PomoIcon.svelte";
    import { ChevronLeft } from "lucide-svelte";
    import type { Task } from "$lib/schema";

    const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    let tasks = $state<Task[]>([]);
    $inspect(tasks);
    let changeMode = $state(false);
    let weekRange = writable<DateRange>(getThisWeekRange());
    // let selectedDay = $state(null);
    let selectedDay = $state($currentTime?.getDay() - 1 || null);
    let newTaskTitle = $state("");
    let isTransitioning = $state(false);
    let monday_date = $derived(
        $weekRange?.start?.day ||
            startOfWeek(today(getLocalTimeZone()), "fr-FR").day,
    );

    onMount(() => {
        $weekRange = parseDateRangeFromURL() || getThisWeekRange();
        setQuery($weekRange);
    });

    $effect(() => {
        invoke("fetch_tasks", {
            startDate: $weekRange.start.toString(),
            endDate: $weekRange.end.toString(),
        })
            .then((data) => {
                tasks = data;
                console.log(tasks);
            })
            .catch(console.error);
    });

    function setQuery(duration) {
        $weekRange = duration;
        const startDate = $weekRange.start;
        const endDate = $weekRange.end;
        const searchParams = new URLSearchParams({ startDate, endDate });
        goto(`?${searchParams.toString()}`);
    }

    // function sort_tasks() {
    //     // duration 기준으로 정렬 (startDate가 빠른 것부터 정렬 -> endDate가 느린것부터 정렬)
    //     return (a, b) => {
    //         const diff = new Date(a.startDate) - new Date(b.startDate);
    //         if (diff === 0) {
    //             return new Date(b.endDate) - new Date(a.endDate);
    //         } else {
    //             return diff;
    //         }
    //     };
    // }

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
    function handleCreateTask() {
        invoke("plugin:task:create_task", {
            title: newTaskTitle,
            subtasks: [],
            startDate: $weekRange.start.toString(),
            endDate: $weekRange.end.toString(),
        }).then((newTask) => {
            tasks.push(newTask);
            newTaskTitle = "";
        });
    }

    function handleWeekSelect(weekIndex) {
        isTransitioning = true;
        setTimeout(() => {
            selectedDay = weekIndex;
            isTransitioning = false;
        }, 400); // match transition duration
    }

    function handleBackToWeekly() {
        isTransitioning = true;
        setTimeout(() => {
            selectedDay = null;
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
        {#if selectedDay === null}
            <div
                class="h-full relative flex flex-col space-y-4 pt-1 w-1/3 min-w-[320px] rounded-l-lg p-2 pr-3.5"
            >
                <DurationPicker
                    update={(weekRange: DateRange) => setQuery(weekRange)}
                />

                <!-- task list -->
                <div
                    class="flex-col flex h-[calc(40%+48px)] min-h-[calc(40%+48px)] space-y-1.5 -translate-y-1 p-0 w-full rounded-lg shadow-md bg-white"
                >
                    <TaskList
                        bind:this={taskListComponent}
                        {tasks}
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

                <div class="h-[106px] flex flex-col space-y-1">
                    <Label class="font-bold text-base">Ongoing Habit List</Label
                    >
                    <HabitList />
                </div>

                <div
                    class="h-[calc(60%-240px)] min-h-[calc(60%-240px)] flex flex-col space-y-1"
                >
                    <Label class="font-bold text-base">+ Task & Habit</Label>
                    <AddTaskOrHabit
                        bind:newTaskTitle
                        onSubmit={handleCreateTask}
                    />
                </div>
            </div>
        {:else}
            <div
                class="h-full relative flex flex-col justify-between space-y-4 pt-1 w-1/3 min-w-[320px] rounded-l-lg p-2 pr-3.5"
            >
                <div class="flex-col h-[calc(100%-380px)] space-y-4">
                    <Button
                        variant="ghost"
                        class="mb-2 flex items-center justify-between h-10 w-full border-b-2"
                        onclick={handleBackToWeekly}
                    >
                        <ChevronLeft />
                        <h2 class="text-lg font-digital">
                            {weeks[selectedDay]}, {monday_date + selectedDay}
                        </h2></Button
                    >
                    <!-- task list -->
                    <div
                        class="flex-col flex h-[calc(100%-40px)] min-h-[calc(100%-40px)] space-y-1.5 -translate-y-1 p-0 w-full rounded-lg shadow-md bg-white"
                    >
                        <TaskList
                            bind:this={taskListComponent}
                            {tasks}
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
                </div>

                <div
                    class="flex flex-col w-full space-y-1 h-[352px] min-h-[352px] max-h-[352px]"
                >
                    <Label
                        class="flex font-bold items-center text-base space-x-1.5"
                    >
                        <span class="translate-x-1">D</span><PomoIcon />
                    </Label>
                    <div
                        class="relative h-[330px] min-h-[330px] max-h-[330px] flex flex-col p-2 pb-6 bg-white rounded-2xl shadow-md"
                    >
                        <div
                            class="absolute top-0 w-[calc(100%-16px)] h-[calc(100%-32px)] my-2"
                        >
                            <ShowRecord />
                        </div>
                        <!-- plan record and start timer directly -->
                        <div
                            class="absolute top-0 w-[calc(100%-16px)] h-[calc(100%-32px)] my-2 z-50"
                        >
                            <PlanRecord />
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    {/snippet}

    {#snippet main()}
        <div class="relative w-full h-full overflow-hidden">
            <div
                class="w-full h-full transition-transform duration-300 ease-in-out"
                class:translate-x-[-100%]={selectedDay !== null ||
                    isTransitioning}
            >
                <div
                    class="grid grid-cols-[7] grid-flow-col gap-1 w-full h-full p-2 max-w-full overflow-x-clip
                     border-2 border-neutral-200 rounded-xl"
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
                                        {tasks}
                                        on:scroll={handleScroll}
                                    ></WeeklyTaskPlan>
                                </div>
                            </div>

                            <!-- result -->
                            <div
                                class="h-[calc(60%-56px)] min-h-[calc(60%-56px)] rounded-md"
                            >
                                <Result />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            {#if selectedDay !== null || isTransitioning}
                <div
                    class="absolute top-0 left-0 w-full h-full rounded-xl
                    border-2 border-neutral-200
                    transition-transform duration-300 ease-in-out"
                    class:translate-x-0={selectedDay !== null}
                    class:translate-x-[100%]={isTransitioning &&
                        selectedDay === null}
                >
                    <WeeklyChat
                        weekIndex={selectedDay}
                        weekTasks={tasks.filter((item) => true)}
                    />
                </div>
            {/if}
        </div>
    {/snippet}
</PageTemplete>

<style>
    .today {
        @apply p-1 h-[calc(100%+10px)] -translate-y-1.5 shadow-lg text-neutral-950 border-[3px] border-neutral-100 border-double;
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
