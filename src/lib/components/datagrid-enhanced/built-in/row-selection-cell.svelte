<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import Cell from '../structure/cell.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
		row: GridBasicRow<any>;
		column: LeafColumn<any>;
	};

	let { datagrid, row, column }: Props = $props();

	const handleChange = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		if (e.currentTarget.checked) {
			datagrid.features.rowSelection.selectRowById(row.identifier);
		} else {
			datagrid.features.rowSelection.deselectRowById(row.identifier);
		}
		e.currentTarget.checked = datagrid.features.rowSelection.isRowSelected(row.identifier);
	};

	// I am not able to make it work with shadcn svelte checkbox
	// it doesn't update the checkbox state to properly reflect the row selection
	// so it does not play well with the row selection feature that allows multi selection
	// or single selection depending on the configuration
</script>

<Cell {datagrid} {row} {column} class=" m-0 items-center justify-center p-0 ">
	<input
		class="m-0 mx-auto size-4"
		type="checkbox"
		checked={datagrid.features.rowSelection.isRowSelected(row.identifier)}
		onchange={handleChange}
	/>
</Cell>
