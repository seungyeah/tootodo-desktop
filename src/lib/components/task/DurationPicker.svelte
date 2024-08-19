<script lang="ts">
	import {
		DateFormatter,
		getLocalTimeZone,
		today,
	} from '@internationalized/date';
	import { Button, RangeCalendar, Popover } from '$ui';
	import { createEventDispatcher } from 'svelte';
	import { CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';
	
	import { getThis3WeeksRange} from "$lib/utils";
	const todayValue = today(getLocalTimeZone());
	const df = new DateFormatter('en-US', {
		month:"short",
		day:"numeric",
	});

	const dispatch = createEventDispatcher();


	// 3 weeks duration
	let selectedDateRange  =getThis3WeeksRange();

	function updateDates() {
		dispatch('update', { selectedDateRange });
	}

   function resetDates() {        
		selectedDateRange  =getThis3WeeksRange();
		updateDates();
	}

</script>

<div class="relative flex items-center w-full h-full gap-2 -translate-y-2 xl:translate-x-4">
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
				class={cn('w-[300px] p-2.5 min-w-[300px] lg:w-[calc(100%-300px)] justify-start font-semibold text-zinc-600')}
				builders={[builder]}
			>
				<CalendarIcon class="w-4 h-4 mr-2" />
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
		<Popover.Content class="w-auto p-0 translate-y-1" align="center">
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
		class="h-8 w-8 !p-1 -translate-x-[34px]"
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
