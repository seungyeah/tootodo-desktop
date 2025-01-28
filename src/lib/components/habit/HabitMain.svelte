<!-- @migration-task Error while migrating Svelte code: `<div>` cannot be a child of `<thead>`. `<thead>` only allows these children: `<tr>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<!-- @migration-task Error while migrating Svelte code: `<div>` cannot be a child of `<thead>`. `<thead>` only allows these children: `<tr>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script lang="ts">
   import {
      CalendarDate,
      getLocalTimeZone,
      today,
      parseDate,
   } from "@internationalized/date";
   import { getContext } from "svelte";
   import { getDatesInRange, getDuration, countMonths } from "$lib/utils";
   const habits = getContext("habits");
   const statusOption: string = getContext("statusOption");
   const days = ["S", "M", "T", "W", "T", "F", "S"];
   const selectedMonth = getContext("selectedMonthRange");

   $: months = {
      value: today(getLocalTimeZone()),
      dates: getDatesInRange($selectedMonth.start, $selectedMonth.end),
      duration: getDuration($selectedMonth.start, $selectedMonth.end),
   };

   $: monthCounts = countMonths(months.dates);

   // scroll
   import { createEventDispatcher } from "svelte";
    import ScrollArea from "$ui/scroll-area/scroll-area.svelte";

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

<ScrollArea
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
                     ? " border-r border-zinc-900 bg-gradient-to-b from-pomodoro-500/10 to-zinc-100"
                     : day === 6
                       ? "bg-gradient-to-b from-blue-500/10 to-zinc-100"
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
         <tr class="h-1 min-w-full"></tr>
      </thead>

      <tbody class="relative text-center border">
         {#key $habits}
            {#each $habits as habit, i}
               {#if habit.status === $statusOption}
                  <tr class="h-[30px]">
                     {#each months.dates as date}
                        {@const day = date.toDate().getDay()}
                        <td class="w-full border-b border-r border-dashed">
                           <!-- todo: record.start_date와 day가 동일할 경우에만. -->
                           {#if day%3===0}
                           <div class="w-3 h-3 m-auto rounded-full" style="background:{habit.color}; opacity:30%"/>
                           {/if}
                        </td>
                     {/each}
                  </tr>
               {/if}
            {/each}
         {/key}
      </tbody>
   </table>
</ScrollArea>

<style>
   td {
      width: 30px;
   }
</style>
