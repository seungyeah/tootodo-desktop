<script lang="ts">
	import { getLocalTimeZone, today,CalendarDate} from "@internationalized/date";
	import { Button, DropdownMenu, Input, Popover, RangeCalendar } from "$ui";
	import { CirclePlus, Calendar, GripVertical } from "lucide-svelte";
	import { onMount, tick } from "svelte";
	import { getContext } from "svelte";
	import { createEventDispatcher } from "svelte";

	const selectedDate = getContext("selectedDateRange");
	const todayValue = today(getLocalTimeZone());
	let cellDuration = {
		start: today(getLocalTimeZone()),
		end: todayValue.add({ days: 0 }),
	};

	let newEventDuration = {
		start: $selectedDate.start.add({ days: 6 }),
		end: $selectedDate.start.add({ days: 13 }),
	};

	onMount(async () => {
		await tick();
		newEventDuration = {
			start: $selectedDate.start.add({ days: 6 }),
			end: $selectedDate.start.add({ days: 13 }),
		};
	});

	// items
	const events = getContext("events");

	function resetNewEvent() {
		newEvent = {
			title: "",
			start_date: todayValue,
			end_date: todayValue.add({ days: 0 }),
		};
	}

	let newEvent = {
		title: "",
		start_date: todayValue,
		end_date: todayValue.add({ days: 0 }),
	};

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
	) {
		event.preventDefault();

		if (newEvent.title.trim() === "") {
			return;
		}

		await tick();

		handleCreate({
			title: newEvent.title,
			start_date: newEventDuration.start,
			end_date: newEventDuration.end,
		});
		resetNewEvent();
	}

	////// dispatch
	const dispatch = createEventDispatcher();

	// crud
	function handleCreate(event) {
		dispatch("create", { event });
	}

	function handleUpdateDuration(event:Event, duration:{start:CalendarDate,end:CalendarDate}) {
		const updateData = {
			"start_date":duration.start.toString(),
			"end_date":duration.end.toString()
		}
		dispatch("update", { event,updateData });
	}

	function handleUpdateTitle(event:Event,title:String){
		const updateData = {
			"title":title
		};
		dispatch("update", { event,updateData });
	}

	// scroll
	let tableContainer: HTMLElement;

	function handleScroll() {
		dispatch("scroll", {
			scrollTop: tableContainer.scrollTop,
			scrollLeft: tableContainer.scrollLeft,
		});
	}

	export function updateScrollPosition(scrollPosition) {
		if (tableContainer) {
			tableContainer.scrollTop = scrollPosition.scrollTop;
			tableContainer.scrollLeft = scrollPosition.scrollLeft;
		}
	}

	// dnd
	let draggedIndex = null;

	function handleDragStart(e, index) {
		draggedIndex = index;
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", index);
	}

	function handleDragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}

	function handleDrop(e, index) {
		e.preventDefault();
		const draggedOverIndex = index;

		if (draggedIndex !== draggedOverIndex) {
			const reorderedEvents = [...$events];
			const [movedItem] = reorderedEvents.splice(draggedIndex, 1);
			reorderedEvents.splice(draggedOverIndex, 0, movedItem);
			$events = reorderedEvents;
		}

		draggedIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
	}
</script>

<div class="flex flex-col w-full h-full space-y-4">
	<!-- add event -->
	<form
		on:submit|preventDefault={handleSubmit}
		class="relative flex h-9 w-full translate-y-1.5 items-center border-b-4 pb-4"
	>
		<DropdownMenu.Root closeOnItemClick={false}>
			<DropdownMenu.Trigger class=" h-9 -translate-y-0.5 rounded p-0">
				<Button
					variant="ghost"
					size="sm"
					class="h-full px-1 rounded shadow s bg-zinc-100"
					><Calendar size={20} /></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[300px] translate-x-2 border-2 border-double border-zinc-800 "
			>
				<DropdownMenu.Group>
					<DropdownMenu.Label class="w-full text-center ">
						{#if newEventDuration}
							<div>
								<span class="font-extrabold text-zinc-400"
									>Date Range:</span
								>
								{newEventDuration.start ||
									$selectedDate.start ||
									"0000-00-00"}
								<span class="font-extrabold text-zinc-400">~</span>
								{newEventDuration.end || $selectedDate.end || "0000-00-00"}
							</div>
						{/if}
					</DropdownMenu.Label>

					<DropdownMenu.Item class="-translate-y-1">
						<RangeCalendar
							bind:value={newEventDuration}
							weekStartsOn={1}
							class="w-[290px] rounded-lg border bg-white shadow "
						/>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<Input
			type="text"
			placeholder={"title : put more than 1 char"}
			bind:value={newEvent.title}
			on:keydown={(e) => {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					handleSubmit(e);
				}
			}}
			class="my-2 ml-2 h-9 w-full scale-y-95 rounded-r-full p-2 pr-9 text-[0.9rem] font-normal focus:shadow"
		/>
		<Button
			variant="ghost"
			type="submit"
			class="absolute z-10 p-0 rounded-full botom-0 right-1 hover:bg-zinc-100"
			><CirclePlus color="#a1a1aa" /></Button
		>
		<div
			class="absolute bottom-0 left-0 w-full text-xs text-center translate-y-3 font-digital text-zinc-600"
		>
			<span class="text-zinc-950">Assigned In:</span>
			{newEventDuration.start + " ~ " + newEventDuration.end}
		</div>
	</form>

	<!-- event list -->
	{#key $events}
		<div
			class="
			rounded-t-xl rounded-b-lg shadow-md  bg-white border-0 border-zinc-600
			no-scrollbar h-full max-h-[calc(100%-50px)] w-full max-w-full overflow-x-clip overflow-y-scroll  "
			bind:this={tableContainer}
			on:scroll={handleScroll}
		>
			<table class="translate-y-1">
				<thead class="sticky top-0 z-10 h-[20px] bg-white text-center">
					<tr class="">
						<th
							scope="col"
							class="flex items-center justify-center h-full translate-y-1 border-r min-w-5 "
							><GripVertical size={14} /></th
						>
						<th scope="col" class="w-3/5 border-r">Title</th>
						<th scope="col" class="w-2/5">Duration</th>
					</tr>
					<tr class="absolute min-w-full border-b-2 border-zinc-500"></tr>
				</thead>
				<tbody class="text-center">
					{#if $events.length === 0}
						<td class="h-[300px] w-full" colspan="3">No events</td>
					{:else}
						{#each $events as event, i}
							<tr class="text-start" class:dragging={draggedIndex === i}>
								<!-- index -->
								<td
									class="h-[30px] draggable inline-block border-b"
									draggable="true"
									on:dragstart={(e) => handleDragStart(e, i)}
									on:dragover={handleDragOver}
									on:drop={(e) => handleDrop(e, i)}
									on:dragend={handleDragEnd}
								>
									<div class="w-full h-full text-center translate-y-1">
										{#if draggedIndex === i}
											<GripVertical size={18} />
										{/if}{i + 1}
									</div>
								</td>
								<!-- title -->
								<td class="h-[30px] border border-t-0 w-full"
									><input
										value={event.title}
										class="h-full px-1.5 w-full bg-transparent"
										on:blur={(e)=>handleUpdateTitle(event,e.target.value)}
									/>
								</td>
								<!-- duration -->
								<Popover.Root
									onOpenChange={(open) => {
										if (!open) {
											event.start_date =
												cellDuration.start.toString();
											event.end_date = cellDuration.end.toString();
											handleUpdateDuration(event, cellDuration);
										}
									}}
								>
									<Popover.Trigger
										><td
											class="inline-block h-[30px] w-[110px] border-b"
										>
											<div
												class="inline-flex space-x-1 h-[30px] translate-y-1.5"
											>
												{#if event.start_date && event.end_date}
													<div class="">
														{event.start_date.slice(5, 10)}
													</div>
													<div
														class="font-extrabold text-zinc-400"
													>
														~
													</div>
													<div>
														{event.end_date.slice(5, 10)}
													</div>
												{:else}
													00-00 <span
														class="font-extrabold text-zinc-400"
														>~</span
													> 00-00
												{/if}
											</div>
										</td></Popover.Trigger
									>
									<Popover.Content class="w-[300px]">
										<!-- select range -->
										<RangeCalendar
											bind:value={cellDuration}
											weekStartsOn={1}
											class="w-full bg-white border rounded-lg shadow "
										/>
									</Popover.Content>
								</Popover.Root>
							</tr>{/each}{/if}
				</tbody>
			</table>
		</div>
	{/key}
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
