import { Button, ConfigProvider, Input, Select, Space, Table, Tabs } from "antd"
import theme from "src/lib/ThemeConfig"
import DrawerLayout from "../../DrawerLayout"
import { Card, Col, Row, Typography } from "antd"
const { Text, Title } = Typography
import { gray, purple, red } from "@ant-design/colors"
import { useContext, useEffect, useState } from "react"
import { addExamToSubscriptionPlanApi, deleteExamFromSubscriptionPlanApi, getActiveSubscriptionPlan } from "src/_api/pricing"
import { newAbortSignal } from "src/lib/utils/abortController"
import { useDispatch, useSelector } from "react-redux"
import { AuthContext } from "src/lib/context/authContext"
import { AppNavbarLayout } from "../../NavbarLayout"
import { USER_ROLE } from "src/lib/utils/constant"
import { NotFound } from "src/components/sharing/Empty"
import { fetchAllExamModulesApi, fetchExamsApi } from "src/_api/exam"
import { selectExamList, selectModuleList, setExamList, setModuleList } from "src/redux/services/exam"
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from "src/redux/services/system"
import { ToastContext } from "src/lib/context/toastContext"
import Column from "antd/es/table/Column"
export const ManagePackagePage = () => {
    const [allSubscriptions, setAllSubscriptions] = useState(null);
    const moduleList = useSelector(selectModuleList);
    const { toastError } = useContext(ToastContext);
    const dispatch = useDispatch();
    const [examIdToAdd, setExamIdToAdd] = useState(null); // [examId, moduleId
    const examId = useSelector(selectSystemExamId);
    const teacherId = useSelector(selectSystemTeacherId);
    const examOptions = useSelector(selectExamList);
    const [isShowTable, setIsShowTable] = useState(false);
    const [subscriptionId, setSubscriptionId] = useState(null);
    const handleChange = async (value) => {
        dispatch(changeExamId(value));
        const moduleList = await fetchAllExamModulesApi(value, teacherId);
        if (moduleList?.data?.list[0] != null) {
            setIsShowTable(true);
            let _moduleMap = {};
            moduleList?.data?.list?.forEach((moduleItem) => {
                _moduleMap[moduleItem?.id] = moduleItem;
            });
            let newSubscriptions = allSubscriptions?.map((subscriptionItem) => {
                return {
                    ...subscriptionItem,
                    examList: subscriptionItem?.examList?.map((moduleItem) => {
                        return typeof moduleItem == "number" ? _moduleMap[moduleItem] : moduleItem;
                    }).filter((moduleItem) => moduleItem != null)
                }
            })
            setAllSubscriptions(newSubscriptions);
            setSubscriptionId(newSubscriptions?.[0]?.id);
            dispatch(setModuleList(moduleList?.data?.list))
        }
        else {
            setIsShowTable(false);
            toastError("No modules under this exam");
            return;
        }
    };
    const addExam = () => {
        console.log({ examOptions })
        let exam = moduleList.find((moduleItem) => moduleItem?.id == examIdToAdd);
        console.log({ examIdToAdd })
        console.log({ exam })
        let newSubscriptions = allSubscriptions?.map((subscriptionItem) => {
            let examList = subscriptionItem?.examList;
            if (Array.isArray(examList) && subscriptionItem?.id == Number(subscriptionId)) {
                return {
                    ...subscriptionItem,
                    examList: [...examList, exam]
                }
            }
            else {
                return subscriptionItem;
            }
        })
        setAllSubscriptions(newSubscriptions);
    }

    const deleteExam = (examId) => {
        console.log({ examId })
        let newSubscriptions = allSubscriptions?.map((subscriptionItem) => {
            let examList = subscriptionItem?.examList;
            if (Array.isArray(examList) && subscriptionItem?.id == Number(subscriptionId)) {
                return {
                    ...subscriptionItem,
                    examList: examList.filter((examItem) => examItem?.id != examId)
                }
            }
            else {
                return subscriptionItem;
            }
        })
        setAllSubscriptions(newSubscriptions);
    }

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
        getActiveSubscriptionPlan(signal).then((resPlanList) => {
            let plansList = resPlanList?.data?.subscription;
            setAllSubscriptions(plansList)
        })
            .catch((err) => { console.log(err) })
        return () => {
            controller.abort();
        }
    }, [])
    const { role } = useContext(AuthContext);
    if ([USER_ROLE.ADMIN, USER_ROLE.TEACHER].includes(role)) {
        return (
            <ConfigProvider theme={theme}>
                <DrawerLayout>
                    <AppNavbarLayout />
                    <main
                        style={{ minHeight: "100vh" }}
                    >
                        <section>
                            <div className='wrapper wrapper-padding '>
                                <Select
                                    showSearch
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
                                <br /><br />
                                {examId && isShowTable &&
                                    <>
                                        {
                                            moduleList && moduleList[0] &&
                                            <>
                                                <br />
                                                Add exam: &nbsp; &nbsp; &nbsp;
                                                <Select
                                                    id="add-exam"
                                                    showSearch
                                                    style={{ width: 200 }}
                                                    placeholder=""
                                                    onChange={(value) => setExamIdToAdd(value)}
                                                    options={moduleList.map((moduleItem) => {
                                                        return {
                                                            label: moduleItem?.name ?? "#" + moduleItem?.id,
                                                            value: moduleItem?.id
                                                        }
                                                    })}
                                                /> &nbsp; &nbsp; &nbsp; &nbsp;
                                                <Button
                                                    onClick={async () => {
                                                        try {
                                                            let response = await addExamToSubscriptionPlanApi(subscriptionId, examIdToAdd)
                                                            if (response && response?.data?.subscription) {
                                                                addExam();
                                                            }
                                                            else {
                                                                toastError("Duplicate exam or some error client-sidee");
                                                            }
                                                        }
                                                        catch (err) {
                                                            toastError("Failed to add");
                                                        }
                                                    }}
                                                    type="primary">Add</Button>
                                                <br /><br /><br />
                                            </>
                                        }
                                        <Tabs
                                            type="card"
                                            tabPosition='left'
                                            onChange={(value) => setSubscriptionId(value)}
                                            activeKey={subscriptionId ?? allSubscriptions?.[0]?.id}
                                            items={allSubscriptions?.map((subscription, index) => {
                                                console.log({ subscription })
                                                return {
                                                    label: subscription.name ?? "No name",
                                                    key: subscription?.id,
                                                    children:
                                                        <>
                                                            <Table
                                                                size="small"
                                                                dataSource={
                                                                    subscription?.examList?.map((examItem) => {
                                                                        return {
                                                                            id: examItem?.id,
                                                                            name: examItem?.name,
                                                                            time: examItem?.timeInMinutes ?? 60
                                                                        }
                                                                    })
                                                                }>
                                                                <Column title="#ID" dataIndex="id" key="id" />
                                                                <Column title="Name" dataIndex="name" key="name" />
                                                                <Column title="Time (Min)" dataIndex="time" key="time" />
                                                                <Column
                                                                    title="Action"
                                                                    key="action"
                                                                    render={(_, examItem) => (
                                                                        <Button
                                                                            onClick={async () => {
                                                                                try {
                                                                                    let response = await deleteExamFromSubscriptionPlanApi(subscriptionId, examItem?.id)
                                                                                    if (response && response?.data?.deleted) {
                                                                                        deleteExam(examItem?.id);
                                                                                    }
                                                                                    else {
                                                                                        toastError("Failed to delete exam");
                                                                                    }
                                                                                }
                                                                                catch (err) {
                                                                                    toastError("Failed to delete exam");
                                                                                }
                                                                            }}
                                                                            style={{ color: "red" }}
                                                                            type="link"
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    )}
                                                                />
                                                            </Table>
                                                        </>
                                                    ,
                                                };
                                            })}
                                        />
                                    </>
                                }

                            </div>

                        </section>
                    </main>
                </DrawerLayout>
            </ConfigProvider >
        )
    }
    else {
        return (
            <NotFound description={`Are you authorised to view this page as ${role}?`} />
        )
    }
}