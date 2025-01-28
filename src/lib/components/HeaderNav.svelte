<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { preloadData } from "$app/navigation";
	import { page } from "$app/state";
	import { writable } from "svelte/store";
	import { Button } from "$ui";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";

	// 스토어 선언
	const backStack = writable<string[]>([]); // 이전 경로 저장
	const forwardStack = writable<string[]>([]); // 다음 경로 저장
	const navClicked = writable(false); // 네비게이션 클릭 상태 관리

	afterNavigate(({ from, to }) => {
		if (!from) return; // 외부에서 들어온 경우 `from`이 null이므로 처리하지 않음

		// `navClicked`가 true라면 스택 저장을 하지 않음
		navClicked.update((clicked) => {
			if (clicked) {
				navClicked.set(false);
				return clicked;
			}

			// 이전 경로를 `backStack`에 추가, `forwardStack` 초기화
			backStack.update((stack) => [...stack, from.url.pathname]);
			forwardStack.set([]);
			return clicked;
		});
	});

	function preloadPage(stack: string[]) {
		if (stack.length === 0) return;
		preloadData(stack[stack.length - 1]);
	}

	function navigateBack() {
		backStack.update((stack) => {
			if (stack.length === 0) return stack;

			const currPage = page.url.pathname;
			const newStack = stack.slice(0, -1); // 마지막 아이템 제거
			forwardStack.update((forward) => [...forward, currPage]); // 현재 경로를 forwardStack에 추가
			history.back(); // 브라우저 뒤로가기
			return newStack;
		});
		navClicked.set(true); // 클릭 상태를 업데이트
	}

	function navigateForward() {
		forwardStack.update((stack) => {
			if (stack.length === 0) return stack;

			const currPage = page.url.pathname;
			const newStack = stack.slice(0, -1); // 마지막 아이템 제거
			backStack.update((back) => [...back, currPage]); // 현재 경로를 backStack에 추가
			history.forward(); // 브라우저 앞으로 가기
			return newStack;
		});
		navClicked.set(true); // 클릭 상태를 업데이트
	}
</script>

<div class="w-12 h-6 flex justify-between space-x-1">
	<!-- 이전 페이지 버튼 -->
	<Button
		class="w-6 h-6 !p-0 "
		variant="outline"
		onmouseover={() => $backStack.length && preloadPage($backStack)}
		onclick={navigateBack}
		disabled={$backStack.length === 0}
	>
		<ChevronLeft size={20} />
	</Button>

	<!-- 다음 페이지 버튼 -->
	<Button
		class="w-6 h-6 !p-0 "
		variant="outline"
		onmouseover={() => $forwardStack.length && preloadPage($forwardStack)}
		onclick={navigateForward}
		disabled={$forwardStack.length === 0}
	>
		<ChevronRight size={20} />
	</Button>
</div>

<style>
</style>
