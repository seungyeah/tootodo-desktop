<script lang="ts">
	import { DurationPicker } from "$components/schedule";
	import {
		type DateRange,
		getThisWeekRange,
		parseDateRangeFromURL,
	} from "$lib/utils";
	import { writable, type Writable } from "svelte/store";
	import { onMount, setContext } from "svelte";
	import { goto } from "$app/navigation";
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let weekRange = writable<DateRange>(getThisWeekRange());
	setContext("weekRange", weekRange);

	onMount(() => {
		$weekRange = parseDateRangeFromURL() || getThisWeekRange();
		setQuery(weekRange);
	});

	function setQuery(duration) {
		$weekRange = duration;
		const startDate = $weekRange.start;
		const endDate = $weekRange.end;
		const searchParams = new URLSearchParams({ startDate, endDate });
		goto(`?${searchParams.toString()}`);
	}

</script>

<div class="flex flex-col justify-center w-full h-full sm:absolute sm:top-0">
	<!-- header: select date -->
	<div class="w-full h-10 translate-y-1">
		<DurationPicker update={(weekRange:DateRange) => setQuery(weekRange)} />
	</div>

	<div class="h-[calc(100%-60px)] w-full">
		{@render children?.()}
	</div>
</div>
