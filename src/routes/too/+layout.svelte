<script lang="ts">

	import { Breadcrumb, ToggleGroup, Button,  } from '$ui';
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	$: selectedPage = $page.url.pathname.split('/')[2];
</script>

<div class="flex flex-col items-center justify-center w-full h-full sm:absolute sm:top-0">
	<div class="relative z-10 flex h-10 w-[calc(100%-450px)] justify-center space-x-2">
		<!-- header: select item -->
		<ToggleGroup.Root
			bind:value={selectedPage}
			class="absolute left-0 top-0.5 flex h-full w-[200px] items-center rounded-xl bg-white shadow-md "
		>
			<ToggleGroup.Item value="notes" aria-label="note" class="h-3/4 w-[30%] px-1">
				<Button on:click={() => goto('/too/notes')}>Note</Button>
			</ToggleGroup.Item>
			<ToggleGroup.Item value="tasks" aria-label="task" class="h-3/4 w-[30%] px-1">
				<Button on:click={() => goto('/too/tasks')}>Task</Button>
			</ToggleGroup.Item>
			<ToggleGroup.Item value="habits" aria-label="habit" class="h-3/4 w-[30%] px-1">
				<Button on:click={() => goto('/too/habits')}>Habit</Button>
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	<div class="h-[calc(100%-60px)] w-full">
		<slot />
	</div>
</div>
