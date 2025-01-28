<script lang="ts">
	import { onMount } from "svelte";
	import { cn } from "$lib/utils.js";
	import type { Readable } from "svelte/store";
	import StarterKit from "@tiptap/starter-kit";
	import cx from "clsx";
	import {
		Editor,
		EditorContent,
		createEditor,
		BubbleMenu,
	} from "svelte-tiptap";

	let editor: Readable<Editor> = $state();
	
	interface Props {
		class?: $$Props["class"];
		content?: string;
	}

	let { class: className = undefined, content = $bindable("") }: Props = $props();

	onMount(() => {
		editor = createEditor({
			extensions: [StarterKit],
			content: content,
			editorProps: {
				attributes: {
					class: cn("w-full h-full px-3", className),
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
</script>

<div class="h-full w-full flex-col">
	{#if editor}
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

		<!-- editor tooltip -->
		<div
			class="flex h-9 w-full items-center space-x-1 rounded-t-md border border-b-0 border-zinc-200 p-2"
		>
			{#each menuItems as item (item.name)}
				<button
					type="button"
					class={cx(
						"h-6 w-6 rounded font-bold hover:bg-zinc-950 hover:text-white",
						{
							"bg-zinc-500 text-white": item.active(),
						},
					)}
					onclick={item.command}
				>
					{item.content}
				</button>
			{/each}
		</div>

		<!-- editor -->
		<div
			class="w-full h-[calc(100%-36px)]
			border border-zinc-200 rounded-b-md max-y-full overflow-y-auto
			dark:prose-invert font-chat
			leading-[1.55rem] prose-headings:my-1 prose-headings:font-bold
			prose-h1:my-2 prose-h1:text-[1.45rem]
			prose-h2:text-[1.35rem] prose-h3:text-[1.17rem] prose-p:my-1.5 prose-p:text-[1rem]
			prose-p:font-normal"
		>
			<EditorContent editor={$editor} />
		</div>
	{/if}
</div>
