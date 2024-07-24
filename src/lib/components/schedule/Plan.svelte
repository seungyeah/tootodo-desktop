<script lang="ts">
   import Chat from "./Chat.svelte";
   import { Button, ContextMenu, DropdownMenu } from "$ui";
   import {
      MessageCircle,
      Pin,
      Bell,
      BellRing,
      EllipsisVertical,
      Trash2,
   } from "lucide-svelte";
   import { afterUpdate, createEventDispatcher, onMount } from "svelte";
   export let value = "";
   const week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
   const weekShort = ["M", "T", "W", "T", "F", "S", "S"];

   let planTime = "";
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
      project: { title: "Project K", color: "#f472b6" },
   };
</script>

<!-- schedule weekly -->
<div class="flex h-[45px] border-b border-dashed">
   {#each week as day, i}
      {@const short = weekShort[i]}
      <ContextMenu.Root
         closeOnItemClick={false}
         onOpenChange={() => {
            if (record.days.some((item) => item.day === day))
               record.days.find((item) => item.day === day).time = planTime;
            planTime = "";
         }}
      >
         <ContextMenu.Trigger class="w-full h-full -translate-y-1 "
            ><button
               class:selectedDay={record.days.some((item) => item.day === day)}
               on:click={() => {
                  // record.days에 day가 있다면 제거하고, 없다면 추가.
                  record.days.some((item) => item.day === day)
                     ? (record.days = record.days.filter(
                          (item) => item.day !== day,
                       ))
                     : (record.days = [...record.days, { day, time: "" }]);
               }}
               class="relative w-full h-full mt-1 rounded-none rounded-b shadow-sm shadow l hover:bg-zinc-100"
               style="color: {record?.project?.color};"
            >
               <span
                  class="absolute left-0 top-0 px-1 py-0.5 font-serif text-[0.5rem] font-light leading-3"
                  >{short}</span
               >
               <span
                  class="absolute bottom-0.5 left-0 text-center w-full py-0.5 font-serif text-[0.75rem] font-light leading-3 text-zinc-500"
                  >{record.days.find((item) => item.day === day)?.time ||
                     ""}</span
               >
            </button>
         </ContextMenu.Trigger>
         {#if record.days.some((item) => item.day === day)}
            <ContextMenu.Content>
               <ContextMenu.Item>
                  <span class="font-bold"> Set Time </span>
                  <input
                     type="time"
                     class="w-full h-8 px-2 border rounded-lg border-zinc-300"
                     bind:value={planTime}
                  />
               </ContextMenu.Item>
            </ContextMenu.Content>
         {/if}
      </ContextMenu.Root>
   {/each}
</div>
