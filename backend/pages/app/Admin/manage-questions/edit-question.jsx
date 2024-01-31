
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
import { FormEdit } from 'src/components/questions/UploadQuestions/FormEdit';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { AuthContext } from 'src/lib/context/authContext';
import useRoleAuthorization from 'src/lib/hooks/useRoleAuthorization';
import { USER_ROLE } from 'src/lib/utils/constant';
import { selectExamList, selectExamModuleId, setExamList } from 'src/redux/services/exam';

const DISPLAY_STATE = {
  DRIVE: "DRIVE",
  UPLOAD: "UPLOAD",
  INITIAL: "INITIAL"
}

export default function EditQuestionPage() {
  const { role } = useContext(AuthContext);
  useRoleAuthorization(role, [USER_ROLE.TEACHER, USER_ROLE.ADMIN, USER_ROLE.BACKOFFICEREVIEWER, USER_ROLE.BACKOFFICEUPLOADER]);
  const examOptions = useSelector(selectExamList);
  const [questionsToFetch, setQuestionsToFetch] = useState(null);
  const [displayState, setDisplayState] = useState(DISPLAY_STATE.INITIAL);
  const dispatch = useDispatch();
  const examId = useSelector(selectSystemExamId);
  const setExamId = (examId) => { return dispatch(changeExamId(examId)) };
  const moduleId = useSelector(selectExamModuleId)
  const setModuleId = (_moduleId) => { return dispatch(setModuleId(_moduleId)) };
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const { toastError, toastCatchError } = useContext(ToastContext);
  const questionRef = useRef(null);
  const handleChange = (value) => {
    setExamId(value);
  };
  useEffect(() => {
    if (displayState === DISPLAY_STATE.UPLOAD || questionsToFetch != null) questionScrollIntoView()
  }, [displayState, questionsToFetch])
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
        dispatch(setExamList(options));
      })
        .catch(() => { })
    }
    return () => {
      abortController.abort();
    }
  }, [])
  function questionScrollIntoView() {
    questionRef.current.scrollIntoView({ behavior: 'smooth' });
    // setDisplayState(state);
  }
  return (
    <DrawerLayout>
      <main
      >
        <section>
          <div>
            <div className='min-h-100vh' style={{ paddingLeft: "15px", paddingRight: "15px" }}>
              <>
                <br /> <br />
                <Divider orientation='left'>
                  <Title level={2}>
                    <EditOutlined />
                    &nbsp;
                    Edit Questions
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
                  <Title level={5}
                  >
                    Choose module by clicking on the card
                  </Title>
                </Divider>
                <ViewModule
                // editModalInitFunction={()=>{
                //   setIsOpenModal(true)
                // }}
                />

                <Modal
                  title={`Edit question #${currentQuestion?.id} module ID ${moduleId}`}
                  centered
                  open={isOpenModal}
                  onOk={() => setIsOpenModal(false)}
                  onCancel={() => setIsOpenModal(false)}
                  width={1000}
                  okButtonProps={{ style: { display: "none" } }}
                >
                  <FormEdit
                    currentQuestion={currentQuestion}
                    setIsOpenModal={setIsOpenModal}
                    isOpenModal={isOpenModal}
                    setCurrentQuestion={setCurrentQuestion}
                  />
                </Modal>
                <br /> <br />
                <Divider orientation='left'>
                  <Title level={5}>
                    Edit Question for Exam #{moduleId}
                  </Title>
                </Divider>
                <ViewQuestion
                  setIsOpenModal={setIsOpenModal}
                  isHideEdit={false}
                />
              </>
            </div>
          </div>
        </section>
      </main>
    </DrawerLayout>
  )
}