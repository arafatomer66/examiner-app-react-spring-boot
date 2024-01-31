


import { Space } from 'antd';
import { AuthForm } from 'src/components/auth';
import { USER_ROLE_TYPE, signStateKey } from 'src/lib/utils/constant';    // <==
import { LOGIN_BACKOFFICE_API, SIGNUP_BACKOFFICE_API } from 'src/_api/auth';
import AuthLayout from '../layout';

export default function LoginBackOfficePage() {

  return (
    <AuthLayout>
    <Space size='small' direction="vertical" align='center' className='w-100'>
      <img src='/images/logo.png' alt="company-logo" width={200} height={150} />
      <AuthForm
        defaultActiveKey={signStateKey.SIGNIN}
        userRoleType={USER_ROLE_TYPE.BACKOFFICE} 
        backendUrls={[LOGIN_BACKOFFICE_API, SIGNUP_BACKOFFICE_API]}
      />
    </Space>
    </AuthLayout>
  )
}