<script lang="ts">
	import type { ColumnGroup, LeafColumn } from '$lib/datagrid/core/types';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import LeafColumnCell from './leaf-column-cell.svelte';
	import { isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import { flip } from 'svelte/animate';
	import GroupColumnCell from './group-column-cell.svelte';
	import HeaderCellDropdown from '../built-in/header-cell-dropdown.svelte';
	import ColumnFilterInput from '../built-in/column-filter-input.svelte';
	import type { ColumnMetaEnhanced } from '../core/types';
	import SortingIndicator from '../built-in/sorting-indicator.svelte';

	type Props = {
		datagrid: EnhancedDatagrid;
		column: ColumnGroup<any, ColumnMetaEnhanced> | LeafColumn<any, ColumnMetaEnhanced>;
	};

	let { datagrid, column }: Props = $props();
</script>

{#if isGroupColumn(column)}
	{@render ColumnGroupHeaderSnippet(column)}
{:else if column.state.visible === true}
	{@render ColumnHeaderSnippet(column)}
{/if}

{#snippet ColumnGroupHeaderSnippet(column: ColumnGroup<any>)}
	<GroupColumnCell {column} {datagrid}>
		<div class={datagrid.customization.styling.getHeadRowGroupColumnCellContentClasses()}>
			<span class={datagrid.customization.styling.getHeadRowGroupColumnCellHeaderClasses()}>
				{column.header}
			</span>
			<HeaderCellDropdown {datagrid} {column} />
		</div>
		<div class="flex grow flex-row">
			{#each column.columns ?? [] as subColumn (subColumn.columnId)}
				<div
					animate:flip={{
						duration: (len) => datagrid.extra.features.animations.getHeadersFlipDuration(len)
					}}
				>
					{#if isGroupColumn(subColumn)}
						{@render ColumnGroupHeaderSnippet(subColumn)}
					{:else if subColumn.state.visible === true}
						{@render ColumnHeaderSnippet(subColumn)}
					{/if}
				</div>
			{/each}
		</div>
	</GroupColumnCell>
{/snippet}

{#snippet ColumnHeaderSnippet(column: LeafColumn<any>)}
	{#if column.headerCell}
		{@const cellContent = column.headerCell({ datagrid, column })}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {column} />
		{/if}
	{:else}
		<LeafColumnCell {datagrid} {column}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class:sortable={column.options.sortable &&
					datagrid.customization.headerCellDropdownMenu.displayColumnSortingControls === true}
				class={datagrid.customization.styling.getHeadRowLeafColumnCellContentClasses(column)}
				onclick={(e) => {
					if (datagrid.customization.enableSorting === false) return;
					let multisort = false;
					if (datagrid.features.sorting.allowMultiSort) {
						multisort = e.shiftKey;
					}
					datagrid.handlers.sorting.toggleColumnSort(column, multisort);
				}}
			>
				<span class="font-semibold">{column.header}</span>

				<div class="flex gap-1">
					{#if datagrid.customization.enableSorting === true && column.isSortable() && datagrid.customization.showColumnSortingIndicator === true}
						{#if column.isSortable()}
							<SortingIndicator {datagrid} {column} />
						{/if}
					{/if}
					{#if column._meta.showColumnManagerDropdownMenu === true && datagrid.customization.enableColumnDropdownMenu === true}
						<HeaderCellDropdown {datagrid} {column} />
					{/if}
				</div>
			</div>
			{#if datagrid.customization.shouldDisplayHeaderCellFilter()}
				<div class={datagrid.customization.styling.getHeadRowLeafColumnFilterInputWrapperClasses()}>
					<ColumnFilterInput {datagrid} {column} />
				</div>
			{/if}
		</LeafColumnCell>
	{/if}
{/snippet}
