<script>
    import { Button, Label } from "$ui";
    import { Dumbbell, Globe, Pill, Sun } from "lucide-svelte";
</script>

<div
    class="h-20 flex justify-start items-center space-x-2 p-2
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
    /* scroll bar */
    ::-webkit-scrollbar {
        height: 0.3rem;
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
