<script lang="ts">
    import {
        DateFormatter,
        getLocalTimeZone,
        today,
    } from "@internationalized/date";
    import { Button, RangeCalendar, Popover } from "$ui";
    import {
        CalendarIcon,
        ChevronLeft,
        ChevronRight,
        RotateCcw,
    } from "lucide-svelte";
    import { cn, parseDateRangeFromURL } from "$lib/utils.js";
    import { getThis3WeeksRange } from "$lib/utils";

    const { update } = $props();
    const todayValue = today(getLocalTimeZone());
    const df = new DateFormatter("en-US", {
        month: "short",
        day: "numeric",
    });

    // 3 weeks duration
    let selectedDateRange = $state(
        parseDateRangeFromURL() || getThis3WeeksRange(),
    );

    function resetDates() {
        selectedDateRange = getThis3WeeksRange();
        update(selectedDateRange);
    }
</script>

<div class="relative flex items-center w-full h-9 gap-2">
    <!-- 7days-- -->
    <Button
        class="h-8 w-8 !p-1"
        variant="ghost"
        onclick={() => {
            selectedDateRange.start = selectedDateRange.start.subtract({
                days: 7,
            });
            selectedDateRange.end = selectedDateRange.end.subtract({ days: 7 });
            update(selectedDateRange);
        }}
    >
        <ChevronLeft size={20} />
    </Button>

    <!-- date range picker -->
    <Popover.Root
        openFocus
        onOpenChange={() => {
            update(selectedDateRange);
        }}
    >
        <Popover.Trigger>
            <Button
                variant="outline"
                class={cn(
                    "w-[230px] h-9 py-2.5 px-4 min-w-[230px] lg:w-[calc(100%-230px)] justify-start  font-semibold text-neutral-600",
                )}
            >
                {#if selectedDateRange && selectedDateRange.start}
                    {#if selectedDateRange.end}
                        {df.format(
                            selectedDateRange.start.toDate(getLocalTimeZone()),
                        )} - {df.format(
                            selectedDateRange.end.toDate(getLocalTimeZone()),
                        )}
                    {:else}
                        {df.format(
                            selectedDateRange.start.toDate(getLocalTimeZone()),
                        )}
                    {/if}
                {:else if todayValue}
                    {df.format(todayValue.toDate(getLocalTimeZone()))}
                {:else}
                    Pick a date
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
                <RotateCcw size={18} strokeWidth={2.2} />
            </Button>
        </Popover.Trigger>
        <Popover.Content
            class="w-auto p-0 translate-y-0 translate-x-4"
            align="center"
        >
            <RangeCalendar
                bind:value={selectedDateRange}
                initialFocus
                weekStartsOn={1}
                numberOfMonths={2}
                placeholder={selectedDateRange?.start}
            />
        </Popover.Content>
    </Popover.Root>

    <!-- 7days++ -->
    <Button
        class="h-8 w-8 !p-1"
        variant="ghost"
        onclick={() => {
            selectedDateRange.start = selectedDateRange.start.add({ days: 7 });
            selectedDateRange.end = selectedDateRange.end.add({ days: 7 });
            update(selectedDateRange);
        }}
    >
        <ChevronRight size={20} />
    </Button>
</div>
