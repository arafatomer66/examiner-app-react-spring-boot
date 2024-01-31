import React, { useContext, useEffect, useState } from 'react';
import { Form, Typography, ConfigProvider } from 'antd';
import theme from 'src/lib/ThemeConfig';
import { ToastContext } from 'src/lib/context/toastContext';
import DrawerLayout from '../../DrawerLayout';
import { newAbortSignal } from 'src/lib/utils/abortController';
import { AuthContext } from 'src/lib/context/authContext';
import { USER_ROLE } from 'src/lib/utils/constant';
import { PlusCircleOutlined, RightCircleFilled } from '@ant-design/icons';
import { blue, gray, purple } from '@ant-design/colors';
import './Tests.css';
import { fetchAllExamModulesApi, fetchExamsApi } from 'src/_api/exam';
import { selectCurrentExam, selectExamList, setCurrentExam, setExamList, setModuleList } from 'src/redux/services/exam';
import { useDispatch, useSelector } from 'react-redux';
import ModuleDrawer from 'src/components/tests/ModuleDrawer';
import useRoleAuthorization from 'src/lib/hooks/useRoleAuthorization';
import { selectSystemTeacherId } from 'src/redux/services/system';
import { Loading } from 'src/components/sharing/Loading';
import { ModalGoToPurchasePage } from 'src/components/tests/ModalGoToPurchasePage';
const { Title, Text } = Typography;


export const TestPage = () => {
  const { toastError, toastSuccess, toastCatchError } = useContext(ToastContext);
  const examList = useSelector(selectExamList);
  const teacherId = useSelector(selectSystemTeacherId);
  const currentExam = useSelector(selectCurrentExam);
  const dispatch = useDispatch();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { role } = useContext(AuthContext);
  useRoleAuthorization(role, [USER_ROLE.STUDENT, USER_ROLE.TEACHER]); const onFinish = async (values) => {
    console.log('Form values:', values);
  };

  useEffect(() => {
    const [controller, signal] = newAbortSignal();
    fetchExamsApi({ signal }).then(res => {
      const options = res.data?.exam.map(exam => {
        return {
          label: exam.title,
          value: exam.id
        }
      })
      dispatch(setExamList(options));
    }).catch(() => { })
    return () => {
      controller.abort();
    }
  }, [])
  const closeDrawer = () => setIsDrawerVisible(false);

  const { profile } = useContext(AuthContext);
  if (profile == null || examList == null) {
    return <Loading/>
  }
  return (
    <ConfigProvider theme={theme}>
      <DrawerLayout>
        <main
          className='min-h-100vh'
        >
          <section>
            <div>
              <ModalGoToPurchasePage />
              <div className='bg-gradient wrapper wrapper-padding '>
                <Text style={{ color: gray[1] }}>
                  Test prep kit
                </Text>
                <Title level={5} className='color-white' >
                  Ace your exams with our amazing platform!
                </Title>

              </div>

              <Title className='wrapper' level={4} style={{ color: theme.token.colorPrimary, marginTop: '20px' }}>
                Exams List
              </Title>
              <div className='wrapper' style={{ marginTop: '20px' }}>
                <div className="card-grid">
                  {
                    examList && examList.map((exam) => {
                      return (
                        <div className="card"
                          key={exam.id + "card"}
                          onClick={() => {
                            setIsDrawerVisible(true);
                            fetchAllExamModulesApi(exam?.value, teacherId,).then(res => {
                              dispatch(setModuleList(res.data?.list))
                              dispatch(setCurrentExam(exam))
                            }).catch(err => {
                              toastCatchError(err)
                            })
                          }}
                          style={{ width: 240 }}
                        >
                          <div className="card-image">
                            {/* <img src="your-image-url.jpg" alt="Card Image" /> */}
                          </div>
                          <div className="card-title" > {exam.label} </div>
                          <br />
                          <div class="card-content" style={{ color: gray[6] }}> View
                            &nbsp;
                            <RightCircleFilled style={{ fontSize: "20px", color: purple[5] }} />
                          </div>

                          {/* <div className="card-content" style={{ color: gray[6] }}> {exam.description} </div> */}
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <ModuleDrawer
                isDrawerVisible={isDrawerVisible}
                closeDrawer={closeDrawer}
                title={currentExam != null ? `Exam modules under ${currentExam?.title}` : `Can't find exams`}
              />
            </div>
          </section>
        </main>
      </DrawerLayout >
    </ConfigProvider>
  );
};

export default TestPage;