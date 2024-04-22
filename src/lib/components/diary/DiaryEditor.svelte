<script lang="ts">
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import StarterKit from '@tiptap/starter-kit';
	import cx from 'clsx';
	import { Editor, EditorContent, createEditor, BubbleMenu } from 'svelte-tiptap';

	let editor: Readable<Editor>;
	export let content = 'how are you today';

	onMount(() => {
		editor = createEditor({
			extensions: [StarterKit],
			content: content,
			editorProps: {
				attributes: {
					class:
						'w-full h-[calc(100vh-422px)] sm:h-[calc(100vh-384px)] border-2 border-zinc-700 rounded-b-md p-3 outline-none overflow-y-auto'
				}
			}
		});
		$editor.on('update', ({ editor }) => {
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

	$: isActive = (name: string, attrs = {}) => $editor.isActive(name, attrs);

	$: menuItems = [
		{
			name: 'heading-1',
			command: toggleHeading(1),
			content: 'H1',
			active: () => isActive('heading', { level: 1 })
		},
		{
			name: 'heading-2',
			command: toggleHeading(2),
			content: 'H2',
			active: () => isActive('heading', { level: 2 })
		},
		{
			name: 'bold',
			command: toggleBold,
			content: 'B',
			active: () => isActive('bold')
		},
		{
			name: 'italic',
			command: toggleItalic,
			content: 'I',
			active: () => isActive('italic')
		},
		{
			name: 'paragraph',
			command: setParagraph,
			content: 'P',
			active: () => isActive('paragraph')
		}
	];
</script>

<div class="h-full w-full flex-col">
	{#if editor}
		<BubbleMenu editor={$editor}>
			<div data-test-id="bubble-menu" class="flex">
				<button
					class={cx('bg-black px-2 text-white/90 hover:text-white', {
						'!text-white': isActive('bold')
					})}
					type="button"
					on:click={toggleBold}
				>
					bold
				</button>
				<button
					class={cx('bg-black px-2 text-white/90 hover:text-white', {
						'!text-white': isActive('italic')
					})}
					type="button"
					on:click={toggleItalic}
				>
					italic
				</button>
			</div>
		</BubbleMenu>

		<!-- editor tooltip -->
		<div
			class="flex h-9 w-full items-center space-x-1 rounded-t-md border-2 border-b-0 border-zinc-700 p-2"
		>
			{#each menuItems as item (item.name)}
				<button
					type="button"
					class={cx('h-6 w-6 rounded font-bold hover:bg-zinc-950 hover:text-white', {
						'bg-zinc-700 text-white': item.active()
					})}
					on:click={item.command}
				>
					{item.content}
				</button>
			{/each}
		</div>

		<!-- editor -->
		<div
			class="w-full h-full dark:prose-invert 
			prose-headings:my-2.5 prose-p:my-1.5 
			prose-h1:text-[1.6rem] prose-h2:text-[1.4rem] prose-h3:text-[1.2rem] 
			prose-p:text-[1.1rem] leading-[1.1rem]"
		>
			<EditorContent editor={$editor} />
		</div>
	{/if}
</div>
