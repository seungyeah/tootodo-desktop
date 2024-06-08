<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import PageTemplete from '../PageTemplete.svelte';
	import {onMount, setContext, tick } from 'svelte';
	import EventMain from '$components/event/EventMain.svelte';
	import EventSide from '$components/event/EventSide.svelte';
	import EventSetting from '$components/event/EventSetting.svelte';
	import DurationPicker from '$components/event/DurationPicker.svelte';
	import { goto } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import { getMonday } from '$lib/utils';
	import { postApi, delApi, putApi } from '$lib/api';
	import {eventSchema} from '$lib/schema';
	import { z } from 'zod';

	// data
	export let data;
	type Event = z.infer<typeof eventSchema>;
	let events: Writable<Event[]> = writable(data?.events||[]);
	
	// duration select
	let todayValue = today(getLocalTimeZone());
	let selectedMonday = getMonday(todayValue.toDate());
	const selectedDateRange = writable({
		start: today(getLocalTimeZone()),
		end: today(getLocalTimeZone())
	});
	setContext('selectedDateRange', selectedDateRange);
	setContext('events', events);

	onMount(async () => {
		todayValue = today(getLocalTimeZone());
		selectedMonday = getMonday(todayValue.toDate());
		$selectedDateRange = {
			start: selectedMonday.subtract({days: 7}),
			end: selectedMonday.add({ days: 13 })
		};
		await setQuery($selectedDateRange);
	});

	async function setQuery(duration) {
		const start_date = duration.start;
		const end_date = duration.end;
		const searchParams = new URLSearchParams({ start_date, end_date });
		$events = await data?.events;
		tick();
		await goto(`?${searchParams.toString()}`);
	}

	async function handleDateUpdate(event) {
		const { selectedDateRange } = event.detail;
		await setQuery(selectedDateRange);
		$selectedDateRange = selectedDateRange;
	}

	async function handleCreateEvent(e) {
		const { title, start_date, end_date } = e.detail.event;
		const formattedEvent = {
			title: title,
			start_date: start_date ? new Date(start_date).toISOString().split('T')[0] : null,
			end_date: end_date ? new Date(end_date).toISOString().split('T')[0] : null
		};
		try {
			const response = await postApi({ path: '/events/', data: formattedEvent });
			const newEvent = response.data.event;
			$events = [newEvent,...$events] 
			tick();
		} catch (error) {
			console.error('Request failed:', error);
		}
	}

	async function handleDeleteEvent(e) {
		const { id } = e.detail.event;
		try {
			await delApi({ path: `/events/${id}` });
		} catch (error) {
			console.error('Request failed:', error);
		}
		$events = $events.filter((event) => event.id !== id);
		tick();
	}

	async function handleUpdateEvent(e){
		const { event } = e.detail.event;
		try {
			await putApi({ path: `/events/${event.id}`,data:event });
		} catch (error) {
			console.error('Request failed:', error);
		}
		$events = $events.filter((event) => event.id !== id);
		tick();
	}

	// scroll
	let scrollPosition = { scrollTop: 0, scrollLeft: 0 };
	let sideComponent;
	let mainComponent;
	let settingComponent;

	function handleScroll(event) {
		scrollPosition = {
			scrollTop: event.detail.scrollTop,
			scrollLeft: event.detail.scrollLeft
		};
		mainComponent.updateScrollPosition(scrollPosition);
		sideComponent.updateScrollPosition(scrollPosition);
		settingComponent.updateScrollPosition(scrollPosition);
	}

	// get setting component's x position
	let sideComponentWidth = 0;
	onMount(() => {
		if (sideComponent) {
			sideComponentWidth = sideComponent.clientWidth;
			tick().then(() => {
				sideComponentWidth = sideComponent.clientWidth;
			});
		}
	});
</script>

<div class="relative h-full w-full">
	<div class="fixed top-5 z-10 w-[calc(100%-190px)] translate-x-1/2">
		<DurationPicker on:update={handleDateUpdate} />
	</div>

	<PageTemplete>
		<div
			slot="side"
			class="flex h-full w-full flex-col px-2 py-2"
			bind:clientWidth={sideComponentWidth}
		>
			<EventSide bind:this={sideComponent} on:scroll={handleScroll} on:create={handleCreateEvent} />
		</div>

		<!-- setting -->
		<div
			slot="options"
			class="absolute flex h-full max-h-[calc(100%-130px)] w-6 flex-col"
			style="transform: translate({sideComponentWidth - 22}px, 35px);"
		>
			<EventSetting
				bind:this={settingComponent}
				on:scroll={handleScroll}
				on:delete={handleDeleteEvent}
			/>
		</div>

		<!-- main: gantt chart -->
		<div slot="main" class="h-full w-full">
			<EventMain bind:this={mainComponent} bind:scrollPosition on:scroll={handleScroll} />
		</div>
	</PageTemplete>
</div>
