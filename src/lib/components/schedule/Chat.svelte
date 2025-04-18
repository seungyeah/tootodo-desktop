<script lang="ts">
	import { run, preventDefault } from "svelte/legacy";

	import { Button, Popover } from "$ui";
	import {
		BookMarked,
		Bookmark,
		Bot,
		CircleArrowOutUpRight,
		Send,
		X,
	} from "lucide-svelte";
	import ChatAsk from "./ChatAsk.svelte";
	import { onDestroy, onMount, tick } from "svelte";
	import { currentTime, formatTimeFull, formatDay } from "$store";

	let askMsg = $state({
		content: "",
		ask: true,
		question: true,
		answer: false,
		open: false,
	});

	let {
		record = $bindable({
			title: "happy",
			openChat: false,
		}),
	} = $props();

	let messages = $state([
		{
			time: "AM 09:15",
			day: "2024-04-19",
			content: "프로젝트 배포 준비를 시작해야겠어.",
			ask: false,
			save: true,
		},
		{
			time: "PM 02:30",
			day: "2024-04-19",
			content: "배포 환경 설정이 생각보다 복잡하네.",
			ask: false,
			save: false,
		},
		{
			time: "PM 05:45",
			day: "2024-04-19",
			content: "배포 스크립트에서 오류가 발생했어. 디버깅이 필요해.",
			ask: true,
			save: true,
		},
		{
			time: "PM 11:20",
			day: "2024-04-19",
			content: "오늘은 배포를 완료하지 못했어. 좀 자야겠다.",
			ask: false,
			save: true,
		},
		{
			time: "AM 10:00",
			day: "2024-04-20",
			content: "배포를 재개했어. 이번에는 잘 되길 바라.",
			ask: false,
			save: false,
		},
		{
			time: "AM 10:32",
			day: "2024-04-20",
			content: "배포 때문에 너무 화났다.",
			ask: false,
			save: true,
		},
		{
			time: "AM 11:15",
			day: "2024-04-20",
			content: "배포가 계속 실패하니 스트레스가 이만저만이 아니야.",
			ask: false,
			save: false,
		},
		{
			time: "PM 01:40",
			day: "2024-04-20",
			content:
				"드디어 배포에 성공했다! 기분이 좋아. 배포할 때 yarn_version이 왜 문제였을까.",
			ask: true,
			save: true,
		},
		{
			time: "PM 03:20",
			day: "2024-04-20",
			content: "배포 후 모니터링 중이야. 안정적으로 작동하는 것 같아.",
			ask: false,
			save: true,
		},
		{
			time: "PM 06:00",
			day: "2024-04-20",
			content:
				"다음 사이드 프로젝트는 반드시 배포관리하시는 분과 함께해야지.",
			ask: false,
			save: true,
		},
	]);
	let messageContainer: HTMLDivElement = $state();
	let chatContainer: HTMLDivElement = $state();

	let newMsg = $state({
		content: "",
		ask: false,
		save: false,
	});

	onMount(() => {
		scrollToBottom();
		if (typeof window !== "undefined")
			document.addEventListener("keydown", handleKeyDown); // keydown 이벤트 리스너 추가
	});

	// 컴포넌트가 파괴될 때 이벤트 리스너 제거
	onDestroy(() => {
		if (typeof window !== "undefined")
			document.removeEventListener("keydown", handleKeyDown); // keydown 이벤트 리스너 제거
	});

	// 키보드 이벤트 리스너를 처리하는 함수
	function handleKeyDown(event) {
		if (event.key === "Escape" || event.key === "Esc") {
			// Esc 버튼이 눌렸을 때, openChat을 false로 변경
			record.openChat = false;
		}
	}

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
			ask: false,
			save: false,
		}; // 메시지를 추가한 후 입력 필드 초기화
		await tick(); // DOM 업데이트를 기다림
		scrollToBottom();
	}

	function scrollToBottom() {
		if (messageContainer)
			messageContainer.scrollTop = messageContainer.scrollHeight;
	}

	run(() => {
		askMsg;
	});
</script>

<div class="h-full w-full" bind:this={chatContainer}>
	<!-- top: record info -->
	<div
		class="flex h-10 w-full items-center justify-between rounded-lg rounded-b-none border-b-2 border-yellow-300 bg-yellow-200 px-2 text-yellow-950 shadow"
	>
		<!-- show bookmark list -->
		<Popover.Root>
			<Popover.Trigger>
				<Button
					variant="ghost"
					class="h-6 translate-y-1 p-1 hover:bg-yellow-400"
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
						class="sticky top-0 mb-2 flex h-8 items-center justify-between border-b-2 bg-white"
					>
						<h4 class="font-bold">Bookmarked</h4>
						<Popover.Close>
							<Button
								variant="ghost"
								class="h-6 translate-y-0.5 p-1 hover:bg-neutral-200 "
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
										onclick={() => (msg.save = !msg.save)}
									>
										{#if msg.ask}
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
										class="line-clamp-3 text-ellipsis text-start text-[0.8rem] font-semibold"
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

		<!-- record info -->
		<div class="p-1 text-[1.05rem]">{record.title}</div>

		<!-- close button -->
		<Button
			variant="ghost"
			class="h-6 p-1 hover:bg-yellow-400"
			onclick={() => (record.openChat = false)}
		>
			<X size={20} />
		</Button>
	</div>

	<!-- body -->
	<div
		bind:this={messageContainer}
		class="h-full max-h-[calc(100%-120px)] w-full flex-col space-y-2 overflow-y-auto px-1 pb-3"
	>
		{#each messages as msg, i}
			{#if i === 0 || msg.day !== messages[i - 1].day}
				<div class="bg-neutral-100 p-0.5 !mt-6"></div>
				<div
					class="mx-20 w-auto rounded-full bg-neutral-100 text-center font-mono text-xs font-normal text-neutral-500 shadow"
				>
					{msg.day}
				</div>
			{/if}

			{#if msg.ask}
				<div class="flex items-end justify-start space-y-1 px-2">
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
						<div class="relative px-2">
							<div
								class="time absolute -right-11 bottom-1 text-start text-[0.63rem]"
							>
								{msg.time}
							</div>
							<Button
								variant="ghost"
								class="absolute bottom-0 right-1 h-6 w-6 p-1 hover:bg-neutral-100"
								onclick={() => {
									if (msg.content !== askMsg.content) {
										askMsg = {
											...askMsg,
											content: msg.content,
											open: true,
										};
									} else {
										askMsg = {
											...askMsg,
											open: !askMsg.open,
										};
									}
								}}
							>
								<CircleArrowOutUpRight
									size={18}
									color="#059669"
									strokeWidth={2.5}
								/>
							</Button>
						</div>
					</div>
				</div>
			{:else}
				<div class="flex items-end justify-end space-y-1 px-2">
					<div
						class="time translate-y-0.5 px-1.5 text-end text-[0.63rem]"
					>
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
		class="flex h-20 w-full items-center rounded-lg rounded-t-none bg-yellow-200 p-1"
	>
		<div class="font-digital h-full w-12 flex-col">
			<Button
				variant="ghost"
				class="h-1/2 px-2  hover:bg-yellow-50"
				onclick={() => (newMsg.save = !newMsg.save)}
			>
				{#if newMsg.save}
					<Bookmark fill="#facc15" />
				{:else}
					<Bookmark />
				{/if}
			</Button>

			<Button
				variant="ghost"
				class="chat h-1/2 -translate-y-1  px-2 hover:bg-emerald-50"
				onclick={() => (newMsg.ask = !newMsg.ask)}
			>
				{#if newMsg.ask}<Bot fill="#10b981" />
				{:else}<Bot />
				{/if}
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

	{#if askMsg.open}
		<div class="chat" style="transform:translate(105%,-100%)">
			<ChatAsk bind:askMsg />
		</div>
	{/if}
</div>

<style>
	.chat {
		@apply fixed z-50 h-[calc(100vh-120px)] w-full  min-w-[250px] rounded-lg  bg-neutral-50 shadow-lg shadow-emerald-950 sm:h-[calc(100vh-80px)];
	}

	.time {
		@apply w-[50px] translate-y-1 scale-90 font-mono text-xs font-light text-neutral-400;
	}
</style>
