<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Button, DropdownMenu, Input, Popover, RangeCalendar } from '$ui';
	import {
		CirclePlus,
		Calendar,
		Trash,
		Trash2,
		ChefHatIcon,
		DiamondPlus,
		ArrowBigRightDash,
		MessageCircle,
		GripVertical
	} from 'lucide-svelte';
	import { currentTime, formatDay } from '$store';
	import { tick } from 'svelte';
	import { getContext } from 'svelte';
	const selectedDate = getContext('selectedDateRange');
	const start = today(getLocalTimeZone());

	$: cellDuration = {
		start: start,
		end: start.add({ days: 0 })
	};

	$: newDuration = {
		start: start,
		end: start.add({ days: 0 })
	};

	export let events = [];

	function resetNewEvent() {
		newEvent = {
			title: ' ',
			start: start,
			end: start.add({ days: 0 })
		};
	}

	let newEvent = {
		title: ' ',
		start: start,
		end: start.add({ days: 0 })
	};

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		if (newEvent.title.trim() === '') {
			return;
		}
		if (newEvent.title.length <= 1) {
			resetNewEvent();
			return;
		}

		events = [
			{
				title: newEvent.title,
				start: newDuration.start,
				end: newDuration.end
			},
			...events
		];
		await tick();
		resetNewEvent();
	}

	// dnd
	let draggedIndex = null;

	function handleDragStart(event, index) {
		draggedIndex = index;
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', index);
	}

	function handleDragOver(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}

	function handleDrop(event, index) {
		event.preventDefault();
		const draggedOverIndex = index;

		if (draggedIndex !== draggedOverIndex) {
			const reorderedEvents = [...events];
			const [movedItem] = reorderedEvents.splice(draggedIndex, 1);
			reorderedEvents.splice(draggedOverIndex, 0, movedItem);
			events = reorderedEvents;
		}

		draggedIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
	}
</script>

<div class="flex h-full w-full flex-col space-y-4">
	<!-- add event -->
	<form
		on:submit|preventDefault={handleSubmit}
		class="relative flex h-9 w-full translate-y-2 items-center border-b-4 pb-4"
	>
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
								<span class="font-extrabold text-zinc-400">Date Range:</span>
								{newDuration.start || '0000-00-00'}
								<span class="font-extrabold text-zinc-400">~</span>
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
			placeholder={'title : put more than 1 char'}
			bind:value={newEvent.title}
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
		<div class="font-digital absolute bottom-0 left-1.5 translate-y-2.5 text-xs text-zinc-600">
			<span class="text-zinc-950">Assigned Date:</span>
			{newDuration.start + ' ~ ' + newDuration.end}
		</div>
	</form>

	<!-- event list -->
	<table class="w-full translate-y-0.5 border">
		<thead>
			<tr class="h-[20px] text-center">
				<th scope="col" class="min-w-5 flex items-center justify-center translate-y-1"><GripVertical size={14} /></th>
				<th scope="col" class="w-3/5 border">Title</th>
				<th scope="col" class="w-2/5 border">Duration</th>
			</tr>
		</thead>
		<tbody>
			{#each events as event, i}
				<tr class=" relative h-[30px] border text-center" class:dragging={draggedIndex === i}>
					<!-- index -->
					<td
						class="draggable translate-x-1.5 -translate-y-0.5"
						draggable="true"
						on:dragstart={(e) => handleDragStart(e, i)}
						on:dragover={handleDragOver}
						on:drop={(e) => handleDrop(e, i)}
						on:dragend={handleDragEnd}
					>
						{#if draggedIndex === i}
							<GripVertical size={18} />
						{/if}
						{i + 1}
					</td>
					<!-- title -->
					<td class="  border"
						><input value={event.title} class="line-clamp-2 h-full w-full bg-transparent p-1" /></td
					>
					<!-- duration -->
					<Popover.Root
						onOpenChange={() => {
							event.start = cellDuration.start;
							event.end = cellDuration.end;
						}}
					>
						<Popover.Trigger
							><td class="translate-y-1.5 text-center">
								<div class="l flex items-center justify-between">
									{#if event.start && event.end}
										<div>
											{event.start.month.toString().padStart(2, '0') +
												'/' +
												event.start.day.toString().padStart(2, '0')}
										</div>

										<div class="font-extrabold text-zinc-400">~</div>
										<div>
											{event.end.month.toString().padStart(2, '0') +
												'/' +
												event.end.day.toString().padStart(2, '0')}
										</div>
									{:else}
										00-00 <span class="font-extrabold text-zinc-400">~</span> 00-00
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
					<!-- setting -->
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<td class="absolute -right-1.5 top-0 h-[30px] translate-x-2/3">
								<Button variant="ghost" size="sm" class="h-full w-full rounded-full px-1">
									<ArrowBigRightDash color="#3f3f46" strokeWidth={2} size={22} />
								</Button>
							</td>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							class="-translate-y-1.5 border-2 border-double border-zinc-800"
							side="right"
							sideOffset="3"
						>
							<DropdownMenu.Group class=" flex items-center justify-center">
								<DropdownMenu.Item class="">
									<button><DiamondPlus size={20} /></button>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="">
									<button><MessageCircle size={20} /></button>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="">
									<button><Trash2 size={20} /></button>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.draggable {
		display: flex;
		align-items: center;
		cursor: move;
	}

	.dragging {
		opacity: 0.5;
	}

	tr.dragging {
		background-color: #f0f0f0;
	}
</style>
