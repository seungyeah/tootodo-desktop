<script lang="ts">
	import { cn } from "$lib/utils";
	import { Label, Badge, Dialog, Button, ScrollArea, Tabs } from "$ui";
	import Input from "$ui/input/input.svelte";
	import Textarea from "$ui/textarea/textarea.svelte";
	import {
		Circle,
		MessageSquare,
		Text,
		Brush,
		Mic,
		BotMessageSquare,
		Paperclip,
	} from "lucide-svelte";
	export let note;
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
				class="flex flex-col items-start justify-center w-full h-full space-y-1"
			>
				<Label class="line-clamp-1">
					{note.title}
				</Label>

				<div class="flex space-x-1 -translate-x-1">
					{#each note.tags as tag}
						<Badge
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
					class=" p-2 border-b-2 border-zinc-600 border-dashed flex flex-col space-y-2"
				>
					<div class="flex space-x-2 h-7 items-center">
						<Button variant="outline" class="p-2 h-7 shadow"
							>task?.info</Button
						>
						<MessageSquare class="" />
						<div>{note.title}</div>
					</div>
					<div class="flex space-x-1 -translate-x-1">
						<Button
							class="h-[18px] shadow-sm translate-y-0.5 font-mono  px-1.5 py-0 text-base font-medium border rounded-md border-b-zinc-950/30 border-r-zinc-950/30"
							>+</Button
						>
						{#each note.tags as tag}
							<Badge
								class="h-[18px] shadow-sm translate-y-0.5 font-mono  px-1.5 py-0 text-base font-medium border rounded-md border-b-zinc-950/30 border-r-zinc-950/30"
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
				<Dialog.Description class="flex w-full h-full space-x-2 ">
					<div
						class="w-1/5 min-w-[230px] h-full bg-zinc-50 flex justify-between flex-col p-1"
					>
						page toc, treeview

						<div class="flex flex-col bg-white rounded-lg h-15">
							<Tabs.Root value="editor" class="w-full h-8 p-1 pt-[5px] ">
								<Tabs.List
									class="flex space-x-2 p-0 h-7 rounded-b-none"
								>
									<Tabs.Trigger value="editor" class="p-1"
										><Text size={15} /></Tabs.Trigger
									>
									<Tabs.Trigger value="drawings" class="p-1"
										><Brush size={15} /></Tabs.Trigger
									>
									<Tabs.Trigger value="recordings" class="p-1"
										><Mic size={15} /></Tabs.Trigger
									>
									<Tabs.Trigger value="chatbot" class="p-1"
										><BotMessageSquare size={15} /></Tabs.Trigger
									>
									<Tabs.Trigger value="file" class="p-1"
										><Paperclip size={15} /></Tabs.Trigger
									>
								</Tabs.List>
							</Tabs.Root>
							<Input
								class="border-zinc-100"
								placeholder="page title.."
							/>
						</div>
					</div>

					<ScrollArea class="w-full h-[calc(100vh-120px)]  ">
						{#each note.pages as page}
							<div
								class="flex flex-col mb-2 p-2 space-x-1 border rounded-md border-zinc-500"
							>
								<div class="h-7">
									<Badge class="bg-zinc-100">{page.type}</Badge>
									{page.title}
								</div>
								<Textarea
									value={page.content}
									class="h-full min-h-96  font-chat p-2 -translate-x-1"
								/>
							</div>
						{/each}
					</ScrollArea>
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{/if}
