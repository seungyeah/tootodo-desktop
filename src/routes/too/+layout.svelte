<script lang="ts">

	import { Breadcrumb, ToggleGroup, Button,  } from '$ui';
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	$: selectedPage = $page.url.pathname.split('/')[2];
</script>

<div class="flex h-full w-full flex-col items-center justify-center sm:absolute sm:top-0">
	<div class="relative z-10 flex h-10 w-[calc(100%-450px)] justify-center space-x-2">
		<!-- header: select item -->
		<ToggleGroup.Root
			bind:value={selectedPage}
			class="absolute left-0 top-0.5 flex h-full w-[200px] items-center rounded-xl bg-white shadow-md "
		>
			<ToggleGroup.Item value="events" aria-label="event" class="h-3/4 w-[30%] px-1">
				<Button on:click={() => goto('/too/events')}>Event</Button>
			</ToggleGroup.Item>
			<ToggleGroup.Item value="tasks" aria-label="task" class="h-3/4 w-[30%] px-1">
				<Button on:click={() => goto('/too/tasks')}>Task</Button>
			</ToggleGroup.Item>
			<ToggleGroup.Item value="habits" aria-label="habit" class="h-3/4 w-[30%] px-1">
				<Button on:click={() => goto('/too/habits')}>Habit</Button>
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		
		<!-- header for each page -->
		<div class="absolute right-0 top-2.5 w-[calc(100%-220px)]">
			{#if $page.url.pathname.includes('tasks')}
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link href="/too/tasks/:category_id">Category</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Link href="/too/tasks/:category_id/:task_id">Task</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Page>Subtask</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			<!-- {:else if $page.url.pathname.includes('events')} -->				
			{/if}
		</div>
	</div>

	<div class="h-[calc(100%-60px)] w-full">
		<slot />
	</div>
</div>
