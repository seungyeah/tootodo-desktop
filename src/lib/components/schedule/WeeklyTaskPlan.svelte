<script lang="ts">
    import { Button, Input } from "$ui";
    import {
        AlarmClockPlus,
        Grid2x2Plus,
        ListPlusIcon,
        Plus,
        X,
    } from "lucide-svelte";
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

    let selectedIndices: Set<number> = $state(new Set());

    function addSelection(index: number) {
        selectedIndices.add(index);
        selectedIndices = new Set(selectedIndices);
    }

    function removeSelection(index: number) {
        if (selectedIndices.has(index)) {
            selectedIndices.delete(index);
        }
        selectedIndices = new Set(selectedIndices);
    }
    function toggleSelection(index: number) {
        if (selectedIndices.has(index)) {
            selectedIndices.delete(index);
        } else {
            selectedIndices.add(index);
        }
        selectedIndices = new Set(selectedIndices);
    }
</script>

<div
    bind:this={container}
    on:scroll
    class="h-full max-h-full overflow-auto no-scrollbar"
>
    <div class="flex flex-col space-y-1.5">
        {#each Array.from({ length: treeItems.length }) as _, index}
            <div class="relative group h-9">
                <Button
                    variant="ghost"
                    class="flex items-center w-full h-9 p-2 py-0 mx-0 shadow-sm border border-neutral-100 rounded-md 
                    {selectedIndices.has(index) ? 'bg-pomodoro-900/10' : ''}"
                    onclick={() => addSelection(index)}
                >
                    <Input
                        class="h-6 px-1 w-full {selectedIndices.has(index)
                            ? 'opacity-100'
                            : 'opacity-0'}"
                        onfocus={() => addSelection(index)}
                    />
                    <Button
                        variant="ghost"
                        class="h-8 px-1 w-8 z-10 hover:bg-secondary/10 {selectedIndices.has(
                            index,
                        )
                            ? 'opacity-100'
                            : 'opacity-0'}"
                    >
                        <Grid2x2Plus class="rotate-180" />
                    </Button>
                </Button>

                {#if selectedIndices.has(index)}
                    <button
                        class="absolute w-4 h-4 -right-0 bottom-0 -translate-y-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        on:click={() => removeSelection(index)}
                    >
                        <X
                            class="w-4 h-4 text-destructive hover:bg-destructive-foreground"
                        />
                    </button>
                {/if}
            </div>
        {/each}
    </div>
</div>
