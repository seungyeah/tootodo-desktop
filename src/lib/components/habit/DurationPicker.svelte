<script lang="ts">
   import { Button, Popover } from "$ui";
   import RangeMonthCalendar from "$lib/components/RangeMonthCalendar.svelte";
   import { createEventDispatcher } from "svelte";
   import {
      DateFormatter,
      endOfMonth,
      getLocalTimeZone,
      startOfMonth,
   } from "@internationalized/date";
   import {
      CalendarIcon,
      ChevronLeft,
      ChevronRight,
      RotateCcw,
   } from "lucide-svelte";
   import { cn, type DateRange, getThisMonthRange } from "$lib/utils";
   const df = new DateFormatter("en-US", {
      dateStyle: "medium",
   });
   const dispatch = createEventDispatcher();

   let selectedMonthRange: DateRange = getThisMonthRange();

   let selectingMonthRange: DateRange = getThisMonthRange();

   function updateDates() {
      dispatch("update", { selectedMonthRange: selectedMonthRange });
   }

   function resetDates() {
      selectedMonthRange = getThisMonthRange();
      updateDates();
   }
</script>

<div
   class="relative flex items-center w-full h-full gap-2 -translate-y-2 xl:translate-x-4"
>
   <!-- 1month-- -->
   <Button
      class="h-8 w-8 !p-1"
      variant="ghost"
      on:click={() => {
         selectedMonthRange.start = startOfMonth(
            selectedMonthRange.start?.subtract({ months: 1 }),
         );
         selectedMonthRange.end = endOfMonth(
            selectedMonthRange.end?.subtract({ months: 1 }),
         );
         updateDates();
      }}
   >
      <ChevronLeft size={20} />
   </Button>

   <!-- date range picker -->
   <Popover.Root
      openFocus
      onOpenChange={(open) => {
         if (!open) {
            if (selectingMonthRange.start && selectingMonthRange.end) {
               selectedMonthRange = selectingMonthRange;
               updateDates();
            }
         } else {
            selectingMonthRange = {
               start: undefined,
               end: undefined,
            };
         }
      }}
   >
      <Popover.Trigger asChild let:builder>
         <Button
            variant="outline"
            class={cn(
               "w-[270px] min-w-[270px] lg:w-[calc(100%-300px)] justify-start font-semibold text-zinc-600 ",
            )}
            builders={[builder]}
         >
            <CalendarIcon class="w-4 h-4 mr-2" />
            {#if selectedMonthRange && selectedMonthRange.start}
               {#if selectedMonthRange.end}
                  {df.format(
                     selectedMonthRange.start.toDate(getLocalTimeZone()),
                  )} - {df.format(
                     selectedMonthRange.end.toDate(getLocalTimeZone()),
                  )}
               {:else}
                  {df.format(
                     selectedMonthRange.start.toDate(getLocalTimeZone()),
                  )}
               {/if}
            {:else}
               Pick a month
            {/if}
         </Button>
         <!-- reset to today -->
         <Button
            variant="secondary"
            class="z-50 h-6 px-1 shadow -translate-x-11"
            on:click={() => {
               resetDates();
            }}
         >
            <RotateCcw size={18} strokeWidth={2.2} />
         </Button>
      </Popover.Trigger>
      <Popover.Content class="w-[300px] p-0 translate-y-1" align="start">
         <RangeMonthCalendar
            bind:value={selectingMonthRange}
            initValue={selectedMonthRange}
         />
      </Popover.Content>
   </Popover.Root>

   <!-- 1month++ -->
   <Button
      class="h-8 w-8 !p-1 -translate-x-[34px]"
      variant="ghost"
      on:click={() => {
         selectedMonthRange.start = startOfMonth(
            selectedMonthRange.start?.add({ months: 1 }),
         );
         selectedMonthRange.end = endOfMonth(
            selectedMonthRange.end?.add({ months: 1 }),
         );
         updateDates();
      }}
   >
      <ChevronRight size={20} />
   </Button>
</div>
