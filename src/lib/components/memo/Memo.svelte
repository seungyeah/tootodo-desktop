<script lang="ts">
	import { Tabs, Button, Input, DropdownMenu } from '$ui';
	import { CirclePlus, Droplet, Grip, PaintBucket, Palette } from 'lucide-svelte';
	import MemoEditor from './MemoEditor.svelte';
	import { currentTime, formatDay } from '$store';
	import { onMount, tick } from 'svelte';

	let memos = [
		{
			pin: true,
			title: 'Take a break',
			date: '2024-04-22',
			color: 'rose',
			content: 'I need to take a break and recharge'
		},
		{
			pin: false,
			title: 'Prioritize tasks',
			date: '2024-04-23',
			color: 'violet',
			content: 'Prioritizing tasks is key to managing workload'
		},
		{
			pin: true,
			title: 'Follow up with team',
			date: '2024-04-24',
			color: 'blue',
			content: 'Remember to follow up with the team regarding the project'
		},
		{
			pin: false,
			title: 'Client meeting',
			date: '2024-04-25',
			color: 'default',
			content: 'Schedule a meeting with the client to discuss progress'
		},
		{
			pin: true,
			title: 'Prepare presentation',
			date: '2024-04-26',
			color: 'fuchsia',
			content: 'Prepare the presentation slides for the upcoming conference'
		},
		{
			pin: false,
			title: 'Review design mockups',
			date: '2024-04-27',
			color: 'green',
			content: 'Review and provide feedback on the design mockups'
		}
	];

	let newMemo = {
		pin: true,
		title: '',
		date: '',
		color: 'default',
		content: ''
	};

	function resetNewMemo() {
		newMemo = {
			pin: true,
			title: '',
			date: '',
			color: newMemo.color,
			content: ''
		};	
	}
	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		if(newMemo.title.trim() === '') {
			return;
		}
		if (newMemo.title.length <= 1) {
			resetNewMemo();
			return;
		}
		
		memos = [
			{
				pin: newMemo.pin,
				title: newMemo.title,
				date: formatDay($currentTime),
				color: newMemo.color,
				content: ''
			},
			...memos
		];
		await tick();
		resetNewMemo();
	}

	onMount(() => {
		memos = memos.sort((a, b) => (b.pin === a.pin ? 0 : b.pin ? 1 : -1));
	});

	// 200,400,600
	let colors = [
		{ name: 'default', normal: '#a1a1aa', light: '#e4e4e7', dark: '#4b5563' },
		{ name: 'rose', normal: '#fb7185', light: '#fecdd3', dark: '#e11d48' },
		// { name: 'orange', normal: '#fb923c', light: '#fed7aa', dark: '#ea580c' },
		{ name: 'violet', normal: '#a78bfa', light: '#ddd6fe', dark: '#7c3aed' },
		{ name: 'green', normal: '#4ade80', light: '#bbf7d0', dark: '#16a34a' },
		{ name: 'blue', normal: '#60a5fa', light: '#bfdbfe', dark: '#2563eb' },
		{ name: 'fuchsia', normal: '#e879f9', light: '#f5d0fe', dark: '#c026d3' }
	];

	$: memos = memos.sort((a, b) => (b.pin === a.pin ? 0 : b.pin ? 1 : -1));

	$:console.log(memos);
</script>

<div class="relative h-full w-full space-x-2">
	<!-- select color -->
	<Tabs.Root value="all" class="h-full w-full" let:value>
		<Tabs.List class="flex w-full ">
			<Tabs.Trigger
				value="all"
				class="w-[40px] -translate-x-1.5 scale-75"
				on:click={() => {
					newMemo.color = 'default';
				}}
			>
				{#if value == 'all'}
					<Button variant="ghost" class="absolute left-0 my-2 bg-zinc-700 !p-3 hover:bg-zinc-800  ">
						<Grip color="#fffbeb" fill="white" />
					</Button>
				{:else}
					<Button variant="ghost" class="absolute left-0 my-2  bg-zinc-300 !p-3 hover:bg-zinc-600">
						<Grip color="#fffbeb" />
					</Button>
				{/if}
			</Tabs.Trigger>
			{#each colors as color}
				<Tabs.Trigger
					value={color.name}
					style={`background-color: ${color.light};`}
					class="mx-1 h-7 w-7 rounded-full shadow"
					on:click={() => {
						newMemo.color = color.name;
					}}
				></Tabs.Trigger>
			{/each}
		</Tabs.List>

		<!-- input form-->
		<form
			on:submit|preventDefault={handleSubmit}
			class="relative flex h-9 w-full translate-y-2 items-center"
		>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class=" h-9 -translate-y-0.5 rounded p-0">
					<Button variant="ghost" size="sm" class="h-full rounded  p-0 shadow ">
						<Droplet
							size={30}
							fill={colors.find((c) => c.name === newMemo.color)?.dark ||
								colors.find((c) => c.name === 'default')?.dark}
							color="#f4f4f5"
						/>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="-translate-y-2">
					<DropdownMenu.Group>
						<DropdownMenu.Label class="text-center">Select Color</DropdownMenu.Label>
						<DropdownMenu.Item class="grid grid-cols-3 data-[highlighted]:bg-zinc-50">
							{#each colors as color}
								<Button
									class="m-2 h-5 w-5 p-2"
									style={`background-color: ${color.normal};`}
									on:click={() => {
										newMemo.color = color.name;
									}}
								/>
							{/each}
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<Input
				type="text"
				placeholder="title : put more than 1 char"
				bind:value={newMemo.title}
				on:keydown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault();
						handleSubmit(e);
					}
				}}
				class="my-2 ml-2 h-9 w-full scale-y-95 rounded-r-full p-2 pr-9 text-[1rem] font-normal focus:shadow"
			/>
			<Button
				variant="ghost"
				type="submit"
				class="botom-0 absolute right-1 z-10 rounded-full p-0 hover:bg-zinc-100"
				><CirclePlus color="#a1a1aa" /></Button
			>
		</form>

		<!-- memo list -->
		<!-- all -->
		<Tabs.Content value="all">
			<div class="card-list space-y-2">
				{#each memos as memo}
						<MemoEditor bind:memo />
				{/each}
			</div>
		</Tabs.Content>
		<!-- color filter -->
		{#each colors as color}
			<Tabs.Content value={color.name}>
				<div class="card-list space-y-4">
					{#each memos as memo}
						{#if memo.color === color.name}
							<MemoEditor bind:memo />
						{/if}
					{/each}
				</div>
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</div>

<style>
	.card-list {
		@apply h-[calc(100vh-212px)] overflow-auto pb-1.5;
	}
</style>
