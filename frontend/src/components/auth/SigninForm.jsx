import { useContext, useEffect, useRef, useState } from "react";
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { loginApi } from "src/_api/auth";
import { ToastContext } from "src/lib/context/toastContext";
import { AuthContext } from "src/lib/context/authContext";
import { SIGNIN_VIEW, USER_ROLE_TYPE } from "src/lib/utils/constant";
import { useNavigate } from "react-router-dom";

export const SigninForm = ({
    // switchToSignup
    loginBackendUrl,
    userRoleType
}) => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const res = await loginApi(loginBackendUrl, values);
            await handleLogin(res);
            navigate(SIGNIN_VIEW);  
            toastSuccess('Success', res.description ?? 'Signed in');
        }
        catch (err) { toastErrorApi(err) };
    };
    const onFinishFailed = () => {
        toastError('Error', 'Sign up failed due to incorrect user input!');
    };
    const { toastSuccess, toastError, toastErrorApi } = useContext(ToastContext);
    const { handleLogin } = useContext(AuthContext);
    const fullWidthLayout = {
        labelCol: { span: 32 },
        wrapperCol: { span: 32 }
    }
    return (
        <div className="flexbox-center-vertical">
            <h1>
                Sign in for your
                <span>
                    {
                        userRoleType === USER_ROLE_TYPE.BACKOFFICE ? ' reviewer / uploader ' :
                            (
                                userRoleType === USER_ROLE_TYPE.ADMIN ? ' admin ' :
                                    (
                                        userRoleType === USER_ROLE_TYPE.NORMAL ? ' ' : ' '
                                    )
                            )
                    }
                </span>
                account.
            </h1>
            <Form
                name="signin"
                layout="vertical"
                style={{
                    maxWidth: "450px",
                }}
                initialValues={{
                    remember: true,
                }}
                className="text-align-start"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <br /><br />
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Email"
                            name="userName"
                            {...fullWidthLayout}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                                { type: 'email' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    {/* </Col>
                </Row>

                <Row>
                    <Col span={24}> */}
                        <Form.Item
                            label="Password"
                            name="password"
                            {...fullWidthLayout}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                { min: 4 },
                                { max: 30 }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    {/* </Col>
                </Row> */}
                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 0,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                {/* <Row>
                    <Col span={24}> */}
                        <Button type="primary" block htmlType="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
                {/* </Form.Item> */}
            </Form>
        </div>
    )
}