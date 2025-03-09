<script lang="ts">
    import Textarea from "../ui/textarea/textarea.svelte";
    import { Button } from "$ui";
    import { Send } from "lucide-svelte";
    import { Input, Label } from "$ui";
    import HabitCreate from "$components/habit/HabitCreate.svelte";

    let { newTaskTitle = $bindable(), onSubmit = () => {} } = $props();
    let selectedType = $state("habit");
    let habitGoalFrequency = $state(7);
</script>

<div
    class="flex space-x-2 h-full
            bg-white p-2 rounded-lg shadow-md"
>
    {#if selectedType === "task"}
        <Textarea
            class="resize-none h-full max-h-full overflow-y-auto w-[calc(100%-48px)] p-2 rounded-md border-0 shadow"
            bind:value={newTaskTitle}
            placeholder="Add a new task..."
        />
    {:else}
        <div
            class="h-full w-[calc(100%-48px)] max-h-full overflow-y-auto flex flex-col shadow p-2 rounded-md"
        >
            <div class="flex items-center w-full space-x-2">
                <HabitCreate />
            </div>
            <div class="relative h-full max-h-24 w-full space-y-1">
                <Label
                    class="font-bold  absolute -rotate-90 -left-2 top-5 text-base text-neutral-500"
                    >Goal</Label
                >
                <div class="ml-8 flex-col h-full space-y-1">
                    <div class="flex h-1/2 items-center space-x-2">
                        <span class="w-16">Start</span>
                        <Input
                            type="time"
                            class="h-8 w-full border-0 border-b"
                        />
                    </div>
                    <div class="flex h-1/2 items-center space-x-2">
                        <span class="w-16">#/Week</span>
                        <div
                            class="flex justify-between items-center space-x-2 h-full w-full"
                        >
                            <Button
                                variant="secondary"
                                class="text-center text-xl opacity-90 text-neutral-100 hover:text-neutral-300 w-6 h-6"
                                disabled={habitGoalFrequency === 1}
                                onclick={() => {
                                    habitGoalFrequency -= 1;
                                }}
                            >
                                -
                            </Button>
                            <input
                                class="w-4 text-center text-base font-semibold"
                                disabled
                                bind:value={habitGoalFrequency}
                            />
                            <Button
                                variant="destructive"
                                class="text-center text-xl opacity-80 text-neutral-100 hover:text-neutral-300 w-6 h-6"
                                disabled={habitGoalFrequency === 7}
                                onclick={() => {
                                    habitGoalFrequency += 1;
                                }}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <div class="relative h-full items-end flex">
        <Button
            class="top-1 absolute right-0 rounded-l-none h-[30px] border border-l-0 border-dashed w-12 text-center py-1"
            variant="ghost"
            onclick={() => (selectedType = "task")}
        >
            Task
            {#if selectedType === "task"}
                <div
                    class="absolute bottom-1 w-4/5 h-1 border-b-[3px] border-double border-pomodoro-800/20"
                ></div>
            {/if}
        </Button>
        <Button
            class="top-10 absolute right-0 rounded-l-none h-[30px] border border-l-0 border-dashed w-12 text-center py-1 "
            variant="ghost"
            onclick={() => (selectedType = "habit")}
        >
            Habit

            {#if selectedType === "habit"}
                <div
                    class="absolute bottom-1 w-4/5 h-1 border-b-[3px] border-double border-pomodoro-800/20"
                ></div>
            {/if}
        </Button>
        <Button
            variant="ghost"
            size="sm"
            onclick={onSubmit}
            class="bg-neutral-100 h-[calc(100%-80px)]"
        >
            <Send />
        </Button>
    </div>
</div>
