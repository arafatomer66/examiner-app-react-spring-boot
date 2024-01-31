import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Select, Space, Row, Col, Image, List, Card, Drawer, Avatar, ConfigProvider } from 'antd';
import theme from 'src/lib/ThemeConfig';
import { ToastContext } from 'src/lib/context/toastContext';
import { newAbortSignal } from 'src/lib/utils/abortController';
import { AuthContext } from 'src/lib/context/authContext';
import { ERROR_STATE_STRING, USER_ROLE } from 'src/lib/utils/constant';
import './Tests.css';
import { fetchExamModulesApi, fetchExamModulesWithQuestionsByModuleIdApi, fetchExamsApi } from 'src/_api/exam';
import { selectExamQuestionList, selectModuleList, setCurrentExam, setCurrentModule, setCurrentQuestion, setExamList, setModuleList, setQuestionList } from 'src/redux/services/exam';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppNavbarLayout } from '../../NavbarLayout';
import { changeExamId, selectSystemTeacherId } from 'src/redux/services/system';
import ModuleDrawer from 'src/components/tests/ModuleDrawer';
import ResultQuestion from 'src/components/tests/ResultQuestion';
import useRoleAuthorization from 'src/lib/hooks/useRoleAuthorization';
import { VimeoPlayerQuestion } from 'src/components/lessons/DisplayLesson/VimeoPlayerQuestion';
import { Loading } from 'src/components/sharing/Loading';
import { getHistoryByIdApi } from 'src/_api/history/history';
import { NotFound } from 'src/components/sharing/Empty';


export const ResultPage = () => {
    const { role } = useContext(AuthContext);
    useRoleAuthorization(role, [USER_ROLE.STUDENT, USER_ROLE.TEACHER]);
    let { id: urlModuleId } = useParams();
    let questionList = useSelector(selectExamQuestionList);
    const dispatch = useDispatch();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isFetched, setIsFetched] = useState(false);
    const [attemptHistory, setAttemptHistory] = useState(null);
    useEffect(() => {
        const [controller, signal] = newAbortSignal();
        getHistoryByIdApi(urlModuleId, { signal }).then(res => {
            if (res.data && res.data.attemptHistory != null && res.data.module) {
                if (res.data.attemptHistory != null) {
                    setAttemptHistory(res.data.attemptHistory);
                    setIsFetched(true)
                }
                if (res.data.module.module) {
                    dispatch(setCurrentModule(res.data.module.module))
                }
                if (res.data.module.questionList) {
                    dispatch(setQuestionList(res.data?.module?.questionList))
                }
            }
        })
            .catch(() => {
                
            })
        return () => {
            controller.abort();
        }
    }, [])
    const closeDrawer = () => setIsDrawerVisible(false);
    const openDrawer = () => setIsDrawerVisible(true);

    return (
        <ConfigProvider theme={theme}>
            <main
                className='min-h-100vh'
            >
                <VimeoPlayerQuestion />
                <AppNavbarLayout />

                {
                    !isFetched ?
                        <Loading /> :
                        <>
                            {isFetched &&  attemptHistory == null ?
                                <NotFound /> :
                                <>
                                    <ResultQuestion
                                        urlModuleId={urlModuleId}
                                        openDrawer={openDrawer}
                                        questions={questionList}
                                        attemptHistory={attemptHistory}
                                    />
                                    <section>
                                        <div>
                                            <ModuleDrawer
                                                isDrawerVisible={isDrawerVisible}
                                                closeDrawer={closeDrawer}
                                                title={`Change exam module`}
                                            />
                                        </div>
                                    </section>
                                </>
                            }
                        </>
                }

            </main>
        </ConfigProvider>
    );
};

export default ResultPage;