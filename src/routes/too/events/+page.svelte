<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import PageTemplete from '../PageTemplete.svelte';
	import { currentTime, formatDay } from '$store';
	import { onMount, tick } from 'svelte';
	import { getContext } from 'svelte';
	import EventMain from '$components/event/EventMain.svelte';
	import EventSide from '$components/event/EventSide.svelte';
	import EventSetting from '$components/event/EventSetting.svelte';
	import { Button, DropdownMenu } from '$ui';
	import { ArrowBigRightDash, DiamondPlus, MessageCircle, Trash2 } from 'lucide-svelte';

	const selectedDate = getContext('selectedDateRange');
	const start = today(getLocalTimeZone());

	let events = [
		{
			title: 'Take a break',
			start: start,
			end: start.add({ days: 2 })
		},
		{
			title: 'Take a nap',
			start: start.add({ days: 4 }),
			end: start.add({ days: 8 })
		}
	];

	let sideComponentWidth = 0;

	// scroll
	let scrollPosition = { scrollTop: 0, scrollLeft: 0 };
	let sideComponent;
	let mainComponent;
	let settingComponent;

	function handleSideScroll(event) {
		scrollPosition = {
			scrollTop: event.detail.scrollTop,
			scrollLeft: event.detail.scrollLeft
		};
		mainComponent.updateScrollPosition(scrollPosition);
		sideComponent.updateScrollPosition(scrollPosition);
		settingComponent.updateScrollPosition(scrollPosition);
	}

	function handleMainScroll(event) {
		scrollPosition = {
			scrollTop: event.detail.scrollTop,
			scrollLeft: event.detail.scrollLeft
		};
		sideComponent.updateScrollPosition(scrollPosition);
		mainComponent.updateScrollPosition(scrollPosition);
		settingComponent.updateScrollPosition(scrollPosition);
	}

	function handleSettingScroll(event) {
		scrollPosition = {
			scrollTop: event.detail.scrollTop,
			scrollLeft: event.detail.scrollLeft
		};
		sideComponent.updateScrollPosition(scrollPosition);
		mainComponent.updateScrollPosition(scrollPosition);
		settingComponent.updateScrollPosition(scrollPosition);
	}

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
	<PageTemplete>
		<div
			slot="side"
			class="flex h-full w-full flex-col px-2 py-2"
			bind:clientWidth={sideComponentWidth}
		>
			<EventSide bind:this={sideComponent} bind:events on:scroll={handleSideScroll} />
		</div>

		<!-- setting -->
		<div
			slot="options"
			class="absolute flex h-full max-h-[calc(100%-130px)]  w-6 flex-col"
			style="transform: translate({sideComponentWidth - 20}px, 35px);"
		>
			<EventSetting bind:this={settingComponent}  {events}  on:scroll={handleSettingScroll} />
		</div>

		<!-- main: gantt chart -->
		<div slot="main" class="h-full w-full">
			<EventMain bind:this={mainComponent}  {events}  bind:scrollPosition on:scroll={handleMainScroll} />
		</div>
	</PageTemplete>
</div>
