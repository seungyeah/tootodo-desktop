<script lang="ts">
    import {Button, Popover} from "$ui";
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
    import {cn, type DateRange, getThisMonthRange, parseMonthRangeFromURL} from "$lib/utils";

    let {update} = $props();

    const df = new DateFormatter('en-US', {
        month: "short",
        day: "numeric",
    });


    let selectedMonthRange: DateRange = $state(parseMonthRangeFromURL() || getThisMonthRange());
    ;

    function resetDates() {
        selectedMonthRange = getThisMonthRange();

        update(selectedMonthRange)
    }

</script>

<div class="relative flex items-center w-full h-9 gap-2 ">

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
        <ChevronLeft size={20}/>
    </Button>

    <!-- date range picker -->
    <Popover.Root
            openFocus
            onOpenChange={() => {
                update(selectedMonthRange)
            }}
    >
        <Popover.Trigger>
            <Button
                    variant="outline"
                    class={cn('w-[230px] h-9 py-2.5 px-4 min-w-[230px] lg:w-[calc(100%-230px)] justify-start  font-semibold text-zinc-600')}
            >
                <CalendarIcon class="w-4 h-4 mr-2"/>
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
                    class=" absolute top-1.5 right-2.5 h-6 px-1 shadow -translate-x-9"
                    onclick={() => {
                  resetDates();
               }}
            >
                <RotateCcw size={18} strokeWidth={2.2}/>
            </Button>
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
            class="h-8 w-8 !p-1"
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
        <ChevronRight size={20}/>
    </Button>
</div>
