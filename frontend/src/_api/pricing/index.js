import { api, FormatResponse, getHeaderTokenForSignal } from '../index';
const ALL_ACTIVE_SUBSCRIPTIONS = '/api/v1/subscriptions/active';
const LATEST_SUBSCRIPTION = '/api/v1/user-subscriptions/latest/';
const SUBSCRIPTIONS_URL = '/api/v1/subscriptions/';

export const getActiveSubscriptionPlan = async (signal) => {
    const response = await api.get(ALL_ACTIVE_SUBSCRIPTIONS, { signal, 
        ...getHeaderTokenForSignal()    
    });
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};

export const getLatestUserSubscription = async (signal) => {
    const response = await api.get(LATEST_SUBSCRIPTION, {
        signal, ...getHeaderTokenForSignal()
    })
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
}

export const addExamToSubscriptionPlanApi = async ( planId, examId) => {
    const response = await api.post(`${SUBSCRIPTIONS_URL}${planId}/exam/${examId}`);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};

export const deleteExamFromSubscriptionPlanApi = async (planId, examId) => {
    const response = await api.delete(`${SUBSCRIPTIONS_URL}${planId}/exam/${examId}`);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};
