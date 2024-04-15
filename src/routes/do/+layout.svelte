<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		today,
		CalendarDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined = undefined;
	let selectedDate: CalendarDate = today(getLocalTimeZone());
</script>

<div class="h-12 w-full flex-col flex justify-center absolute top-0">
	<!-- header: select date -->
	<div class="flex h-10 w-full items-center justify-center space-x-2 scale-105 translate-y-1">
		<Button
			class="h-8 w-8 !p-1"
			variant="ghost"
			on:click={() => (selectedDate = selectedDate.subtract({ days: 1 }))}
		>
			<ChevronLeft size={20} />
		</Button>
		<Popover.Root openFocus>
			<Popover.Trigger asChild let:builder>
				<Button
					variant="outline"
					class={cn(
						'w-[280px]  text-center font-semibold text-md',
						!value && 'text-muted-foreground'
					)}
					builders={[builder]}
				>
					<CalendarIcon class="mr-2 h-4 w-4" />
					{value
						? df.format(value.toDate(getLocalTimeZone()))
						: df.format(selectedDate.toDate(getLocalTimeZone()))}
				</Button>
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0 my-2 shadow shadow-pink">
				<Calendar bind:value initialFocus />
			</Popover.Content>
		</Popover.Root>

		<Button
			class="h-8 w-8 !p-1"
			variant="ghost"
			on:click={() => (selectedDate = selectedDate.add({ days: 1 }))}
		>
			<ChevronRight size={20} />
		</Button>
	</div>

	<div class="h-[calc(100%-60px)]">
		<slot />
	</div>
</div>
