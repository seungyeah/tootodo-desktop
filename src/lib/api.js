import { goto } from "$app/navigation";

const send = async ({ method = '', path = '', data = {} } = {}) => {
	const commonUrl = import.meta.env.VITE_SERVER_ENDPOINT;
	const url = commonUrl + '/api' + path;

	const headers = {
		"Content-Type": "application/json",
		"Accept": "application/json",
	};

	const options = {
		method,
		headers,
		body: JSON.stringify(data),
		credentials: 'include',
	};

	// GET 요청의 경우 body를 제외합니다.
	if (method === 'GET' || method === 'HEAD') {
		delete options.body;
	}

	try {
		const response = await fetch(url, options);
		if (method === 'DELETE') return;
		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}, Message: ${responseData.message}`);
		}
		return responseData;
	} catch (error) {
		if (error.message.includes('403')) {			
			alert('Session expired. Please log in again.');
			goto('/login');
		}
		console.error('API request failed:', error);
	}
};

const getApi = ({ path = '' } = {}) => {
	return send({ method: 'GET', path });
};

const putApi = ({ path = '', data = {} } = {}) => {
	return send({ method: 'PUT', path, data });
};

const postApi = ({ path = '', data = {} } = {}) => {
	return send({ method: 'POST', path, data, });
};

const delApi = ({ path = '', data = {} } = {}) => {
	return send({ method: 'DELETE', path, data });
};

const patchApi = ({ path = '', data = {} } = {}) => {
	return send({ method: 'PATCH', path, data });
};

export {
	getApi,
	putApi,
	postApi,
	delApi,
	patchApi,
};