<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import { getContext } from 'svelte';

	export let events = [
		{
			title: 'Take a break',
			start: start,
			end: start.add({ days: 4 })
		}
	];
	const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	const selectedDate = getContext('selectedDateRange');
	const start = today(getLocalTimeZone());

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
</script>

<div class="h-full w-full">
	<table class="w-full border-2 border-zinc-800  table-fixed">
		<thead><tr></tr> </thead>
		<tbody class="text-center">
			<tr class="text-center">
				{#each monthCounts as monthCount}
					<td class="border-b-2 border-r-2 border-zinc-700" colspan={monthCount.count}
						>{monthCount.month}</td
					>
				{/each}
			</tr>
			<tr>
				{#each months.dates as date}
					{@const day = date.toDate().getDay()}
					<td
						class={day === 0
							? 'border-r-2 border-zinc-800 bg-red-100'
							: day === 6
								? 'bg-blue-100'
								: ''}>{days[day]}</td
					>
				{/each}
			</tr>
			<tr>
				{#each months.dates as date}
					<td class="border border-b-2 border-zinc-600 text-zinc-600">
						<div>
							{date.toString().split('-')[2]}
						</div>
					</td>
				{/each}
			</tr>

			{#key events}
				{#each events as event}
					{@const event_start = getDuration($selectedDate.start, event.start)}
					{@const event_duration = getDuration(event.start, event.end)}
					{@const event_end = getDuration(event.end, $selectedDate.end)}
					{#if getDuration($selectedDate.end, event.start)>0 || getDuration(event.end, $selectedDate.start)>0}
					{:else if event_start <= 0}
						<tr class="h-[28px] border-b">
							<td
								colspan={event_duration + event_start + 1}
								class="event"
								data-percent={event_duration + event_start + 1}
							>
							</td>
							<td colspan={event_end}></td>
						</tr>
					{:else if event_end <= 0}
						<tr class="h-[28px] border-b">
							<td colspan={event_start}></td>
							<td
								colspan={event_duration + event_end + 1}
								class="event"
								data-percent={event_duration + event_end + 1}
							>
							</td>
						</tr>
					{:else}
						<tr class="h-[28px] border-b ">
							<td colspan={event_start}></td>
							<td colspan={event_duration + 1} class="event  " data-percent={event_duration + 1}>
							</td>
							<td colspan={event_end}></td>
						</tr>
					{/if}
				{/each}
			{/key}
		</tbody>
	</table>
</div>

<style>
	.event {
		position: relative;
		background-color: #3b83f6;
		color: black;
		height: 20px;
		margin: 2px 0;
		text-wrap: nowrap;
	}
	.event::after {
		content: attr(data-percent) 'days';
		position: absolute;
		right: -0px;
		top: 0;
		color: white;
	}
</style>
