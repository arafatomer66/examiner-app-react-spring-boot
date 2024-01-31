import { FormatResponse, api, getHeaderTokenForSignal } from "..";

export const UPLOAD_PROFILE_URL = '/api/v1/user/uploadProfile';
export const uploadProfileImageApi = async ({signal}) => {
    const response = await api.get(UPLOAD_PROFILE_URL, {signal,
        ...getHeaderTokenForSignal()
    });
    if(response && response.status){
        return new FormatResponse(response);
    }
    else{
        return response
    }
};  