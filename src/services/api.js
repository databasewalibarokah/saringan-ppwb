const BASE_URL = 'https://generus.app/api';

const getHeaders = (token) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Include X-Ponpes-Id header if user is logged in and has selected a ponpes
  const selectedPonpesId = localStorage.getItem('selected_ponpes_id');
  if (selectedPonpesId) {
    headers['X-Ponpes-Id'] = selectedPonpesId;
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    throw error;
  }
  return data;
};

export const api = {
  get: async (endpoint, token) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  post: async (endpoint, body, token) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint, body, token) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint, token) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};
