
import { Button, Result, Space } from 'antd';

import { useContext } from 'react';
import { AuthContext } from 'src/lib/context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import DrawerLayout from './DrawerLayout';
import { LOGOUT_REDIRECT_URL, USER_ROLE, USER_ROLE_HUMAN_FRIENDLY_SMALL_CASE } from 'src/lib/utils/constant';
import { useDispatch } from 'react-redux';
import { resetSystem } from 'src/redux/services/system';
import { resetExam } from 'src/redux/services/exam';

export default function AppWelcomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleLogout, role } = useContext(AuthContext);
  const UserLayout = (<>
    <DrawerLayout>
      <main
      >
        <section>
          <div>
            <br /><br />
            <Space size='small' direction="vertical" justify="center" align='center' className='w-100 min-h-100vh'>
              1. hi welcome
              2. continue exam/ learning
              3. small hero
              4. learning resources link
              5. exam reources link - could be together with 4
              6. exam boards
              7. large hero
            </Space>
          </div>
        </section>
      </main>
    </DrawerLayout>
  </>)
  const AdminLayout = (
    <DrawerLayout>
      <main
      >
        <section>
          <div>
            <br /><br />
            <Space size='small' direction="vertical" justify="center" align='center' className='w-100 min-h-100vh'>
              <Result
                status="success"
                icon={<img src='/images/success-tick.png' alt="company-logo" width={150} height={150} />
                }
                title={`Successfully logged into your ${USER_ROLE_HUMAN_FRIENDLY_SMALL_CASE[role]} account!`}
                subTitle="You can now access your resources."
                extra={[
                  <Link to='/app/profile' key="profile">
                    <Button type="primary" key="profile">
                      Manage your profile
                    </Button>
                  </Link>,
                  <Button
                    key="logout"
                    onClick={
                      () => {
                        handleLogout();
                        dispatch(resetSystem())
                        dispatch(resetExam())
                        navigate(LOGOUT_REDIRECT_URL);
                      }
                    }
                  >Logout</Button>,
                ]}
              />
            </Space>
          </div>
        </section>
      </main>
    </DrawerLayout>
  )
  // if ([USER_ROLE.BACKOFFICEREVIEWER, USER_ROLE.UPLOADER].includes(role)) {
    return AdminLayout
  // }
  // else return UserLayout
}