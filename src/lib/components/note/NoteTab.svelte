<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script lang="ts">
   import { createTabs, melt } from "@melt-ui/svelte";
   import { Blend, Kanban, List, Tags, Settings2 } from "lucide-svelte";
   import { cubicInOut } from "svelte/easing";
   import { crossfade } from "svelte/transition";
   import ViewOptions from "./NoteViewOptions.svelte";

   export let defaultValue = "list";
   const {
      elements: { root, list, content, trigger },
      states: { value },
   } = createTabs({
      defaultValue: defaultValue,
   });

   const triggers = [
      { id: "tags", title: "Tags", icon: Tags },
      { id: "list", title: "List", icon: List },
      { id: "kanban", title: "Kanban", icon: Kanban },
      { id: "graph", title: "Graph", icon: Blend },
   ];

   const [send, receive] = crossfade({
      duration: 250,
      easing: cubicInOut,
   });
</script>

<div
   use:melt={$root}
   class="flex w-full h-full bg-white flex-col overflow-hidden rounded-t-xl rounded-b-lg shadow-md data-[orientation=vertical]:flex-row"
>
   <!-- tab list -->
   <div
      use:melt={$list}
      class="flex shrink-0 w-full overflow-x-auto
            data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
   >
      <ViewOptions />

      {#each triggers as triggerItem}
         <button
            use:melt={$trigger(triggerItem.id)}
            class="relative w-3/4 trigger bg-zinc-100"
         >
            <svelte:component
               this={triggerItem.icon}
               size={20}
               strokeWidth={2}
            />
            {#if $value === triggerItem.id}
               <div
                  in:send={{ key: "trigger" }}
                  out:receive={{ key: "trigger" }}
                  class="absolute bottom-0 w-[80%] -translate-x-1/2 border-2 border-double rounded-full left-1/2 bg-pomodoro-100"
               />
            {/if}
         </button>
      {/each}
   </div>

   <div use:melt={$content("tags")} class="h-full no-scrollbar">
      <slot name="tags" />
   </div>

   <div use:melt={$content("list")} class="h-full no-scrollbar">
      <slot name="list" />
   </div>

   <div use:melt={$content("kanban")} class="h-full no-scrollbar">
      <slot name="kanban" />
   </div>

   <div use:melt={$content("graph")} class="h-full no-scrollbar">
      <slot name="graph" />
   </div>
</div>

<style lang="postcss">
   /* .content{
      @apply h-full max-h-full m-2 overflow-y-auto bg-white border-2 border-double  border-zinc-600;  
   } */
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
