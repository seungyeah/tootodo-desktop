<script lang="ts">
   import { cn } from "$lib/utils.js";
   import { createTabs, melt } from "@melt-ui/svelte";
   import { Package } from "lucide-svelte";
   import { getContext } from "svelte";
   import { cubicInOut } from "svelte/easing";
   import { crossfade } from "svelte/transition";

   const statusOption: string = getContext("statusOption");

   const {
      elements: { root, list, content, trigger },
      states: { value },
   } = createTabs({
      defaultValue: "tab-1",
   });

   let className = "";
   export { className as class };

   const triggers = [
      { id: "tab-1", title: "InProgress" },
      { id: "tab-2", title: "Archived" },
   ];

   const [send, receive] = crossfade({
      duration: 250,
      easing: cubicInOut,
   });
</script>

<div
   use:melt={$root}
   class={cn(
      "flex w-full bg-white flex-col overflow-hidden rounded-t-xl rounded-b-lg shadow-md  data-[orientation=vertical]:flex-row",
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
            class={`relative trigger ${triggerItem.id === "tab-2" ? "w-14" : "w-full"}`}
            on:click={()=> $statusOption = triggerItem.title}
         >
            {#if triggerItem.id === "tab-2"}
               <Package strokeWidth={1.65} />
            {:else}
               <span class="font-semibold -translate-y-0.5"
                  >{triggerItem.title}</span
               >
            {/if}
            {#if $value === triggerItem.id}
               <div
                  in:send={{ key: "trigger" }}
                  out:receive={{ key: "trigger" }}
                  class="absolute bottom-0 w-8 h-1 -translate-x-1/2 rounded-full left-1/2 bg-pomodoro-400"
               />
            {/if}
         </button>
      {/each}
   </div>

   <div
      use:melt={$content("tab-1")}
      class="content no-scrollbar"
   >
      <slot name="tab-1" />
   </div>

   <div use:melt={$content("tab-2")} class="content no-scrollbar">
      <slot name="tab-2" />
   </div>
</div>

<style lang="postcss">
   .content{
      @apply h-full max-h-full m-2 overflow-y-auto bg-white border-2 border-double  border-zinc-600;  
   }
   .trigger {
      display: flex;
      align-items: center;
      justify-content: center;

      cursor: default;
      user-select: none;

      border-radius: 0;
      background-color: theme(colors.zinc.100);

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
