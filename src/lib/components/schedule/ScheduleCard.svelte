<script lang="ts">
	import { Button, ToggleGroup, Separator, Toggle,DropdownMenu } from '$ui';
	import { MessageCircle, Pin, Bell, EllipsisVertical, Trash2 } from 'lucide-svelte';
	export let value = '';
	const week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	const weekShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  let record = {
    pin:true,
    alarm:false,
    item: 'task',
    title:'happy',
  }
</script>

<div class="w-full rounded-lg border-b-2 border-t-2">
	<div class="relative flex items-center h-8 space-x-0">    
    <DropdownMenu.Root>
      <DropdownMenu.Trigger><EllipsisVertical size={16} /></DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label class="text-center">Set {value}</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Item><Bell size={16} class="mr-2"/>Set Alarm</DropdownMenu.Item>
          <DropdownMenu.Item><Trash2 size={16} class="mr-2"/>Delete</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
    {#if record.pin}
		<Toggle class="px-1 h-6"><Pin size={16} fill="#e4e4e7" /></Toggle>
    {/if}
    
		<h4 class="p-1">{record.title}</h4>
		<Button variant="ghost" class="absolute right-0 px-2 h-6"
			><MessageCircle size={16} fill="#fef08a" /></Button
		>
	</div>
	<Separator />
	<ToggleGroup.Root type="multiple">
		{#each week as day, i}
			{@const short = weekShort[i]}
			<ToggleGroup.Item value={day} class="h-6  w-full border">{short}</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
</div>
