import { writable, get, derived } from 'svelte/store';
import { getApi, putApi, delApi, postApi } from '../api.js';
import { z } from 'zod';
import { goto } from '$app/navigation';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

const registerSchema = z
	.object({
		name: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(8),
		passwordConfirm: z.string().min(8)
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['confirmPassword'] // refine 함수에서 오류 위치를 지정
	});

const setAuth = () => {
	let initValues = {
		email: '',
		id: 0,
		name: '',
		photo: '',
		provider: '',
		role: '',
		updatedAt: '',
		verified: false,
		createdAt: ''
	};

	const { subscribe, set, update } = writable({ ...initValues });

	const register = async (userData) => {
		const result = registerSchema.safeParse(userData);
		if (!result.success) {
			alert('입력 데이터가 유효하지 않습니다: ' + result.error.message);
			return;
		}
		try {
			const options = {
				path: '/auth/register',
				data: result.data
			};
			await postApi(options);
			alert('가입이 완료되었습니다. ');
			goto('/login');
		} catch (e) {
			alert(e.message);
		}
	};

	const login = async (userData) => {
		const result = loginSchema.safeParse(userData);

		if (!result.success) {
			alert('입력 데이터가 유효하지 않습니다: ' + result.error.message);
			return;
		}

		try {
			const options = {
				path: '/auth/login',
				data: result.data
			};

			await postApi(options);
			getUserInfo();
			alert('로그인이 완료되었습니다.');
			goto('/do');
		} catch (e) {
			alert(e.message);
			goto('/login');
		}
	};

	const getGoogleUrl = async (from: string) => {
		const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

		try {
			const options = {
				redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT as string,
				client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string,
				access_type: 'offline',
				response_type: 'code',
				prompt: 'consent',
				scope: [
					'https://www.googleapis.com/auth/userinfo.profile',
					'https://www.googleapis.com/auth/userinfo.email'
				].join(' '),
				state: from
			};

			const qs = new URLSearchParams(options);
			return `${rootUrl}?${qs.toString()}`;
		} catch (e) {
			alert('구글 로그인시 오류가 발생했습니다. 로그인을 다시시도해 주세요.' + e);
		}
	};

	const getUserInfo = async () => {
		const options = {
			path: '/users/me'
		};
		try {
			const resp = await getApi(options);
			const user = resp.data.user;
			//todo: 본인 인증 후 verified를 true로 변경
			set({ ...user, verified: true });
			// alert('사용자 정보를 불러왔습니다. ' + user.email + ' ' + user.provider);
		} catch (e) {
			// alert(e.message);
			await refreshWithFn(getUserInfo);
		}
	};

	const resetUserInfo = () => set({ ...initValues });

	const logout = async () => {
		const options = {
			path: '/auth/logout'
		};

		try {
			await delApi(options);
			set({ ...initValues });
			alert('로그아웃이 완료되었습니다.');
			goto('/login');
		} catch (e) {
			alert(e.message);
			await refreshWithFn(logout);
		}
	};

	const googleLogin = async () => {
		try {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get('code');
			const state = urlParams.get('state');

			const options = {
				path: `/sessions/oauth/google?code=${code}&state=${state}`
			};

			await getApi(options);
			console.log('구글 로그인 완료')
			alert('구글 로그인 완료');
			goto('/do');
			getUserInfo();			
		} catch (e) {
			alert('구글 로그인시 오류가 발생했습니다. ' + e);
			goto('/login');
		}
	};

	const refreshWithFn = async (toExecute) => {
		try {
			const options = {
				path: '/auth/refresh'
			};
			const resp = await getApi(options);
			// alert('refresh token 완료');
			toExecute();
		} catch (e) {
			alert('refresh token 으로 acces token을 받을 수 없습니다. 다시 로그인하세요. ' + e);
			goto('/login');
		}
	};

	return {
		subscribe,
		refreshWithFn,
		login,
		getGoogleUrl,
		logout,
		resetUserInfo,
		register,
		googleLogin,
		getUserInfo
	};
};

export const auth = setAuth();
export const isAuthed = derived(auth, ($auth) => ($auth.verified ? true : false));
