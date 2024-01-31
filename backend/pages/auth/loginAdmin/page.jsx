

import { Space } from 'antd';
import { LOGIN_ADMIN_API } from 'src/_api/auth';
import { AuthForm } from 'src/components/auth';
import { USER_ROLE_TYPE, signStateKey } from 'src/lib/utils/constant';
import AuthLayout from '../layout';

export default function LoginAdminPage() {

  return (
    <AuthLayout>
      <Space size='small' direction="vertical" align='center' className='w-100'>
        <img src='/images/logo.png' alt="company-logo" width={200} height={150} />
        <AuthForm
          defaultActiveKey={signStateKey.SIGNIN}
          backendUrls={[LOGIN_ADMIN_API, '_']}
          userRoleType={USER_ROLE_TYPE.ADMIN}
          isOnlySignIn={true}
        />
      </Space>
    </AuthLayout>
  )
}