<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import * as Calendar from "./index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = CalendarPrimitive.Props;

	type $$Events = CalendarPrimitive.Events;


	interface Props {
		value?: $$Props["value"];
		placeholder?: $$Props["placeholder"];
		weekdayFormat?: $$Props["weekdayFormat"];
		class?: $$Props["class"];
		[key: string]: any
	}

	let {
		value = $bindable(undefined),
		placeholder = $bindable(undefined),
		weekdayFormat = "short",
		class: className = undefined,
		...rest
	}: Props = $props();
	
</script>

<CalendarPrimitive.Root
	bind:value
	bind:placeholder
	{weekdayFormat}
	class={cn("p-3 m-auto", className)}
	{...rest}
	on:keydown
	
	
>
	{#snippet children({ months, weekdays })}
		<Calendar.Header>
			<Calendar.PrevButton />
			<Calendar.Heading />
			<Calendar.NextButton />
		</Calendar.Header>
		<Calendar.Months >
			{#each months as month}
				<Calendar.Grid >
					<Calendar.GridHead>
						<Calendar.GridRow class="flex justify-between">
							{#each weekdays as weekday}
								<Calendar.HeadCell>
									{weekday.slice(0, 3)}
								</Calendar.HeadCell>
							{/each}
						</Calendar.GridRow>
					</Calendar.GridHead>
					<Calendar.GridBody>
						{#each month.weeks as weekDates}
							<Calendar.GridRow class="flex justify-between w-full mt-2">
								{#each weekDates as date}
									<Calendar.Cell {date}>
										<Calendar.Day {date} month={month.value} />
									</Calendar.Cell>
								{/each}
							</Calendar.GridRow>
						{/each}
					</Calendar.GridBody>
				</Calendar.Grid>
			{/each}
		</Calendar.Months>
	{/snippet}
</CalendarPrimitive.Root>
