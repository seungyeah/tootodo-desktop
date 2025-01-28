<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onMount } from "svelte";
	import type { Readable } from "svelte/store";
	import { cn } from "$lib/utils.js";
	import StarterKit from "@tiptap/starter-kit";
	import cx from "clsx";
	import {
		Editor,
		EditorContent,
		createEditor,
		BubbleMenu,
	} from "svelte-tiptap";
	import { Button, DropdownMenu } from "$ui";
	import { Eclipse, Pin } from "lucide-svelte";

	
	let editor: Readable<Editor> = $state();
	let selectedColor = $state("#d1d5db");
	let content;

	interface Props {
		class?: $$Props["class"];
		memo?: any;
	}

	let { class: className = undefined, memo = $bindable({
		date: "2024-04-21",
		color: "default",
		title: "Memo Title",
		content: "",
		pin: true,
	}) }: Props = $props();

	onMount(() => {
		selectedColor =
			colors.find((c) => c.name === memo.color)?.light || "#d1d5db";

		editor = createEditor({
			extensions: [StarterKit],
			content: memo.content,
			editorProps: {
				attributes: {
					class: cn(
						"h-[120px] min-h-[120px] max-h-[300px] max-w-full min-w-full w-full h-full px-3 overflow-scroll no-scrollbar focus:outline-none focus:shadow-xl",
						className,
					),
				},
			},
		});
		$editor.on("update", ({ editor }) => {
			content = JSON.stringify(editor.getJSON(), null, 2);
		});
	});

	const toggleHeading = (level: 1 | 2) => {
		return () => {
			$editor.chain().focus().toggleHeading({ level }).run();
		};
	};

	const toggleBold = () => {
		$editor.chain().focus().toggleBold().run();
	};

	const toggleItalic = () => {
		$editor.chain().focus().toggleItalic().run();
	};

	const setParagraph = () => {
		$editor.chain().focus().setParagraph().run();
	};

	let isActive = $derived((name: string, attrs = {}) => $editor.isActive(name, attrs));

	let menuItems = $derived([
		{
			name: "heading-1",
			command: toggleHeading(1),
			content: "H1",
			active: () => isActive("heading", { level: 1 }),
		},
		{
			name: "heading-2",
			command: toggleHeading(2),
			content: "H2",
			active: () => isActive("heading", { level: 2 }),
		},
		{
			name: "bold",
			command: toggleBold,
			content: "B",
			active: () => isActive("bold"),
		},
		{
			name: "italic",
			command: toggleItalic,
			content: "I",
			active: () => isActive("italic"),
		},
		{
			name: "paragraph",
			command: setParagraph,
			content: "P",
			active: () => isActive("paragraph"),
		},
	]);

	//memo color 300,500,700
	let colors = [
		{ name: "default", normal: "#f59e0b", light: "#fcd34d", dark: "#b45309" },
		{ name: "rose", normal: "#f43f5e", light: "#fda4af", dark: "#be123c" },
		// { name: 'orange', normal: '#f97316', light: '#fdba74', dark: '#c2410c' },
		{ name: "violet", normal: "#8b5cf6", light: "#c4b5fd", dark: "#6d28d9" },
		{ name: "green", normal: "#22c55e", light: "#86efac", dark: "#15803d" },
		{ name: "blue", normal: "#3b82f6", light: "#93c5fd", dark: "#1d4ed8" },
		{ name: "fuchsia", normal: "#d946ef", light: "#f0abfc", dark: "#a21caf" },
	];

	run(() => {
		selectedColor =
			colors.find((c) => c.name === memo.color)?.light || "#d1d5db";
	});
</script>

{#if editor}
	<div class="w-full  my-1">
		<BubbleMenu editor={$editor}>
			<div data-test-id="bubble-menu" class="flex">
				<button
					class={cx("bg-black px-2 text-white/90 hover:text-white", {
						"!text-white": isActive("bold"),
					})}
					type="button"
					onclick={toggleBold}
				>
					bold
				</button>
				<button
					class={cx("bg-black px-2 text-white/90 hover:text-white", {
						"!text-white": isActive("italic"),
					})}
					type="button"
					onclick={toggleItalic}
				>
					italic
				</button>
			</div>
		</BubbleMenu>

		<!-- top, change memo color, pin, created date -->
		<div
			class="relative flex w-full h-8 gap-1 p-2 border-2 border-double shadow-sm rounded-t-md"
			style="border-color: {selectedColor}; border-bottom: 0;"
		>		
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class="z-10 absolute -right-[0.6rem] -top-1  h-9 -translate-y-1.5 rounded p-0"
				>
					<Button
						variant="ghost"
						size="sm"
						class="h-full px-1 py-0 rounded-full hover:bg-zinc-50 "
					>
						<Eclipse
							size={24}
							fill={colors.find((c) => c.name === memo.color)?.dark}
							color="white"
						/>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="-translate-y-2">
					<DropdownMenu.Group>
						<DropdownMenu.Item onclick={() => (memo.pin = true)}
							><Pin size={16} fill="#e4e4e7" class="w-4 h-4 mr-2" />Set
							pin</DropdownMenu.Item
						>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Label class="text-center"
							>Set Color</DropdownMenu.Label
						>
						<DropdownMenu.Item
							class="grid grid-cols-3 data-[highlighted]:bg-zinc-50"
						>
							{#each colors as color}
								<Button
									class="w-5 h-5 p-2 m-2"
									style={`background-color: ${color.normal};`}
									onclick={() => {
										memo.color = color.name;
									}}
								/>
							{/each}
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			{#if memo.pin}
				<Button
					variant="ghost"
					class="h-6 p-0 -translate-y-1"
					onclick={() => (memo.pin = false)}
					><Pin size={16} fill="#e4e4e7" />
				</Button>
			{/if}

			<input
				type="text"
				bind:value={memo.title}
				class="z-10 h-7 w-[calc(100%-30px)] -translate-y-1.5 bg-transparent p-1 text-[0.85rem] font-semibold focus-visible:outline-none focus-visible:border-2 focus-visible:rounded"
			/>
		</div>

		<main
			class="font-chat relative rounded-b-lg -translate-y-1.5 pt-1 w-full
				rounded-r-none border-2 border-double leading-[1.3rem]
				dark:prose-invert prose-headings:my-1 prose-headings:font-bold
				prose-h1:my-2 prose-h1:text-[1.45rem]
				prose-h2:text-[1.35rem] prose-h3:text-[1.17rem] prose-p:my-1.5 prose-p:text-[1rem]
				prose-p:font-normal"
			style="border-color: {selectedColor}; border-top: 0;"
		>
			<div
				class=" absolute -right-[2.1rem] top-6 w-[88px] rotate-90 px-1.5 font-mono text-xs font-light"
				style="color: {selectedColor};"
			>
				{memo.date}
			</div>

			<EditorContent editor={$editor}/>
		</main>
	</div>
{/if}
