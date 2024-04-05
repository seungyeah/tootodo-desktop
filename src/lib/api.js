const send = async ({ method = '', path = '', data = {}, access_token = '' } = {}) => {
	const commonUrl = import.meta.env.VITE_SERVER_ENDPOINT;
	const url = commonUrl + '/api' + path;
  
	const headers = {
	  "Access-Control-Allow-Origin": commonUrl,
	  "Content-Type": "application/json",
	  "Accept": "application/json",
	  "Authorization": access_token ? `Bearer ${access_token}` : undefined,
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
	  if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
	  }
	  return await response.json();
	} catch (error) {
	  throw error;
	}
  };
  
  const getApi = ({ path = '', access_token = '' } = {}) => {
	return send({ method: 'GET', path, access_token });
  };
  
  const putApi = ({ path = '', data = {}, access_token = '' } = {}) => {
	return send({ method: 'PUT', path, data, access_token });
  };
  
  const postApi = ({ path = '', data = {}, access_token = '' } = {}) => {
	return send({ method: 'POST', path, data, access_token });
  };
  
  const delApi = ({ path = '', data = {}, access_token = '' } = {}) => {
	return send({ method: 'DELETE', path, data, access_token });
  };
  
  export {
	getApi,
	putApi,
	postApi,
	delApi,
  };
  