
import { Button, Result, Space } from 'antd';

import { useContext } from 'react';
import { AuthContext } from 'src/lib/context/authContext';
import DrawerLayout from '../../DrawerLayout';
export default function StudentPage() {

  return (
    <DrawerLayout>
    <main
    >
      <section>
        <div>
          <br /><br />  
          <Space size='small' direction="vertical" justify="center" align='center' className='w-100 min-h-100vh'>
            Manage Students
          </Space>
        </div>
      </section>
    </main>
    </DrawerLayout>
  )
}