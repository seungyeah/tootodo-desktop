<script lang="ts">
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		today,
		CalendarDate
	} from '@internationalized/date';
	import { Button, RangeCalendar, Popover } from '$ui';
	import { createEventDispatcher } from 'svelte';
	import { CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';
	import { getMonday } from '$lib/utils';
	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	const dispatch = createEventDispatcher();

	 let todayValue: DateValue | undefined = today(getLocalTimeZone());
    let selectedMonday = getMonday(todayValue?.toDate());;

	let selectedDateRange = {
		start: selectedMonday,
		end: selectedMonday.add({ days: 13 })
	};

	function updateDates() {
		dispatch('update', { selectedDateRange });
	}

    function resetDates() {        
        selectedMonday = getMonday(todayValue?.toDate());
        selectedDateRange = {
            start: selectedMonday,
            end: selectedMonday.add({ days: 13 })
        };
        updateDates();
    }

</script>

<div class="relative w-full h-full flex -translate-y-2 translate-x-4 items-center gap-2">
	<!-- 7days-- -->
	<Button
		class="h-8 w-8 !p-1"
		variant="ghost"
		on:click={() => {
			selectedDateRange.start = selectedDateRange.start.subtract({ days: 7 });
			selectedDateRange.end = selectedDateRange.end.subtract({ days: 7 });
			updateDates();
		}}
	>
		<ChevronLeft size={20} />
	</Button>

	<!-- date range picker -->
	<Popover.Root
		openFocus
		onOpenChange={() => {
			updateDates();
		}}
	>
		<Popover.Trigger asChild let:builder>
			<Button
				variant="outline"
				class={cn('w-[300px] justify-start text-left font-normal')}
				builders={[builder]}
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				{#if selectedDateRange && selectedDateRange.start}
					{#if selectedDateRange.end}
						{df.format(selectedDateRange.start.toDate(getLocalTimeZone()))} - {df.format(
							selectedDateRange.end.toDate(getLocalTimeZone())
						)}
					{:else}
						{df.format(selectedDateRange.start.toDate(getLocalTimeZone()))}
					{/if}
				{:else if todayValue}
					{df.format(todayValue.toDate(getLocalTimeZone()))}
				{:else}
					Pick a date
				{/if}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar
				bind:value={selectedDateRange}
				initialFocus
				weekStartsOn={1}
				numberOfMonths={2}
				placeholder={selectedDateRange?.start}
			/>
		</Popover.Content>
	</Popover.Root>

	<!-- reset to today -->
	<Button
		variant="secondary"
		class="absolute z-50  translate-x-[306px]  h-6 px-1 shadow"
		on:click={() => {
            resetDates();
		}}
	>
		<RotateCcw size={18} strokeWidth={2.2} />
	</Button>

	<!-- 7days++ -->
	<Button
		class="h-8 w-8 !p-1"
		variant="ghost"
		on:click={() => {
			selectedDateRange.start = selectedDateRange.start.add({ days: 7 });
			selectedDateRange.end = selectedDateRange.end.add({ days: 7 });
			updateDates();
		}}
	>
		<ChevronRight size={20} />
	</Button>
</div>
