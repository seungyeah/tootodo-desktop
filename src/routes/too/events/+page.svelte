<script lang="ts">
	import PageTemplete from "../PageTemplete.svelte";
	import { SvelteComponent, onMount, setContext, tick } from "svelte";
	import EventMain from "$components/event/EventMain.svelte";
	import EventSide from "$components/event/EventSide.svelte";
	import EventSetting from "$components/event/EventSetting.svelte";
	import DurationPicker from "$components/event/DurationPicker.svelte";
	import { goto} from "$app/navigation";
	import { writable, type Writable } from "svelte/store";
	import { postApi, delApi, patchApi } from "$lib/api";
	import {type Event } from "$lib/schema";
	import { type DateRange ,getThis3WeeksRange} from "$lib/utils";
	// data
	export let data;
	let events: Writable<Event[]> = writable(data?.events || []);
	
	// duration select
	const selectedDateRange:Writable<DateRange> = writable(getThis3WeeksRange());
	setContext("selectedDateRange", selectedDateRange);
	setContext("events", events);

	onMount(async () => {
		$selectedDateRange =getThis3WeeksRange();
		await setQuery($selectedDateRange);
	});

	async function setQuery(duration) {
		const start_date = duration.start;
		const end_date = duration.end;
		const searchParams = new URLSearchParams({ start_date, end_date });
		await goto(`?${searchParams.toString()}`);
		$events = await data?.events;
		await tick();
	}

	async function handleDateUpdate(e) {
		const { selectedDateRange } = e.detail;
		await setQuery(selectedDateRange);
		$selectedDateRange = selectedDateRange;
	}

	async function handleCreateEvent(e) {
		const { title, start_date, end_date } = e.detail.event;
		const formattedEvent = {
			title,
			start_date: start_date
				? new Date(start_date).toISOString().split("T")[0]
				: null,
			end_date: end_date
				? new Date(end_date).toISOString().split("T")[0]
				: null,
		};
		try {
			const res = await postApi({
				path: "/events/",
				data: formattedEvent,
			});
			const newEvent = res.data.event;
			$events = [newEvent, ...$events];
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	async function handleDeleteEvent(e) {
		const { id } = e.detail.event;
		try {
			await delApi({ path: `/events/${id}` });
			$events = $events.filter((event) => event.id !== id);
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}		
	}

	async function handleUpdateEvent(e) {
		const {id} = e.detail.event;
		
		try {
			const res = await patchApi({ path: `/events/${id}`, data:e.detail.updateData });
			const updatedEvent = res.data.event;
			
			$events = $events.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
			);
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	// scroll
	let scrollPosition = { scrollTop: 0, scrollLeft: 0 };
	let sideComponent: SvelteComponent;
	let mainComponent: SvelteComponent;
	let settingComponent: SvelteComponent;

	function handleScroll(e) {
		scrollPosition = {
			scrollTop: e.detail.scrollTop,
			scrollLeft: e.detail.scrollLeft,
		};
		mainComponent.updateScrollPosition(scrollPosition);
		sideComponent.updateScrollPosition(scrollPosition);
		settingComponent.updateScrollPosition(scrollPosition);
	}

	// get setting component's x position
	let sideComponentWidth = 0;
	onMount(async () => {
		if (sideComponent) {
			sideComponentWidth = sideComponent.clientWidth;
			await tick().then(() => {
				sideComponentWidth = sideComponent.clientWidth;
			});
		}
	});
</script>

<div class="relative w-full h-full">
	<PageTemplete>
		<div slot="nav" class="">
			<DurationPicker on:update={handleDateUpdate} />
		</div>

		<div
			slot="side"
			class="flex flex-col w-full h-full px-2 py-2"
			bind:clientWidth={sideComponentWidth}
		>
			<EventSide
				bind:this={sideComponent}
				on:scroll={handleScroll}
				on:create={handleCreateEvent}
				on:update={handleUpdateEvent}
			/>
		</div>

		<!-- setting -->
		<div
			slot="options"
			class="absolute flex h-full max-h-[calc(100%-130px)] w-6 flex-col"
			style="transform: translate({sideComponentWidth - 22}px, 34px);"
		>
			<EventSetting
				bind:this={settingComponent}
				on:scroll={handleScroll}
				on:delete={handleDeleteEvent}
				on:update={handleUpdateEvent}
			/>
		</div>

		<!-- main: gantt chart -->
		<div slot="main" class="w-full h-full">
			<EventMain
				bind:this={mainComponent}
				bind:scrollPosition
				on:scroll={handleScroll}
			/>
		</div>
	</PageTemplete>
</div>
