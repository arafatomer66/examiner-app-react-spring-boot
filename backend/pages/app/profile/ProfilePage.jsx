import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Select, Space, Row, Col, Image, Divider } from 'antd';
import { ToastContext } from 'src/lib/context/toastContext';
import DrawerLayout from '../DrawerLayout';
import { useJSMediaQuery } from 'src/lib/hooks/useJSMediaQuery';
import { changeUserApi, getMeApi } from 'src/_api/auth';
import { newAbortSignal } from 'src/lib/utils/abortController';
import { AuthContext } from 'src/lib/context/authContext';
import { USER_ROLE } from 'src/lib/utils/constant';
import { PlusCircleOutlined } from '@ant-design/icons';
import { blue, gray } from '@ant-design/colors';
import { UploadIcon } from 'src/components/sharing/UploadIcon';
import './ProfilePage.module.css'
import { Loading } from 'src/components/sharing/Loading';
import { AppNavbarLayout } from '../AppNavbarLayout';
import { useSelector } from 'react-redux';
import { selectSystemTeacherId } from 'src/redux/services/system';
const { Option } = Select;
const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
  },
};

export const ProfilePage = () => {
  const [form] = Form.useForm();
  const teacherId = useSelector(selectSystemTeacherId);
  const { toastError, toastSuccess, toastCatchError } = useContext(ToastContext);
  // const { isBigScreen, isDesktopOrLaptop, isMobile, isTablet, isSmallMobile } = useJSMediaQuery();
  // console.log({ isBigScreen, isDesktopOrLaptop, isMobile, isTablet, isSmallMobile });
  const onFinish = async (values) => {
    delete values.password;
    delete values.role;
    changeUserApi(values)
      .then(res => {
        if (res.data && res.data.user != null) {
          handleProfile({ ...profile, ...res.data.user })
          toastSuccess('Success', 'Your profile has been updated!');
        }
      })
      .catch(err => {
        toastCatchError(err);
      })
    console.log('Form values:', values);
  };

  const onFinishFailed = () => {
    toastError('Error', 'Form submission failed due to incorrect user input!');
  };
  const handleProfileImage = (profileImage) => {
    handleProfile({ ...profile, profileImage })
  }
  const { profile, handleProfile, role } = useContext(AuthContext);
  if (profile == null) {
    return <Loading />
  }
  return (
    <DrawerLayout>
      <main
      >
        <section>
          <div>
            <AppNavbarLayout />
            <Space size='small' direction="vertical" justify="center" align='center' className='w-100 min-h-100vh'>
              <Form
                {...formItemLayout}
                form={form}
                name="ProfilePage"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                  firstName: profile?.user?.firstName ?? "Your First Name",
                  lastName: profile?.user?.lastName ?? "Your Last Name",
                  userName: profile?.user?.username ?? "Your User Name",
                  role: profile?.user?.role ?? "Your Role",
                  password: "DummyDummyDummyDummy",
                  displayName: profile?.user?.displayName ?? "Your Display Name",
                  teacherId: teacherId ?? "Your Teacher ID",
                  role_id: profile?.user?.id ?? "Your Role ID",
                }}
                labelAlign='left'
                layout="vertical"
                style={{
                  maxWidth: '700px',
                  margin: 'auto',
                }}
                scrollToFirstError
              >
                <br />
                <Title level={3} style={{ textAlign: 'center' }}>
                  User Profile
                </Title>
                <Space className='group-parent-hover'
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>

                  <Image
                    width={100}
                    height={100}
                    style={{ borderRadius: '50%', objectFit: 'cover', margin: "auto" }}
                    src={profile?.user?.profileImage ?? '/images/profile.jpg'}
                  />
                  <UploadIcon className="group-child-hover-show" setImage={handleProfileImage} />
                  {/* <PlusCircleOutlined style={{ position: 'relative', top: "40px", color: gray[5], fontSize: '30px', cursor: "pointer" }} /> */}
                </Space>
                <Row gutter={6} style={{ display: 'flex', justify: 'space-between' }}>
                  <Col span={{ xs: 24, lg: 12 }}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[
                        { required: true, message: 'Please input the first name!' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={{ xs: 24, lg: 12 }}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[
                        { required: true, message: 'Please input the last name!' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={6} style={{ display: 'flex', justify: 'space-between' }}>
                  <Col span={{ xs: 24, lg: 12 }}>
                    <Form.Item
                      name="userName"
                      label="Email"
                      rules={[
                        { required: true, message: 'Please input the user name!' },
                      ]}
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={{ xs: 24, lg: 12 }}>
                    <Form.Item
                      name="displayName"
                      label="Display Name"
                      rules={[
                        { required: true, message: 'Please input the display name!' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={6} style={{ display: 'flex', justify: 'space-between' }}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { message: 'Please input the display name!' },
                    ]}
                  >
                    <Input type="password" readOnly />
                  </Form.Item>
                  <Form.Item
                    name="role"
                    label="Role"
                    rules={[
                      { required: true, message: 'Please select a role!' },
                    ]}
                  >
                    <Input readOnly disabled />
                  </Form.Item>
                </Row>
                <div style={{ justifyContent: 'space-around', display: 'flex' }}>
                  <Form.Item name="submitType">
                    <Button value="close" type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                  {/* <Form.Item name="submitType">
                    <Button value="again" type="primary" htmlType="submit">
                      Change Password
                    </Button>
                  </Form.Item> */}
                </div>
                {/* {[
                  USER_ROLE.BACKOFFICEREVIEWER, USER_ROLE.BACKOFFICEUPLOADER, USER_ROLE.STUDENT
                ].includes(role) &&
                  <>
                    <Divider orientation='left'>
                      Other information
                    </Divider>
                    <Row gutter={6} style={{ display: 'flex', justify: 'space-between' }}>
                      <Form.Item
                        name="role_id"
                        label="ID"
                        rules={[
                          { required: true, message: 'Please input the teacher ID!' },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="teacherId"
                        label="Teacher ID"
                        rules={[
                          { required: true, message: 'Please input the teacher ID!' },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Row>
                  </>
                } */}
              </Form>
            </Space>
          </div>
        </section>
      </main>
    </DrawerLayout>
  );
};

export default ProfilePage;