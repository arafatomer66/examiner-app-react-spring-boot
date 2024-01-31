import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Select, Space, Row, Col, Image, List, Card, Drawer, Avatar, ConfigProvider, Table } from 'antd';
import theme from 'src/lib/ThemeConfig';
import { ToastContext } from 'src/lib/context/toastContext';
import { newAbortSignal } from 'src/lib/utils/abortController';
import { AuthContext } from 'src/lib/context/authContext';
import { USER_ROLE } from 'src/lib/utils/constant';
import './Tests.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNavbarLayout } from '../../NavbarLayout';
import { changeExamId, selectSystemTeacherId } from 'src/redux/services/system';
import useRoleAuthorization from 'src/lib/hooks/useRoleAuthorization';
import { VimeoPlayerQuestion } from 'src/components/lessons/DisplayLesson/VimeoPlayerQuestion';
import { Loading } from 'src/components/sharing/Loading';
import { getHistoryByUserIdApi } from 'src/_api/history/history';
import { NotFound } from 'src/components/sharing/Empty';
import Column from 'antd/es/table/Column';
import { green } from '@ant-design/colors';
import Title from 'antd/es/skeleton/Title';
import dayjs from 'dayjs';


export const RecordPage = () => {
    const { role } = useContext(AuthContext);
    const navigate = useNavigate();
    useRoleAuthorization(role, [USER_ROLE.STUDENT, USER_ROLE.TEACHER]);
    const [isFetched, setIsFetched] = useState(false);
    const [attemptHistoryList, setAttemptHistoryList] = useState(null);
    useEffect(() => {
        const [controller, signal] = newAbortSignal();
        getHistoryByUserIdApi({ signal }).then(res => {
            if (res.data && res.data.attemptHistory != null) {
                setAttemptHistoryList(res.data.attemptHistory);
                setIsFetched(true);
            }
        })
            .catch(() => {

            })
        return () => {
            controller.abort();
        }
    }, [])

    const dateObjectConverter = (dateTimeArray) => {
        return dayjs(new Date(
            dateTimeArray[0], dateTimeArray[1] - 1, dateTimeArray[2], dateTimeArray[3], dateTimeArray[4], dateTimeArray[5], dateTimeArray[6] / 1e6)
        ).format('YYYY-MM-DD HH:mm A');
    }

    return (
        <ConfigProvider theme={theme}>
            <main
                className='min-h-100vh'
            >
                <VimeoPlayerQuestion />
                <AppNavbarLayout />
                <div className='wrapper wrapper-padding'>
                    {
                        !isFetched ?
                            <Loading /> :
                            <>
                                {isFetched && attemptHistoryList == null ?
                                    <NotFound /> :
                                    <>
                                        <Typography.Title style={{ margin: 'auto' }} level={3}>Previous records</Typography.Title>
                                        <br />
                                        <Table
                                            size="small"
                                            dataSource={
                                                attemptHistoryList?.map((item, index) => {
                                                    return {
                                                        index: index + 1,
                                                        startDateTime: dateObjectConverter(item?.startDateTime),
                                                        endDateTime: dateObjectConverter(item?.endDateTime),
                                                        percentage: item?.percentage,
                                                        totalQuestion: item?.totalQuestion - item?.totalAnswerMissing,
                                                        totalCorrect: item?.totalCorrect,
                                                        id: item?.id
                                                    }
                                                })
                                            }>
                                            <Column title="#" dataIndex="index" key="index" />
                                            <Column title="Start" dataIndex="startDateTime" key="startDateTime" />
                                            <Column title="End" dataIndex="endDateTime" key="endDateTime" />
                                            <Column title="Percent(%)" dataIndex="percentage" key="percentage" />
                                            <Column title="Total Question" dataIndex="totalQuestion" key="totalQuestion" />
                                            <Column title="Total Correct" dataIndex="totalCorrect" key="totalCorrect" />
                                            <Column
                                                title="Action"
                                                key="action"
                                                render={(_, item) => {
                                                    console.log({item})
                                                    console.log({item})
                                                    console.log({item})
                                                    return (
                                                        <Button
                                                            onClick={() => {
                                                                navigate(`/app/tests/result/${item?.id}`)
                                                            }}
                                                            style={{ color: green[6] }}
                                                            type="link"
                                                        >
                                                            View Exam
                                                        </Button>
                                                    )
                                                }}
                                            />
                                        </Table>
                                    </>
                                }
                            </>
                    }
                </div>
            </main>
        </ConfigProvider>
    );
};

export default RecordPage;