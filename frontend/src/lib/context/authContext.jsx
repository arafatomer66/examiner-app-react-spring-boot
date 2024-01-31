import { createContext, useEffect, useState } from "react";
import { LOCAL_STORAGE_KEYS, NORMAL_LOGIN_URL, SIGNIN_VIEW } from "../utils/constant";
import { newAbortSignal } from "../utils/abortController";
import { getMeApi } from "src/_api/auth";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZATION ?? null));
    const [role, setRole] = useState(localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE ?? null));
    const [profile, setProfile] = useState(null);

    const handleLogin = (apiData) => {
        const userdata = apiData.data;
        if ('token' in userdata) localStorage.setItem(LOCAL_STORAGE_KEYS.AUTHORIZATION, userdata.token);
        if ('role' in userdata) localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, userdata.role);
        setAccessToken(userdata.token)
        setRole(userdata.role);
    };

    useEffect(() => {
        const [abortController, signal] = newAbortSignal();
        if (accessToken != null && role != null) {
            getMeApi({
                signal
            })
                .then(res => {
                    console.log({ res })
                    setProfile(res.data)
                })
                .catch(()=> {
                });
        }
        return () => {
            abortController.abort();
        }
    }, [accessToken]);

    const handleLogout = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTHORIZATION);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ROLE);
        setAccessToken(null);
        setRole(null);
    }

    return (
        <Provider
            value={{
                handleLogin: (apiData) => handleLogin(apiData),
                handleLogout: () => handleLogout(),
                accessToken,
                role,
                profile, 
                handleProfile: (apiData) => setProfile(apiData),
            }}
        >
            {children}
        </Provider>
    );
};


export { AuthContext, AuthProvider };