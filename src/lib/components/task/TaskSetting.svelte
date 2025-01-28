<script lang="ts">
	import { DropdownMenu, Menubar } from "$ui";
	import {
		ArrowBigRightDash,
		Diamond,
		MessageCircle,
		Plus,
		Trash2,CornerDownRight,

        EllipsisVertical

	} from "lucide-svelte";
	import { createEventDispatcher, getContext } from "svelte";
	import { type Task } from "$lib/schema";

	const tasks = getContext("tasks");

	let openChat = $state(false);

	const dispatch = createEventDispatcher();

	function handleDelete(task: Task) {
		dispatch("delete", { task });
	}

	function handleCreate(task: Task, addChild: boolean) {
		dispatch("create", { task, addBelow: true, addChild });
	}

	function handleUpdate(task: Task, key: string, value: any) {
		const updateData = {
			[key]: value,
		};
		dispatch("update", { task, updateData });
	}

	let tableContainer: HTMLElement = $state();

	function handleScroll() {
		dispatch("scroll", {
			scrollTop: tableContainer.scrollTop,
			scrollLeft: tableContainer.scrollLeft,
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
	onscroll={handleScroll}
>
	<table class="w-full">
		<tbody>
			{#key tasks}
				{#each $tasks as task, i}
					<tr class="z-10 flex h-[30px] items-center border-b border-zinc-400 border-dashed">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<td class="">
									<EllipsisVertical
										color="#3f3f46"
										strokeWidth={2}
										size={20}
									/>
								</td>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content
								class="border-2 border-double border-zinc-800 "
								side="left"
							>
								<DropdownMenu.Group
									class="flex items-center justify-center"
								>
									<DropdownMenu.Item class="h-8 py-0">
										<button onclick={handleCreate(task, false)} class="relative h-8 w-7"
											><Plus size={20} /><span class="absolute bottom-0 right-0">🔻</span>
										</button>
									</DropdownMenu.Item>
									<DropdownMenu.Item class="h-8 py-0">
										<button onclick={handleCreate(task, true)}  class="relative w-6 h-7"
											><Plus size={20} /><CornerDownRight class="absolute bottom-0 right-0 w-3 h-3"/></button
										>
									</DropdownMenu.Item>
									
									
								</DropdownMenu.Group>
								<DropdownMenu.Separator/>
								<DropdownMenu.Group
									class="flex items-center justify-center "
								>
									
									<DropdownMenu.Item class="">
										<button
											onclick={handleUpdate(
												task,
												"milestone",
												!task.milestone,
											)}><Diamond size={20} fill={task.milestone? "#e46b75":"#3f3f46"}/></button
										>
									</DropdownMenu.Item>
									<DropdownMenu.Item class="">
										<button onclick={() => (openChat = !openChat)}
											><MessageCircle size={20} /></button
										>
									</DropdownMenu.Item>
									<DropdownMenu.Item class="">
										<button onclick={handleDelete(task)}
											><Trash2 size={20} /></button
										>
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
