import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  lessonMap: null,
  currentLesson: null,
  currentSubject: null,
  subjectList: null,
  modalState: null,
  subjectPagination: {
    size: 30, page: 0, totalPages: null, totalItems: null
  },
  currentTopicId: null,
  topicMap: {}
};
export const slice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    setLessonMap: (state, action) => {
      state.lessonMap = action.payload;
    },
    editLessonMap: (state, action) => {
      const newLesson = action.payload;
      const topicId = newLesson.topicId;
      state.lessonMap[topicId] = current(state.lessonMap[topicId]).map(lesson => {
        if (lesson.id === newLesson.id) {
          return newLesson;
        }
        return lesson;
      });
      state.currentLesson = newLesson;
    },
    deleteLessonMap: (state, action) => {
      const {lessonId, topicId} = action.payload;
      state.lessonMap[topicId] = current(state.lessonMap[topicId]).filter(lesson => lesson.id != lessonId);
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
    setCurrentSubject: (state, action) => {
      state.currentSubject = action.payload;
    },
    setSubjectList: (state, action) => {
      state.subjectList = action.payload;
    },
    setSubjectPagination: (state, action) => {
      state.subjectPagination = action.payload;
    },
    setCurrentTopicId: (state, action) => {
      state.currentTopicId = action.payload;
    },
    setTopicMap: (state, action) => {
      state.topicMap = action.payload;
    },
    setModalState: (state, action) => {
      state.modalState = action.payload;
    },
    resetLesson: () => {
      // eslint-disable-next-line no-undef
      state = {
        ...initialState
      }
    },
  },
});

export const {
  setLessonMap,
  editLessonMap,
  deleteLessonMap,
  setCurrentLesson,
  setSubjectList,
  setCurrentSubject,
  setSubjectPagination,
  setCurrentTopicId,
  setTopicMap,
  setModalState
} = slice.actions;

export const selectLessonMap = state => { return state.lesson.lessonMap };
export const selectCurrentLesson = state => { return state.lesson.currentLesson };
export const selectCurrentSubject = state => { return state.lesson.currentSubject };
export const selectSubjectList = state => { return state.lesson.subjectList };
export const selectSubjectPagination = state => { return state.lesson.subjectPagination };
export const selectCurrentTopicId = state => { return state.lesson.currentTopicId };
export const selectTopicMap = state => { return state.lesson.topicMap };
export const selectModalState = state => { return state.lesson.modalState };
export default slice.reducer;

