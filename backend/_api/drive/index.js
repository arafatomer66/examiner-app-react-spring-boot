import { DEFAULT_TEACHER_ID } from 'src/lib/utils/constant';
import { api, FormatResponse } from '../index';
export const INIT_DRIVE_URL = 'api/v1/drive/url/';
export const REDIRECT_DRIVE_URL = 'api/v1/drive/login/google';
export const SAVE_IMAGES = 'api/v1/drive/file/saveImages/';
export const SAVE_AND_READ_EXCEL_AND_MAKE_MODULE = 'api/v1/drive/file/saveAndReadExcelAndMakeModule/';
export const SAVE_AND_READ_EXCEL_AND_MAKE_LESSON = 'api/v1/drive/file/saveAndReadExcelAndMakeLesson/';
export const DOWNLOAD_IMAGE_FROM_DRIVE_TO_AZURE = 'api/v1/drive/file/downloadAzure';

export const initDriveApi = async ({signal}) => {
    const response = await api.get(INIT_DRIVE_URL, {signal});
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};

export const redirectDriveApi = async (code) => {
    const response = await api.get(`${REDIRECT_DRIVE_URL}/?code=${code}` );
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const saveImagesforModuleApi = async (fileId, examId, teacherId) => {
    const response = await api.get(`${SAVE_IMAGES}${fileId}/?examId=${examId}&teacherId=${teacherId}`);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const saveAndReadExcelAndMakeModuleApi = async (fileId, data) => {
    const response = await api.post(
        `${SAVE_AND_READ_EXCEL_AND_MAKE_MODULE}${fileId}`,
        data
    );
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const saveAndReadExcelAndMakeLessonApi = async (fileId, examId, teacherId) => {
    const response = await api.get(`${SAVE_AND_READ_EXCEL_AND_MAKE_LESSON}${fileId}/?examId=${examId}&teacherId=${teacherId}`);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

export const downloadImageToAzure = async ({fileId, moduleId=null, teacherId=DEFAULT_TEACHER_ID}, {signal}) => {
    const response = await api.post(`${DOWNLOAD_IMAGE_FROM_DRIVE_TO_AZURE}/${fileId}/?moduleId=${moduleId}&teacherId=${teacherId}`);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  

