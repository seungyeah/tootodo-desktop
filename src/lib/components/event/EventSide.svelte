<script lang="ts">
	import { getLocalTimeZone, today, } from '@internationalized/date';
	import { Button, DropdownMenu, Input, Popover, RangeCalendar, } from '$ui';
	import {
		CirclePlus,
		Calendar,
		GripVertical
	} from 'lucide-svelte';
	import { tick } from 'svelte';
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let tableContainer;

	function handleScroll(event) {
		dispatch('scroll', {
			scrollTop: tableContainer.scrollTop,
			scrollLeft: tableContainer.scrollLeft
		});
	}

	export function updateScrollPosition(scrollPosition) {
		if (tableContainer) {
			tableContainer.scrollTop = scrollPosition.scrollTop;
			tableContainer.scrollLeft = scrollPosition.scrollLeft;
		}
	}

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
		if (newEvent.title.length <= 2) {
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
		class="relative flex h-9 w-full translate-y-1.5 items-center border-b-4 pb-4"
	>
		<DropdownMenu.Root closeOnItemClick={false}>
			<DropdownMenu.Trigger class=" h-9 -translate-y-0.5 rounded p-0">
				<Button variant="ghost" size="sm" class="s h-full rounded bg-zinc-100 px-1  shadow"
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
	<div
		class="h-full max-h-[calc(100%-50px)] w-full overflow-y-scroll no-scrollbar max-w-full overflow-x-clip border-2 border-zinc-600"
		bind:this={tableContainer}
		on:scroll={handleScroll}
	>
		<table class="translate-y-0.5">
			<thead class="sticky top-0 z-10 h-[20px] bg-white text-center">
				<tr class="">
					<th scope="col" class="flex min-w-5 translate-y-1 items-center justify-center border-r"
						><GripVertical size={14} /></th
					>
					<th scope="col" class="w-3/5 border-r">Title</th>
					<th scope="col" class="w-2/5">Duration</th>
				</tr>
				<div class="absolute min-w-full border-b-2 border-zinc-500"></div>
			</thead>
			<tbody class="text-center">
				{#each events as event, i}
					<tr class=" relative h-[30px] border text-start" class:dragging={draggedIndex === i}>
						<!-- index -->
						<td
							class="draggable -translate-y-0.5"
							draggable="true"
							on:dragstart={(e) => handleDragStart(e, i)}
							on:dragover={handleDragOver}
							on:drop={(e) => handleDrop(e, i)}
							on:dragend={handleDragEnd}
						>
							{#if draggedIndex === i}
								<GripVertical size={18} />
							{/if}
							<div class="w-full text-center">{i + 1}</div>
						</td>
						<!-- title -->
						<td class="  relative border"
							><input value={event.title} class="h-full w-full bg-transparent p-1" />							
						</td>
						<!-- duration -->
						<Popover.Root
							onOpenChange={() => {
								event.start = cellDuration.start;
								event.end = cellDuration.end;
							}}
						>
							<Popover.Trigger
								><td class="translate-x-1 translate-y-1.5">
									<div class=" flex space-x-1">
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
								<!-- select range -->
								<RangeCalendar
									bind:value={cellDuration}
									weekStartsOn={1}
									class=" w-full rounded-lg border bg-white shadow "
								/>
							</Popover.Content>
						</Popover.Root>
						
				{/each}
			</tbody>
		</table>
	</div>
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
