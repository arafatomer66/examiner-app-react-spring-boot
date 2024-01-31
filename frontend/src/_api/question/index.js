import { api, FormatResponse } from '../index';
export let ALL_QUESTION_URL = 'api/v1/question/';

export const createQuestionApi = async (data, moduleId=null) => {
    if (moduleId!=null){
        ALL_QUESTION_URL = 'api/v1/question/?module_id='+moduleId;
    }
    const response = await api.post(ALL_QUESTION_URL, data);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const editQuestionApi = async (data) => {
    const response = await api.put(ALL_QUESTION_URL, data);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const editQuestionStatusApi = async (id, data) => {
    const response = await api.patch(`${ALL_QUESTION_URL}${id}/status`, data);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const deleteQuestionById = async (questionId, moduleId) => {
    const response = await api.delete(`${ALL_QUESTION_URL}${questionId}/module/${moduleId}`);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
}; 