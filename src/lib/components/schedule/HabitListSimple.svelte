<script>
    import { Button, Label } from "$ui";
    import { Dumbbell, Globe, Pill, Sun } from "lucide-svelte";
</script>

<div
    class="h-12 flex justify-start items-center space-x-2 p-2
            max-w-full overflow-x-auto overflow-y-clip"
>
    <Button
        variant="ghost"
        class="flex shadow flex-col py-2 w-9 h-9 aspect-square rounded-lg font-digital text-amber-600"
    >
        <div
            class="flex space-x-2 h-full translate-y-1 border-b border-dashed pb-0.5"
        >
            <Sun />
        </div>
    </Button>
    <Button
        variant="ghost"
        class="flex shadow flex-col py-2 w-9 h-9 aspect-square text-zinc-600"
    >
        <div
            class="flex space-x-2 h-full translate-y-1 border-b border-dashed pb-0.5"
        >
            <Dumbbell />
        </div>
    </Button>

    <Button
        variant="ghost"
        class="flex shadow flex-col py-2 w-9 h-9 aspect-square rounded-lg font-digital text-red-600"
    >
        <div
            class="flex space-x-2 h-full translate-y-1 border-b border-dashed pb-0.5"
        >
            <Pill />
        </div>
    </Button>
    <Button
        variant="ghost"
        class="flex shadow flex-col py-2 w-9 h-9 aspect-square rounded-lg font-digital text-blue-600"
    >
        <div
            class="flex space-x-2 h-full translate-y-1 border-b border-dashed pb-0.5"
        >
            <Globe />
        </div>
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
