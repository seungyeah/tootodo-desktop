<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
	import * as RangeCalendar from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = RangeCalendarPrimitive.Props;
	type $$Events = RangeCalendarPrimitive.Events;

	export let value: $$Props['value'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;
	export let weekdayFormat: $$Props['weekdayFormat'] = 'short';
	export let startValue: $$Props['startValue'] = undefined;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<RangeCalendarPrimitive.Root
	on:keydown
	bind:value
	bind:placeholder
	bind:startValue
	{weekdayFormat}
	class={cn('px-1.5 py-2', className)}
	{...$$restProps}
	let:months
	let:weekdays
>
	<RangeCalendar.Header>
		<RangeCalendar.PrevButton />
		<RangeCalendar.Heading />
		<RangeCalendar.NextButton />
	</RangeCalendar.Header>
	<RangeCalendar.Months>
		{#each months as month}
			<RangeCalendar.Grid>
				<RangeCalendar.GridHead>
					<RangeCalendar.GridRow class="flex">
						{#each weekdays as weekday}
							<RangeCalendar.HeadCell>
								{weekday.slice(0, 2)}
							</RangeCalendar.HeadCell>
						{/each}
					</RangeCalendar.GridRow>
				</RangeCalendar.GridHead>
				<RangeCalendar.GridBody>
					{#each month.weeks as weekDates}
						<RangeCalendar.GridRow class="w-full mt-2">
							{#each weekDates as date}
								<RangeCalendar.Cell {date} class="relative text-sm text-center focus-within:z-20">
									<RangeCalendar.Day
										{date}
										month={month.value}
										class={cn(
											`group relative inline-flex h-full items-center justify-center overflow-visible whitespace-nowrap
											border border-transparent bg-background bg-transparent p-0 text-sm font-normal text-foreground
											hover:border-foreground focus-visible:!ring-foreground
											data-[disabled]:pointer-events-none
											data-[outside-month]:pointer-events-none
											data-[highlighted]:rounded-none
											data-[selection-end]:rounded-sm
											data-[selection-start]:rounded-sm
											data-[today]:rounded-full
											data-[selection-end]:rounded-l-none
											data-[selection-start]:rounded-r-none
											data-[highlighted]:bg-zinc-100
											data-[selected]:bg-zinc-100
											data-[selection-end]:bg-foreground/80
											data-[selection-start]:bg-foreground/80
											data-[selection-end]:font-medium
											data-[selection-start]:font-medium
											data-[disabled]:text-foreground/30
											data-[selected]:text-foreground
											data-[selection-end]:text-background
											data-[selection-start]:text-background
											data-[unavailable]:text-muted-foreground
											data-[unavailable]:line-through
											data-[selection-start]:focus-visible:ring-2
											data-[selection-start]:focus-visible:!ring-offset-2
											data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none
											data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border
											data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:!ring-0
											data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:!ring-offset-0`
										)}
									>
										<div
											class="absolute top-[5px] hidden size-1 rounded-full group-data-[today]:block group-data-[selected]:bg-zinc-100"
										/>
										{date.day}
									</RangeCalendar.Day>
								</RangeCalendar.Cell>
							{/each}
						</RangeCalendar.GridRow>
					{/each}
				</RangeCalendar.GridBody>
			</RangeCalendar.Grid>
		{/each}
	</RangeCalendar.Months>
</RangeCalendarPrimitive.Root>
