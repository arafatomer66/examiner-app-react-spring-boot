import React, { useContext, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { LOGOUT_REDIRECT_URL } from 'src/lib/utils/constant';
import { AuthContext } from '../context/authContext';
import { resetSystem } from 'src/redux/services/system';
import { resetExam } from 'src/redux/services/exam';
import { useDispatch } from 'react-redux';

const useRedirectIfRoleUndefined = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const pathName = location.pathname;
    const { role } = useContext(AuthContext);
    useEffect(() => {
        const publicPathRegexList = [/^\/auth/];
        const publicPathURLList = ['/'];
        const path = pathName.split('?')[0];
        if (
            !publicPathRegexList.some((publicPathRegex) => publicPathRegex.test(path))
            &&
            !publicPathURLList.includes(path)

        ) {
            if (role == null) {
                navigate(LOGOUT_REDIRECT_URL);
                dispatch(resetSystem())
                dispatch(resetExam())
            }
        }
    }, [role]);

    return []

};

export default useRedirectIfRoleUndefined;