import PropTypes from 'prop-types';
import { createContext } from 'react';
export const ToastContext = createContext({ openNotification: null, toastErrorApi: null, toastSuccess: null, toastWarning: null, toastError: null });
import { notification } from 'antd';
import { TOAST_POSITION } from 'src/lib/utils/constant';
import { Outlet } from 'react-router-dom';

export const ToastContextContextProvider = ({
    children,
}) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = ({ placement = TOAST_POSITION.TOP_RIGHT, message, description, role, type }) => {
        api.open({
            message,
            description,
            placement,
            role,
            type
        });
    };
    const toastSuccess = (message, description) => {
        api.open({
            message,
            description,
            placement: TOAST_POSITION.TOP_RIGHT,
            role: 'status',
            type: 'success'
        });
    }
    const toastWarning = (message, description) => {
        api.open({
            message,
            description,
            placement: TOAST_POSITION.TOP_RIGHT,
            role: 'status',
            type: 'warning'
        });
    }
    const toastError = (message, description) => {
        api.open({
            message,
            description,
            placement: TOAST_POSITION.TOP_RIGHT,
            role: 'alert',
            type: 'error'
        });
    }
    const toastCatchError = (error) => {
        api.open({
            message: `${error.response?.status || ""} Error: ${error.response?.data?.error || error.message}`,
            description: `Error occurred`,
            placement: TOAST_POSITION.TOP_RIGHT,
            role: 'alert',
            type: 'error'
        });
    }
    const toastErrorApi = (err) => {
        toastError(err.response?.status + " Status Code" ?? "Error occurred", err.response?.data?.message ?? err.message);
    }
    return (
        <ToastContext.Provider value={{ openNotification, toastError, toastSuccess, toastWarning, toastErrorApi, toastCatchError }}>
            {contextHolder}
            <Outlet />  
        </ToastContext.Provider>
    );
};

export default ToastContextContextProvider;