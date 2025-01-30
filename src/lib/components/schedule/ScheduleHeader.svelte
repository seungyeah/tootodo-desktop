<script lang="ts">
	import { Button } from "$ui";
	import {
		MoonStar,
		Share,
		Workflow,
	} from "lucide-svelte";
	import { currentTime, formatTime } from "$store";

	interface Props {
		openSide?: boolean;
	}

	let { openSide = $bindable(true) }: Props = $props();

	let currentTimeDisplay = $derived(formatTime($currentTime));

</script>

<header class="flex justify-between mb-1 mr-1.5 text-lg font-digital">
				<button
					onclick={() => (openSide = !openSide)}
					class="rounded-full z-[1] h-[30px] flex"
				>
					<MoonStar fill="black" class="mr-2" />
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

