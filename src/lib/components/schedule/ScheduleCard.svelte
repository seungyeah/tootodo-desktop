<script lang="ts">
	import { Button, ToggleGroup, Separator, Toggle, DropdownMenu } from '$ui';
	import { MessageCircle, Pin, Bell, BellRing,EllipsisVertical, Trash2 } from 'lucide-svelte';
	export let value = '';
	const week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
	const weekShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	export let record = {
		pin: true,
		alarm: false,
		item: 'task',
		title: 'happy',
		days: ['tue']
	};;

</script>

<div class="t w-full rounded-lg border-b-2 border-t-2">
	<div class="relative flex h-8 items-center space-x-0">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger><EllipsisVertical size={16} /></DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label class="text-center">Set {value}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item><Bell size={16} class="mr-2" />Set Alarm</DropdownMenu.Item>
					<DropdownMenu.Item><Trash2 size={16} class="mr-2" />Delete</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		
    {#if record.pin}
			<Toggle class="h-6 px-1"><Pin size={16} fill="#e4e4e7" /></Toggle>
		{/if}
    {#if record.alarm}
			<Toggle class="h-6 px-1"><BellRing size={16} fill="#fde68a" /></Toggle>
		{/if}

		<div class="p-1 text-[1rem]">{record.title}</div>
		<Button variant="ghost" class="absolute right-0 h-6 px-2"
			><MessageCircle size={16} fill="#d4d4d8" /></Button
		>
	</div>
	<hr class="border-dashed" />

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
</div>

<style>
	.selectedDay {
		@apply bg-pink-50;
	}
</style>
