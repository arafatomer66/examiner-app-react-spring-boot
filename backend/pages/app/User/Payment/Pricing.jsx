import { Button, ConfigProvider, Empty, Input, Modal, Space, Spin } from "antd"
import theme from "src/lib/ThemeConfig"
import DrawerLayout from "../../DrawerLayout"
import { Steps, Card, Col, Row, Typography } from "antd"
const { Text, Title } = Typography
import { UserOutlined, LoadingOutlined, SmileOutlined, CheckCircleTwoTone, CloseCircleTwoTone, Loading3QuartersOutlined } from '@ant-design/icons'
import { gray, purple, red } from "@ant-design/colors"
import { useContext, useEffect, useState } from "react"
import CardInput from "src/components/sharing/payment/CardInput"
import { ModalSubscription } from "src/components/sharing/payment/ModalSubsciption"
import { getLatestUserSubscription, getActiveSubscriptionPlan } from "src/_api/pricing"
import { newAbortSignal } from "src/lib/utils/abortController"
import { useDispatch, useSelector } from "react-redux"
import { selectSubscription, setPricingId, setSubscriptions } from "src/redux/services/subscription"
import { AuthContext } from "src/lib/context/authContext"
import { cancelSubscriptionMethodApi } from "src/_api/stripe"
import { ToastContext } from "src/lib/context/toastContext"
import dayjs from "dayjs"
import { AppNavbarLayout } from "../../NavbarLayout"
import { USER_ROLE } from "src/lib/utils/constant"
import { NotFound } from "src/components/sharing/Empty"
export const PricingPage = () => {
    const [isShowPlans, setIsShowPlans] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [allSubscriptions, setAllSubscriptions] = useState(null)
    const { profile, handleProfile, role } = useContext(AuthContext);
    const { toastSuccess, toastError } = useContext(ToastContext);
    useEffect(() => {
        const [controller, signal] = newAbortSignal();
        // fetch multiple same time
        Promise.all([getActiveSubscriptionPlan(signal)]).then(res => {
            console.log(res)
            setAllSubscriptions(res[0].data?.subscription)
        })
            .catch((err) => { console.log(err) })
        return () => {
            controller.abort()
        }
    }, [])
    if ([USER_ROLE.ADMIN, USER_ROLE.STUDENT, USER_ROLE.PARENT, USER_ROLE.TEACHER].includes(role)) {
        return (
            <ConfigProvider theme={theme}>
                <DrawerLayout>
                    <AppNavbarLayout />
                    <main
                        style={{ minHeight: "100vh" }}
                    >
                        <section>
                            <ModalSubscription isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                            {!isShowPlans ?
                                <div className='wrapper wrapper-padding'>
                                    <Title level={3}>Your Current Subscription</Title>
                                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                        <Space>
                                            <Button type="primary" onClick={() => {
                                                setIsShowPlans(true)
                                            }
                                            }>View Plan</Button>
                                            <Button
                                                onClick={() => {
                                                    cancelSubscriptionMethodApi({
                                                        paymentgatewayref: profile?.subscription?.paymentgatewayref,
                                                    })
                                                        .then(() => {
                                                            toastSuccess("Cancel subscription successfully")
                                                            handleProfile({
                                                                ...profile,
                                                                subscription: null,
                                                                plan: null
                                                            })
                                                        })
                                                        .catch(() => {
                                                            toastError("Cancel subscription failed")
                                                        })
                                                }}
                                                type="dashed" danger>Cancel</Button>
                                        </Space>
                                    </div>
                                    <br />
                                    <br />
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={4} lg={6} xl={7}> </Col>
                                        {
                                            profile?.plan ?
                                                <Col xs={24} md={16} lg={12} xl={10}>
                                                    <CurrentCard item={{ ...profile?.plan, ...profile?.subscription }} />
                                                </Col>
                                                :
                                                <>
                                                    <Empty size="large" style={{ margin: "10vh auto" }} description={
                                                        <span>
                                                            No subsciptions yet!
                                                        </span>
                                                    } />

                                                </>
                                        }
                                        <Col xs={24} md={4} lg={6} xl={7}   ></Col>
                                    </Row>
                                    <div>

                                    </div>
                                </div>
                                :
                                <div className='wrapper wrapper-padding '>
                                    <div>
                                        <Steps
                                            items={steps}
                                        />
                                    </div>
                                    <br />
                                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                        <Space>
                                            <Button
                                                type="primary" onClick={() => {
                                                    setIsShowPlans(false)
                                                }}>Show Current Plan</Button>
                                        </Space>
                                    </div>
                                    <br />
                                    <Row gutter={16}>
                                        {
                                            allSubscriptions?.map((item, _index) => {
                                                return (
                                                    <Col key={item.id} xs={24} md={12} xl={8}>
                                                        <PricingCardItem setIsModalOpen={setIsModalOpen} item={item} />
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                </div>
                            }
                        </section>
                    </main>
                </DrawerLayout>
            </ConfigProvider>
        )
    }
    else {
        return (
            <NotFound description={`Are you authorised to view this page as ${role}?`} />
        )
    }
}

const CurrentCard = ({ item }) => {
    const dateConvert = (date, color = "black") => {
        if (date == null) {
            return
        }
        const dateTime = dayjs(date);
        if (dateTime.isValid()) {
            return (
                <div>
                    <Text style={{ color }}>{
                        dateTime.format('MMMM D, YYYY h:mm A')
                    }</Text>
                </div>
            )
        }
    }
    return (
        <>
            <Card
                style={
                    { padding: "10px 5px", border: `0.05px solid ${purple[2]}`, borderRadius: "10px" }
                }
                bordered={true}
            >
                <Title level={5}>{item?.name}</Title>
                <Text>{item?.description}</Text>
                <div style={{ textAlign: "center" }}>
                    {
                        item?.active ? <Text style={{ color: purple[5] }}>Active</Text>
                            :
                            <Text style={{ color: red[3] }}>Expired</Text>
                    }
                    {
                        dateConvert(item?.subscriptionStartDate)
                    }

                    {
                        dateConvert(item?.subscriptionEndDate)
                    }

                    {
                        item?.endDate && <Text style={{ color: purple[5] }}>{item?.endDate}</Text>
                    }
                </div>

            </Card>

        </>
    )
}

const PricingCardItem = ({ item, setIsModalOpen }) => {
    const dispatch = useDispatch()

    return (
        <Card
            style={
                {
                    height: "100%",
                    padding: "10px 5px", border: `0.05px solid ${purple[2]}`, borderRadius: "10px"
                }
            }
            bordered={true}
        >
            <Title level={5}>{item?.name}</Title>
            <Text>{item?.description}</Text>
            <div style={{ textAlign: "center" }}>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <Title style={{ color: purple[5] }} level={2} type="primary" >AUD ${item?.currentprice}</Title>
                <div>
                    <Text> {item?.duration} </Text>
                    <br />
                    <Text style={{ color: gray[1] }} > {pricing?.subscriptionLabel} </Text>
                </div>
            </div>
            <div>
                {
                    item?.positive?.split("|")?.map((feature, index) => {
                        return (
                            <div key={index}>
                                <CheckCircleTwoTone twoToneColor="#52c41a" />
                                <Text style={{ marginTop: "10px", marginLeft: "10px" }}>{feature}</Text>
                            </div>
                        )
                    })
                }
                {
                    item?.negative?.split("|")?.map((feature, index) => {
                        return (
                            <div key={index}>
                                <CloseCircleTwoTone twoToneColor="red" />
                                <Text style={{ marginTop: "10px", marginLeft: "10px", textDecoration: "line-through", color: gray[1] }}>{feature}</Text>
                            </div>
                        )
                    })
                }
                <>
                    <br /> <br />
                    <Button
                        onClick={() => {
                            setIsModalOpen(true);
                            dispatch(setPricingId(item?.priceId))
                        }}
                        block style={{ borderRadius: "20px", }}>{pricing?.buttonLabel}</Button>
                    <Text style={{ marginTop: "10px", textAlign: "center", display: "block", color: gray[1] }}>{pricing?.textAfterLabel}</Text>
                </>
            </div>
        </Card>
    )
}

const steps = [
    {
        id: "abc",
        title: 'Login',
        status: 'finish',
        description: "Logged into the system",
        icon: <UserOutlined />,
    },
    {
        id: "def",
        title: 'Pay',
        status: 'process',
        description: "Please choose your plan",
        icon: <Loading3QuartersOutlined />,
    },
    {
        id: "ghi",
        title: 'Done',
        status: 'finish',
        description: "purchase done",
    },
]

const pricing =
{
    subscriptionText: "monthly",
    subscriptionLabel: "(recurring)",
    buttonLabel: "Get Exam Bundle",
    textAfterLabel: "Save 20%",
}