<script lang="ts">
	import {onMount } from 'svelte';

	import { Button, Input } from '$ui';

	import { auth, isAuthed } from '$lib/store';

	let signUp = false;
	let googleLoginUrl;

	let errorMessage = '';

	onMount(async () => {
		// 사용자 인증 상태 확인
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			await auth.googleLogin(); // URL에 code가 있으면 로그인 처리를 진행
		}
		
	});

	let registerForm = {
		name: '',
		email: '',
		password: '',
		passwordConfirm: ''
	};

	let loginForm = {
		email: '',
		password: ''
	};

	async function handleRegister(e) {
		e.preventDefault();
		try {
			await auth.register(registerForm);
			signUp = false;
			registerForm = {
				name: '',
				email: '',
				password: '',
				passwordConfirm: ''
			};                
		} catch (error) {
			errorMessage = error.message;
		}
	}

	async function handleLogin(e) {
		e.preventDefault();
		try {
			await auth.login(loginForm);
			loginForm = {
				email: '',
				password: ''
			};
		} catch (error) {
			errorMessage = error.message;
		}
	}

	
</script>

{#if !$isAuthed}
	<div class="w-screen h-screen login">
		{#if signUp}
			<!-- sign up -->
			<h1 class="text-center">Sign Up</h1>
			<form method="POST" on:submit={handleRegister} class="flex w-full flex-col space-y-2">
				<Input type="name" placeholder="name" class="w-full" bind:value={registerForm.name} />
				<Input type="email" placeholder="email" class="w-full" bind:value={registerForm.email} />
				<Input
					type="password"
					placeholder="password"
					class="w-full"
					bind:value={registerForm.password}
				/>
				<Input
					type="password"
					placeholder="confirmPassword"
					class="w-full"
					bind:value={registerForm.passwordConfirm}
				/>
				<div class="my-2 flex w-full space-x-2">
					<Button type="submit" class="w-2/3">Submit</Button>
					<Button on:click={() => (signUp = false)} class="w-1/3">Sign In</Button>
				</div>
			</form>
		{:else}
			<!-- sign in -->
			<h1 class="text-center text-2xl font-bold">Login</h1>
			<form method="POST" on:submit={handleLogin} class="flex w-full flex-col space-y-2">
				<Input type="email" placeholder="email" class="w-full" bind:value={loginForm.email} />
				<Input
					type="password"
					placeholder="password"
					class="w-full"
					bind:value={loginForm.password}
				/>
				<div class="my-2 flex w-full space-x-2">
					<Button variant="secondary" type="submit" class="w-full text-center">Submit</Button>
					<!-- <Button on:click={() => (signUp = true)} class="w-1/3">Sign Up</Button> -->
				</div>
			</form>
		{/if}

		<!-- <a href={googleLoginUrl} rel="external">
			<Button
				class="my-2 w-full"
				on:click={async () => (googleLoginUrl = await auth.getGoogleUrl('/'))}
				>Login with google</Button
			>
		</a> -->

		<div class="w-30">
			{errorMessage}
		</div>
	</div>
{/if}

<slot />

<style>
	.login {
		display: grid;
		place-content: center;
		font-family: 'Manrope Variable', sans-serif;
	}
</style>