<script lang="ts">
	import ShowPromptIcon from "./ShowPromptIcon.svelte";

	import ShowSummaryIcon from "./ShowSummaryIcon.svelte";

	import ShowBookMarkIcon from "./ShowBookMarkIcon.svelte";

	import { Button, Popover, ScrollArea, Resizable, Switch, Label } from "$ui";
	import {
		BookMarked,
		CirclePlus,
		Bookmark,
		CircleArrowOutUpRight,
		Dumbbell,
		Globe,
		Pill,
		Star,
		Sun,
		BotMessageSquare,
		Bot,
	} from "lucide-svelte";
	import ChatAsk from "./ChatAsk.svelte";
	import { onDestroy, onMount, tick } from "svelte";
	import { currentTime, formatTimeFull, formatDay } from "$store";
	import { cn } from "$lib/utils";
	import ChatOptions from "./ChatOptions.svelte";
	let askMsg = $state({
		content: "",
		ask: true,
		question: true,
		answer: false,
		open: false,
	});

	let askMode;
	let { taskTree = [], record = {
		title: "happy",
		openChat: false,
	} } = $props();

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
	let chatContainer: HTMLDivElement;

	let newMsg = $state({
		content: "",
		ask: false,
		save: false,
	});

	onMount(() => {
		scrollToBottom();
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
			ask: false,
			save: false,
		};
		await tick(); // DOM 업데이트를 기다림
		scrollToBottom();
	}	

	function scrollToBottom() {
		if (messageContainer)
			messageContainer.scrollTop = messageContainer.scrollHeight;
	}

	let todayHabits = [
		{
			id: 0,
			icon: Sun,
			title: "wake up",
			done: true,
			doneTime: new Date("Fri Apr 26 2024 10:20:30 GMT+0900 (한국 표준시)"),
		},
		{ id: 3, icon: Pill, title: "take pills", done: false, doneTime: "" },
		{
			id: 4,
			icon: Globe,
			title: "learn foreign language",
			done: false,
			doneTime: "",
		},
		{
			id: 6,
			icon: Dumbbell,
			title: "workout",
			done: true,
			doneTime: new Date("Fri Apr 26 2024 1:50:30 GMT+0900 (한국 표준시)"),
		},
	]

	function handleAskClick() {
		if (msg.content !== askMsg.content) {
			askMsg = { ...askMsg, content: msg.content, open: true };
		} else {
			askMsg = { ...askMsg, open: !askMsg.open };
		}
	}
</script>

<div
	class="relative flex flex-col justify-between h-full bg-white shadow rounded-xl m-2 border-zinc-500"
>
	<Resizable.PaneGroup
		direction="vertical"
		class="flex justify-center w-full py-1 space-x-2  shadow rounded-t-xl rounded-b-xl shadow-zinc-500 border-t-2 border-r-2 border-zinc-500 border-double"
	>
		<Resizable.Pane minSize={14} class="relative px-1">
			<div
				bind:this={messageContainer}
				class="h-full max-h-[calc(100%-8px)] w-full flex-col space-y-1 overflow-y-auto px-1 pb-3 bg-pomodoro-50/50 rounded-lg"
			>
				{#each messages as msg, i}
					<!-- 하루의 첫 대화 위엔 날짜 표시 -->
					{#if i === 0 || msg.day !== messages[i - 1].day}
						<div
							class="flex justify-center w-full h-8 m-auto my-2 "
						>
							<div
								class="w-1/2 h-5 my-1.5 font-mono text-xs font-normal text-center border-b  rounded-full text-zinc-500 bg-pomodoro-50"
							>
								{msg.day}
							</div>
						</div>
					{/if}

					<!-- msg -->
					<div
						class="flex items-end px-2 py-0.5 space-y-1 {msg.ask
							? 'justify-start'
							: 'justify-end'}"
					>
						{#if !msg.ask}
							<div
								class="time translate-y-0.5 px-1.5 text-end text-[0.63rem]"
							>
								{msg.time}
							</div>
						{/if}

						<div class="relative flex max-w-[90%]">
							<Button
								variant="ghost"
								class={cn(
									"absolute top-0.5 h-6 p-1 hover:bg-zinc-200",
									msg.ask ? "left-0" : "right-0",
								)}
								onclick={() => (msg.save = !msg.save)}
							>
								<Bookmark
									size={16}
									color="#52525b"
									fill={msg.save
										? msg.ask
											? "#05966980"
											: "#d92b3a80"
										: "none"}
								/>
							</Button>

							<div
								class="bg-white/90 font-chat w-full rounded-lg py-1 px-2 text-[0.9rem] font-normal leading-5 text-zinc-800 border-b border-dotted {msg.ask
									? 'border-emerald-700 border-r rounded-l-none !rounded-b-lg pl-6'
									: 'border-zinc-400 border-l rounded-r-none rounded-t-lg pr-6'}"
							>
								{msg.content}
							</div>

							{#if msg.ask}
								<div class="relative px-2">
									<div
										class="time absolute -right-11 bottom-1 text-start text-[0.63rem]"
									>
										{msg.time}
									</div>
									<Button
										variant="ghost"
										class="absolute bottom-0 w-6 h-6 p-1 right-0.5 hover:bg-zinc-100"
										onclick={handleAskClick}
									>
										<CircleArrowOutUpRight
											size={18}
											color="#059669"
											strokeWidth={2.5}
										/>
									</Button>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</Resizable.Pane>

		<Resizable.Handle
			withHandle
			class="-translate-x-2 bg-zinc-00 h-3 border border-zinc-600"
		/>

		<Resizable.Pane minSize={20} defaultSize={20} class="w-full p-1 !m-0">
			<div
				class="w-full px-2 h-8 bg-zinc-50 flex justify-between items-center"
			>
				<Label for="bookmark-mode" class="absolute left-[15px] z-10"
					><Bookmark size={10} class="text-color-500" /></Label
				>
				<Switch
					id="bookmark-mode"
					onclick={() => (newMsg.save = !newMsg.save)}
					class="w-8 h-5 data-[state=checked]:bg-pomodoro-500/50"
					checked={newMsg.save}
				/>

				<Label for="ask-mode" class="absolute left-[55px] z-10"
					><Bot size={10} class="text-color-600" /></Label
				>
				<Switch
					id="ask-mode"
					onclick={() => (newMsg.ask = !newMsg.ask)}
					class="w-8 h-5 data-[state=checked]:bg-emerald-600/50"
					checked={newMsg.ask}
				/>

				<!-- todo : task가 선택, habit선택 동시에 불가능(?) -->
				<div
					class="flex items-center justify-center h-8 w-[calc(100%-200px)] max-w-[calc(100%-200px)] overflow-clip"
				>
					<ChatOptions items={taskTree} type={"task"} />
					<ChatOptions items={todayHabits} type={"habit"} />
				</div>

				<div class="flex space-x-2">
					<ShowPromptIcon></ShowPromptIcon>
					<!-- show bookmark list -->
					<ShowBookMarkIcon {messages}></ShowBookMarkIcon>

					<!-- summary -->
					<ShowSummaryIcon ></ShowSummaryIcon>
				</div>
			</div>

			<form
				onsubmit={handleSubmit}
				class="w-full h-full px-1 pt-1 pb-2"
			>
				<textarea
					placeholder="Send message"
					bind:value={newMsg.content}
					onkeydown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							handleSubmit(e);
						}
					}}
					class=" font-chat  rounded-lg h-[calc(100%-24px)] w-full p-2 text-baseas font-normal focus:shadow"
				></textarea>
			</form>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>

<style>
	.chat {
		@apply fixed z-50 h-[calc(100vh-120px)] w-full  min-w-[250px] rounded-lg  bg-zinc-50 shadow-lg shadow-emerald-950 sm:h-[calc(100vh-80px)];
	}

	.time {
		@apply w-[50px] translate-y-1 scale-90 font-mono text-xs font-light text-zinc-400;
	}

		/* scroll bar */
		::-webkit-scrollbar {
		width: 0.5rem;
	}

	::-webkit-scrollbar-track {
		@apply bg-zinc-200/80 rounded-full;
	}

	::-webkit-scrollbar-thumb {
		@apply bg-zinc-400/80 rounded-full;
	}

	::-webkit-scrollbar-thumb:hover {
		@apply bg-zinc-500/80 rounded-full;
	}
</style>
