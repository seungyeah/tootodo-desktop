<script lang="ts">
	import '../app.pcss';
	import { Button, Breadcrumb, Popover, Input, Avatar } from '$ui';
	import HeaderNav from '$components/HeaderNav.svelte';
	import TWindicator from '$components/TWindicator.svelte';
	import { auth, isAuthed } from '$lib/store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Search, LogOut } from 'lucide-svelte';
	import { page } from '$app/stores';

	let errorMessage = '';

	onMount(async () => {
		const loggedIn = getCookie('logged_in');
		if (loggedIn) {
			await auth.getUserInfo();
		} else {
			goto('/login');
		}
	});

	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}

	async function handleLogout(e) {
		e.preventDefault();
		try {
			await auth.logout();
		} catch (error) {
			errorMessage = error.message;
		}
	}

</script>

{#if $isAuthed}
	<div class="flex h-14 w-screen items-center justify-between rounded-b-2xl bg-black p-4">
		<div class="relative flex h-full w-[200px] items-center space-x-2">
			<!-- backward/forward page -->
			<HeaderNav />
			<!-- navigation -->
			<Breadcrumb.Root class="absolute left-12 w-[200px]">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/too" class="text-xl font-bold text-white hover:text-pink-100"
							><div class:currentPage={$page.url.pathname.includes('too')}>Too</div>
						</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="text-pink-500" />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/do" class="text-xl font-bold text-white hover:text-pink-100"
							><span class:currentPage={$page.url.pathname.includes('do')}>Do</span>
						</Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</div>

		<div class="xxs:text-green relative flex h-full w-[calc(100%-400px)] items-center space-x-1">
			<!-- search -->
			<Input type="text" class="absolute hidden h-8 w-[calc(100%-112px)] md:block " />
			<Button variant="secondary" class="absolute right-28 h-8 w-11 md:hidden">
				<Search size={30} class="scale-125" strokeWidth={2.2} />
			</Button>

			<!-- timer -->
			<Popover.Root>
				<Popover.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" class="absolute right-2 h-8"
						>00:00:00</Button
					>
				</Popover.Trigger>
				<Popover.Content class="w-[95px]">
					<div class="grid gap-4">
						<div class="space-y-2">
							<h4 class="font-medium leading-none">Dimensions</h4>
							<p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
						</div>
						<div class="grid gap-2">hi</div>
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>

		<!-- logout, user profile -->
		<div class="flex w-[120px] items-center justify-end space-x-2">
			<Avatar.Root class=" h-8 w-8 border-2 shadow-lg text-pink-500">
				<Avatar.Image src={$auth.photo} alt={$auth.email} />
				<Avatar.Fallback class="bg-black font-bold">Hi</Avatar.Fallback>
			</Avatar.Root>
			<Button class="w-30 my-2 h-8 bg-white/10 " variant="secondary" on:click={handleLogout}>
				<LogOut color="white" strokeWidth={2.5} />
			</Button>
		</div>
	</div>
{/if}

<div class="p-2">
	<slot />
</div>

<TWindicator />

<style>
	:global(html, body) {
		height: 100%;
	}

	:global(body) {
		font-family: 'Manrope Variable', sans-serif;
	}

	.currentPage {
		color: #f0f;
	}
</style>
