<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import { identifier } from '../actions.svelte';
	import type { ColumnMetaEnhanced } from '../core/types';

	type Props = {
		datagrid: EnhancedDatagrid;
		row: GridBasicRow<any>;
		column: LeafColumn<any, ColumnMetaEnhanced>;
		children: Snippet;
		class?: string;
	};

	let { datagrid, row, column, children, class: _class }: Props = $props();
</script>

<div
	use:identifier={{ datagrid, value: `${row.identifier}-${column.columnId}` }}
	class:grow={column?._meta?.grow}
	class={cn(datagrid.customization.styling.getBodyRowCellClasses(datagrid, row, column), 'group transition-none', _class)}
	data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
	style:--pin-left-offset={column.state.pinning.offset + 'px'}
	style:--pin-right-offset={column.state.pinning.offset + 'px'}
>
	{@render children()}
</div>

<style>
	/* Copy Feedback */

	.copy-feedback {
		animation: copyFeedback 1s ease;
	}

	@keyframes copyFeedback {
		0% {
			background-color: hsl(var(--grid-accent) / 0.2);
		}
		100% {
			background-color: transparent;
		}
	}
</style>
