<script lang="ts">
	import Chat from './Chat.svelte';
	import { Button, ContextMenu, DropdownMenu } from '$ui';
	import { MessageCircle, Pin, Bell, BellRing, EllipsisVertical, Trash2 } from 'lucide-svelte';
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
	export let value = '';
	const week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
	const weekShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

	let planTime = '';
	export let record = {
		pin: true,
		alarm: true,
		item: 'task',
		title: 'urgent task',
		days: [
			{ day: 'mon', time: '' },
			{ day: 'wed', time: '' }
		],
		openChat: false,
		project: { title: 'Project K', color: '#f472b6' }
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
<div class="w-full rounded-lg border-b-[3px] border-t-2 shadow-sm" bind:this={chatRef}>
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
					<MessageCircle size={16} fill="#f4f4f5" color="#a1a1aa" />
				{/if}
			</Button>
		{/if}
	</div>

	<hr class="border-dashed border-zinc-300" />

	<!-- schedule weekly -->
	<div class="flex h-[30px] border-r border-dashed">
		{#each week as day, i}
			{@const short = weekShort[i]}
			<ContextMenu.Root
				closeOnItemClick={false}
				onOpenChange={() => {
					if (record.days.some((item) => item.day === day))
						record.days.find((item) => item.day === day).time = planTime;
					planTime = '';
				}}
			>
				<ContextMenu.Trigger class="h-full w-full -translate-y-1 "
					><button
						class:selectedDay={record.days.some((item) => item.day === day)}
						on:click={() => {
							// record.days에 day가 있다면 제거하고, 없다면 추가.
							record.days.some((item) => item.day === day)
								? (record.days = record.days.filter((item) => item.day !== day))
								: (record.days = [...record.days, { day, time: '' }]);
						}}
						class="relative h-full w-full rounded-none rounded-b border-l border-dashed hover:bg-zinc-100"
						style="color: {record?.project?.color};"
					>
						<span
							class="absolute left-0 top-0 px-1 py-0.5 font-serif text-[0.5rem] font-light leading-3"
							>{short}</span
						>
						<span
							class="absolute bottom-0.5 left-0 text-center w-full py-0.5 font-serif text-[0.75rem] font-light leading-3 text-zinc-500"
							>{record.days.find((item) => item.day === day)?.time || ''}</span
						>
					</button>
				</ContextMenu.Trigger>
				{#if record.days.some((item) => item.day === day)}
					<ContextMenu.Content>
						<ContextMenu.Item 
							>
							<span class="font-bold">
								Set Time
							</span>
							<input
								type="time"
								class="h-8 w-full px-2 rounded-lg border border-zinc-300"
								bind:value={planTime}
							/>
						</ContextMenu.Item>
					</ContextMenu.Content>
				{/if}
			</ContextMenu.Root>
		{/each}
	</div>

	<!-- chat popup -->
	{#if record.openChat}
		<div class="chat" style="transform:translate(87%,-{componentY}px)">
			<Chat bind:record />
		</div>
	{/if}
</div>


<style>
	.selectedDay {
		@apply bg-zinc-100;
	}

	.chat {
		@apply fixed z-50 h-[calc(100vh-120px)] w-1/3  min-w-[250px] rounded-lg  bg-zinc-50 shadow-lg shadow-yellow-950 sm:h-[calc(100vh-90px)];
	}
</style>
