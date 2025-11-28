import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subscription';

export interface Plan {
    _id: string;
    name: string;
    price: number;
    interval: string;
    description: string;
    features: string[];
    isPopular: boolean;
}

export interface Subscription {
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
}

export const subscriptionService = {
    getPlans: async (): Promise<Plan[]> => {
        const response = await axios.get(`${API_URL}/plans`);
        return response.data.data;
    },

    getCurrentSubscription: async (): Promise<Subscription> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/current`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    subscribe: async (planId: string): Promise<Subscription> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/subscribe`, { planId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    cancelSubscription: async (): Promise<Subscription> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/cancel`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    createOrder: async (planId: string): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/create-order`, { planId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    verifyPayment: async (paymentData: any): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/verify-payment`, paymentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getPaymentHistory: async (): Promise<any[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    }
};
