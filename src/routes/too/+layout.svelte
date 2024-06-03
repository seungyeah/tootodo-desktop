<script lang="ts">
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		today,
		CalendarDate
	} from '@internationalized/date';
	import { Breadcrumb, ToggleGroup, Button, RangeCalendar, Popover } from '$ui';
	import { goto } from '$app/navigation';

	import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let todayValue: DateValue | undefined = today(getLocalTimeZone());

	const selectedDateRange = writable({
		start: new CalendarDate(todayValue.year, todayValue.month, todayValue.day),
		end: new CalendarDate(todayValue.year, todayValue.month, todayValue.day).add({ days: 14 })
	});
	setContext('selectedDateRange', selectedDateRange);

	$: selectedPage = $page.url.pathname.split('/')[2];
</script>

<div class="flex h-full w-full flex-col items-center justify-center sm:absolute sm:top-0">
	<div class="relative z-10 flex h-10 w-[calc(100%-450px)] justify-center space-x-2">
		<!-- header: select item -->
		<ToggleGroup.Root
			bind:value={selectedPage}
			class="absolute left-0 top-2.5 flex h-full w-[200px] items-center rounded-t-xl border border-b-2 border-b-zinc-300"
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
			{:else if $page.url.pathname.includes('events')}
				<div class="flex -translate-y-2 translate-x-4 items-center gap-2">
					<!-- 7days-- -->
					<Button
						class="h-8 w-8 !p-1"
						variant="ghost"
						on:click={() => {
							{
								$selectedDateRange.start = $selectedDateRange.start.subtract({ days: 7 });
							}
							{
								$selectedDateRange.end = $selectedDateRange.end.subtract({ days: 7 });
							}
						}}
					>
						<ChevronLeft size={20} />
					</Button>
					<!-- date range picker -->
					<Popover.Root openFocus>
						<Popover.Trigger asChild let:builder>
							<Button
								variant="outline"
								class={cn('w-[300px] justify-start text-left font-normal')}
								builders={[builder]}
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{#if $selectedDateRange && $selectedDateRange.start}
									{#if $selectedDateRange.end}
										{df.format($selectedDateRange.start.toDate(getLocalTimeZone()))} - {df.format(
											$selectedDateRange.end.toDate(getLocalTimeZone())
										)}
									{:else}
										{df.format($selectedDateRange.start.toDate(getLocalTimeZone()))}
									{/if}
								{:else if todayValue}
									{df.format(todayValue.toDate(getLocalTimeZone()))}
								{:else}
									Pick a date
								{/if}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<RangeCalendar
								bind:value={$selectedDateRange}
								bind:startValue={todayValue}
								initialFocus
								weekStartsOn={1}
								numberOfMonths={2}
								placeholder={$selectedDateRange?.start}
							/>
						</Popover.Content>
					</Popover.Root>
					<!-- 7days++ -->
					<Button
						class="h-8 w-8 !p-1"
						variant="ghost"
						on:click={() => {
							{
								$selectedDateRange.start = $selectedDateRange.start.add({ days: 7 });
							}
							{
								$selectedDateRange.end = $selectedDateRange.end.add({ days: 7 });
							}
						}}
					>
						<ChevronRight size={20} />
					</Button>
				</div>
			{/if}
		</div>
	</div>

	<div class="h-[calc(100%-60px)] w-full">
		<slot />
	</div>
</div>
