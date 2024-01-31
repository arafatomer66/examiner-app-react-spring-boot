import { createSlice, current } from "@reduxjs/toolkit";
export const ALL_EXAM_URL = 'api/v1/exam/';
export const ALL_EXAM_MODULE_URL = 'api/v1/exam/module/';
export const ALL_EXAM_MODULE_QUESTIONS_URL = 'api/v1/exam/question/module/';

const initialState = {
  moduleId: null,
  modulePagination: null,
  questionPagination: null,
  examList: null,
  moduleList: null,
  questionList: null,
  currentQuestion: null,
  currentExam: null,
};
export const slice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setQuestionStringToFetch: (state, action) => {
      if (state.currentModule && state.currentModule.questions) {
        state.currentModule.questions = action.payload;
      }
    },
    setModuleId: (state, action) => {
      let currentModule = current(state.moduleList).find((module) => module.id == action.payload);
   
      if (currentModule != null) {
        state.currentModule = currentModule;
        state.moduleId = currentModule.id;
      }
    },
    setQuestionList: (state, { payload }) => {
      state.questionList = payload;
    },
    editModuleList: (state, { payload }) => {
      state.moduleList = state.moduleList.map((module) => {
        if (module.id === payload.id) {
          return payload;
        } else {
          return module;
        }
      });
    },
    editQuestionList: (state, { payload }) => {
      state.questionList = state.questionList.map((question) => {
        if (question.id === payload.id) {
          return payload;
        } else {
          return question;
        }
      });
    },
    addQuestionList: (state, { payload }) => {
      state.questionList = [...state.questionList, payload];
    },
    addModuleList: (state, { payload }) => {
      state.moduleList = [...state.moduleList, payload];
    },
    deleteQuestionList: (state, { payload }) => {
      state.questionList = state.questionList.filter((question) => question.id != payload);
      state.moduleList = state.moduleList.map((module) => {
        if (module.id == state.moduleId) {
          return {
            ...module,
            questions: String(module.questions).replace(`${payload},`, ''),
          }
        } else {
          return module;
        }
      })
    },
    deleteModuleList: (state, { payload }) => {
      state.moduleList = state.moduleList.filter((module) => module.id != payload);
      state.questionList = null;
    },
    setModuleList: (state, { payload }) => {
      state.moduleList = payload;
    },
    setExamList: (state, { payload }) => {
      state.examList = payload;
    },
    setCurrentQuestion: (state, { payload }) => {
      state.currentQuestion = payload;
    },
    setCurrentExam: (state, { payload }) => {
      state.currentExam = payload;
    },
    setCurrentModule: (state, { payload }) => {
      state.currentModule = payload;
    },
    resetExam: (state) => {
      // eslint-disable-next-line no-unused-vars
      state.moduleId = null;
      state.modulePagination = null;
      state.currentExam = null;
      state.currentModule = null;
      state.questionPagination = null;
      state.examList = null;
      state.moduleList = null;
      state.questionList = null;
    },
  },
});

export const {
  setCurrentQuestion,
  setCurrentExam,
  setCurrentModule,
  setExamList,
  setModuleId,
  setModuleList,
  setQuestionStringToFetch,
  setQuestionList,
  addModuleList,
  addQuestionList,
  editQuestionList,
  editModuleList,
  deleteQuestionList,
  deleteModuleList,
  resetExam
} = slice.actions;

export const selectExamModuleId = state => { return state.exam.currentModule?.id };
export const selectExamQuestionPagination = state => { return state.exam.questionPagination };
export const selectExamModulePagination = state => { return state.exam.modulePagination };
export const selectExamList = state => { return state.exam.examList };
export const selectModuleList = state => { return state.exam.moduleList };
export const selectExamQuestionList = state => { return state.exam.questionList };
export const selectExamQuestionStringToFetch = state => { return state.exam.currentModule?.questions ?? "" };
export const selectCurrentExam = state => { return state.exam.currentExam };
export const selectCurrentModule = state => { return state.exam.currentModule };
export const selectCurrentQuestion = state => { return state.exam.currentQuestion };
export default slice.reducer;
