const BASE_URL = 'https://animal-shelter-backend-eight.vercel.app/api';

const api = {
    get: async (url, token) => {
        const res = await fetch(`${BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            cache: 'no-store',
        });
        return handleResponse(res);
    },

    post: async (url, body, token) => {
        const res = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(body),
        });
        return handleResponse(res);
    },

    patch: async (url, body, token) => {
        const res = await fetch(`${BASE_URL}${url}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(body),
        });
        return handleResponse(res);
    },

    delete: async (url, token) => {
        const res = await fetch(`${BASE_URL}${url}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });
        return handleResponse(res);
    },

    // For file uploads (FormData)
    upload: async (url, formData, token) => {
        const res = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                // Content-Type is auto-set for FormData
            },
            body: formData,
        });
        return handleResponse(res);
    }
};

async function handleResponse(res) {
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const err = new Error((data && data.message) || res.statusText);
        err.status = res.status;
        throw err;
    }
    return data;
}

export default api;
