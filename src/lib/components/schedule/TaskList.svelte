<script lang="ts">
    import type { Task } from "$lib/schema";
    import Chat from "./Chat.svelte";

    import TaskItem from "./TaskItem.svelte";

    interface Props {
        // items
        tasks?: Task[];
        record?: any;
    }

    let { tasks = [] }: Props = $props();

    // 자식 컴포넌트(self)에서 발생한 이벤트를 처리하고 상위로 전달하는 함수
    function handleChildUpdate(event: CustomEvent) {
        const { task, updateData } = event.detail;
    }

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
            {@const itemId = `${task?.id}`}
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
