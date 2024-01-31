
import { Space } from 'antd';
import { Typography } from 'antd';
import DrawerLayout from '../../DrawerLayout';


const { Title } = Typography;

export default function BackofficePage() {

  return (
    <DrawerLayout>
    <main
    >
      <section>
        <div>
          <Space size='small' direction="vertical" justify="center" align='center' className='w-100 min-h-100vh'>
          <br/> <br/>
          <Title level={2}>Manage Back ofice</Title>
          </Space>
        </div>
      </section>
    </main>
    </DrawerLayout>
  )
}