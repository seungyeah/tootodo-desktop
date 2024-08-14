<script lang="ts">
	import { DropdownMenu, Menubar } from "$ui";
	import {
		ArrowBigRightDash,
		Diamond,
		FilePlus,
		BookOpen,
		BookPlus,
		MessageCircle,
		Plus,
		Ungroup,
		Trash2,
		Waypoints,
		EllipsisVertical,
		Move,CalendarFold
	} from "lucide-svelte";
	import { createEventDispatcher, getContext } from "svelte";
	import { type Task } from "$lib/schema";
    import type { TaskCreationMode } from "$lib/type";

	export let hasChildren: boolean;
	export let task: Task;
	export let hasNote: boolean = false;
	let openChat = false;

	const dispatch = createEventDispatcher();
	const dispatchUpdateTask: Function = getContext("handleUpdateTask");
	const dispatchCreateTask:Function = getContext("handleCreateTask");
	const disaptchDeleteTask:Function = getContext("handleDeleteTask");

	function handleDelete(task: Task) {
		disaptchDeleteTask(task);
	}

	function handleCreate(task: Task, mode: TaskCreationMode) {
		dispatchCreateTask(task,mode)
	}

	function handleUpdate(task: Task, key: string, value: any) {
		const updateData = {
			[key]: value,
		};
		dispatchUpdateTask(task,updateData)
	}

	function openNote(task){
		

	}
	function openNotePageList(task){

	}
	function createNote(task){

	}
</script>

<div class="flex flex-col w-6 max-h-full overflow-y-scroll no-scrollbar">
	<table class="w-full">
		<tbody>
			<tr class="z-10 flex h-[30px] items-center">
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
						class="border-2 w-[190px] border-double border-zinc-800 "
						side="bottom"
						alignOffset={-100}
						sideOffset={-30}
					>
						<!-- add :
						 task: add task  | add subtask with same duration
						 subtask: add subtask with same parent task
						-->
						<DropdownMenu.Group
							class="relative flex items-center justify-center w-full pl-8"
						>
							<DropdownMenu.Label class="absolute left-0 text-xs"
								><Plus size={20} />
							</DropdownMenu.Label>
							{#if !task.parent_id}
								<DropdownMenu.Item class="h-8 py-0">
									<button
										on:click={handleCreate(task, 'sameDuration')}
										class="relative h-8"
										>task🔻
									</button>
								</DropdownMenu.Item>
							{/if}
							<DropdownMenu.Item class="h-8 py-0">
								<button on:click={handleCreate(task, 'child')} class=" h-7"
									>subtask</button
								>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />

						<!-- move : 
						 task with subtask: ungroup
						 task without subtask: move other task
						 subtask: convert to task | move other subtask
						-->
						<DropdownMenu.Group
							class="flex items-center justify-center pl-8"
						>
							<DropdownMenu.Label class="absolute left-0 text-xs ">
								{#if hasChildren}
									<Ungroup size={20}  class="mx-1.5"  />
								{:else}
									<Move size={18} class="mx-1.5" />
								{/if}
							</DropdownMenu.Label>

							{#if hasChildren}
								<DropdownMenu.Item class="h-8 py-0">
									<button
										on:click={handleUpdate(
											task,
											"milestone",
											!task.milestone,
										)}
										class=" h-7">ungroup</button
									>
								</DropdownMenu.Item>
							{:else}
								<DropdownMenu.Item class="h-8 py-0">
									<button
										on:click={handleUpdate(
											task,
											"milestone",
											!task.milestone,
										)}
										class=" h-7">new group</button
									>
								</DropdownMenu.Item>
							{/if}
						</DropdownMenu.Group>
						<DropdownMenu.Separator />

						<!-- note: new note,(if exists) open note | new page  -->
						<DropdownMenu.Group class="flex justify-center w-full">
							{#if hasNote}
								<DropdownMenu.Item class="h-8 ">
									<button
										on:click={openNote(task)}
										class="relative -translate-y-1"
										><BookOpen size={20} class="mx-1" />
										<span class="absolute -left-0.5 -bottom-3.5">open</span></button
									>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="h-8">
									<button
										on:click={openNotePageList(task)}
										class="relative -translate-y-1"
										><FilePlus size={20} /><span class="absolute -left-1 -bottom-3.5">page</span></button
									>
								</DropdownMenu.Item>
							{:else}
							<DropdownMenu.Label class="absolute text-xs left-1.5"
								><BookPlus  size={20} />
							</DropdownMenu.Label>
								<DropdownMenu.Item class="h-8 ml-8">									
									<button
										on:click={createNote(task)}
										class="flex h-8 p-1.5"
									>
										new note
									</button>
								</DropdownMenu.Item>
							{/if}
						</DropdownMenu.Group>
						<DropdownMenu.Separator />

						<!-- etc. (un)set milestone, critical path info, open chat, delete task -->
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
								<button 
									><CalendarFold size={20} /></button
								>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="">
								<button 
									><Waypoints size={20} /></button
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
