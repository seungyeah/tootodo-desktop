<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today,parseDate } from '@internationalized/date';
	import { getContext } from 'svelte';

	const events = getContext('events');

	const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	const selectedDate = getContext('selectedDateRange');

	$: months = {
		value: today(getLocalTimeZone()),
		dates: getDatesInRange($selectedDate.start, $selectedDate.end),
		duration: getDuration($selectedDate.start, $selectedDate.end)
	};

	$: monthCounts = countMonths(months.dates);

	function countMonths(dates: CalendarDate[]): { month: number; count: number }[] {
		if (!dates) return [];
		let monthCounts = [{ month: 0, count: 0 }];

		dates.forEach((date) => {
			const month = date.toDate().getMonth() + 1; // 월을 1부터 시작하도록 변경
			let monthEntry = monthCounts.find((entry) => entry.month === month);

			if (monthEntry) {
				monthEntry.count++;
			} else {
				monthCounts.push({ month, count: 1 });
			}
		});

		// 기본 초기화 객체를 제거
		return monthCounts.filter((entry) => entry.month !== 0);
	}

	function getDuration(start: CalendarDate, end: CalendarDate): number {
		if (!start || !end) return 0; // 두 날짜 간의 차이를 밀리초 단위로 계산
		const timeDifference = end.toDate() - start.toDate();

		// 밀리초를 일 단위로 변환
		const msInADay = 86_400_000;
		const diff = Math.floor(timeDifference / msInADay);
		return diff;
	}

	// 범위 내의 모든 날짜를 배열로 반환하는 함수
	function getDatesInRange(start: CalendarDate, end: CalendarDate) {
		if (!start || !end) return [];
		let dates = [];
		let currentDate = start;

		while (currentDate.compare(end) <= 0) {
			dates.push(currentDate);
			currentDate = currentDate.add({ days: 1 });
		}

		return dates;
	}

	// scroll
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let tableContainer;

	function handleScroll(event) {
		dispatch('scroll', {
			scrollTop: tableContainer.scrollTop,
			scrollLeft: tableContainer.scrollLeft
		});
	}

	export let scrollPosition = { scrollTop: 0, scrollLeft: 0 };

	export function updateScrollPosition(scrollPosition) {
		if (tableContainer) {
			tableContainer.scrollTop = scrollPosition.scrollTop;
			tableContainer.scrollLeft = scrollPosition.scrollLeft;
		}
	}

	$: {
		if (tableContainer) {
			tableContainer.scrollTop = scrollPosition.scrollTop;
			tableContainer.scrollLeft = scrollPosition.scrollLeft;
		}
	}
</script>

<div
	class="h-full max-h-full w-full translate-y-1 overflow-y-scroll border-2 border-zinc-800"
	bind:this={tableContainer}
	on:scroll={handleScroll}
>
	<table class="relative w-full border-separate border-spacing-0 ">
		<thead class="sticky top-0 z-10 bg-white text-center shadow-lg">
			<tr class="text-center text-[1rem] h-7">
				{#each monthCounts as monthCount}
					<td class="border-r  border-b-2 border-zinc-600" colspan={monthCount.count}>{monthCount.month}</td>
				{/each}
			</tr>

			<tr class="text-center">
				{#each months.dates as date}
					{@const day = date.toDate().getDay()}
					<td class="border-r border-b-4 border-zinc-600 py-0 text-xs text-zinc-600">
						<div
							class={day === 0
								? ' border-r border-zinc-900  bg-red-100'
								: day === 6
									? 'bg-blue-100'
									: ''}
						>
							<div class="py-0 text-xs">{days[day]}</div>
							<div class="-translate-y-0.5 border-[0.5px] border-dotted border-zinc-700"></div>
							<div>{date.toString().split('-')[2]}</div>
						</div>
					</td>
				{/each}
			</tr>
			<div class="min-w-full h-1"></div>

		</thead>

		<tbody class="relative border text-center">
			{#key $events}
				{#each $events as event, i}
					{@const event_start = getDuration($selectedDate.start, parseDate(event.start_date))}
					{@const event_duration = getDuration(parseDate(event.start_date), parseDate(event.end_date))}
					{@const event_end = getDuration( parseDate(event.end_date), $selectedDate.end)}
					{@const start_to_event_start = getDuration($selectedDate.end,parseDate(event.start_date))}
					{@const end_to_event_start = getDuration( parseDate(event.end_date), $selectedDate.start)}

					{#if start_to_event_start > 0 || end_to_event_start > 0}<div></div>{:else}
						<tr class="h-[30px] border-b ">
							{#if event_start == 0 && event_end == 0}
								<td
									colspan={event_duration + event_start + 1}
									class="event"
									data-percent={event_duration + event_start + 1}>
									<span class="text-zinc-700"><span class="opacity-80 text-xs">#</span>{i + 1}
									</td
								>
							{:else if event_start <= 0}
								<td
									colspan={event_duration + event_start + 1}
									class="event "
									data-percent={event_duration + event_start + 1}><span class="opacity-80 text-xs">#</span>{i + 1}</td
								>
								<td colspan={event_end} class="border-b"></td>
							{:else if event_end <= 0}
								<td colspan={event_start} class="border-b"></td>
								<td
									colspan={event_duration + event_end + 1}
									class="event"
									data-percent={event_duration + event_end + 1}><span class="opacity-80 text-xs">#</span>{i + 1}</td
								>
							{:else}
								<td colspan={event_start} class="border-b"></td>
								<td colspan={event_duration + 1} class="event" data-percent={event_duration + 1}
									><span class="opacity-80 text-xs">#</span>{i + 1}</td
								>
								<td colspan={event_end} class="border-b"></td>
							{/if}
						</tr>
					{/if}
				{/each}
			{/key}
		</tbody>
	</table>
</div>

<style>
	td {
		width: 30px;
	}
	.event {
		position: relative;
		background-color: #3f3f46;
		color: white;
		height: 20px;
		margin: 2px 0;
		text-wrap: nowrap;
		border-bottom: #c1c1c1 1px solid;
	}
	.event::after {
		content: attr(data-percent) ' %';
		font-size: 10px;
		position: absolute;
		right: 2px;
		top: -3px;
		color: white;
		opacity:70%;
	}
</style>
