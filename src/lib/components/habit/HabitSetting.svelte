<script lang="ts">
	import { DropdownMenu } from '$ui';
	import { ArrowBigRightDash, DiamondPlus, MessageCircle, Trash2 } from 'lucide-svelte';
	import { createEventDispatcher, getContext } from 'svelte';
	import {type Habit } from "$lib/schema";

	const habits = getContext('habits');

	let openChat = false;

	const dispatch = createEventDispatcher();
	
	function handleDelete(habit:Habit){
		dispatch('delete', { habit });	
	}

	function handleUpdate(habit:Habit,key:string,value:any){
		const updateData = {
			[key]:value
		}
		dispatch('update', {habit,updateData });	
	}

	let tableContainer: HTMLElement;

	function handleScroll() {
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
	class="flex flex-col w-6 max-h-full overflow-y-scroll no-scrollbar"
	bind:this={tableContainer}
	on:scroll={handleScroll}
>
	<table class="w-full">
		<tbody>
			{#key habits}
			{#each $habits as habit, i}
				<tr class="z-10 flex h-[30px] items-center">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<td class="">
								<ArrowBigRightDash color="#3f3f46" strokeWidth={2} size={22} />
							</td>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="border-2 border-double border-zinc-800 " side="right">
							<DropdownMenu.Group class="flex items-center justify-center ">
								<DropdownMenu.Item class="">
									<button on:click={handleUpdate(habit,'milestone',!habit.milestone)}><DiamondPlus size={20} /></button>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="">
									<button on:click={()=>openChat = !openChat}><MessageCircle size={20} /></button>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="">
									<button on:click={handleDelete(habit)}><Trash2 size={20} /></button>
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
