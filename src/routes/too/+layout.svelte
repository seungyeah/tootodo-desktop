<script lang="ts">

	import { ToggleGroup, Button } from "$ui";
	import { goto } from "$app/navigation";

	import { page } from "$app/state";
	import {type DateRange, getThis3WeeksRange, parseDateRangeFromURL} from "$lib/utils";
	import { onMount, tick } from "svelte";
	import {DurationPicker} from "$components/schedule";
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

	let selectedPage = $state(page.url.pathname.split("/")[2]);

	$effect(() => {
		selectedPage = page.url.pathname.split("/")[2];
	});
</script>

<div class="flex flex-col justify-center w-full h-full sm:absolute sm:top-0">
	<div class="w-full  h-10 ">
	</div>
	<div class="h-[calc(100%-70px)]  w-full">
		{@render children?.()}
	</div>
</div>
