<script lang="ts">
	import type { Writable } from "svelte/store";
	import { Checkbox } from "$ui";

	export let checked: Writable<boolean>;
</script>

<Checkbox bind:checked={$checked} />