import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Select, Space, Row, Col, Image, List, Card, Drawer, Avatar, Empty, ConfigProvider } from 'antd';
import { ToastContext } from 'src/lib/context/toastContext';
import { newAbortSignal } from 'src/lib/utils/abortController';
import { AuthContext } from 'src/lib/context/authContext';
import { ERROR_STATE_STRING, USER_ROLE } from 'src/lib/utils/constant';
import './Tests.css';
import { fetchExamModulesApi, fetchExamModulesWithQuestionsByModuleIdApi, fetchExamsApi } from 'src/_api/exam';
import { selectExamQuestionList, setCurrentExam, setCurrentModule, setCurrentQuestion, setExamList, setModuleList, setQuestionList } from 'src/redux/services/exam';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from 'src/pages/app/HomeNavbar';
import { AppNavbarLayout } from '../../NavbarLayout';
import { changeExamId, selectSystemTeacherId } from 'src/redux/services/system';
import ModuleDrawer from 'src/components/tests/ModuleDrawer';
import AttemptQuestion from 'src/components/tests/AttemptQuestion';
import useRoleAuthorization from 'src/lib/hooks/useRoleAuthorization';
import { Loading } from 'src/components/sharing/Loading';
import theme from 'src/lib/ThemeConfig';
import { NotFound } from 'src/components/sharing/Empty';
import { ModalSubmitExam } from 'src/components/tests/ModalSubmitExam';


export const AttemptPage = () => {
    const { toastError, toastSuccess, toastCatchError } = useContext(ToastContext);
    const { role } = useContext(AuthContext);
    useRoleAuthorization(role, [USER_ROLE.STUDENT, USER_ROLE.TEACHER]);
    let { id: urlModuleId } = useParams();
    const questionList = useSelector(selectExamQuestionList);
    const teacherId = useSelector(selectSystemTeacherId);
    const dispatch = useDispatch();
    const [isFetched, setIsFetched] = useState(false);
    useEffect(() => {
        const [controller, signal] = newAbortSignal();
        fetchExamModulesWithQuestionsByModuleIdApi(urlModuleId, { signal })
            .then(res => {
                setIsFetched(true);
                dispatch(setCurrentModule(res.data?.module))
                dispatch(setQuestionList(res.data?.questionList))
                fetchExamModulesApi(res.data?.examId, teacherId, 0, 10)
                    .then(res => {
                        dispatch(setModuleList(res.data?.list))
                    })
                    .catch(() => {
                        dispatch(setQuestionList(null))
                    })
            })
            .catch(() => {
                dispatch(setQuestionList(null))
            })
        return () => {
            controller.abort();
        }
    }, [])


    const { profile } = useContext(AuthContext);

    return (
        <main
            className='min-h-100vh'
        >
            <AppNavbarLayout />
            <ModalSubmitExam urlModuleId={urlModuleId} />
            <ConfigProvider theme={theme}>
                {
                    profile == null || !isFetched ?
                        <Loading /> :
                        <>
                            {isFetched && questionList == null ?
                                <NotFound /> :
                                <AttemptQuestion urlModuleId={urlModuleId} questions={questionList} />
                            }
                        </>
                }
            </ConfigProvider>
        </main>
    );
};

export default AttemptPage;