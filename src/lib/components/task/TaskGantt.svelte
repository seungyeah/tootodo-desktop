<script lang="ts">
   import {
      getLocalTimeZone,
      today,
   } from "@internationalized/date";
   import { getContext } from "svelte";
   import { getDatesInRange, getDuration, countMonths } from "$lib/utils";

   export let treeItems = [];
   const days = ["S", "M", "T", "W", "T", "F", "S"];
   const selectedDate = getContext("selectedDateRange");

   $: months = {
      value: today(getLocalTimeZone()),
      dates: getDatesInRange($selectedDate.start, $selectedDate.end),
      duration: getDuration($selectedDate.start, $selectedDate.end),
   };

   $: monthCounts = countMonths(months.dates);
   // 전체 날짜 수 계산
   $: totalDays = months.dates.length;
   
   // scroll
   import { createEventDispatcher } from "svelte";
    import GanttTree from "./GanttTree.svelte";

   const dispatch = createEventDispatcher();
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

<div
   class="w-full h-full max-h-full overflow-x-scroll overflow-y-scroll translate-y-1 border-2 no-scrollbar border-zinc-800"
   bind:this={tableContainer}
   on:scroll={handleScroll}
>
   <table class="relative w-full border-separate table-fixed border-spacing-0">
      <thead class="sticky top-0 z-10 text-center bg-white shadow-lg">
         <tr class="text-center text-[1rem] h-7">
            {#each monthCounts as monthCount}
               <td
                  class="border-b-2 border-r border-zinc-600"
                  colspan={monthCount.count}
                  >{monthCount.month}</td
               >
            {/each}
         </tr>

         <tr class="text-center">
            {#each months.dates as date}
               {@const day = date.toDate().getDay()}
               <td
                  class="py-0 text-xs border-b-4 border-r border-zinc-600 text-zinc-600"
                  
                  style="width: calc({100 / totalDays}%);"
               >
                  <div
                     class={day === 0
                        ? " border-r border-zinc-900  bg-pomodoro-500/10"
                        : day === 6
                          ? "bg-blue-100/90"
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
      </thead>
      <tbody class="relative w-full">
         <GanttTree {treeItems} {totalDays}/>
      </tbody>
      
   </table>

</div>

