<script lang="ts">
    import { Button } from "$ui";
    import type { TreeItem } from "./TaskList.svelte";

    let container: HTMLElement;

    interface Props {
        treeItems?: TreeItem[];
    }
    let { treeItems = [] }: Props = $props();

    export function updateScrollPosition(pos: { scrollTop: number }) {
        if (container && pos) {
            container.scrollTop = pos.scrollTop;
        }
    }
</script>

<div
    bind:this={container}
    on:scroll
    class="h-full max-h-full overflow-auto no-scrollbar"
>
    <div class="flex flex-col space-y-1">
        {#each Array.from({ length: treeItems.length }) as _}
            <Button
                variant="outline"
                size="sm"
                class="border-neutral-100 shadow-sm"
            />
        {/each}
    </div>
</div>
