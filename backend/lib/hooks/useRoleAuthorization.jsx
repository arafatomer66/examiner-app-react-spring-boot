import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetSystem } from 'src/redux/services/system';
import { LOGOUT_REDIRECT_URL } from '../utils/constant';
import { resetExam } from 'src/redux/services/exam';
import { useDispatch } from 'react-redux';

const useRoleAuthorization = (userRole, allowedRoles, redirectPath="/app/welcome") => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  useEffect(() => {
    if (!(userRole && allowedRoles.includes(userRole))) {
      navigate(redirectPath);
    }
    if (userRole == null) {
        navigate(LOGOUT_REDIRECT_URL);
        dispatch(resetSystem())
        dispatch(resetExam())
    }
  }, [userRole, allowedRoles, history, redirectPath]);
};

export default useRoleAuthorization;