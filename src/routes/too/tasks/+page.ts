// import type { Load } from '@sveltejs/kit';
// import { CalendarDate } from '@internationalized/date';
//
//
// export const load: Load = async ({ fetch, url }) => {
// 	let startDate: String | CalendarDate | null = url.searchParams.get('startDate');
// 	let endDate: String | CalendarDate | null  = url.searchParams.get('endDate');
//
// 	if (!startDate || !endDate) {
// 		startDate = "";
// 		endDate = "";
// 	}
// 	const path = import.meta.env.VITE_SERVER_ENDPOINT + '/api' +`/tasks?startDate=${startDate}&endDate=${endDate}`;
//
// 	try {
// 		const response = await fetch(path,{
// 				method: 'GET',
// 				headers: {
// 					'Content-Type': 'application/json',
// 					"Accept": "application/json",
// 				},
// 				credentials: 'include',
// 		});
// 		if (!response.ok) {
// 			const errorData = await response.json();
// 			throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
// 		}
// 		return await response.json();
// 	} catch (e) {
// 		console.error('task를 불러오는 데 실패했습니다:', e);
// 	}
// 	return [];
// };
