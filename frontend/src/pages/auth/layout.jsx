import { ConfigProvider } from 'antd';
import theme from 'src/lib/ThemeConfig';
import PropTypes from 'prop-types';
import './layout.css';
  
export default function AuthLayout({ children }) {

    return (
        <ConfigProvider theme={theme}>
        <main
        >
            <section>
                <div className='grid-two-columns'>
                    <div className='d-none-at-mobile flexbox-vertical-between-at-desktop min-h-100vh'>
                        <div className='bg-auth-image'>
                        </div>
                        <div>
                            Hi
                        </div>

                    </div>
                    <div className='flexbox-center-vertical text-align-center'>
                        {children}
                    </div>
                </div>
            </section>
        </main>
        </ConfigProvider>
    )
}
