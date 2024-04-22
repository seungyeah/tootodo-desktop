<script lang="ts">
	import { Button, Resizable } from '$ui';
	import DiaryEditor from '$components/diary/DiaryEditor.svelte';
	import { Bed, BookOpenText, Dumbbell, Globe, Pill, Star, Sun, Utensils } from 'lucide-svelte';
	const habits = [
		{ id: 2, icon: Sun },
		{ id: 2, icon: Bed },		
        { id: 1, icon: Utensils },
		{ id: 3, icon: Pill },		
        {id:5, icon:Globe},
        {id:6, icon:BookOpenText},
        { id: 4, icon: Dumbbell },
	];
</script>

<div class="relative h-full w-full flex-col">
	<div
		class="flex h-[32px] translate-y-1.5 border-l-2 border-zinc-700 text-center text-lg font-bold"
	>
		<div class="relative -translate-y-1 translate-x-4">
			{#each Array(5) as _, i}
				<Star size={20} class="absolute" style="transform:translateX({i * 24}px)" />
			{/each}
		</div>
	</div>
	<div
		class="flex h-[38%] w-full translate-y-1 border-l-2 border-zinc-700 p-1 pt-1.5 text-center text-lg font-bold"
	>
		<Resizable.PaneGroup
			direction="horizontal"
			class="m-2 -translate-y-5 rounded-xl border-2 border-double border-zinc-400"
		>
			<Resizable.Pane>task</Resizable.Pane>
			<Resizable.Handle class="bg-zinc-500 p-[1px]" />
			<Resizable.Pane>event</Resizable.Pane>
		</Resizable.PaneGroup>
        
        <!-- habbit -->
		<div class="w-1/4 h-full -translate-y-10">
            <div class="w-full border-b-4 mb-2 border-double border-zinc-200"> Habit </div>
			<div
				class="grid grid-cols-2 gap-1  rounded-lg shadow h-[calc(100%-14px)] max-h-[calc(100%-14px)] overflow-y-scroll no-scrollbar px-1.5 "
			>
				{#each habits as habit}
					<Button variant="ghost" class="p-2 rounded-full"><svelte:component this={habit.icon} /></Button>
				{/each}
			</div>
		</div>
	</div>
	<div class="h-[56%] w-full">
		<DiaryEditor />
	</div>
</div>
