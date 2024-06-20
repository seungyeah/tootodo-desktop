<script lang="ts">
	import { getContext, tick } from "svelte";
	import { createEventDispatcher } from "svelte";
	import { Button, DropdownMenu, Input, Popover, RangeCalendar } from "$ui";
	import {
		CirclePlus,
		Calendar,
		GripVertical,
		Sticker,
		Hexagon,
	} from "lucide-svelte";
	import { type Habit } from "$lib/schema";
	import IconPicker from "./IconPicker.svelte";
	import icons from "$lib/icons";

	const dispatch = createEventDispatcher();
	const selectedMonth = getContext("selectedMonthRange");
	const habits = getContext("habits");
	// new habit
	function resetNewHabit() {
		newHabit = {
			name: "",
			icon: "Hexagon",
			color: "#09090b",
		};
	}

	$:newHabit = {
		name: "",
		icon: "Hexagon",
		color: "#09090b",
	};

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
	) {
		event.preventDefault();
		if (newHabit.name.trim() === "") {
			return;
		}

		await tick();

		handleCreate({
			name: newHabit.name,
			icon: newHabit.icon,
			color: newHabit.color,
		});
		resetNewHabit();
	}

	// crud
	function handleCreate(habit) {
		dispatch("create", { habit });
	}

	function handleUpdateStatus(habit: Habit) {
		const updateData = {};
		dispatch("update", { habit, updateData });
	}

	function handleUpdateName(habit: Habit, name: String) {
		const updateData = {
			name: name,
		};
		dispatch("update", { habit, updateData });
	}

	// udate from child
	function updateIcon(habit, e) {
		let {key,value} = e.detail
		let updateData = {}
		if(key === "icon"){
			habit.icon =value
			updateData.icon = value
		}else if(key === "color"){
			habit.color =value	
			updateData.color = value
		}
		dispatch("update", { habit, updateData });
		return habit
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
			const reorderedhabits = [...$habits];
			const [movedItem] = reorderedhabits.splice(draggedIndex, 1);
			reorderedhabits.splice(draggedOverIndex, 0, movedItem);
			$habits = reorderedhabits;
		}

		draggedIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
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
</script>

<div class="flex flex-col w-full h-full space-y-4">
	<!-- add habit -->
	<form
		on:submit|preventDefault={handleSubmit}
		class="relative flex h-9 w-full translate-y-1.5 items-center border-b-4 pb-4"
	>
		<IconPicker on:update={(e)=> newHabit = updateIcon(newHabit,e)}>
			<div slot="trigger">
				<Button
					variant="ghost"
					size="sm"
					class="h-8 px-1 rounded shadow bg-zinc-100 translate-y-0.5"
				>
					{#if newHabit.icon.trim() === ""}
						<Hexagon size={20} strokeWidth={3} />
					{:else}
						<svelte:component
							this={icons[newHabit.icon]}
							size={16}
							color={newHabit?.color}
						/>
					{/if}
				</Button>
			</div>
		</IconPicker>
		<Input
			type="text"
			placeholder={"name : put more than 1 char"}
			bind:value={newHabit.name}
			on:keydown={(e) => {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					handleSubmit(e);
				}
			}}
			class="my-2 ml-2 h-9 w-full scale-y-95 rounded-r-full p-2 pr-9 text-[1rem] font-normal focus:shadow"
		/>
		<Button
			variant="ghost"
			type="submit"
			class="absolute z-10 p-0 rounded-full botom-0 right-1 hover:bg-zinc-100"
			><CirclePlus color="#a1a1aa" /></Button
		>
		<div
			class="absolute bottom-0 left-0 w-full text-xs text-center translate-y-2.5 font-digital text-zinc-600"
		>
			<span class="text-zinc-950">In Progress</span>
		</div>
	</form>

	<!-- habit list -->
	{#key $habits}
		<div
			class="no-scrollbar h-full max-h-[calc(100%-50px)] w-full max-w-full overflow-x-clip overflow-y-scroll border-2 border-zinc-600"
			bind:this={tableContainer}
			on:scroll={handleScroll}
		>
			<table class="translate-y-0.5">
				<thead class="sticky top-0 z-10 h-[20px] bg-white text-center">
					<tr class="">
						<th
							scope="col"
							class="flex items-center justify-center translate-y-1 border-r min-w-5"
							><GripVertical size={14} /></th
						>
						<th scope="col" class="w-3/5 border-r">Name</th>
						<th scope="col" class="w-2/5">Icon</th>
					</tr>
					<tr class="absolute min-w-full border-b-2 border-zinc-500"></tr>
				</thead>
				<tbody class="text-center">
					{#if $habits.length === 0}
						<td class="h-[300px] w-full" colspan="3">No habits</td>
					{:else}
						{#each $habits as habit, i}
							{#if habit.status === "InProgress"}
							<tr class="text-start" class:dragging={draggedIndex === i}>
								<!-- index -->
								<td
									class="h-[30px] w-full draggable inline-block border-b"
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
								<!-- name -->
								<td class="h-[30px] border border-t-0 w-full "
									><input
										value={habit.name}
										class="h-full px-1.5 w-full bg-transparent"
										on:blur={(e) =>
											handleUpdateName(habit, e.target.value)}
									/>
								</td>
								<!-- icon -->
								<td class="h-[30px] border border-t-0 w-full inline-block ">
								<IconPicker on:update={(e)=> habit = updateIcon(habit,e)}>
									<div slot="trigger" class="h-[30px]">
										<Button
											variant="ghost"
											class="p-1.5 h-[24px] bg-white"
										>
											<svelte:component
												this={icons[habit.icon]}
												size={16}
												color={habit.color}
											/>
										</Button>
									</div>
								</IconPicker>
							</td>
								
							</tr>{/if}{/each}{/if}
				</tbody>
			</table>
		</div>
	{/key}
</div>
