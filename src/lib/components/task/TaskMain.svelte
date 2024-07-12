<script lang="ts">
   import {
      CalendarDate,
      getLocalTimeZone,
      today,
      parseDate,
   } from "@internationalized/date";
   import { getContext } from "svelte";
   import { getDatesInRange, getDuration, countMonths } from "$lib/utils";

   const tasks = getContext("tasks");

   const days = ["S", "M", "T", "W", "T", "F", "S"];
   const selectedDate = getContext("selectedDateRange");

   $: months = {
      value: today(getLocalTimeZone()),
      dates: getDatesInRange($selectedDate.start, $selectedDate.end),
      duration: getDuration($selectedDate.start, $selectedDate.end),
   };

   $: monthCounts = countMonths(months.dates);

   // scroll
   import { createEventDispatcher } from "svelte";

   const dispatch = createEventDispatcher();
   let tableContainer;

   function handleScroll(event) {
      dispatch("scroll", {
         scrollTop: tableContainer.scrollTop,
         scrollLeft: tableContainer.scrollLeft,
      });
   }

   export let scrollPosition = { scrollTop: 0, scrollLeft: 0 };

   export function updateScrollPosition(scrollPosition) {
      if (tableContainer) {
         tableContainer.scrollTop = scrollPosition.scrollTop;
         tableContainer.scrollLeft = scrollPosition.scrollLeft;
      }
   }

   $: {
      if (tableContainer) {
         tableContainer.scrollTop = scrollPosition.scrollTop;
         tableContainer.scrollLeft = scrollPosition.scrollLeft;
      }
   }
</script>

<div
   class="w-full h-full max-h-full overflow-y-scroll translate-y-1 border-2 border-zinc-800"
   bind:this={tableContainer}
   on:scroll={handleScroll}
>
   <table class="relative w-full border-separate border-spacing-0">
      <thead class="sticky top-0 z-10 text-center bg-white shadow-lg">
         <tr class="text-center text-[1rem] h-7">
            {#each monthCounts as monthCount}
               <td
                  class="border-b-2 border-r border-zinc-600"
                  colspan={monthCount.count}>{monthCount.month}</td
               >
            {/each}
         </tr>

         <tr class="text-center">
            {#each months.dates as date}
               {@const day = date.toDate().getDay()}
               <td
                  class="py-0 text-xs border-b-4 border-r border-zinc-600 text-zinc-600"
               >
                  <div
                     class={day === 0
                        ? " border-r border-zinc-900  bg-red-100"
                        : day === 6
                          ? "bg-blue-100"
                          : ""}
                  >
                     <div class="py-0 text-xs">{days[day]}</div>
                     <div
                        class="-translate-y-0.5 border-[0.5px] border-dotted border-zinc-700"
                     ></div>
                     <div>{date.toString().split("-")[2]}</div>
                  </div>
               </td>
            {/each}
         </tr>
         <div class="h-1 min-w-full"></div>
      </thead>

      <tbody class="relative text-center border">
         {#key $tasks}
            {#each $tasks as task, i}
               {@const task_start = getDuration(
                  $selectedDate.start,
                  parseDate(task.start_date),
               )}
               {@const task_duration = getDuration(
                  parseDate(task.start_date),
                  parseDate(task.end_date),
               )}
               {@const task_end = getDuration(
                  parseDate(task.end_date),
                  $selectedDate.end,
               )}
               {@const start_to_task_start = getDuration(
                  $selectedDate.end,
                  parseDate(task.start_date),
               )}
               {@const end_to_task_start = getDuration(
                  parseDate(task.end_date),
                  $selectedDate.start,
               )}

               {#if start_to_task_start > 0 || end_to_task_start > 0}<div
                  ></div>{:else}
                  <tr class="h-[30px] border-b">
                     {#if task_start == 0 && task_end == 0}
                        <td
                           colspan={task_duration + task_start + 1}
                           class:milestone={task.milestone}
                           class:task={!task.milestone}
                           data-percent={task_duration + task_start + 1}
                        >
                           <span class="text-zinc-700"
                              ><span class="text-xs opacity-80">#</span>{i + 1}
                           </span></td
                        >
                     {:else if task_start <= 0}
                        <td
                           colspan={task_duration + task_start + 1}
                           class:milestone={task.milestone}
                           class:task={!task.milestone}
                           data-percent={task_duration + task_start + 1}
                           ><span class="text-xs opacity-80">#</span>{i + 1}</td
                        >
                        <td colspan={task_end} class="border-b"></td>
                     {:else if task_end <= 0}
                        <td colspan={task_start} class="border-b"></td>
                        <td
                           colspan={task_duration + task_end + 1}
                           class:milestone={task.milestone}
                           class:task={!task.milestone}
                           data-percent={task_duration + task_end + 1}
                           ><span class="text-xs opacity-80">#</span>{i + 1}</td
                        >
                     {:else}
                        <td colspan={task_start} class="border-b"></td>
                        <td
                           colspan={task_duration + 1}
                           class:milestone={task.milestone}
                           class:task={!task.milestone}
                           data-percent={task_duration + 1}
                           ><span class="text-xs opacity-80">#</span>{i + 1}</td
                        >
                        <td colspan={task_end} class="border-b"></td>
                     {/if}
                  </tr>
               {/if}
            {/each}
         {/key}
      </tbody>
   </table>
</div>

<style>
   td {
      width: 30px;
   }
   .milestone {
      position: relative;
      background-color: #b91c1c;
      opacity: 80%;
      color: white;
      height: 20px;
      margin: 2px 0;
      text-wrap: nowrap;
      border-bottom: #c1c1c1 1px solid;
   }
   .task {
      position: relative;
      background-color: #3f3f46;
      opacity: 80%;
      color: white;
      height: 20px;
      margin: 2px 0;
      text-wrap: nowrap;
      border-bottom: #c1c1c1 1px solid;
   }
   .task::after {
      content: attr(data-percent) " %";
      font-size: 10px;
      position: absolute;
      right: 2px;
      top: -3px;
      color: white;
      opacity: 70%;
   }
</style>
