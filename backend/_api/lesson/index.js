import { api, FormatResponse } from '../index';
export let ALL_LESSON_URL = 'api/v1/lesson/';

export const createLessonApi = async (data) => {
    const response = await api.post(ALL_LESSON_URL+ 'create', data);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const editLessonApi = async (lessonId, data) => {
    const response = await api.put(ALL_LESSON_URL + lessonId, data);
    console.log(response)
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const deleteLessonById = async (lessonId) => {
    const response = await api.delete(`${ALL_LESSON_URL}${lessonId}`);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
}; 

export const fetchLessonsApi = async (data) => {
    const response = await api.post(`${ALL_LESSON_URL}`, data);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  