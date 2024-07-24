<script lang="ts">
	import {DurationPicker}from "$components/schedule";
	import { type DateRange,getThisWeekRange  } from "$lib/utils";
	import {  writable, type Writable } from "svelte/store";
	import { SvelteComponent, onMount, setContext, tick } from "svelte";
    import { goto } from "$app/navigation";
	
	 export let data;

	// duration select
	const selectedWeekRange: Writable<DateRange> = writable(getThisWeekRange());
	setContext("selectedWeekRange", selectedWeekRange);

	onMount(async () => {
		$selectedWeekRange = getThisWeekRange();
		await setQuery($selectedWeekRange);
	});

	async function setQuery(duration) {
		const start_date = duration.start;
		const end_date = duration.end;
		const searchParams = new URLSearchParams({ start_date, end_date });
		await goto(`?${searchParams.toString()}`);
		await tick();
	}

	async function handleDateUpdate(e) {
		const { selectedWeekRange } = e.detail;
		await setQuery(selectedWeekRange);
		$selectedWeekRange = selectedWeekRange;
	}

	
</script>

<div class="flex flex-col justify-center w-full h-full sm:absolute sm:top-0">
	<!-- header: select date -->
	<div class="flex items-center justify-center w-full h-10 space-x-2 translate-y-1">
		<DurationPicker on:update={handleDateUpdate} />
	</div>

	<div class="h-[calc(100%-60px)] w-full">		
		<slot />
	</div>
</div>

<!-- <script lang="ts">
	import { CalendarIcon } from 'lucide-svelte';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		today,
		CalendarDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button, Calendar, Popover, Separator } from '$ui';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import {DurationPicker}from "$components/schedule";
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined = undefined;
	let selectedDate: CalendarDate = today(getLocalTimeZone());
</script>

<div class="flex flex-col justify-center w-full h-full sm:absolute sm:top-0">
	<div class="flex items-center justify-center w-full h-10 space-x-2 translate-y-1">
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
						'text-md  w-[280px] text-center font-semibold',
						!value && 'text-muted-foreground'
					)}
					builders={[builder]}
				>
					<CalendarIcon class="w-4 h-4 mr-2" />
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

	<div class="h-[calc(100%-60px)] w-full">
		
		<slot />
	</div>
</div> -->
