

import { USER_ROLE_TYPE, signStateKey } from "src/lib/utils/constant";
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";
import { Tabs } from 'antd';
import { useNavigate } from "react-router-dom";
export const AuthForm = ({
  defaultActiveKey,
  backendUrls,
  isOnlySignUp,
  isOnlySignIn,
  userRoleType
}) => {
  const navigate = useNavigate();
  const [loginBackendUrl, signupBackendUrl] = backendUrls;
  let urlPart = '';
  switch (userRoleType) {
    case USER_ROLE_TYPE.ADMIN:
      urlPart = 'Admin';
      break;
    case USER_ROLE_TYPE.BACKOFFICE:
      urlPart = 'Backoffice';
      break;
  }
  const items = [
    {
      ...(isOnlySignUp ? {} : {
        key: signStateKey.SIGNIN,
        label: signStateKey.SIGNIN,
        children: <SigninForm userRoleType={userRoleType} loginBackendUrl={loginBackendUrl} />,
      })
    },
    {
      ...(isOnlySignIn ? {} : {
        key: signStateKey.SIGNUP,
        label: signStateKey.SIGNUP,
        children:
          <>
            <SignupForm
              userRoleType={userRoleType}
              urlPart={urlPart} signupBackendUrl={signupBackendUrl}
            />
          </>,
      })
    },
  ];
  return (
    <>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        items={items}
        onChange={(key) => {
          if (key === signStateKey.SIGNIN) {
            navigate(`/auth/login${urlPart}`);
          }
          else {
            navigate(`/auth/signup${urlPart}`);
          }
        }}
        centered={true}
      />
    </>
  )
}