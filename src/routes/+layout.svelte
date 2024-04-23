<script lang="ts">
	import '../app.pcss';
	import { Button, Breadcrumb, Popover, Input, Avatar, DropdownMenu } from '$ui';
	import HeaderNav from '$components/HeaderNav.svelte';
	import TWindicator from '$components/TWindicator.svelte';
	import { auth, isAuthed } from '$store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Search, LogOut, Clock } from 'lucide-svelte';
	import { page } from '$app/stores';
	import ShowRecord from '$components/tenMTable/showRecord.svelte';
	import PlanRecord from '$components/tenMTable/planRecord.svelte';

	let errorMessage = '';
	let searchMode = false;
	let timerMode = false;
	let timerOpen = false;

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
	<div class="relative flex h-12 w-screen justify-between  ">
		<!-- left menu (navigate page) -->
		<div
			class="z-20 absolute left-0 flex h-full w-[200px] items-center space-x-3 rounded-b-2xl rounded-r-2xl bg-zinc-800 px-4"
		>
			<!-- backward/forward page -->
			<HeaderNav />
			<!-- navigation -->
			<Breadcrumb.Root class="absolute left-16 w-[200px]">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/too" class="text-xl font-bold text-white hover:text-zinc-100"
							><div class:currentPage={$page.url.pathname.includes('too')}>Too</div>
						</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="text-zinc-400" />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/do" class="text-xl font-bold text-white hover:text-zinc-100"
							><span class:currentPage={$page.url.pathname.includes('do')}>Do</span>
						</Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</div>

		{#if searchMode}
			<Input
				type="text"
				class="z-10 h-10 w-[calc(100%-450px)] absolute right-0 -translate-x-[210px] translate-y-2.5 border-2 shadow shadow-zinc-300 "
			/>
		{/if}

		<!-- right menu (profile, search, timer) -->
		<div
			class="z-10 absolute right-0 flex h-12 w-[200px] items-center justify-evenly space-x-2 rounded-b-2xl rounded-l-2xl bg-zinc-800 px-4"
		>
			<!-- search -->
			<Button
				variant="ghost"
				class="h-8 w-10 !p-1 hover:bg-zinc-900 hover:shadow hover:shadow-zinc-200"
				on:click={() => (searchMode = !searchMode)}
			>
				<Search size={26} strokeWidth={2} color = white fill="#09090b" class={searchMode ? 'bg-zinc-900 shadow-xl shadow-zinc-50 scale-125 scale-1 rounded-full' : ''} />
			</Button>
			<!-- timer, tenMplanner -->
			<Popover.Root onOutsideClick={()=>timerMode = false} closeFocus={()=>timerMode = false} openFocus={()=>timerMode = true}>
				<Popover.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" 
					class="h-8 w-10 !p-1 hover:bg-zinc-900 hover:shadow hover:shadow-zinc-200"
						><Clock size={26} color = white fill="#09090b"  strokeWidth={2} class={timerMode ? 'bg-zinc-900 shadow-xl shadow-zinc-50 scale-125 rounded-full' : ''} /></Button
					>
				</Popover.Trigger>
				<Popover.Content class="w-[470px] my-3 ">
						<div 
							class={timerOpen?"m-auto w-full h-[264px] relative":"m-auto w-full h-[460px] relative"}
						>						
							<ShowRecord {timerOpen}/>
							<div class="absolute top-0 w-full h-full">
								<!-- plan record and start timer directly -->
								<PlanRecord bind:timerOpen/>
							</div>
						</div>
				</Popover.Content>
			</Popover.Root>
			<!-- profile -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" class="h-8 w-8 hover:bg-zinc-950 "
						><Avatar.Root class=" h-8 w-8 border-2 text-zinc-500 shadow-lg ">
							<Avatar.Image src={$auth.photo} alt={$auth.email} />
							<Avatar.Fallback class="bg-black font-bold">Hi</Avatar.Fallback>
						</Avatar.Root></Button
					>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Label>{$auth.email}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={handleLogout}>
						<LogOut size={18} class="mx-2" />
						Log out
						<!-- <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut> -->
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
{/if}

<div class="w-full h-full max-h-[calc(100vh-50px)]">
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
		@apply underline underline-offset-[3px];
	}
</style>
