

import { useState, useContext } from "react";
import {
    Button, Checkbox, Form, Input, Row, Col, Select,
    Divider, Space,
} from 'antd';
import { ToastContext } from "src/lib/context/toastContext";
import { AuthContext } from "src/lib/context/authContext";
import { DEFAULT_TEACHER_ID, USER_ROLE, USER_ROLE_TYPE, USER_STATUS } from "src/lib/utils/constant";
import { signupApi } from "src/_api/auth";
import { useNavigate } from "react-router-dom";
const PasswordValidationRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/);
export const SignupForm = ({
    // switchToSignin
    signupBackendUrl,
    userRoleType,
    urlPart,
}) => {
    const navigate = useNavigate();
    userRoleType ??= USER_ROLE_TYPE.NORMAL;
    const [loading, setLoading] = useState(false);
    const { toastSuccess, toastError, toastErrorApi } = useContext(ToastContext);
    const onFinish = async (values) => {
        const role = String(values.role).trim();
        if (values.password != values.confirmPassword) {
            toastError('Error', 'Password and confirm password are not matched!');
            return;
        }
        if (userRoleType == USER_ROLE_TYPE.NORMAL) {
            const studentId = values.student_id;
            if (role == USER_ROLE.PARENT) {
                values.status = USER_STATUS.PENDING;
                if (String(studentId).trim() == '' || studentId == null || studentId == undefined) {
                    toastError('Error', 'Student ID is required for parent role!');
                    return;
                }
            }
            else {
                values.teacher_id = DEFAULT_TEACHER_ID;
                values.status = USER_STATUS.ACTIVE;
            }
        }
        if (userRoleType == USER_ROLE_TYPE.BACKOFFICE) {
            values.teacher_id = DEFAULT_TEACHER_ID;
            values.status = USER_STATUS.ACTIVE;
        }
        try {
            const res = await signupApi(signupBackendUrl, values);
            toastSuccess('Success', res.description ?? 'Signed up');
            navigate(`/auth/login${urlPart}`);
        }
        catch (err) { toastErrorApi(err) };
    };
    const onFinishFailed = () => {
        toastError('Error', 'Sign up failed due to incorrect user input!');
    };
    const handleChange = (value) => {
        const studentId = document.getElementById('student_id');
        if (value === USER_ROLE.PARENT) {
            if (studentId.classList.contains('d-none')) studentId.classList.remove('d-none');
        } else if (value === USER_ROLE.STUDENT) {
            if (!studentId.classList.contains('d-none')) studentId.classList.add('d-none');
        }
    };
    const fullWidthLayout = {
        labelCol: { span: 32 },
        wrapperCol: { span: 32 }
    }
    const defaultRoleObject = USER_ROLE_TYPE.NORMAL == userRoleType ? {
        role: USER_ROLE.STUDENT
    } : {
        role: USER_ROLE.BACKOFFICEUPLOADER
    }
    return (
        <div>
            <div className="flexbox-center-vertical">
                <h1>
                    Sign up for your new
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
                    account
                </h1>
                <Form
                    name="signup"
                    layout="vertical"
                    style={{
                        maxWidth: "450px",
                    }}
                    className="text-align-start"
                    initialValues={{
                        remember: true,
                        ...defaultRoleObject,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <br />
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label="First Name"
                                {...fullWidthLayout}
                                name="firstName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your first name!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                {...fullWidthLayout}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your last name!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Email"
                        name="userName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                            {
                                type: 'email',
                                message: 'Your email format is incorrect!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Display Name"
                        name="display_name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your disp!ay name',
                            },
                            { min: 4 },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {/* <Row gutter={8}>
                        <Col span={12}> */}
                            <Form.Item
                                label="Password"
                                {...fullWidthLayout}
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        pattern: PasswordValidationRegex,
                                        message: "Password must be 8 letters, have at least 1 uppercase letter, numbers, and special characters",
                                        // validateTrigger: 'onblur'
                                    },
                                    // { min: 4 },
                                    { max: 30 }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        {/* </Col>
                        <Col span={12}> */}
                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                {...fullWidthLayout}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The new password that you entered do not match!'));
                                        },
                                    }),
                                    { max: 30 }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        {/* </Col>
                    </Row> */}
                    {
                        USER_ROLE_TYPE.NORMAL == userRoleType ? (
                            <Row gutter={8}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Role"
                                        {...fullWidthLayout}
                                        name="role"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your role!',
                                            },
                                        ]}
                                    >
                                        <Select
                                            onChange={handleChange}
                                            options={[
                                                { value: USER_ROLE.PARENT, label: 'Parent' },
                                                { value: USER_ROLE.STUDENT, label: 'Student' },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12} className="d-none" id="student_id">
                                    <Form.Item
                                        label="Student ID"
                                        {...fullWidthLayout}
                                        name="student_id"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ) :
                            <Row gutter={8}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Role"
                                        {...fullWidthLayout}
                                        name="role"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your role!',
                                            },
                                        ]}
                                    >
                                        <Select
                                            defaultValue={USER_ROLE.BACKOFFICEUPLOADER}
                                            onChange={handleChange}
                                            options={[
                                                { value: USER_ROLE.BACKOFFICEUPLOADER, label: 'Uploader' },
                                                { value: USER_ROLE.BACKOFFICEREVIEWER, label: 'Reviewer' },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* <Col span={12} id="teacher_id">
                            <Form.Item
                                label="Teacher ID"
                                {...fullWidthLayout}
                                name="teacher_id"
                            >
                                <Input />
                            </Form.Item>
                        </Col> */}
                            </Row>
                    }

                    <br />

                    {/* <Form.Item
                        wrapperCol={{
                            
                            span: 8,
                        }}
                    > */}
                    <Button type="primary" block htmlType="submit">
                        Submit
                    </Button>
                    {/* </Form.Item> */}
                </Form>
                <br />
            </div>
        </div >
    )
}