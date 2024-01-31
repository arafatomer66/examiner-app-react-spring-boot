import { api, FormatResponse, getHeaderTokenForSignal } from '../index';
export const ALL_EXAM_URL = 'api/v1/exam/';
export const ALL_EXAM_MODULE_URL = 'api/v1/exam/module/';
export const ALL_EXAM_MODULE_QUESTIONS_URL = 'api/v1/exam/question/module/';

export const fetchExamsApi = async ({ signal }) => {
    const response = await api.get(ALL_EXAM_URL, {
        signal,
        ...getHeaderTokenForSignal()
    });
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};

export const fetchExamModulesApi = async (examId, teacherId, page, size) => {
    const response = await api.get(`${ALL_EXAM_MODULE_URL}?examId=${examId}&teacherId=${teacherId}&page=${page}&size=${size}`);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};

export const fetchAllExamModulesApi = async (examId, teacherId) => {
    const response = await api.get(`${ALL_EXAM_MODULE_URL}?examId=${examId}&teacherId=${teacherId}`);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};


export const fetchExamModuleQuestionsApi = async (data, page, size) => {
    const response = await api.post(`${ALL_EXAM_MODULE_QUESTIONS_URL}?page=${page}&size=${size}`,
        data);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};

export const fetchSubjectByExamIdAndTeacherIdApi = async (examId, teacherId) => {
    const response = await api.get(`${ALL_EXAM_URL}${examId}/teacher/${teacherId}/subject`);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};

export const fetchTopicBySubjectIdAndTeacherIdApi = async (subjectId, examId) => {
    const response = await api.get(`${ALL_EXAM_URL}subject/${subjectId}/exam/${examId}/topic`);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};

export const fetchExamModulesWithQuestionsByModuleIdApi = async (moduleId, { signal }) => {
    const response = await api.get(`${ALL_EXAM_MODULE_URL}${moduleId}`, {
        signal,
        ...getHeaderTokenForSignal()
    });
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
};

export const deleteModuleById = async (moduleId) => {
    const response = await api.delete(`${ALL_EXAM_MODULE_URL}${moduleId}`);
    if (response && response.status) {
        return new FormatResponse(response);
    }
    else {
        return response
    }
}; 