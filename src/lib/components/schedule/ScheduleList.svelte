<script context="module" lang="ts">
   import { type Task } from "$lib/schema";

   export type TreeItem = {
      task: Task;
      subtasks?: TreeItem[];
   };

   let draggedTask: Task | null = null;
</script>

<script lang="ts">
   import SettingIcon from "./SettingIcon.svelte";

   import { Button } from "$ui";
   import { Folder, FolderOpen, MessageCircle } from "lucide-svelte";
   import { Pin } from "lucide-svelte";

   import { createEventDispatcher, getContext } from "svelte";
   import Chat from "./Chat.svelte";

   import { melt, type TreeView } from "@melt-ui/svelte";
   import { cn } from "$lib/utils";
   const {
      elements: { item, group },
      helpers: { isExpanded, isSelected },
   } = getContext<TreeView>("tree");

   // items
   export let level = 1;
   export let treeItems: TreeItem[] = [];

   export let record = {
      pin: true,
      alarm: true,
      item: "note",
      title: "urgent note",
      days: [
         { day: "mon", time: "" },
         { day: "wed", time: "" },
      ],
      openChat: false,

      category: { title: "Project K", color: "#e46b75" },
   };
   const dispatch = createEventDispatcher();

   // 자식 컴포넌트(self)에서 발생한 이벤트를 처리하고 상위로 전달하는 함수
   function handleChildUpdate(event: CustomEvent) {
      const { task, updateData } = event.detail;
      //dispatchUpdateTask({ task, updateData });
   }

   // scroll
   let tableContainer: HTMLElement;
   function handleScroll() {
      dispatch("scroll", {
         scrollTop: tableContainer.scrollTop,
         scrollLeft: tableContainer.scrollLeft,
      });
   }

   export function updateScrollPosition(scrollPosition) {
      if (tableContainer) {
         tableContainer.scrollTop = scrollPosition.scrollTop;
         tableContainer.scrollLeft = scrollPosition.scrollLeft;
      }
   }
</script>

{#key treeItems}
   <div
      class={(level !== 1 &&
         "pl-2 bg-zinc-50 border-b-2  border-zinc-500 border-double rounded-l-lg shadow") ||
         "h-full max-h-full overflow-y-auto overflow-x-clip no-scrollbar "}
      bind:this={tableContainer}
      on:scroll={handleScroll}
   >
      {#each treeItems as { task, subtasks }}
         {@const itemId = `${task.id}`}
         {@const hasChildren = !!subtasks?.length}
         <div
            class="flex flex-col h-11 m-2 rounded-md shadow bg-white border-t border-zinc-50"
         >
            <div class="relative flex items-center h-11">
               <div
                  class={cn(
                     "w-3 h-full rounded-l",
                     level === 1
                        ? " bg-pomodoro-900/10 border-b border-pomodoro-900/60"
                        : " bg-zinc-900/10 border-b border-zinc-900",
                  )}
               />

               <SettingIcon></SettingIcon>

               <!-- item pin -->
               {#if record.pin && level === 1}
                  <Button
                     variant="ghost"
                     class="absolute h-6  px-1 -top-2 -left-3 -rotate-12 "
                     on:click={() => (record.pin = false)}
                     ><Pin size={16} fill="#e4e4e7" color="#52525b" /></Button
                  >
               {/if}

               <!-- item info -->
               <button
                  use:melt={$item({
                     id: itemId,
                     hasChildren,
                  })}
                  class="w-full flex flex-col justify-between -ml-2 -translate-x-1"
               >
                  <div class="flex h-9">
                     <!-- Folder icon. -->
                     {#if hasChildren && $isExpanded(itemId)}
                        <svelte:component
                           this={FolderOpen}
                           fill="white"
                           class={cn(
                              "w-3.5 min-w-3.5 max-w-3.5  absolute -left-2.5 -top-3 opacity-70 ",
                              record.pin
                                 ? "-left-2.5"
                                 : "-left-6",
                           )}
                        />
                     {:else if hasChildren}
                        <svelte:component
                           this={Folder}
                           fill="white"
                           class={cn(
                              "w-3.5 min-w-3.5 max-w-3.5  absolute -left-2.5 -top-3 opacity-70",
                              record.pin
                                 ? "-left-2.5"
                                 : "-left-6",
                           )}
                        />
                     {/if}

                     <div
                        class="text-start self-center text-xs font-sans line-clamp-2 leading-[1.1rem]"
                     >
                        {task.title}
                     </div>
                  </div>
               </button>

               <!-- chatting popup icon-->
               <Button
                  variant="ghost"
                  class="absolute h-6  px-2 -right-4 -bottom-1.5"
                  on:click={() => (record.openChat = !record.openChat)}
               >
                  <div
                     class=" text-zinc-500 text-[0.5rem] w-full h-full absolute rotate-90 -top-[22px] font-digital"
                  >
                     {task?.start_date?.slice(8, 10)} - {task?.end_date?.slice(
                        8,
                        10,
                     )}
                  </div>
                  {#if record.openChat}
                     <MessageCircle
                        size={16}
                        fill="#fef08a"
                        class="scale-125 -translate-x-0.5 "
                     />
                  {:else}
                     <MessageCircle size={16} fill="#f4f4f5" class="text-zinc-400" />
                  {/if}
               </Button>
            </div>
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
