<script lang="ts">
	import { preventDefault } from "svelte/legacy";

	import { onDestroy, onMount, tick } from "svelte";
	import { Button, Popover } from "$ui";
	import {
		BookMarked,
		Bookmark,
		Bot,
		BotMessageSquare,
		Send,
		X,
	} from "lucide-svelte";
	import { currentTime, formatTimeFull, formatDay } from "$store";

	let {
		askMsg = $bindable({
			content: "배포할 때 yarn_version이 왜 문제였을까.",
			ask: true,
			question: true,
			answer: false,
			open: false,
		}),
	} = $props();

	let messages = $state([
		{
			content:
				"yarn_version이 문제가 되는 이유는 프로젝트에서 사용하는 Yarn 버전과 배포 환경에서 사용하는 Yarn 버전이 일치하지 않을 때 발생할 수 있습니다.",
			ask: true,
			question: false,
			answer: true,
			save: true,
			time: "AM 10:32",
			day: "2024-04-19",
		},
		{
			content: "그럼 배포 환경에서 Yarn 버전을 어떻게 맞출 수 있을까요?",
			ask: true,
			question: true,
			answer: false,
			save: false,
			time: "AM 10:35",
			day: "2024-04-19",
		},
		{
			content:
				'프로젝트 루트 디렉토리에 `.yarnrc` 파일을 생성하고, 원하는 Yarn 버전을 지정할 수 있습니다. 예를 들어, `yarn-version "1.22.0"`과 같이 설정하면 해당 버전의 Yarn을 사용하게 됩니다.',
			ask: true,
			question: false,
			answer: true,
			save: true,
			time: "AM 10:37",
			day: "2024-04-19",
		},
		{
			content:
				"`.yarnrc` 파일을 사용하면 팀원들 모두 동일한 Yarn 버전을 사용할 수 있겠네요.",
			ask: true,
			question: true,
			answer: false,
			save: true,
			time: "AM 10:40",
			day: "2024-04-19",
		},
		{
			content:
				"맞습니다. `.yarnrc` 파일을 프로젝트에 포함시키면 팀원들 간에 Yarn 버전을 일관되게 유지할 수 있어 버전 불일치로 인한 문제를 방지할 수 있습니다.",
			ask: true,
			question: false,
			answer: true,
			save: false,
			time: "AM 10:42",
			day: "2024-04-19",
		},
	]);

	let messageContainer: HTMLDivElement = $state();
	let askMsgHeight = 0;

	let newMsg = $state({
		content: "",
		ask: true,
		question: true,
		answer: false,
		save: false,
	});

	onMount(() => {
		if (askMsg.open) {
			scrollToBottom();
		}
	});

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
	) {
		event.preventDefault();
		if (newMsg.content.trim() === "") return;
		messages = [
			...messages,
			{
				...newMsg,
				time: formatTimeFull($currentTime),
				day: formatDay($currentTime),
			},
		];
		newMsg = {
			content: "",
			ask: true,
			question: true,
			answer: false,
			save: false,
		};
		await tick(); // DOM 업데이트를 기다림
		scrollToBottom();
	}

	function scrollToBottom() {
		if (messageContainer)
			messageContainer.scrollTop = messageContainer.scrollHeight;
	}
</script>

{#if askMsg.open}
	<div class="h-full w-full">
		<!-- top: record info -->
		<div
			class="flex h-10 w-full items-center justify-between rounded-lg rounded-b-none bg-emerald-500 px-2 text-white shadow"
		>
			<!-- show bookmark list -->
			<Popover.Root>
				<Popover.Trigger>
					<Button
						variant="ghost"
						class="h-6 p-1 hover:bg-emerald-600 translate-y-0.5"
					>
						<BookMarked size={20} />
					</Button>
				</Popover.Trigger>
				<Popover.Content
					class="max-h-[calc(100%-60px)] w-1/4 max-w-[300px] -translate-x-5 translate-y-8 overflow-y-auto px-3 pt-0 "
					side="left"
					avoidCollisions={false}
				>
					<div class="flex-col items-center justify-between pt-1">
						<div
							class="sticky top-0 bg-white flex items-center justify-between mb-2 h-8 border-b-2"
						>
							<h4 class="font-bold">Bookmarked</h4>
							<Popover.Close>
								<Button
									variant="ghost"
									class="h-6 p-1 hover:bg-neutral-200 translate-y-0.5 "
									><X color="#a1a1aa" />
								</Button>
							</Popover.Close>
						</div>
						<div class="flex-col space-y-2">
							{#each messages as msg}
								{#if msg.save}
									<div
										class="flex items-start justify-start space-x-1 border-b border-dashed"
									>
										<Button
											variant="ghost"
											class="h-6 p-1 "
											onclick={() =>
												(msg.save = !msg.save)}
										>
											{#if msg.answer}
												<Bookmark
													size={20}
													color="#52525b"
													fill="#10b981"
												/>
											{:else}
												<Bookmark
													size={20}
													color="#52525b"
													fill="#facc15"
												/>
											{/if}
										</Button>
										<div
											class="text-[0.8rem] font-semibold text-start text-ellipsis line-clamp-3"
										>
											{msg.content}
										</div>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				</Popover.Content>
			</Popover.Root>

			<div class="flex translate-y-0.5 text-[1.1rem]">Q&A</div>
			<Button
				variant="ghost"
				class="h-6 p-1 hover:bg-emerald-600"
				onclick={() => (askMsg.open = false)}
			>
				<X size={20} />
			</Button>
		</div>

		<!-- body -->
		<div
			bind:this={messageContainer}
			class="h-full max-h-[calc(100%-120px)] w-full flex-col space-y-2 overflow-y-auto pr-1 pb-3"
		>
			<div
				class="sticky top-0 z-10 p-1 max-h-[18%] w-full overflow-y-auto border-b-4 border-emerald-600 bg-emerald-50 px-2 py-1 font-mono text-[0.85rem] font-semibold text-emerald-900"
			>
				<BotMessageSquare class="mx-0.5 inline-block" />
				{askMsg.content}
			</div>
			{#each messages as msg, i}
				{#if i === 0 || msg.day !== messages[i - 1].day}
					<div class="bg-neutral-100 p-0.5 !mt-6"></div>
					<div
						class="mx-20 mt-4 w-auto rounded-full bg-neutral-100 text-center font-mono text-xs font-normal text-neutral-500 shadow"
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
								class="absolute left-0 top-0.5 h-6 p-1 hover:bg-neutral-200"
								onclick={() => (msg.save = !msg.save)}
							>
								{#if msg.save}
									<Bookmark
										size={16}
										color="#52525b"
										fill="#10b981"
									/>
								{:else}
									<Bookmark size={16} color="#52525b" />
								{/if}
							</Button>
							<div
								class=" font-chat w-full rounded-lg rounded-l-none py-1 pl-6 pr-2 text-[1rem] font-normal leading-6 text-neutral-800 shadow-sm shadow-emerald-300"
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
								class="absolute left-0 top-0.5 h-6 p-1 hover:bg-neutral-200"
								onclick={() => (msg.save = !msg.save)}
							>
								{#if msg.save}
									<Bookmark
										size={16}
										color="#52525b"
										fill="#fde047"
									/>
								{:else}
									<Bookmark size={16} color="#52525b" />
								{/if}
							</Button>
							<div
								class=" font-chat w-full rounded-lg rounded-l-none py-1 pl-6 pr-2 text-[1rem] font-normal leading-6 text-neutral-800 shadow-sm shadow-yellow-300"
							>
								{msg.content}
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- foot: send message -->
		<div
			class="flex h-20 w-full items-center rounded-lg rounded-t-none bg-emerald-500 p-1"
		>
			<div class="font-digital h-full w-12 flex-col">
				<Button
					variant="ghost"
					class="h-1/2 px-2  hover:bg-emerald-600"
					onclick={() => (newMsg.save = !newMsg.save)}
				>
					{#if newMsg.save}
						<Bookmark fill="#facc15" />
					{:else}
						<Bookmark color="white" />
					{/if}
				</Button>

				<Button
					variant="ghost"
					disabled
					class="chat h-1/2 -translate-y-1  px-2"
				>
					<Bot fill="white" color="#022c22" />
				</Button>
			</div>
			<form
				onsubmit={preventDefault(handleSubmit)}
				class="relative h-full w-full"
			>
				<textarea
					bind:value={newMsg.content}
					onkeydown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
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
					class="absolute bottom-0 right-0 z-10 p-2 hover:bg-neutral-100"
					><Send color="#71717a" /></Button
				>
			</form>
		</div>
	</div>
{/if}

<style>
	.time {
		@apply w-[50px] translate-y-1 scale-90 font-mono text-xs font-light text-neutral-400;
	}
</style>
