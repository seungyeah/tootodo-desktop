<script lang="ts">
	import { run } from 'svelte/legacy';

	import { ToggleGroup, Button } from "$ui";
	import { goto } from "$app/navigation";

	import { page } from "$app/stores";
	import { getThis3WeeksRange, parseDateRangeFromURL } from "$lib/utils";
	import { onMount, tick } from "svelte";
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const date_range = parseDateRangeFromURL() || getThis3WeeksRange();

	onMount(() => {
		setQuery(date_range);
	});

	function setQuery(duration) {
		const startDate = duration.start;
		const endDate = duration.end;
		const searchParams = new URLSearchParams({ startDate, endDate });
		goto(`/too/tasks?${searchParams.toString()}`);
	}
	let selectedPage;
	run(() => {
		selectedPage = $page.url.pathname.split("/")[2];
	});
</script>

<div
	class="flex flex-col items-center justify-center w-full h-full sm:absolute sm:top-0"
>
	<div
		class="relative z-10 flex h-10 w-[calc(100%-460px)] justify-start space-x-2"
	>
		<ToggleGroup.Root
			bind:value={selectedPage}
			class="flex h-full w-[240px] items-center rounded-xl bg-white shadow-md "
		>
			<!-- select item -->
			<ToggleGroup.Item
				value="tasks"
				aria-label="task"
				class="w-1/3 p-1 ml-2 h-3/4"
			>
				<Button on:click={() => goto("/too/tasks")}>Task</Button>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="notes"
				aria-label="note"
				class="w-1/3 p-1 h-3/4"
			>
				<Button on:click={() => goto("/too/notes")}>Note</Button>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="habits"
				aria-label="habit"
				class="w-1/3 p-1 mr-2 h-3/4"
			>
				<Button on:click={() => goto("/too/habits")}>Habit</Button>
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	<div class="h-[calc(100%-60px)] w-full">
		{@render children?.()}
	</div>
</div>
