<script lang="ts">
    import type { TaskModel } from "$lib/schema/index";
    import Chat from "./Chat.svelte";

    import TaskItem from "./TaskItem.svelte";

    interface Props {
        // items
        tasks?: TaskModel[];
        record?: any;
    }

    let { tasks = [] }: Props = $props();

    // scroll
    let tableContainer: HTMLElement = $state();

    export function updateScrollPosition(pos: { scrollTop: number }) {
        if (tableContainer && pos) {
            tableContainer.scrollTop = pos.scrollTop;
        }
    }
</script>

{#key tasks}
    <div
        class="h-full max-h-full overflow-y-auto overflow-x-clip no-scrollbar p-2 space-y-1.5"
        bind:this={tableContainer}
        on:scroll
    >
        {#each tasks as task}
            <div
                class="flex flex-col h-9 rounded-md bg-white shadow-sm border border-neutral-100"
            >
                <TaskItem {task} />
            </div>
            {#if task.subtasks?.length}
                <div>{task.subtasks}</div>
            {/if}
        {/each}
    </div>
{/key}
