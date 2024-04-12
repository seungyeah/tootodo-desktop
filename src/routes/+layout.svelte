<script lang="ts">
	import '../app.pcss';
	import { Button, Breadcrumb, Popover, Input } from '$ui';
	import HeaderNav from '$components/HeaderNav.svelte';
	import TWindicator from '$components/TWindicator.svelte';
	import { auth, isAuthed } from '$lib/store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Search } from 'lucide-svelte';

	let errorMessage = '';

	onMount(async () => {
		const loggedIn = getCookie('logged_in');
		if (loggedIn) {
			console.log('logged in' + loggedIn);
			await auth.getUserInfo();
		} else {
			console.log('login error' + loggedIn);
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
		<div class="flex h-full  w-[340px] items-center space-x-2 relative">
			<!-- backward/forward page -->
			<HeaderNav />
			<!-- navigation -->
			<Breadcrumb.Root class="absolute left-12 w-[300px]">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/" class="text-xl font-bold text-white hover:text-pink-100"
							>Too</Breadcrumb.Link
						>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="text-pink-500" />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/" class="text-xl font-bold text-white hover:text-pink-100"
							>Do</Breadcrumb.Link
						>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</div>

		<div class="flex h-full w-full justify-end items-center space-x-1 relative">
			<!-- search -->
				<Input type="text" class="h-8 hidden md:block absolute md:right-28  w-4/5 " />
				<Button variant="secondary" class="h-8 w-11 md:hidden absolute right-28">
					<Search size={30} class="scale-125" strokeWidth={2.2}/>
				</Button>
			
			<!-- timer -->
			<Popover.Root >
				<Popover.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" class="h-8 absolute right-2" >00:00:00</Button>
				</Popover.Trigger>
				<Popover.Content class="w-80">
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
		<Button class="w-30 my-2 h-8 bg-white/10 " variant="secondary" on:click={handleLogout}>
			<span class="text-pink-500 hidden md:block">
				{$auth.email}
			</span>
			<span class="ml-2 text-lg font-bold text-white"> Logout </span>
		</Button>
	</div>
{:else}
	<slot />
{/if}

<TWindicator />

<style>
	:global(html, body) {
		height: 100%;
	}

	:global(body) {
		font-family: 'Manrope Variable', sans-serif;
	}
</style>
