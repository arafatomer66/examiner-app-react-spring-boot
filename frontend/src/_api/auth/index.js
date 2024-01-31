import { api, FormatResponse, getHeaderTokenForSignal } from '../index';
export const LOGIN_NORMAL_API = 'login';
export const LOGIN_BACKOFFICE_API = 'loginBackoffice'
export const LOGIN_ADMIN_API = 'loginAdmin';
export const SIGNUP_NORMAL_API = 'signup'
export const SIGNUP_BACKOFFICE_API = 'signupBackoffice'
export const GET_ME_API = 'api/v1/user/getMe';
export const CHANGE_ME_API = 'api/v1/user/changeUser';

export const loginApi = async (url, data) => {
    const response = await api.post(url, data);
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};

export const signupApi = async(url, data) => {
    const response = await api.post(url, data)
    if(response && response.status){
        return new FormatResponse(response)
    }
    else{
        return response
    }
}


export const getMeApi = async({signal}
    // , refetch=false
    ) => {
    // let data = {}   
    // if (!refetch) {
    //     let userJSON = localStorage.getItem('user');
    //     let subscriptionJSON = localStorage.getItem('subscription');
    //     let planJSON = localStorage.getItem('plan');
    //     data= {
    //         user: JSON.parse( userJSON ?? {} ),
    //         subscription: JSON.parse(subscriptionJSON ?? {}),
    //         plan: JSON.parse(planJSON ?? {}),
    //     }
    //     return {
    //         data
    //     }

    // }
    const response = await api.get(GET_ME_API, {signal,
        ...getHeaderTokenForSignal() 
    })
    if(response && response.status){
        return new FormatResponse(response)
    }
    else{
        return response
    }
}

export const changeUserApi = async(data) => {
    const response = await api.post(CHANGE_ME_API, data)
    if(response && response.status){
        return new FormatResponse(response)
    }
    else{
        return response
    }
}