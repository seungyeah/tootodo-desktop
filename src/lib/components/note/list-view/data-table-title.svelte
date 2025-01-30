<script lang="ts">
	import NotePage from "./NotePage.svelte";

	import { Label, Badge, Dialog, Button } from "$ui";
	import { Circle, MessageCircle, Plus, Tag } from "lucide-svelte";
	import ItemInfo from "./data-table-connections.svelte";

	let { note } = $props();
	// $: console.log(note);
	let tagGroups = [
		{
			id: "0",
			name: "undefined",
			tags: ["대회"],
			color: "#f4f4f5",
		},
		{
			id: "1",
			name: "english",
			tags: ["speaking", "writing", "reading", "listening", "word"],
			color: "#f3e8ff",
		},
		{
			id: "2",
			name: "ai",
			tags: ["qdrant", "cohere", "langchain"],
			color: "#ecfccb",
		},
		{
			id: "3",
			name: "language",
			tags: ["rust", "javascript", "python", "c++", "c"],
			color: "#fef3c7",
		},
		{
			id: "4",
			name: "database",
			tags: ["qdrant", "postgres", "mongodb"],
			color: "#d1fae5",
		},
	];
</script>

{#if note}
	<Dialog.Root open={false}>
		<Dialog.Trigger class="w-full h-full">
			<div
				class="flex flex-col items-start justify-center w-full h-full space-y-1 ml-6"
			>
				<Label class="line-clamp-1">
					{note.title}
				</Label>

				<div class="flex space-x-1 -translate-x-1">
					{#each note.tags as tag}
						<Badge
								variant="outline"
							class=" h-[18px] shadow-sm translate-y-0.5 font-mono  px-1.5  text-xs font-medium border rounded-md border-b-zinc-950/30 border-r-zinc-950/30"
						>
							{tag.name}
							<span class="ml-1 flex">
								{#each tag.groups as group_id, i}
									{@const color =
										tagGroups.find((f) => f.id === group_id)?.color ||
										"#f4f4f5"}
									<Circle
										class="h-3 w-3 text-zinc-600  "
										style={`margin-left:-${i + 2}px;`}
										fill={color}
									/>
								{/each}
							</span>
						</Badge>
					{/each}
				</div>
			</div>
		</Dialog.Trigger>
		<Dialog.Content
			class="!min-w-[calc(100vw-2rem)] !min-h-[calc(100vh-1rem)] py-3 px-4 max-h-[calc(100vh-1rem)] overflow-y-clip "
		>
			<Dialog.Header>
				<Dialog.Title
					class=" p-2 border-b-2 border-zinc-600 border-double flex flex-col space-y-2 "
				>
					<div
						class="relative flex  w-full space-x-1 h-7 justify-center items-center  "
					>
						<ItemInfo itemInfo={note.connectedItemInfo} class="absolute top-0 left-0"/>
						<div class="font-semibold text-zinc-800 w-full text-center ">{note.title}</div>

					</div>
					<div class="flex space-x-1 -translate-x-1">
						<Button
							class="h-[18px] shadow-sm text-xs bg-zinc-100 translate-y-0.5 font-mono p-0 pr-1 py-0 font-medium rounded-md hover:bg-zinc-100 "
							><Tag size={19} class="p-1 text-zinc-700"/><input class="w-9 h-3.5 p-1 rounded" placeholder="tag"/></Button
						>
						{#each note.tags as tag}
							<Badge
								variant="outline"
								class="h-[18px] shadow-sm text-xs translate-y-0.5 font-mono  px-1.5 py-0  font-medium border rounded-md border-b-zinc-950/30 border-r-zinc-950/30"
							>
								{tag.name}
								<span class="ml-1 flex">
									{#each tag.groups as group_id, i}
										{@const color =
											tagGroups.find((f) => f.id === group_id)
												?.color || "#f4f4f5"}
										<Circle
											class="h-3 w-3 text-zinc-600  "
											style={`margin-left:-${i + 2}px;`}
											fill={color}
										/>
									{/each}
								</span>
							</Badge>
						{/each}
					</div>
				</Dialog.Title>

				<Dialog.Description class=" w-full h-full ">
					<NotePage {note}></NotePage>
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{/if}
