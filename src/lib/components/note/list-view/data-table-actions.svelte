<script lang="ts">
	import {Ellipsis} from "lucide-svelte";
	import { Button,DropdownMenu } from "$ui";
	interface Props {
		id: string;
	}

	let { id }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild >
		{#snippet children({ builder })}
				<Button variant="ghost" builders={[builder]} size="icon" class="relative w-8 h-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="w-4 h-4" />
			</Button>
					{/snippet}
		</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
				Copy payment ID
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>View customer</DropdownMenu.Item>
		<DropdownMenu.Item>View payment details</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>