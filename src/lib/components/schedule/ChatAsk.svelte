<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Button } from '$ui';
	import { Bookmark, Bot, BotMessageSquare, EllipsisVertical, Send, X } from 'lucide-svelte';
	import { currentTime, formatTimeFull } from '$store';
	$: currentTimeDisplay = formatTimeFull($currentTime);
	export let askMsg = {
		content: '배포할 때 yarn_version이 왜 문제였을까.',
		ask: true,
		question: true,
		answer: false,
		open: false
	};

	let messages = [
		{
			content:
				'yarn_version이 문제가 되는 이유는 프로젝트에서 사용하는 Yarn 버전과 배포 환경에서 사용하는 Yarn 버전이 일치하지 않을 때 발생할 수 있습니다.',
			ask: true,
			question: false,
			answer: true,
			save: true,
			time: 'AM 10:32',
			day: '2023-06-08'
		},
		{
			content: '그럼 배포 환경에서 Yarn 버전을 어떻게 맞출 수 있을까요?',
			ask: true,
			question: true,
			answer: false,
			save: false,
			time: 'AM 10:35',
			day: '2023-06-08'
		},
		{
			content:
				'프로젝트 루트 디렉토리에 `.yarnrc` 파일을 생성하고, 원하는 Yarn 버전을 지정할 수 있습니다. 예를 들어, `yarn-version "1.22.0"`과 같이 설정하면 해당 버전의 Yarn을 사용하게 됩니다.',
			ask: true,
			question: false,
			answer: true,
			save: true,
			time: 'AM 10:37',
			day: '2023-06-08'
		},
		{
			content: '`.yarnrc` 파일을 사용하면 팀원들 모두 동일한 Yarn 버전을 사용할 수 있겠네요.',
			ask: true,
			question: true,
			answer: false,
			save: true,
			time: 'AM 10:40',
			day: '2023-06-08'
		},
		{
			content:
				'맞습니다. `.yarnrc` 파일을 프로젝트에 포함시키면 팀원들 간에 Yarn 버전을 일관되게 유지할 수 있어 버전 불일치로 인한 문제를 방지할 수 있습니다.',
			ask: true,
			question: false,
			answer: true,
			save: false,
			time: 'AM 10:42',
			day: '2023-06-08'
		}
	];

	let messageContainer: HTMLDivElement;
	let askMsgHeight = 0;

	let newMsg = {
		content: '',
		ask: true,
		question: true,
		answer: false,
		save: false
	};

	onMount(() => {
		if (askMsg.open) {
			scrollToBottom();
		}
	});

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		if (newMsg.content.trim() === '') return;
		messages = [...messages, { ...newMsg, time: currentTimeDisplay }];
		newMsg = {
			content: '',
			ask: true,
			question: true,
			answer: false,
			save: false
		};
		await tick(); // DOM 업데이트를 기다림
		scrollToBottom();
	}

	function scrollToBottom() {
		if (messageContainer) messageContainer.scrollTop = messageContainer.scrollHeight;
	}
</script>

{#if askMsg.open}
	<div class="h-full w-full">
		<!-- top: record info -->
		<div
			class="flex h-10 w-full items-center justify-between rounded-lg rounded-b-none bg-emerald-500 px-2 text-white shadow"
		>
			<Button variant="ghost" class="h-6 p-1 hover:bg-emerald-600">
				<EllipsisVertical size={20} />
			</Button>

			<div class="flex translate-y-0.5 text-[1.1rem]">Q&A</div>
			<Button
				variant="ghost"
				class="h-6 p-1 hover:bg-emerald-600"
				on:click={() => (askMsg.open = false)}
			>
				<X size={20} />
			</Button>
		</div>

		<!-- body -->
		<div
			bind:this={messageContainer}
			class="h-full max-h-[calc(100%-120px)] w-full flex-col space-y-2 overflow-y-auto pb-3"
		>
			<div
				bind:clientHeight={askMsgHeight}
				class="fixed z-10 max-h-[15%] w-full overflow-y-auto border-b-4 border-emerald-600 bg-emerald-50 px-2 py-1 font-mono text-[0.85rem] font-semibold text-emerald-900"
			>
				<BotMessageSquare class="mx-0.5 inline-block" />
				{askMsg.content}
			</div>
			<div style="height: {askMsgHeight}px;"></div>
			{#each messages as msg, i}
				{#if i === 0 || msg.day !== messages[i - 1].day}
					<hr class="bg-zinc-100 p-0.5" />
					<div
						class="mx-20 mt-4 w-auto rounded-full bg-zinc-100 text-center font-mono text-xs font-normal text-zinc-500 shadow"
					>
						{msg.day}
					</div>
				{/if}

				{#if msg.answer}
					<div class="flex items-end justify-start space-y-1 px-3">
						<!-- msg content -->
						<div class="relative flex max-w-[80%]">
							<div class="time absolute -right-14 bottom-1">
								{msg.time}
							</div>
							<Button
								variant="ghost"
								class="absolute left-0 top-0.5 h-6 p-1 hover:bg-zinc-200"
								on:click={() => (msg.save = !msg.save)}
							>
								{#if msg.save}
									<Bookmark size={16} color="#52525b" fill="#10b981" />
								{:else}
									<Bookmark size={16} color="#52525b" />
								{/if}
							</Button>
							<div
								class=" font-chat w-full rounded-lg rounded-l-none py-1 pl-6 pr-2 text-[1.05rem] font-normal leading-6 text-zinc-800 shadow-sm shadow-emerald-300"
							>
								{msg.content}
							</div>
						</div>
					</div>
				{:else}
					<div class="flex items-end justify-end space-y-1 px-2">
						<div class="time pr-2 text-end">
							{msg.time}
						</div>
						<div class="relative flex max-w-[80%]">
							<Button
								variant="ghost"
								class="absolute left-0 top-0.5 h-6 p-1 hover:bg-zinc-200"
								on:click={() => (msg.save = !msg.save)}
							>
								{#if msg.save}
									<Bookmark size={16} color="#52525b" fill="#fde047" />
								{:else}
									<Bookmark size={16} color="#52525b" />
								{/if}
							</Button>
							<div
								class=" font-chat w-full rounded-lg rounded-l-none py-1 pl-6 pr-2 text-[1.05rem] font-normal leading-6 text-zinc-800 shadow-sm shadow-emerald-300"
							>
								{msg.content}
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- foot: send message -->
		<div class="flex h-20 w-full items-center rounded-lg rounded-t-none bg-emerald-500 p-1">
			<div class="font-digital h-full w-12 flex-col">
				<Button
					variant="ghost"
					class="h-1/2 px-2  hover:bg-emerald-50"
					on:click={() => (newMsg.save = !newMsg.save)}
				>
					{#if newMsg.save}
						<Bookmark fill="#facc15" />
					{:else}
						<Bookmark color="white" />
					{/if}
				</Button>

				<Button variant="ghost" disabled class="chat h-1/2 -translate-y-1  px-2">
					<Bot fill="white" color="#022c22" />
				</Button>
			</div>
			<form on:submit|preventDefault={handleSubmit} class="relative h-full w-full">
				<textarea
					bind:value={newMsg.content}
					on:keydown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleSubmit(e);
						}
					}}
					placeholder="Send message"
					class="font-chat h-full w-full rounded-lg p-2 text-[1.06rem] leading-5"
				></textarea>
				<Button
					variant="ghost"
					type="submit"
					class="absolute bottom-0 right-0 z-10 p-2 hover:bg-zinc-100"
					><Send color="#71717a" /></Button
				>
			</form>
		</div>
	</div>
{/if}

<style>
	.time {
		@apply w-[50px] translate-y-1 scale-90 font-mono text-xs font-light text-zinc-400;
	}
</style>
