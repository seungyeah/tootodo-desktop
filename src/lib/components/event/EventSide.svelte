<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Button, DropdownMenu, Input, Popover, RangeCalendar } from '$ui';
	import { CirclePlus, Calendar } from 'lucide-svelte';
	import { currentTime, formatDay } from '$store';
	import { tick } from 'svelte';
	import { getContext } from 'svelte';
	const selectedDate = getContext('selectedDateRange');
	const start = today(getLocalTimeZone());

	$: newDuration = {
		start: start,
		end: start.add({ days: 7 })
	};

	$: cellDuration = {
		start: start,
		end: start.add({ days: 7 })
	};

	export let events = [
		{
			title: 'Take a break',
			start: start,
			end: start.add({ days: 4 })
		}
	];

	function resetNewMemo() {
		newMemo = {
			pin: true,
			title: '',
			date: '',
			color: newMemo.color,
			content: ''
		};
	}

	let newMemo = {
		pin: true,
		title: '',
		date: '',
		color: 'default',
		content: ''
	};

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		if (newMemo.title.trim() === '') {
			return;
		}
		if (newMemo.title.length <= 1) {
			resetNewMemo();
			return;
		}

		memos = [
			{
				pin: newMemo.pin,
				title: newMemo.title,
				date: formatDay($currentTime),
				color: newMemo.color,
				content: ''
			},
			...memos
		];
		await tick();
		resetNewMemo();
	}
</script>

<div class="flex h-full w-full flex-col space-y-4">
	<!-- add event -->
	<form on:submit|preventDefault={handleSubmit} class="relative flex h-9 w-full items-center border-b-4 pb-4 translate-y-2">
		<DropdownMenu.Root closeOnItemClick={false}>
			<DropdownMenu.Trigger class=" h-9 -translate-y-0.5 rounded p-0">
				<Button variant="ghost" size="sm" class="s h-full rounded px-1 shadow  "
					><Calendar size={20} /></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-[300px] translate-x-2 border-2 border-double border-zinc-800 ">
				<DropdownMenu.Group>
					<DropdownMenu.Label class="w-full text-center ">
						{#if newDuration}
							<div>
								<span class="font-extrabold text-violet-500">Date Range:</span>
								{newDuration.start || '0000-00-00'}
								<span class="font-extrabold text-violet-500">~</span>
								{newDuration.end || '0000-00-00'}
							</div>
						{/if}
					</DropdownMenu.Label>

					<DropdownMenu.Item class="-translate-y-1">
						<RangeCalendar
							bind:value={newDuration}
							weekStartsOn={1}
							class="w-[290px] rounded-lg border bg-white shadow "
						/>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<Input
			type="text"
			placeholder="title : put more than 1 char"
			bind:value={newMemo.title}
			on:keydown={(e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault();
					handleSubmit(e);
				}
			}}
			class="my-2 ml-2 h-9 w-full scale-y-95 rounded-r-full p-2 pr-9 text-[1rem] font-normal focus:shadow"
		/>
		<Button
			variant="ghost"
			type="submit"
			class="botom-0 absolute right-1 z-10 rounded-full p-0 hover:bg-zinc-100"
			><CirclePlus color="#a1a1aa" /></Button
		>
	</form>

	<!-- event list -->
	<table class="w-full border">
		<thead>
			<tr class="">
				<th scope="col" class="border">#</th>
				<th scope="col" class="w-3/5 border">Title</th>
				<th scope="col" class="w-2/5 border">Duration</th>
			</tr>
		</thead>
		<tbody>
			{#each events as event, i}
				<tr class="h-[30px] border">
					<td class="border">{i + 1}</td>
					<td class="  border"
						><input value={event.title} class="line-clamp-2 h-full w-full bg-transparent p-1" /></td
					>
					<Popover.Root
						onOpenChange={() => {
							event.start = cellDuration.start;
							event.end = cellDuration.end;
						}}
					>
						<Popover.Trigger
							><td class="translate-x-1 translate-y-1.5 text-center">
								<div>
									{#if event.start && event.end}
										{event.start.month.toString().padStart(2, '0') +
											'-' +
											event.start.day.toString().padStart(2, '0')}
										<span class="font-extrabold text-violet-500">~</span>
										{event.end.month.toString().padStart(2, '0') +
											'-' +
											event.end.day.toString().padStart(2, '0')}
									{:else}
										00-00 <span class="font-extrabold text-violet-500">~</span> 00-00
									{/if}
								</div>
							</td></Popover.Trigger
						>
						<Popover.Content class="w-[300px]">
							<RangeCalendar
								bind:value={cellDuration}
								weekStartsOn={1}
								class=" w-full rounded-lg border bg-white shadow "
							/>
						</Popover.Content>
					</Popover.Root>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
