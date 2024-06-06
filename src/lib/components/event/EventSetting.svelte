<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Button, DropdownMenu } from '$ui';
	import { ArrowBigRightDash, DiamondPlus, MessageCircle, Trash2 } from 'lucide-svelte';
	import { createEventDispatcher, getContext } from 'svelte';

	const start = today(getLocalTimeZone());

	const events = getContext('events');


	const dispatch = createEventDispatcher();
	function handleDelete(event){
		dispatch('delete', { event });	
	}
	let tableContainer;

	function handleScroll(event) {
		dispatch('scroll', {
			scrollTop: tableContainer.scrollTop,
			scrollLeft: tableContainer.scrollLeft
		});
	}

	export function updateScrollPosition(scrollPosition) {
		if (tableContainer) {
			tableContainer.scrollTop = scrollPosition.scrollTop;
			tableContainer.scrollLeft = scrollPosition.scrollLeft;
		}
	}
</script>

<div
	class=" no-scrollbar flex max-h-full  w-6 flex-col overflow-y-scroll"
	bind:this={tableContainer}
	on:scroll={handleScroll}
>
	<table class="w-full">
		<tbody>
			{#key events}
			{#each $events as event, i}
				<tr class="z-10 flex h-[30px] items-center">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<td class="">
								<ArrowBigRightDash color="#3f3f46" strokeWidth={2} size={22} />
							</td>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="border-2 border-double border-zinc-800 " side="right">
							<DropdownMenu.Group class=" flex items-center justify-center">
								<DropdownMenu.Item class="">
									<button><DiamondPlus size={20} /></button>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="">
									<button><MessageCircle size={20} /></button>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="">
									<button on:click={handleDelete(event)}><Trash2 size={20} /></button>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</tr>
			{/each}
			{/key}
		</tbody>
	</table>
</div>
