import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Button, Typography, Form, Input, Select, Space, Row, Col, Image, List, Card, Drawer, Avatar } from 'antd';
import theme from 'src/lib/ThemeConfig';
import { ToastContext } from 'src/lib/context/toastContext';
import { PlusCircleOutlined, KeyOutlined, RightCircleFilled } from '@ant-design/icons';
import { blue, gray, grey, purple, red } from '@ant-design/colors';
import { getQuestionsLength } from 'src/lib/utils/getQuestionsLength';
import { useDispatch, useSelector } from 'react-redux';
import { getMonthFromInteger } from 'src/lib/utils/helper';
import { selectModuleList, setCurrentModule } from 'src/redux/services/exam';
import { setModalState } from 'src/redux/services/lesson';
import { MODAL_ROUTE_MESSAGE, USER_ROLE } from 'src/lib/utils/constant';
import { AuthContext } from 'src/lib/context/authContext';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography
import './ModuleDrawer.module.css';
import { createHistoryApi } from 'src/_api/history/history';

export const ModuleDrawer = ({
    isDrawerVisible, closeDrawer,
}) => {
    const { profile, role } = useContext(AuthContext);
    const dispatch = useDispatch();
    const moduleList = useSelector(selectModuleList);
    const navigate = useNavigate();
    let examMap = {}
    profile?.plan?.examList?.forEach((value) => {
        examMap[value] = null;
    });
    const dateJSXFromDateString = (createdAt, updatedAt) => {
        const [yearCreated, monthCreated, dayCreated] = createdAt ?? [];
        const [yearUpdated, monthUpdated, dayUpdated] = updatedAt ?? [];
        const dateJSX = (
            <div>
                <Text style={{ color: gray[3] }}>
                    Created at: {dayCreated}, {getMonthFromInteger(monthCreated)}, {yearCreated}
                </Text>
                <br />
                <Text style={{ color: gray[3] }}>
                    Updated at: {dayUpdated}, {getMonthFromInteger(monthUpdated)}, {yearUpdated}
                </Text>
            </div>
        )
        return dateJSX;
    }
    return (

        <Drawer
            placement="right"
            onClose={closeDrawer}
            open={isDrawerVisible}
            extra={
                <Space>
                    <Button type="primary" onClick={closeDrawer}>
                        OK
                    </Button>
                </Space>
            }
        >
            <List
                itemLayout="horizontal"
                dataSource={moduleList ?? []}
                renderItem={(item, _index) => {
                    let length = getQuestionsLength(item?.questions);
                    const onClick = () => {
                        if (examMap && item.id in examMap) {
                            dispatch(setCurrentModule(item));
                            // createHistoryApi({ moduleId: item.id }).then(() => {
                            navigate(`/app/tests/attempt/${item?.id}`)
                                // })
                                .catch(() => { });
                        }
                        else {
                            dispatch(setModalState(MODAL_ROUTE_MESSAGE.EXAM_PAY_TO_VIEW_MODAL));
                        }
                    }
                    return (
                        <List.Item
                            key={item.id + "list-item"}
                        >
                            <List.Item.Meta
                                // avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                                title={
                                    <>
                                        {
                                            examMap && item.id in examMap ?
                                                <>
                                                    <a
                                                        onClick={onClick}
                                                        style={{
                                                            paddingLeft: "25px"
                                                        }}
                                                    >Module # {item?.id}&nbsp;
                                                        [{length} question(s)]
                                                    </a>
                                                </>
                                                :
                                                <a
                                                    style={{
                                                        paddingLeft: "25px"
                                                    }}
                                                    onClick={onClick}

                                                >
                                                    &nbsp;
                                                    Module # {item?.id}&nbsp;
                                                    [{length} question(s)]
                                                </a>
                                        }
                                    </>
                                }
                                description={(
                                    <div>
                                        {
                                            examMap && item.id in examMap ?
                                                <div
                                                    style={{
                                                        paddingLeft: "25px"
                                                    }}
                                                >
                                                    {[USER_ROLE.TEACHER, USER_ROLE.ADMIN, USER_ROLE.STUDENT, USER_ROLE.PARENT].includes(role) &&
                                                        dateJSXFromDateString(item?.createdDateTime, item?.updatedDateTime)}
                                                    {
                                                        length > 0 && (
                                                            <>
                                                                <a
                                                                    onClick={onClick}
                                                                    style={{ color: theme.token.colorPrimary }}>
                                                                    Attempt this module &nbsp; <RightCircleFilled />
                                                                </a> &nbsp;
                                                            </>
                                                        )
                                                    }
                                                </div> :
                                                <div
                                                    onClick={onClick}
                                                    style={{
                                                        position: "relative"
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                                                            top: "-35px",
                                                            borderRadius: "20px",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            zIndex: 99,
                                                            width: "100%",
                                                            height: "150%",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <div
                                                        >
                                                            <KeyOutlined style={{ fontWeight: 900, fontSize: "35px", color: "white", }} />
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            paddingLeft: "25px"
                                                        }}
                                                    >
                                                        {
                                                            [USER_ROLE.TEACHER, USER_ROLE.ADMIN, USER_ROLE.STUDENT, USER_ROLE.PARENT].includes(role) &&
                                                            dateJSXFromDateString(item?.createdDateTime, item?.updatedDateTime)
                                                        }
                                                        {
                                                            length > 0 && (
                                                                <>
                                                                    <a
                                                                        style={{ color: theme.token.colorPrimary }}>
                                                                        Attempt this module &nbsp; <RightCircleFilled />
                                                                    </a> &nbsp;
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                )}
                            />
                        </List.Item>
                    )
                }}
            />
        </Drawer>

    );
};

export default ModuleDrawer;