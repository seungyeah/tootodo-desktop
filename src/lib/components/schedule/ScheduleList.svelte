<script lang="ts">
   import { Button, DropdownMenu } from "$ui";
   import { Book, BookPlus, MoonStar, Share, Workflow } from "lucide-svelte";
   import { currentTime, formatTime } from "$store";
   import {
      MessageCircle,
      Pin,
      Bell,
      BellRing,
      EllipsisVertical,
      Trash2,
   } from "lucide-svelte";

   import { createEventDispatcher, getContext } from "svelte";
   import type { Task } from "$lib/schema";
   import Chat from "./Chat.svelte";
   let openSide = true;

   let selectedWeekRange = getContext("selectedWeekRange");
   $: currentTimeDisplay = formatTime($currentTime);

   export let tasks: Task[] = [];
   let value;
   let chatRef;
   let componentY = 0;
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
   function toggleOpenChat() {
      record.openChat = !record.openChat;
      dispatch("toggleOpenChat", record);
   }
</script>

<header class="flex justify-between mb-1 mr-1.5 text-lg font-digital">
   <button
      on:click={() => (openSide = !openSide)}
      class="rounded-full z-[1] h-[30px] flex"
   >
      <MoonStar fill="black" />
      {currentTimeDisplay}
   </button>

   <div class="flex space-x-1">
      <Button
         variant="ghost"
         class="shadow z-[1] h-[30px] px-2 py-0 -translate-y-0.5 translate-x-1 hover:bg-transparent 
   hover:shadow-lg hover:shadow-zinc-400 hover:-translate-y-1 rounded-full"
      >
         <Workflow strokeWidth={2.5} size={16} />
      </Button>
      <Button
         variant="ghost"
         class="shadow z-[1] h-[30px] px-2 py-0 -translate-y-0.5 translate-x-1 hover:bg-transparent 
hover:shadow-lg hover:shadow-zinc-400 hover:-translate-y-1 rounded-full"
      >
         <Share strokeWidth={2.5} size={16} />
      </Button>
   </div>
</header>

<div
   class="h-[calc(100%-30px)] overflow-y-auto overflow-x-clip no-scrollbar rounded-lg border-2 border-zinc-700"
>
   {#each tasks as task, i}
      <div class="flex flex-col h-10 mx-2 my-2 rounded-lg shadow">
         <div class="relative flex items-center h-10 ">
            <!-- setting item -->
            <DropdownMenu.Root>
               <DropdownMenu.Trigger
                  ><EllipsisVertical size={16} class="w-5" color={record.category.color} /></DropdownMenu.Trigger
               >
               <DropdownMenu.Content>
                  <DropdownMenu.Group>
                     
                     <DropdownMenu.Separator />
                     <DropdownMenu.Item on:click={() => (record.pin = true)}
                        ><Pin size={16} class="mr-2" />Pin</DropdownMenu.Item
                     >
                     {#if record.note}
                     <DropdownMenu.Item on:click={() => (record.pin = true)}
                        ><Book size={16} class="mr-2" />Open Note</DropdownMenu.Item
                     >
                     {:else}
                     <DropdownMenu.Item on:click={() => (record.pin = true)}
                        ><BookPlus size={16} class="mr-2" />Add Note</DropdownMenu.Item
                     >
                     {/if}

                     <DropdownMenu.Item
                        ><Trash2
                           size={16}
                           class="mr-2"
                        />Delete</DropdownMenu.Item
                     >
                  </DropdownMenu.Group>
               </DropdownMenu.Content>
            </DropdownMenu.Root>

            <!-- item content -->
            {#if record.pin}
               <Button
                  variant="ghost"
                  class="absolute h-6  px-1 -top-1.5 -left-3 "
                  on:click={() => (record.pin = false)}
                  ><Pin size={16} fill="#e4e4e7" /></Button
               >
            {/if}
            
            <!-- item title -->
            <button class=" w-[calc(100%-40px)] text-start text-[0.8rem] h-9 line-clamp-2 leading-[1.07rem]">{task.title}</button>

            <!-- chatting popup icon-->
            <Button
               variant="ghost"
               class="absolute h-6 px-2 -right-0.5 top-2"
               on:click={toggleOpenChat}
            >
               {#if record.openChat}
                  <MessageCircle
                     size={16}
                     fill="#fef08a"
                     class="scale-125 "
                  />
               {:else}
                  <MessageCircle size={16} fill="#f4f4f5" color="#a1a1aa" />
               {/if}
            </Button>
         </div>

         <!-- <hr class="border-dashed border-zinc-300" /> -->

         <!-- chat popup -->
         {#if record.openChat}
            <div
               class="chat"
               style="transform:translate(87%,-{componentY + 8}px)"
            >
               <Chat bind:record />
            </div>
         {/if}
      </div>
   {/each}
</div>
