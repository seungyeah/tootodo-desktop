import type { Load } from '@sveltejs/kit';
import { getMonday } from '$lib/utils.js';
import { CalendarDate } from '@internationalized/date';
export const load: Load = async ({ fetch, url, prerendering  }) => {
	let start_date: String | CalendarDate | null = null;
	let end_date: String | CalendarDate | null = null;

	// 프리렌더링 시 URL 매개변수를 무시하고 기본값을 설정
	if (prerendering) {
		start_date = getMonday(new Date()).subtract({ days: 7 });
		end_date = start_date.add({ days: 20 });
	} else {
		start_date = url.searchParams.get('start_date');
		end_date = url.searchParams.get('end_date');

		if (!start_date || !end_date) {
			start_date = getMonday(new Date()).subtract({ days: 7 });
			end_date = start_date.add({ days: 20 });
		}
	}
	
	const path = import.meta.env.VITE_SERVER_ENDPOINT + '/api' +`/events?start_date=${start_date}&end_date=${end_date}`;

	try {
		const response = await fetch(path,{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					"Accept": "application/json",
				},
				credentials: 'include',
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
		}
		return await response.json();
	} catch (e) {
		console.error('이벤트를 불러오는 데 실패했습니다:', e);
	}
	return [];
};
