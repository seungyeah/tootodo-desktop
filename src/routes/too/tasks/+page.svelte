<script lang="ts">
	import PageTemplete from '../PageTemplete.svelte';

	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import { Badge, Button, Command, Popover, Separator } from '$ui';
	import { cn } from '$lib/utils.js';

	type Category = {
		value: string;
		label: string;
		properties: {
			options: string[];
			label: string;
		}[];
	};
	const categories: Category[] = [
		{
			value: 'tootodo',
			label: 'tootodo',
			properties: [
				{
					label: 'tags',
					options: [
						'FE',
						'BE',
						'DB',
						'DevOps',
						'Design',
						'Marketing',
						'Sales',
						'HR',
						'Management',
						'Others'
					]
				},
				{
					label: 'status',
					options: ['Todo', 'Doing', 'Done']
				}
			]
		},
		{
			value: 'english',
			label: 'English',
			properties: [
				{
					label: 'tags',
					options: [
						'Vocabulary',
						'Grammar',
						'Listening',
						'Speaking',
						'Reading',
						'Writing',
						'Others'
					]
				},
				{
					label: 'status',
					options: ['Todo', 'Doing', 'Done']
				}
			]
		}
	];

	let open = false;
	let value = 'tootodo';
	$: selectedValue = categories.find((f) => f.value === value)?.label ?? 'Select a Category...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<PageTemplete>
	<div slot="side" class="h-full w-full">
		<div
			class="relative flex h-full min-w-[240px] max-w-[360px] flex-col items-center justify-start bg-violet-50 text-lg font-bold"
		>
			<div class="absolute top-0 h-2 w-full bg-white" />
			<!-- change category color -->
			<!-- add property -->
			<!-- select category -->
			<Popover.Root bind:open let:ids>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						class="z-10 w-[200px] justify-between shadow"
					>
						{selectedValue}
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-[200px] p-0">
					<Command.Root>
						<Command.Input placeholder="Select Category" />
						<Command.Empty>No Category found.</Command.Empty>
						<Command.Group>
							{#each categories as category}
								<Command.Item
									value={category.value}
									onSelect={(currentValue) => {
										value = currentValue;
										closeAndFocusTrigger(ids.trigger);
									}}
								>
									<Check
										class={cn('mr-2 h-4 w-4', value !== category.value && 'text-transparent')}
									/>
									{category.label}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>

			<!-- properties -->
			<div class="flex flex-col space-y-2">
				{#if selectedValue}
					{@const category = categories.find((f) => f.value === value)}
					{#if category}
						{#each category.properties as prop}
							<div class="m-2 rounded-lg bg-white">
								<Button class="w-full justify-between rounded-none border-b-2">
									{prop.label}
								</Button>
								<div class="p-2">
									{#each prop.options as option}
										<Badge class="mx-0.5 w-auto" variant="outline">
											{option}
										</Badge>
									{/each}
								</div>
							</div>
						{/each}
					{/if}
				{/if}
			</div>
		</div>
	</div>
	<div slot="main"></div>
</PageTemplete>
