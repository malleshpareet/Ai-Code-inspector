const API_URL = '/api/auth';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const authService = {
    // Auth
    register: async (userData: any) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    login: async (credentials: any) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return response.json();
    },

    googleLogin: async (credential: string) => {
        const response = await fetch(`${API_URL}/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential }),
        });
        return response.json();
    },

    githubLogin: async (code: string) => {
        const response = await fetch(`${API_URL}/github-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });
        return response.json();
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Profile
    getProfile: async () => {
        const response = await fetch(`${API_URL}/profile`, {
            headers: getHeaders(),
        });
        return response.json();
    },

    updateProfile: async (data: any) => {
        const response = await fetch(`${API_URL}/update-profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return response.json();
    },

    updatePassword: async (data: any) => {
        const response = await fetch(`${API_URL}/update-password`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return response.json();
    },

    deleteAccount: async () => {
        const response = await fetch(`${API_URL}/delete`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return response.json();
    },

    // GitHub Integration
    linkGithub: async (code: string) => {
        const response = await fetch(`${API_URL}/link-github`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ code }),
        });
        return response.json();
    },

    unlinkGithub: async () => {
        const response = await fetch(`${API_URL}/unlink-github`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return response.json();
    },

    getGithubRepos: async () => {
        const response = await fetch(`${API_URL}/github/repos`, {
            headers: getHeaders(),
        });
        return response.json();
    },

    getGithubRepoTree: async (owner: string, repo: string, branch: string) => {
        const response = await fetch(`${API_URL}/github/repo/${owner}/${repo}/tree/${branch}`, {
            headers: getHeaders(),
        });
        return response.json();
    },

    getGithubFileContent: async (owner: string, repo: string, path: string) => {
        // Encode path to handle slashes
        const encodedPath = path.split('/').map(encodeURIComponent).join('/');
        const response = await fetch(`${API_URL}/github/repo/${owner}/${repo}/contents/${encodedPath}`, {
            headers: getHeaders(),
        });
        return response.json();
    },
};
