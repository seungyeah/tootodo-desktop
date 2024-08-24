<script lang="ts">
   import { cn } from "$lib/utils";
   import { Button, ContextMenu, DropdownMenu, Label, Separator } from "$ui";
   import { melt, type TreeView } from "@melt-ui/svelte";
   import { createEventDispatcher, getContext } from "svelte";
   import type { TreeItem } from "./ScheduleList.svelte";
   const {
      elements: { item, group },
      helpers: { isExpanded, isSelected },
   } = getContext<TreeView>("tree");

   // items
   export let level = 1;
   export let treeItems: TreeItem[] = [];
   const weeks = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

   $: scheduledFrom = "";
   $: scheduledTo = "";
   export let record = {
      pin: true,
      alarm: true,
      item: "note",
      title: "urgent note",
      days: [
         { day: "mon", from: "", to: "" },
         { day: "wed", from: "", to: "" },
      ],
      openChat: false,
   };

   function handleChildUpdate(event: CustomEvent) {
      const { task, updateData } = event.detail;
      //dispatchUpdateTask({ task, updateData });
   }

   const dispatch = createEventDispatcher();
   let tableContainer: HTMLElement;

   export let scrollPosition = { scrollTop: 0 };
   function handleScroll() {
      dispatch("scroll", {
         scrollTop: tableContainer.scrollTop,
      });
   }

   export function updateScrollPosition(scrollPosition) {
      if (tableContainer) {
         tableContainer.scrollTop = scrollPosition.scrollTop;
      }
   }

   $: {
      if (tableContainer) {
         tableContainer.scrollTop = scrollPosition.scrollTop;
      }
   }
</script>

{#key treeItems}
   <div
      class={(level !== 1 &&
         "px-1.5 h-full border-b-2 bg-zinc-50  border-zinc-500 border-double rounded-r-lg shadow") ||
         "max-h-full overflow-y-auto no-scrollbar"}
      bind:this={tableContainer}
      on:scroll={handleScroll}
   >
      {#each treeItems as { task, subtasks }}
         {@const itemId = `${task.id}`}
         {@const hasChildren = !!subtasks?.length}
         <!-- schedule weekly -->
         <div
            class="flex h-11 my-2 border-l-2 border-r-2 rounded border-zinc-500"
         >
            {#each weeks as day, i}
               <ContextMenu.Root
                  closeOnItemClick={false}
                  onOpenChange={() => {
                     if (record.days.some((item) => item.day === day))
                        record.days.find((item) => item.day === day).from =
                           scheduledFrom;
                     record.days.find((item) => item.day === day).to =
                        scheduledTo;
                     scheduledFrom = "";
                     scheduledTo = "";
                  }}
               >
                  <ContextMenu.Trigger class="w-full h-full -translate-y-1 "
                     ><button
                        on:click={() => {
                           // record.days에 day가 있다면 제거하고, 없다면 추가.
                           record.days.some((item) => item.day === day)
                              ? (record.days = record.days.filter(
                                   (item) => item.day !== day,
                                ))
                              : (record.days = [
                                   ...record.days,
                                   { day, from: "", to: "" },
                                ]);
                        }}
                        class={cn(
                           "relative bg-white/90 w-full h-full mt-1 border-l border-r border-dotted rounded shadow-sm border-zinc-300 hover:bg-zinc-100/90",
                           record.days.some((item) => item.day === day)
                              ? level === 1
                                 ? "bg-pomodoro-800/5 "
                                 : "bg-zinc-400/5"
                              : "",
                        )}
                     >
                        {#if record.days.some((item) => item.day === day)}
                           {@const { from, to } = record.days.find(
                              (item) => item.day === day,
                           )}
                           <div
                              class="relative text-start w-full py-1 px-2 font-serif text-[0.75rem] font-light leading-3 text-zinc-500"
                           >
                              from:
                              <span class="absolute right-2.5"
                                 >{from || ""}</span
                              >
                           </div>
                           <div
                              class="text-start w-full py-1 px-2 font-serif text-[0.75rem] font-light leading-3 text-zinc-500"
                           >
                              to: <span class="absolute right-2.5"
                                 >{to || ""}</span
                              >
                           </div>
                        {/if}
                     </button>

                     <!-- set time -->
                  </ContextMenu.Trigger>
                  {#if record.days.some((item) => item.day === day)}
                     <ContextMenu.Content>
                        <ContextMenu.Label class="text-center">
                           Set Time
                        </ContextMenu.Label>
                        <Separator />
                        <ContextMenu.Item class="flex space-x-2">
                           <Label class="w-12 font-digital">From</Label>
                           <input
                              type="time"
                              class="w-full h-8 px-2 border rounded-lg border-zinc-300"
                              bind:value={scheduledFrom}
                           />
                        </ContextMenu.Item>

                        <ContextMenu.Item class="flex space-x-2">
                           <Label class="w-12 font-digital">To</Label>
                           <input
                              type="time"
                              class="w-full h-8 px-2 border rounded-lg border-zinc-300"
                              bind:value={scheduledTo}
                           />
                        </ContextMenu.Item>
                     </ContextMenu.Content>
                  {/if}
               </ContextMenu.Root>
            {/each}
         </div>

         {#if subtasks?.length}
            <div
               use:melt={$group({ id: itemId })}
               class:groupChild={$isExpanded(itemId)}
            >
               <svelte:self
                  treeItems={subtasks}
                  level={level + 1}
                  on:update={handleChildUpdate}
               />
            </div>
         {/if}
      {/each}
   </div>
{/key}

<style>
   .chat {
      @apply fixed z-50 h-[calc(100vh-110px)] w-1/3 max-w-[430px]   min-w-[250px] rounded-lg  bg-zinc-50 shadow-lg shadow-yellow-950 sm:h-[calc(100vh-80px)];
   }
</style>
