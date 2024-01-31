import { api, FormatResponse } from '../index';
export let STRIPE_URL = 'api/v1/stripe';

export const createSubscriptionApi = async (data) => {
    const response = await api.post(STRIPE_URL+ '/create-subscription', data);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};  

export const updateSubscriptionMethodApi = async (data) => {
    const response = await api.post(STRIPE_URL+ '/update-payment-method', data);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};  

export const cancelSubscriptionMethodApi = async (data) => {
    const response = await api.post(STRIPE_URL+ '/cancel-subscription', data);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};  