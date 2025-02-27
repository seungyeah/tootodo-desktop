<script lang="ts">
    import Textarea from "../ui/textarea/textarea.svelte";
    import Label from "../ui/label/label.svelte";
    import { Button } from "$ui";
    import { Send } from "lucide-svelte";

    let { newTaskTitle = $bindable(), onSubmit = () => {} } = $props();
</script>

<Label class="font-bold ">+ Task & Habit</Label>

<div
    class="flex space-x-2 h-full mt-1
            bg-white p-2 rounded-lg shadow-md"
>
    <Textarea
        class="resize-none h-full max-h-full overflow-y-auto w-[calc(100%-52px)] px-2 py-1  rounded-md  border-0 shadow"
        bind:value={newTaskTitle}
        placeholder="task"
    ></Textarea>
    <div class="relative h-full items-end flex">
        <Button
            class=" top-1 absolute right-0 rounded-l-none h-[30px] border border-l-0 border-dashed  w-12 text-center py-1"
            variant="ghost"
        >
            Task
            <div
                class="absolute bottom-1 w-4/5 h-1 border-b-[3px] border-double border-pomodoro-800/20"
            ></div>
        </Button>
        <Button
            class="top-10 absolute right-0 rounded-l-none h-[30px] border border-l-0 border-dashed  w-12 text-center py-1"
            variant="ghost"
        >
            Habit
        </Button>
        <Button
            variant="ghost"
            size="sm"
            onclick={onSubmit}
            class=" bg-neutral-100 h-[calc(100%-80px)] "
        >
            <Send />
        </Button>
    </div>
</div>
