<script lang="ts">
   import { Button, Calendar, Popover } from "$ui";
   import { createEventDispatcher } from "svelte";
   import {
      DateFormatter,
      endOfWeek,
      getLocalTimeZone,
      CalendarDate,
      today,
      startOfWeek,
   } from "@internationalized/date";
   import {
      CalendarIcon,
      ChevronLeft,
      ChevronRight,
      RotateCcw,
   } from "lucide-svelte";
   import { cn, type DateRange, getThisWeekRange } from "$lib/utils";
   const df = new DateFormatter("en-US", {
      dateStyle: "medium",
   });
   const dispatch = createEventDispatcher();

   let selectedWeekRange: DateRange = getThisWeekRange();

   function updateDates() {
      dispatch("update", { selectedWeekRange });
   }

   function resetDates() {
      selectedWeekRange = getThisWeekRange();
      selectedDate = today(getLocalTimeZone());
      updateDates();
   }

   let selectedDate =  today(getLocalTimeZone());
   $:{
      if(selectedDate){
         selectedWeekRange.start = startOfWeek(selectedDate,'fr-FR');
         selectedWeekRange.end = endOfWeek(selectedDate,'fr-FR');
         selectedDate = selectedWeekRange.start;
      }
   }
</script>

<div
   class="flex items-center justify-center w-full h-10 space-x-2 -translate-y-0.5"
>

   <!-- 1week-- -->
   <Button
      class="h-8 w-8 !p-1"
      variant="ghost"
      on:click={() => {
         selectedWeekRange.start = startOfWeek(
            selectedWeekRange.start?.subtract({ weeks: 1 }),'fr-FR'
         );
         selectedWeekRange.end = endOfWeek(
            selectedWeekRange.end?.subtract({ weeks: 1 }),'fr-FR'
         );
         selectedDate = selectedWeekRange.start;
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
            if (selectedDate) {
               selectedWeekRange.start = startOfWeek(selectedDate,'fr-FR');
               selectedWeekRange.end = endOfWeek(selectedDate,'fr-FR');
               selectedDate = selectedWeekRange.start;
               updateDates();
            }
         } else {
            selectedWeekRange = {
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
               "text-md  w-[400px] text-center font-semibold ",
               !selectedDate && "text-muted-foreground",
            )}
            builders={[builder]}
         >
            <CalendarIcon class="w-4 h-4 mr-2" />
            <span class="text-zinc-600">
               {selectedDate && selectedWeekRange.start
                  ? df.format(
                       selectedWeekRange.start.toDate(),
                    )
                  : df.format(
                       getThisWeekRange(
                          today(getLocalTimeZone()).toDate(),
                       ).start.toDate(),
                    )}
               -
               {selectedDate && selectedWeekRange.end
                  ? df.format(
                       selectedWeekRange.end.toDate(),
                    )
                  : df.format(
                       getThisWeekRange(
                          today(getLocalTimeZone()).toDate(),
                       ).end.toDate(),
                    )}
            </span>
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
      <!-- date range picker : pick a date and update the week range -->
      <Popover.Content class="p-0 translate-y-1 " align="center">
         <Calendar bind:value={selectedDate} initialFocus weekStartsOn={1} />
      </Popover.Content>
   </Popover.Root>

   <!-- 1week++ -->
   <Button
      class="h-8 w-8 !p-1 -translate-x-[34px]"
      variant="ghost"
      on:click={() => {
         selectedWeekRange.start = startOfWeek(
            selectedWeekRange.start?.add({ weeks: 1 }),'fr-FR'
         );
         selectedWeekRange.end = endOfWeek(
            selectedWeekRange.end?.add({ weeks: 1 }),'fr-FR'
         );
         selectedDate = selectedWeekRange.start;
         updateDates();
      }}
   >
      <ChevronRight size={20} />
   </Button>
</div>
