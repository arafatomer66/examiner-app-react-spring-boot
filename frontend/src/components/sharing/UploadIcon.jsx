import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { LOCAL_STORAGE_KEYS } from 'src/lib/utils/constant';
import { UPLOAD_PROFILE_URL } from 'src/_api/image';
import { baseURL } from 'src/_api';
export const UploadIcon = ({ setImage, className=null }) => (
    <Upload
        name='file'
        action={baseURL + "/" + UPLOAD_PROFILE_URL}
        headers={{
            Authorization: localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZATION) ?? "",
        }}
        className={className!=null ? className : ""}
        onChange={(info, data, data2) => {
            console.log({ info, data, data2 })
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                setImage(info.file.response.data?.file);
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }}
    >
        <Button
            style={{ borderRadius: "50%", borderColor: "1px solid gray", position: "relative", top: "30px", left: "-30px" }}
            icon={<UploadOutlined />}>
        </Button>
    </Upload >
);