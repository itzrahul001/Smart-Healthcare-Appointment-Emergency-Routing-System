import api from './api';

const AuthService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('id', response.data.id);
            localStorage.setItem('name', response.data.name);
        }
        return response.data;
    },

    register: async (payload) => {
        return api.post('/auth/register', payload);
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('name');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const id = localStorage.getItem('id');
        const name = localStorage.getItem('name');
        return token ? { token, role, id, name } : null;
    },
};

export default AuthService;
