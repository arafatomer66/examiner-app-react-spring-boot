

import { Space } from 'antd';
import { LOGIN_ADMIN_API } from 'src/_api/auth';
import { AuthForm } from 'src/components/auth';
import { USER_ROLE_TYPE, signStateKey } from 'src/lib/utils/constant';
import AuthLayout from '../layout';

export default function VerifyPage() {

  return (
    <AuthLayout>
      <Space size='small' direction="vertical" align='center' className='w-100'>
        <img src='/images/logo.png' alt="company-logo" width={200} height={150} />
        <div className="flexbox-center-vertical">
            <h1>
                Verify your account
            </h1>
            <div>
                Your accunt has been successully verified. Please 
                <a href='/auth/login'> login to your account </a>
            </div>
        </div>
      </Space>
    </AuthLayout>
  )
}