


import { Space } from 'antd';
import { AuthForm } from 'src/components/auth';
import { USER_ROLE_TYPE, signStateKey } from 'src/lib/utils/constant';
import { LOGIN_NORMAL_API, SIGNUP_NORMAL_API } from 'src/_api/auth';
import AuthLayout from '../layout';

export default function SignupPage() {

  return (
    <AuthLayout>
    <Space size='small' direction="vertical" align='center' className='w-100'>
      <img src='/images/logo.png' alt="company-logo" width={200} height={150} />
      <AuthForm
        defaultActiveKey={signStateKey.SIGNUP}
        backendUrls={[LOGIN_NORMAL_API, SIGNUP_NORMAL_API]}
        userRoleType={USER_ROLE_TYPE.NORMAL} 
      />
    </Space>
    </AuthLayout>
  )
}