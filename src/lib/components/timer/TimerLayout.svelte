<script lang="ts">
	import { VisSingleContainer, VisNestedDonut } from '@unovis/svelte';
	type Datum = {
		group: string;
		subgroup: string;
	};
	export let data: Datum[];
	const layers = [(d: Datum) => d.group, (d: Datum) => d.subgroup];
	const layerSettings = (i: number) => i === 0 && { width: 25 };
</script>

<VisSingleContainer {data}>
	<VisNestedDonut {layers} {layerSettings} />
</VisSingleContainer>
