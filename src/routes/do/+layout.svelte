<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { type DateValue, DateFormatter, getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
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

<div class="w-full flex justify-center space-x-2 items-center">
	<Button class="h-8 w-8 !p-1" variant="ghost" on:click={()=>selectedDate = selectedDate.subtract({days:1})}>
		<ChevronLeft size={20}  />
	</Button>
	<Popover.Root openFocus>
		<Popover.Trigger asChild let:builder>
			<Button
				variant="outline"
				class={cn(
					'w-[280px] justify-start text-left font-normal',
					!value && 'text-muted-foreground'
				)}
				builders={[builder]}
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				{value ? df.format(value.toDate(getLocalTimeZone())) : df.format(selectedDate.toDate(getLocalTimeZone()))}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar bind:value initialFocus />
		</Popover.Content>
	</Popover.Root>

	<Button class="h-8 w-8 !p-1" variant="ghost" on:click={()=>selectedDate = selectedDate.add({days:1})}>
		<ChevronRight size={20}  />
	</Button>
</div>

<slot />
