<script lang="ts">
   import { run } from "svelte/legacy";

   import { Button } from "$ui";
   import { CalendarDate } from "@internationalized/date";
   import { ChevronLeft, ChevronRight } from "lucide-svelte";

   let { value = $bindable(), initValue } = $props();
   let year;
   run(() => {
      year = initValue.start?.year;
   });

   const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
   ];
</script>

<div class="flex flex-col w-full">
   <div class="flex justify-between w-full p-2 border-b-2 shadow">
      <Button
         onclick={() => {
            year--;
         }}
         variant="outline"
         class="p-0 bg-transparent opacity-50 h-7 w-7 hover:opacity-100"
      >
         <ChevronLeft class="w-4 h-4" />
      </Button>
      {year}
      <Button
         onclick={() => {
            year++;
         }}
         variant="outline"
         class="p-0 bg-transparent opacity-50 h-7 w-7 hover:opacity-100"
      >
         <ChevronRight class="w-4 h-4" />
      </Button>
   </div>

   <div class="grid grid-cols-4 gap-3 p-2">
      {#each months as month, i}
         <Button
            variant="ghost"
            class={`
               p-2 text-center
               ${
                  value.start || value.end
                     ? value.start?.month < i + 1 && value.end?.month > i + 1
                        ? "bg-neutral-100"
                        : (value.start?.month === i + 1 &&
                               value.start?.year === year) ||
                            (value.end?.month === i + 1 &&
                               value.end?.year === year)
                          ? "bg-neutral-300"
                          : ""
                     : initValue.start?.month < i + 1 &&
                         initValue.end?.month > i + 1
                       ? "bg-neutral-100"
                       : (initValue.end?.month === i + 1 &&
                              initValue.end?.year === year) ||
                           (initValue.start?.month === i + 1 &&
                              initValue.start?.year === year)
                         ? "bg-neutral-300"
                         : ""
               }
            `}
            onclick={() => {
               value.start = new CalendarDate(year, i + 1, 1);
               value.end = new CalendarDate(year, i + 1, 31);
               if (value.start > value.end) {
                  const temp = value.start;
                  value.start = value.end;
                  value.end = temp;
               }
            }}>{month}</Button
         >
      {/each}
   </div>
</div>
