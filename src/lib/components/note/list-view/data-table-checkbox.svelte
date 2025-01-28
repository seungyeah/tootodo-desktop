<script lang="ts">
	import type { Writable } from "svelte/store";
	import { Checkbox } from "$ui";

	interface Props {
		checked: Writable<boolean>;
	}

	let { checked }: Props = $props();
</script>

<Checkbox bind:checked={$checked} />