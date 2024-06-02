<script lang="ts">
	import { Button, Checkbox, Label } from '$ui';
	import { MessageCircle } from 'lucide-svelte';

	export let records = [
		{
			item: 'task',
			title: 'urgent task',
			days: ['mon', 'wed'],
			chatID: '321241',
			project: { title: 'Project K', color: '#f472b6' },
			openChatInDiary: false,
			done: false
		}
	];
</script>

<div class="no-scrollbar max-h-full overflow-y-auto">
	{#each records as record}
		<div
			class="relative flex items-center space-x-1.5 border-b border-dashed px-2 text-[1rem] font-semibold"
		>
			{#if record.project}
				{@const projColor = record.project.color}
				<Checkbox
					id={record.title}
					bind:checked={record.done}
					style="background-color: {projColor}"
					class="border-0 opacity-60 data-[state=checked]:opacity-20 "
				/>
			{:else}
				<Checkbox
					id={record.title}
					bind:checked={record.done}
					class="border-0 bg-zinc-300 data-[state=checked]:opacity-10"
				/>
			{/if}

			{#if record.chatID}
				<div class="flex h-7 w-full justify-between">
					<Label for={record.title} class="w-full text-start text-[1.0rem] xl:text-[1.2rem] ">
						<div class={record.done ? 'w-full line-through opacity-60' : ''}>
							{record.title}
						</div>
					</Label>
					<!-- <button
						on:click={() => (record.openChatInDiary = !record.openChatInDiary)}
						class="absolute right-2 top-0 h-full bg-white"
					>
						{#if record.openChatInDiary}
							<MessageCircle size={16} fill="#fef08a" class=" scale-125" />
						{:else}
							<MessageCircle size={16} fill="#fafafa" color="#d4d4d8" />
						{/if}
					</button> -->
				</div>
			{/if}
		</div>
	{/each}
</div>
