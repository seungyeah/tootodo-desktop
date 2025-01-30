<!-- @migration-task Error while migrating Svelte code: Cannot set properties of undefined (setting 'next') -->
<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script lang="ts">
    import {cn} from "$lib/utils.js";
    import {createTabs, melt} from "@melt-ui/svelte";
    import {Package} from "lucide-svelte";
    import {getContext} from "svelte";
    import {cubicInOut} from "svelte/easing";
    import {crossfade} from "svelte/transition";

    // 상위 컴포넌트 (/habits/+page, /tasks/+page)에서 정의됨
    const statusOption: string = getContext("statusOption");

    interface Props {
        tab1?: import("svelte").Snippet;
        tab2?: import("svelte").Snippet;
        class?: string;
    }

    let {
        tab1,
        tab2,
        class:className,
    }: Props = $props();

    const {
        elements: {root, list, content, trigger},
        states: {value},
    } = createTabs({
        defaultValue: "tab-1",
    });

    const triggers = [
        {id: "tab-1", title: "InProgress"},
        {id: "tab-2", title: "Archived"},
    ];

    const [send, receive] = crossfade({
        duration: 250,
        easing: cubicInOut,
    });
</script>

<div
        use:melt={$root}
        class={cn(
      "flex w-full bg-white h-full flex-col overflow-hidden rounded-t-xl rounded-r-none rounded-b-lg data-[orientation=vertical]:flex-row",
      className,
   )}
>
    <!-- tab list -->
    <div
            use:melt={$list}
            class="flex shrink-0 overflow-x-auto bg-zinc-100
   data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
    >
        {#each triggers as triggerItem}
            <button
                    use:melt={$trigger(triggerItem.id)}
                    class={`py-4 relative trigger ${triggerItem.id === "tab-2" ? "w-14" : "w-full"}`}
                    onclick={()=> $statusOption = triggerItem.title}
            >
                {#if triggerItem.id === "tab-2"}
                    <Package strokeWidth={1.65}/>
                {:else}
               <span class=" font-semibold -translate-y-0.5"
               >{triggerItem.title}</span
               >
                {/if}
                {#if $value === triggerItem.id}
                    <div
                            in:send={{ key: "trigger" }}
                            out:receive={{ key: "trigger" }}
                            class="h-1 border-none absolute bottom-0 w-[80%] -translate-x-1/2 rounded-full left-1/2 bg-pomodoro-50"
                    />
                {/if}
            </button>
        {/each}
    </div>

    <div
            use:melt={$content("tab-1")}
            class="content no-scrollbar"
    >
        {@render tab1?.()}
    </div>

    <div use:melt={$content("tab-2")} class="content no-scrollbar">
        {@render tab2?.()}
    </div>
</div>

<style lang="postcss">
    .content {
        @apply h-full max-h-full m-2 overflow-y-auto  border-2 border-double  border-zinc-600;
    }

    .trigger {
        display: flex;
        align-items: center;
        justify-content: center;

        cursor: default;
        user-select: none;

        border-radius: 0;
        background-color: theme(colors.zinc.50);

        color: theme(colors.zinc.900);
        font-weight: 500;
        line-height: 1;

        height: 26px;
        padding-inline: theme(spacing.2);

        &:focus {
            position: relative;
        }

        &:focus-visible {
            @apply z-10 ring-2;
        }

        &[data-state="active"] {
            @apply focus:relative;
            background-color: white;
            color: theme("colors.pomodoro.900");
        }
    }
</style>
