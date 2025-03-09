<script lang="ts">
	import { getContext, tick } from "svelte";
	import { Button, Input } from "$ui";
	import { CirclePlus, Hexagon } from "lucide-svelte";
	import IconPicker from "./IconPicker.svelte";
	import icons from "$lib/icons";

	// new habit
	function resetNewHabit() {
		newHabit = {
			name: "",
			icon: "Hexagon",
			color: "#09090b",
		};
	}

	let newHabit = $state({
		name: "",
		icon: "Hexagon",
		color: "#09090b",
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
</script>

<div class="flex flex-col w-full h-full space-y-2">
	<!-- create habit -->
	<form onsubmit={handleSubmit} class="relative flex items-center w-full h-9">
		<IconPicker
			on:update={(e) => (newHabit = handleUpdateIcon(newHabit, e))}
		>
			{#snippet trigger()}
				<div>
					<Button
						variant="ghost"
						size="sm"
						class="h-8 px-2 rounded shadow bg-neutral-100 translate-y-0.5"
					>
						{#if newHabit.icon.trim() === ""}
							<Hexagon size={20} strokeWidth={3} />
						{:else}
							{@const Component = icons[newHabit.icon]}
							<Component size={16} color={newHabit?.color} />
						{/if}
					</Button>
				</div>
			{/snippet}
		</IconPicker>
		<Input
			type="text"
			placeholder={"name : put more than 1 char"}
			bind:value={newHabit.name}
			onkeydown={(e) => {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					handleSubmit(e);
				}
			}}
			class="my-2 ml-2 h-9 w-full scale-y-95 border-0 border-b p-2 pr-9 text-base font-normal focus:shadow"
		/>
		<!-- <Button
			variant="ghost"
			type="submit"
			class="absolute z-10 p-0 rounded-full botom-0 right-1 hover:bg-neutral-100"
			><CirclePlus color="#a1a1aa" /></Button
		> -->
	</form>
</div>
