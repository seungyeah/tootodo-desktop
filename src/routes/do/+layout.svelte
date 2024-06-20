<script lang="ts">
	import { CalendarIcon } from 'lucide-svelte';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		today,
		CalendarDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button, Calendar, Popover } from '$ui';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined = undefined;
	let selectedDate: CalendarDate = today(getLocalTimeZone());
</script>

<div class="flex h-full w-full flex-col justify-center sm:absolute sm:top-0">
	<!-- header: select date -->
	<div class="flex h-10 w-full translate-y-1 items-center justify-center space-x-2">
		<!-- day-- -->
		<Button
			class="h-8 w-8 !p-1"
			variant="ghost"
			on:click={() => (selectedDate = selectedDate.subtract({ days: 1 }))}
		>
			<ChevronLeft size={20} />
		</Button>

		<!-- date picker -->
		<Popover.Root openFocus>
			<Popover.Trigger asChild let:builder>
				<Button
					variant="outline"
					class={cn(
						'text-md  w-[280px] text-center font-semibold',
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
			<Popover.Content class="shadow-pink my-2 w-auto p-0 shadow">
				<Calendar bind:value initialFocus />
			</Popover.Content>
		</Popover.Root>

		<!-- day++ -->
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
