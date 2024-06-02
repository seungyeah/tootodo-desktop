<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import PageTemplete from '../PageTemplete.svelte';
	import { currentTime, formatDay } from '$store';
	import { tick } from 'svelte';
	import { getContext } from 'svelte';
	import EventMain from '$components/event/EventMain.svelte';
	import EventSide from '$components/event/EventSide.svelte';

	const selectedDate = getContext('selectedDateRange');
	const start = today(getLocalTimeZone());

	let events = [
		{
			title: 'Take a break',
			start: start,
			end: start.add({ days: 4 })
		},
		{
			title: 'Take a nap',
			start: start.add({ days: 4 }),
			end: start.add({ days: 8 })
		},
	];

</script>

<PageTemplete>
	<div slot="side" class="flex h-full w-full flex-col px-2 py-2">
		<EventSide bind:events/>
	</div>

	<!-- main: gantt chart -->
	<div slot="main" class="h-full w-full">
		<EventMain {events} />
	</div>
</PageTemplete>
