<script lang="ts">
	import { DropdownMenu, Menubar } from "$ui";
	import {
		ArrowBigRightDash,
		Diamond,
		MessageCircle,
		Plus,
		Trash2,
		CornerDownRight,
		EllipsisVertical,
	} from "lucide-svelte";
	import { createEventDispatcher, getContext } from "svelte";
	import { type Task } from "$lib/schema";

	export let task: Task;

	let openChat = false;

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

</script>

<div
	class="flex flex-col w-6 max-h-full overflow-y-scroll no-scrollbar"
>
	<table class="w-full">
		<tbody>
			<tr
				class="z-10 flex h-[30px] items-center"
			>
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
						<DropdownMenu.Group class="flex items-center justify-center">
							<DropdownMenu.Item class="h-8 py-0">
								<button
									on:click={handleCreate(task, false)}
									class="relative h-8 w-7"
									><Plus size={20} /><span
										class="absolute bottom-0 right-0">🔻</span
									>
								</button>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="h-8 py-0">
								<button
									on:click={handleCreate(task, true)}
									class="relative w-6 h-7"
									><Plus size={20} /><CornerDownRight
										class="absolute bottom-0 right-0 w-3 h-3"
									/></button
								>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group class="flex items-center justify-center ">
							<DropdownMenu.Item class="">
								<button
									on:click={handleUpdate(
										task,
										"milestone",
										!task.milestone,
									)}
									><Diamond
										size={20}
										fill={task.milestone ? "#e46b75" : "#3f3f46"}
									/></button
								>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="">
								<button on:click={() => (openChat = !openChat)}
									><MessageCircle size={20} /></button
								>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="">
								<button on:click={handleDelete(task)}
									><Trash2 size={20} /></button
								>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</tr>
		</tbody>
	</table>
</div>
