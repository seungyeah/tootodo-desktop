<script lang="ts">
	import { CalendarRange } from 'lucide-svelte';
	import type { DateRange } from 'bits-ui';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';

    import{Button, RangeCalendar, Popover} from '$ui';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let value: DateRange | undefined = $state({
		start: new CalendarDate(2024, 4, 12),
		end: new CalendarDate(2024, 4, 12).add({ days: 7 })
	});

	let startValue: DateValue | undefined = $state(undefined);
</script>

<div class="grid gap-2 ">	
	<Popover.Root openFocus>
		<Popover.Trigger asChild >
			{#snippet children({ builder })}
						<Button
					variant="outline"
					class={cn(
						'w-[300px] justify-start text-left font-normal',
						!value && 'text-muted-foreground'
					)}
					builders={[builder]}
				>
					<CalendarRange class="mr-2 h-4 w-4 " />
					{#if value && value.start}
						{#if value.end}
							{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
								value.end.toDate(getLocalTimeZone())
							)}
						{:else}
							{df.format(value.start.toDate(getLocalTimeZone()))}
						{/if}
					{:else if startValue}
						{df.format(startValue.toDate(getLocalTimeZone()))}
					{:else}
						Pick a date
					{/if}
				</Button>
								{/snippet}
				</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar
				bind:value
				bind:startValue
				placeholder={value?.start}
				initialFocus
				numberOfMonths={2}
			/>
		</Popover.Content>
	</Popover.Root>
</div>

{@render children?.()}
