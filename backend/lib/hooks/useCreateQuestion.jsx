import { DEFAULT_TEACHER_ID, USER_ROLE } from 'src/lib/utils/constant';
import { ToastContext } from 'src/lib/context/toastContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { fetchExamsApi } from 'src/_api/exam';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import useRoleAuthorization from './useRoleAuthorization';
import { AuthContext } from '../context/authContext';
import { selectExamList, selectExamModuleId, setExamList } from 'src/redux/services/exam';

export const DISPLAY_STATE = {
  DRIVE: "DRIVE",
  UPLOAD: "UPLOAD",
  INITIAL: "INITIAL"
}


const useCreateQuestion = () => {
  const { role } = useContext(AuthContext);
  useRoleAuthorization(role, [USER_ROLE.TEACHER, USER_ROLE.ADMIN, USER_ROLE.BACKOFFICEREVIEWER, USER_ROLE.BACKOFFICEUPLOADER]);
  const { toastError } = useContext(ToastContext);
  const questionRef = useRef(null);
  const moduleId = useSelector(selectExamModuleId)
  const setModuleId = (_moduleId) => { return dispatch(setModuleId(_moduleId)) };
  const examOptions = useSelector(selectExamList);
  // const [moduleId, setModuleId] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const teacherId = useSelector(selectSystemTeacherId);
  const dispatch = useDispatch();
  const examId = useSelector(selectSystemExamId);
  const setExamId = (_examId) => { return dispatch(changeExamId(_examId)) };
  // const questionRef = useRef(null);



  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (examOptions== null) fetchExamsApiFunction(signal);

    return () => {
      abortController.abort();
    };
  }, [])


  const fetchExamsApiFunction = async (signal) => {
    const respose = await fetchExamsApi({ signal })
    if (respose && respose.data && respose.data.exam) {
      const exams = respose.data.exam;
      const options = exams.map(exam => {
        return {
          label: exam.title,
          value: exam.id
        }
      })
      dispatch(setExamList(options))
    }
  }

  const handleModuleId = (moduleId) => {
    setModuleId(moduleId);
  }

  const handleChange = (value) => {
    setExamId(value);
  };

  return {
    moduleId,
    handleModuleId,
    examOptions,
    examId, setExamId,
    isOpenModal, setIsOpenModal,
    teacherId,
    questionRef,
    handleChange,
    toastError
  }
}

export default useCreateQuestion;