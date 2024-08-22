<script lang="ts">
	import { Button } from "$ui";
	import {
		MoonStar,
		Share,
		Workflow,
	} from "lucide-svelte";
	import { currentTime, formatTime } from "$store";

	export let openSide = true;

	$: currentTimeDisplay = formatTime($currentTime);

</script>

<header class="flex justify-between mb-1 mr-1.5 text-lg font-digital">
				<button
					on:click={() => (openSide = !openSide)}
					class="rounded-full z-[1] h-[30px] flex"
				>
					<MoonStar fill="black" />
					{currentTimeDisplay}
				</button>

				<div class="flex space-x-1">
					<Button
						variant="ghost"
						class="shadow z-[1] h-[30px] px-2 py-0 -translate-y-0.5 translate-x-1 hover:bg-transparent 
			hover:shadow-lg hover:shadow-zinc-400 hover:-translate-y-1 rounded-full"
					>
						<Workflow strokeWidth={2.5} size={16} />
					</Button>
					<Button
						variant="ghost"
						class="shadow z-[1] h-[30px] px-2 py-0 -translate-y-0.5 translate-x-1 hover:bg-transparent 
		hover:shadow-lg hover:shadow-zinc-400 hover:-translate-y-1 rounded-full"
					>
						<Share strokeWidth={2.5} size={16} />
					</Button>
				</div>
			</header>

