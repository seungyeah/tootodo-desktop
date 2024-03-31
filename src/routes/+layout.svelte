<script lang="ts">
	import '../app.pcss';
	import { Button, Input } from '$ui';

	import { auth, isAuthed } from '$lib/store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let errorMessage = '';

	onMount(async ()=>{
		const loggedIn = getCookie('logged_in');
		if(loggedIn){
			await auth.getUserInfo();
		}else{
			goto('/login');
		}
	});

	$: console.log($isAuthed);	

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
<div class="flex">
	<p>Hello {$auth.email}</p>
	<Button class="my-2 w-full" on:click={handleLogout}>Logout</Button>
</div>
{/if}
<slot />

<style>
	:global(html, body) {
		height: 100%;
	}

	:global(body) {
		display: grid;
		place-content: center;
		font-family: 'Manrope Variable', sans-serif;
	}
</style>
