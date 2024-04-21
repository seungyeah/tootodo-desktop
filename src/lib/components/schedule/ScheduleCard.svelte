<script lang="ts">
	import Chat from './Chat.svelte';
	import { Button, DropdownMenu } from '$ui';
	import { MessageCircle, Pin, Bell, BellRing, EllipsisVertical, Trash2 } from 'lucide-svelte';
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
	export let value = '';
	const week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
	const weekShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

	export let record = {
		title: 'happy',
		openChat: false
	};

	let chatRef;
	let componentY = 0;
	const dispatch = createEventDispatcher();

	function toggleOpenChat() {
		record.openChat = !record.openChat;
		dispatch('toggleOpenChat', record);
	}

	function updatePosition() {
		const rect = chatRef.getBoundingClientRect();
		componentY = rect.top - 10;
	}

	onMount(() => {
		updatePosition();
	});

	afterUpdate(() => {
		updatePosition();
	});
</script>

<!-- card -->
<div class="w-full rounded-lg border-b-2 border-t-2" bind:this={chatRef}>
	<!-- item info -->
	<div class="relative flex h-8 items-center space-x-0">
		<!-- setting item -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger><EllipsisVertical size={16} /></DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label class="text-center">Set {value}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={() => (record.pin = true)}
						><Pin size={16} class="mr-2" />Set Pin</DropdownMenu.Item
					>

					<DropdownMenu.Item on:click={() => (record.alarm = true)}
						><Bell size={16} class="mr-2" />Set Alarm</DropdownMenu.Item
					>
					<DropdownMenu.Item><Trash2 size={16} class="mr-2" />Delete</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<!-- item content -->
		{#if record.pin}
			<Button variant="ghost" class="h-6 px-1" on:click={() => (record.pin = false)}
				><Pin size={16} fill="#e4e4e7" /></Button
			>
		{/if}
		{#if record.alarm}
			<Button variant="ghost" class="h-6 px-1" on:click={() => (record.alarm = false)}
				><BellRing size={16} fill="#fde68a" /></Button
			>
		{/if}
		<div class="p-1 text-[1rem]">{record.title}</div>

		<!-- chatting popup icon-->
		{#if record.item == 'task' || record.item == 'event'}
			<Button variant="ghost" class="absolute right-0 top-1 h-6 px-2" on:click={toggleOpenChat}>
				{#if record.openChat}
					<MessageCircle size={16} fill="#fef08a" class=" scale-125" />
				{:else}
					<MessageCircle size={16} fill="#e4e4e7" />
				{/if}
			</Button>
		{/if}
	</div>

	<hr class="border-dashed" />

	<!-- schedule weekly -->
	<div class="flex">
		{#each week as day, i}
			{@const short = weekShort[i]}
			<button
				class:selectedDay={record.days.includes(day)}
				on:click={() =>
					record.days.includes(day)
						? (record.days = record.days.filter((d) => d !== day))
						: (record.days = [...record.days, day])}
				class="font-digital h-6 w-full rounded-md rounded-b border-l border-dashed text-xs hover:bg-pink-50"
				>{short}</button
			>
		{/each}
	</div>

	<!-- chat popup -->
	{#if record.openChat}
		<div class="chat" style="transform:translate(85%,-{componentY}px)">
			<Chat bind:record />
		</div>
	{/if}
</div>

<style>
	.selectedDay {
		@apply bg-pink-50;
	}

	.chat {
		@apply fixed z-50 h-[calc(100vh-120px)] w-1/3  min-w-[250px] rounded-lg  bg-zinc-50 shadow-lg shadow-yellow-950 sm:h-[calc(100vh-90px)];
	}
</style>
