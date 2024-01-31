import { api, FormatResponse, getHeaderTokenForSignal } from '../index';
export const CREATE_HISTORY_URL = 'api/v1/history/';

export const getHistoryByIdApi = async (id, {signal}) => {
    const response = await api.get(CREATE_HISTORY_URL + id, {
        signal, ...getHeaderTokenForSignal()
    });
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const getHistoryByUserIdApi = async ({signal}) => {
    const response = await api.get(CREATE_HISTORY_URL, {
        signal, ...getHeaderTokenForSignal()
    });
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const createHistoryApi = async (data) => {
    const response = await api.post(CREATE_HISTORY_URL, data);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  