<script lang="ts">
	import { Button } from "$ui";
	import { BotMessageSquare } from "lucide-svelte";
</script>

<Button
	variant="ghost"
	size="sm"
	class="w-auto h-8 p-2 text-xs bg-white rounded-lg shadow"
	><BotMessageSquare size={16} />
</Button>
