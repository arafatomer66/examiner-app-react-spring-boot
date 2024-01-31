
import { useContext, useEffect, useRef, useState } from 'react';
import { Divider, Typography } from 'antd';
import { fetchExamsApi } from 'src/_api/exam';
import {
  Button,
  Select,
  Modal
} from 'antd';
import DriveBulkUpload from 'src/components/questions/UploadQuestions/DriveBulkUpload';
import { DEFAULT_TEACHER_ID } from 'src/lib/utils/constant';
import { ToastContext } from 'src/lib/context/toastContext';
const { Title, Text } = Typography;
import {
  EditOutlined
} from '@ant-design/icons'
import DrivePickerExcel from 'src/components/questions/UploadQuestions/DrivePickerExcel';
import DrawerLayout from '../../DrawerLayout';
import ViewModule from 'src/components/questions/DisplayQuestion/ViewModule';
import ViewQuestion from 'src/components/questions/DisplayQuestion/ViewQuestion';
import { FormAdd } from 'src/components/questions/UploadQuestions/FormAdd';
import { FormEditStatus } from 'src/components/questions/UploadQuestions/FormEditStatus';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { AuthContext } from 'src/lib/context/authContext';
import useRoleAuthorization from 'src/lib/hooks/useRoleAuthorization';
import { USER_ROLE } from 'src/lib/utils/constant';
import { selectExamList, selectExamModuleId, setExamList } from 'src/redux/services/exam';

export default function QuestionStatusPage() {
  const { role } = useContext(AuthContext);
  useRoleAuthorization(role, [USER_ROLE.TEACHER, USER_ROLE.ADMIN, USER_ROLE.BACKOFFICEREVIEWER, USER_ROLE.BACKOFFICEUPLOADER]);
  const examOptions = useSelector(selectExamList);
  const [questionsToFetch, setQuestionsToFetch] = useState(null);
  const dispatch = useDispatch();
  const examId = useSelector(selectSystemExamId);
  const setExamId = (examId) => { return dispatch(changeExamId(examId)) };
  const moduleId = useSelector(selectExamModuleId)
  const setModuleId = (_moduleId) => { return dispatch(setModuleId(_moduleId)) };
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const { toastError } = useContext(ToastContext);
  const questionRef = useRef(null);
  const handleChange = (value) => {
    setExamId(value);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (examOptions == null) {
      fetchExamsApi({ signal }).then(res => {
        const options = res.data.exam.map(exam => {
          return {
            label: exam.title,
            value: exam.id
          }
        })
        dispatch(setExamList(options))
      })
    }
    return () => {
      abortController.abort();
    }
  }, [])
  function questionScrollIntoView() {
    questionRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  useEffect(() => {
    if (questionsToFetch != null)
      questionScrollIntoView()
  }, [questionsToFetch])
  return (
    <DrawerLayout>
      <main
      >
        <section>
          <div>
            <div className='w-100 min-h-100vh' style={{ paddingLeft: "25px" }}>
              <>
                <br /> <br />
                <Divider orientation='left'>
                  <Title level={2}>
                    <EditOutlined />
                    &nbsp;
                    Edit Question Status
                  </Title>
                </Divider>
                <br />
                <div>
                  <Text>Exam</Text>
                  &nbsp; &nbsp;
                  <Select
                    showSearch
                    defaultValue={examId}
                    style={{ width: 200 }}
                    placeholder="Choose your exam"
                    optionFilterProp="children"
                    onChange={handleChange}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={examOptions}
                  />
                </div>
                <br ref={questionRef} />

                <br />
                <Divider orientation='left'>
                  <Title level={5}>
                    Edit Question Staus
                  </Title>
                </Divider>
                <ViewModule
                  setQuestionsToFetch={setQuestionsToFetch}
                  setModuleId={setModuleId}
                />
                <br />
                <Divider orientation='left'>
                  <Title level={5}>
                    Edit Question Status for Exam #{moduleId}
                  </Title>
                </Divider>
                <ViewQuestion
                  setIsOpenModal={setIsOpenModal}
                  isShowStatus={true}
                />
              </>
            </div>
          </div>
        </section>
      </main>
    </DrawerLayout>
  )
}