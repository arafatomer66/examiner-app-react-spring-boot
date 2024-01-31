import { ConfigProvider } from 'antd';
import 'src/index.css'
import theme from 'src/lib/ThemeConfig';
import LogoImg from 'src/assets/images/logo.png'
import Navbar from './app/HomeNavbar';
export default function Home() {
  return (
    <ConfigProvider theme={theme}>
      <main>
        <Navbar />
        <div className="flexbox-vertical-align flexbox-center-horizontal min-h-100vh">
          <img
            src='/images/logo.png'
            alt="EDGE EDUCATION LOGO"
            width={400}
            height={300}
          />
        </div>
      </main>
    </ConfigProvider>
  )
}
