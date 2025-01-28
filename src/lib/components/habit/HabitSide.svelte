<script lang="ts">
	import { run, preventDefault } from 'svelte/legacy';

	import { getContext, tick } from "svelte";
	import { createEventDispatcher } from "svelte";
	import { Button, Input, } from "$ui";
	import {
		CirclePlus,
		Hexagon,
	} from "lucide-svelte";
	import Tab from "./HabitTab.svelte";
	import IconPicker from "./IconPicker.svelte";
	import icons from "$lib/icons";
	import HabitList from "./HabitList.svelte";
	
	const dispatch = createEventDispatcher();
	// new habit
	function resetNewHabit() {
		newHabit = {
			name: "",
			icon: "Hexagon",
			color: "#09090b",
		};
	}

	let newHabit;
	run(() => {
		newHabit = {
			name: "",
			icon: "Hexagon",
			color: "#09090b",
		};
	});

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

	// udate from child
	function handleUpdateIcon(habit, e) {
		let { key, value } = e.detail;
		let updateData = {};
		if (key === "icon") {
			habit.icon = value;
			updateData.icon = value;
		} else if (key === "color") {
			habit.color = value;
			updateData.color = value;
		} 
		return habit;
	}

	// scroll
	let tableContainer: HTMLElement = $state();

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

<div class="flex flex-col w-full h-full space-y-2">
	<!-- add habit -->
	<form
		onsubmit={preventDefault(handleSubmit)}
		class="relative flex items-center w-full h-9"
	>
		<IconPicker on:update={(e) => (newHabit = handleUpdateIcon(newHabit, e))}>
			{#snippet trigger()}
						<div >
					<Button
						variant="ghost"
						size="sm"
						class="h-8 px-1 rounded shadow bg-zinc-100 translate-y-0.5"
					>
						{#if newHabit.icon.trim() === ""}
							<Hexagon size={20} strokeWidth={3} />
						{:else}
							{@const SvelteComponent = icons[newHabit.icon]}
						<SvelteComponent
								size={16}
								color={newHabit?.color}
							/>
						{/if}
					</Button>
				</div>
					{/snippet}
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
			class="my-2 ml-2 h-9 w-full scale-y-95 rounded-r-full p-2 pr-9 text-[0.9rem] font-normal focus:shadow"
		/>
		<Button
			variant="ghost"
			type="submit"
			class="absolute z-10 p-0 rounded-full botom-0 right-1 hover:bg-zinc-100"
			><CirclePlus color="#a1a1aa" /></Button
		>
	</form>

	<Tab class="w-full h-full">
		<!-- @migration-task: migrate this slot by hand, `tab-1` is an invalid identifier -->
	<div slot="tab-1" bind:this={tableContainer} onscroll={handleScroll}>
			<HabitList></HabitList>
		</div>

		<!-- @migration-task: migrate this slot by hand, `tab-2` is an invalid identifier -->
	<div slot="tab-2" bind:this={tableContainer} onscroll={handleScroll}>
			<HabitList></HabitList>
		</div>
	</Tab>
</div>
