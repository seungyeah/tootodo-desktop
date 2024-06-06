// import { getApi, putApi, postApi, delApi } from '$lib/api';

// import { getMonday } from '$lib/utils.js';
// import { CalendarDate } from '@internationalized/date';
// export const load = async ({url }) => {
//     let events = [];

// 	const fetchEvents = async () => {
        
//         let start_date:String|CalendarDate = url.searchParams.get('start_date');
//         let end_date:String|CalendarDate = url.searchParams.get('end_date');

//         if (!start_date || !end_date) {
// 			start_date = getMonday(new Date());
//             end_date = start_date.add({ days: 13 });
// 		}
//         const path =  `/events?start_date=${start_date}&end_date=${end_date}`;
// 		try {
// 			const response = await getApi({path});
//             console.log("hi fetch~")
// 			return response.events ;
// 		} catch (e) {
// 			console.error('이벤트를 불러오는 데 실패했습니다:', e);
// 			return  [];
// 		}
// 	};

// 	const updateEvent = async (event) => {
// 		await putApi({ path: `/events/${event.id}` });
// 	};
    

//     return {
//         events: await fetchEvents(),
//         updateEvent,
//     };	
// };
