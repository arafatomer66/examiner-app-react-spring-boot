import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_TEACHER_ID } from "src/lib/utils/constant";

export const slice = createSlice({
    name: 'system',
    initialState: {
        examId: null,
        teacherId: DEFAULT_TEACHER_ID,
        isCookieSet: null,
    },
    reducers: {
        changeExamId: (state, action) => {
            state.examId = action.payload;
        },
        changeTeacherId: (state, action) => {
            state.teacherId = action.payload;
        },
        changeAllSystem: (state, {payload}) => {
            const {examId, teacherId} = payload;
            state.examId = examId;
            state.teacherId = teacherId;
        },
        changeIsCookieSet: (state, action) => {
            state.isCookieSet = action.payload;
        },
        resetSystem: (state) => {
            state.teacherId = DEFAULT_TEACHER_ID;
            state.examId = null;
        },
    },
});

export const { changeExamId, changeTeacherId, changeAllSystem, resetSystem, changeIsCookieSet } = slice.actions;
export const selectSystemTeacherId = state => { return state.system.teacherId };
export const selectSystemExamId = state => { return state.system.examId };
export const selectSystemIsCookieSet = state => { return state.system.isCookieSet }

export default slice.reducer;