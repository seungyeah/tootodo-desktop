<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import StarterKit from '@tiptap/starter-kit';
	import cx from 'clsx';
	import { Editor, EditorContent, createEditor, BubbleMenu } from 'svelte-tiptap';
	import { Button, DropdownMenu, Input } from '$ui';
	import { Eclipse, Pin } from 'lucide-svelte';

	let editor: Readable<Editor>;
	let selectedColor = '#d1d5db';
	let content;

	export let memo = {
		date: '2024-04-21',
		color: 'default',
		title: 'Memo Title',
		content: '',
		pin: true
	};

	onMount(() => {
		selectedColor = colors.find((c) => c.name === memo.color)?.light || colors.find((c) => c.name === 'default')?.light || '#d1d5db' ;

		editor = createEditor({
			extensions: [StarterKit],
			content: memo.content,
			editorProps: {
				attributes: {
					class: 'w-full  h-[122px] py-1 px-3.5 overflow-y-auto focus:outline-none focus:shadow-xl '
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

	//memo color 300,500,700
	let colors = [
		{ name: 'default', normal: '#71717a', light: '#d1d5db', dark: '#3f3f46' },
		{ name: 'rose', normal: '#f43f5e', light: '#fda4af', dark: '#be123c' },
		// { name: 'orange', normal: '#f97316', light: '#fdba74', dark: '#c2410c' },
		{ name: 'violet', normal: '#8b5cf6', light: '#c4b5fd', dark: '#6d28d9' },
		{ name: 'green', normal: '#22c55e', light: '#86efac', dark: '#15803d' },
		{ name: 'blue', normal: '#3b82f6', light: '#93c5fd', dark: '#1d4ed8' },
		{ name: 'fuchsia', normal: '#d946ef', light: '#f0abfc', dark: '#a21caf' }
	];

	$: selectedColor = colors.find((c) => c.name === memo.color)?.light || colors.find((c) => c.name === 'default')?.light || '#d1d5db' ;
</script>

{#if editor}
	<div class="flex-col">
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

		<!-- top, change memo color, pin, created date -->
		<div
			class="relative mt-2 flex h-8 w-full gap-1 rounded-t-md border-2 p-2 shadow-sm"
			style="border-color: {selectedColor}; border-bottom: 0;"
		>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="absolute -right-1.5 -top-1  h-9 -translate-y-1.5 rounded p-0">
					<Button variant="ghost" size="sm" class="h-full rounded  p-0">
						<Eclipse
							size={24}
							fill={colors.find((c) => c.name === memo.color)?.dark}
							color="white"
						/>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="-translate-y-2">
					<DropdownMenu.Group>
						<DropdownMenu.Item on:click={() => (memo.pin = true)}
							><Pin size={16} fill="#e4e4e7" class="mr-2 h-4 w-4" />Set pin</DropdownMenu.Item
						>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Label class="text-center">Set Color</DropdownMenu.Label>
						<DropdownMenu.Item class="grid grid-cols-3 data-[highlighted]:bg-zinc-50">
							{#each colors as color}
								<Button
									class="m-2 h-5 w-5 p-2"
									style={`background-color: ${color.normal};`}
									on:click={() => {
										memo.color = color.name;
									}}
								/>
							{/each}
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			{#if memo.pin}
				<Button variant="ghost" class="h-6 -translate-y-1 p-0" on:click={() => (memo.pin = false)}
					><Pin size={16} fill="#e4e4e7" />
				</Button>
			{/if}

			<input
				type="text"
				bind:value={memo.title}
				class="z-10 h-7 w-[calc(100%-30px)] -translate-y-1 bg-transparent p-1 text-[0.95rem] font-semibold shadow focus-visible:outline-none focus-visible:border-2 focus-visible:rounded "
			/>
		</div>

		<main
			class="font-chat prose relative mb-3 rounded-b-lg
        rounded-r-none border-2 leading-[1.55rem]
        dark:prose-invert prose-headings:my-1 prose-headings:font-bold
        prose-h1:my-2 prose-h1:text-[1.45rem]
        prose-h2:text-[1.35rem] prose-h3:text-[1.17rem] prose-p:my-1.5 prose-p:text-[1.1rem]
        prose-p:font-normal"
			style="border-color: {selectedColor}; border-top: 0;"
		>
			<div
				class=" absolute -right-[2.1rem] top-5 w-[88px] rotate-90 px-1.5 font-mono text-xs font-light"
				style="color: {selectedColor};"
			>
				{memo.date}
			</div>

			<EditorContent editor={$editor} />
		</main>
	</div>
{/if}
