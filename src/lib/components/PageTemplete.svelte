<script lang="ts">
    import { Separator } from "$ui";
    import { cn } from "$lib/utils";
    import { MoonStar } from "lucide-svelte";
    import { formatTime, currentTime } from "$store";

    interface Props {
        changeMode?: boolean;
        side?: import("svelte").Snippet;
        options?: import("svelte").Snippet<[any]>;
        main?: import("svelte").Snippet;
        change_main?: import("svelte").Snippet;
        main_side?: import("svelte").Snippet;
    }

    let {
        changeMode = $bindable(false),
        change_main,
        side,
        main_side,
        options,
        main,
    }: Props = $props();

    let currentTimeDisplay = $derived(formatTime($currentTime));
</script>

<div class="h-full mx-3 shadow-md bg-neutral-100 shadow-neutral-400 rounded-lg">
    <button
        onclick={() => (changeMode = !changeMode)}
        class="fixed top-4 right-4 w-[calc(100%-32px)] rounded-full z-[1] h-[30px] flex text-lg font-digital"
    >
        <MoonStar fill="black" class="mr-2" />
        {currentTimeDisplay}
    </button>

    <div class="flex h-full space-x-0 max-w-full items-center text-sm">
        <!-- side -->
        {#if changeMode}
            <div class="flex flex-col w-1/3 min-w-[374px] h-full">
                <div
                    class=" flex h-full p-2 pr-0 w-full flex-col items-center justify-start"
                >
                    {@render side?.()}
                </div>
            </div>
        {/if}

        {@render options?.({ class: "h-full" })}

        <!-- main: itemlist -->
        <div
            class={cn(
                "flex w-full h-full p-2 overflow-x-auto overflow-y-clip ",
                {
                    "max-w-[calc(100%-0px)] pl-0": changeMode,
                    "max-w-full": !changeMode,
                },
            )}
        >
            {#if !changeMode}
                {@render main_side?.()}
            {/if}

            <div
                class="relative p-2 w-full bg-white h-full rounded-r-lg no-scrollbar overflow-x-auto overflow-y-clip max-w-full"
            >
                {#if changeMode && change_main}
                    {@render change_main?.()}
                {:else}
                    {@render main?.()}
                {/if}
            </div>
        </div>
    </div>
</div>
