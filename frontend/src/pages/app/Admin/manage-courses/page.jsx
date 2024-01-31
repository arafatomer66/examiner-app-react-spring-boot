
import { Space, Typography } from 'antd';
import {
  Button,
  Select,
  Modal
} from 'antd';
const { Title, Text } = Typography;
import {
  AppstoreOutlined,
  FormatPainterOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import DrivePickerExcel from 'src/components/questions/UploadQuestions/DrivePickerExcel';
import DrawerLayout from '../../DrawerLayout';
import { DEFAULT_TEACHER_ID, MODAL_ROUTE_MESSAGE, USER_ROLE } from 'src/lib/utils/constant';
import { ToastContext } from 'src/lib/context/toastContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { fetchExamsApi, fetchSubjectByExamIdAndTeacherIdApi } from 'src/_api/exam';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import DrivePickerExcelLesson from 'src/components/lessons/UploadLessons/DrivePickerExcelLesson';
import { setModalState, setSubjectList } from 'src/redux/services/lesson';
import { selectExamList, setExamList } from 'src/redux/services/exam';
import { FormAddLesson } from 'src/components/lessons/UploadLessons/FormAddLesson';
import { FormEditLesson } from 'src/components/lessons/UploadLessons/FormEditLesson';
import ViewSubject from 'src/components/lessons/DisplayLesson/ViewSubject';
import { VimeoPlayerLesson } from 'src/components/lessons/DisplayLesson/VimeoPlayerLesson';
import ViewLesson from 'src/components/lessons/DisplayLesson/ViewLesson';
import { AuthContext } from 'src/lib/context/authContext';


export default function LessonPage() {
  const { toastError } = useContext(ToastContext);
  const examOptions = useSelector(selectExamList);
  const teacherId = useSelector(selectSystemTeacherId);
  const dispatch = useDispatch();
  const examId = useSelector(selectSystemExamId);
  const { role } = useContext(AuthContext);
  const fetchSubjectsByExamIdAndTeacherIdApiFunction = async (_examId) => {
    try {
      const response = await fetchSubjectByExamIdAndTeacherIdApi(_examId, teacherId);
      if (response && response.data && response.data.subject) {
        dispatch(setSubjectList(response.data.subject));
      }
      else {
        throw new Error("No subject list for this exam or failed to fetch subject list");
      }
    }
    catch (error) {
      dispatch(setSubjectList([]))
      toastError("Subjects for this exam is empty");
    }
  }

  const fetchExamsApiFunction = async (signal) => {
    const respose = await fetchExamsApi({ signal })
    if (respose && respose.data && respose.data.exam) {
      const options = respose.data.exam.map(exam => {
        return {
          label: exam.title,
          value: exam.id
        }
      })
      dispatch(setExamList(options));
    }
  }

  const handleChange = (value) => {
    dispatch(changeExamId(value));
    fetchSubjectsByExamIdAndTeacherIdApiFunction(value);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (examOptions == null) fetchExamsApiFunction(signal);
    if (examId != null) fetchSubjectsByExamIdAndTeacherIdApiFunction(examId);
    return () => {
      abortController.abort();
    };
  }, [])


  return (
    <DrawerLayout>
      <main 
      >
        <VimeoPlayerLesson />
        <FormAddLesson />
        <FormEditLesson />
        <section>
          <div className='wrapper-padding' style={{paddingTop: "0px", paddingBottom: "20px"}}>
            <br /> <br />
            <Title level={2}>
              {[USER_ROLE.PARENT, USER_ROLE.STUDENT].includes(role) ?
                <>
                <AppstoreOutlined />
                  &nbsp;
                  View Courses
                </> :
                <>
                  <FormatPainterOutlined />
                  &nbsp;
                  Create Courses
                </>
              }
            </Title>
            <br />
            <div>
              <Text>Exam</Text>
              &nbsp; &nbsp;
              <Select
                showSearch
                loading={examOptions == null}
                style={{ width: 200 }}
                placeholder="Choose your exam"
                optionFilterProp="children"
                onChange={handleChange}
                defaultValue={examId ?? null}
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={examOptions}
              />
            </div>
          </div>
          <div className='wrapper-padding' style={{paddingTop: "0px", paddingBottom: "10px"}}>
            <ViewSubject />
            {
              [USER_ROLE.BACKOFFICEREVIEWER, USER_ROLE.BACKOFFICEUPLOADER, USER_ROLE.ADMIN, USER_ROLE.TEACHER].includes(role) &&
              <Space style={{paddingTop: "0px"}}>
                <DrivePickerExcelLesson />
                <Button onClick={() => {
                  dispatch(setModalState(MODAL_ROUTE_MESSAGE.LESSON_ADD_MODAL))
                }}>
                  Add a course
                  &nbsp;
                  <PlusCircleOutlined style={{ fontSize: '1.5em', marginLeft: '5px', cursor: "pointer" }} />
                </Button>
              </Space>
            }
            <br/> <br/>
            <ViewLesson />
          </div>
        </section>
      </main>
    </DrawerLayout>
  )
}