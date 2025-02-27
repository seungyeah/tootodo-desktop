<script>
    import { Button, Label } from "$ui";
    import { Dumbbell, Globe, Pill, Sun } from "lucide-svelte";
</script>

<Label class="font-bold">Ongoing Habit List</Label>

<div
    class="h-20 flex justify-start items-center space-x-2 p-2 mt-1
            max-w-full overflow-x-auto overflow-y-clip
            rounded-lg shadow-md bg-white"
>
    <Button
        variant="ghost"
        class="flex shadow flex-col py-2 h-full w-20 aspect-square rounded-lg font-digital text-amber-600"
    >
        <div
            class="flex space-x-2 h-full translate-y-1 border-b border-dashed pb-0.5"
        >
            <Sun />
            <span class="font-digital">4 / 7</span>
        </div>
        <span class="font-serif text-xs">at : 6 AM</span>
    </Button>
    <Button
        variant="ghost"
        class="flex shadow flex-col py-2 h-full w-20 aspect-square text-zinc-600"
    >
        <div
            class="flex space-x-2 h-full translate-y-1 border-b border-dashed pb-0.5"
        >
            <Dumbbell />
            <span class="font-digital">1 / 7</span>
        </div>
        <span class="font-serif text-xs">at : 8 AM</span>
    </Button>

    <Button
        variant="ghost"
        class="flex shadow flex-col py-2 h-full w-20 aspect-square rounded-lg font-digital text-red-600"
    >
        <div
            class="flex space-x-2 h-full translate-y-1 border-b border-dashed pb-0.5"
        >
            <Pill />
            <span class="font-digital">1 / 7</span>
        </div>
        <span class="font-serif text-xs">at : 1 PM</span>
    </Button>
    <Button
        variant="ghost"
        class="flex shadow flex-col py-2 h-full w-20 aspect-square rounded-lg font-digital text-blue-600"
    >
        <div
            class="flex space-x-2 h-full translate-y-1 border-b border-dashed pb-0.5"
        >
            <Globe />
            <span class="font-digital">1 / 7</span>
        </div>
        <span class="font-serif text-xs">at : 8 PM</span>
    </Button>
</div>

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

    :global(.transition-all) {
        transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
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
</style>
