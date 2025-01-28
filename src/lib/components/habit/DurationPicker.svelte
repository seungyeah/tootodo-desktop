<script lang="ts">
   import { Button, Popover } from "$ui";
   import RangeMonthCalendar from "$lib/components/RangeMonthCalendar.svelte";
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
   import { cn, type DateRange, getThisMonthRange ,parseMonthRangeFromURL} from "$lib/utils";

   let {update} = $props();

   const df = new DateFormatter('en-US', {
		month:"short",
		day:"numeric",
	});


   let selectedMonthRange:DateRange = $state(parseMonthRangeFromURL() || getThisMonthRange()); ;

   function resetDates() {
      selectedMonthRange = getThisMonthRange();

      update(selectedMonthRange)
   }

</script>

<div
   class="relative flex items-center w-full h-full gap-2 -translate-y-2 xl:translate-x-4"
>
   <!-- 1month-- -->
   <Button
      class="h-8 w-8 !p-1"
      variant="ghost"
      onclick={() => {
         selectedMonthRange.start = startOfMonth(
            selectedMonthRange.start?.subtract({ months: 1 }),
         );
         selectedMonthRange.end = endOfMonth(
            selectedMonthRange.end?.subtract({ months: 1 }),
         );

      update(selectedMonthRange)
      }}
   >
      <ChevronLeft size={20} />
   </Button>

   <!-- date range picker -->
   <Popover.Root
      openFocus
      onOpenChange={() => {

      update(selectedMonthRange)
      }}
   >
      <Popover.Trigger asChild >
         {#snippet children({ builder })}
                  <Button
               variant="outline"
               class={cn('w-[300px] p-2.5 min-w-[300px] lg:w-[calc(100%-300px)] justify-start font-semibold text-zinc-600')}
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
               onclick={() => {
                  resetDates();
               }}
            >
               <RotateCcw size={18} strokeWidth={2.2} />
            </Button>
                        {/snippet}
            </Popover.Trigger>
      <Popover.Content class="w-[300px] p-0 translate-y-1" align="start">
         <RangeMonthCalendar
            bind:value={selectedMonthRange}
            initValue={selectedMonthRange}
         />
      </Popover.Content>
   </Popover.Root>

   <!-- 1month++ -->
   <Button
      class="h-8 w-8 !p-1 -translate-x-[34px]"
      variant="ghost"
      onclick={() => {
         selectedMonthRange.start = startOfMonth(
            selectedMonthRange.start?.add({ months: 1 }),
         );
         selectedMonthRange.end = endOfMonth(
            selectedMonthRange.end?.add({ months: 1 }),
         );

      update(selectedMonthRange)
      }}
   >
      <ChevronRight size={20} />
   </Button>
</div>
