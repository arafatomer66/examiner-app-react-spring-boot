
import { useContext, useEffect, useRef, useState } from 'react';
import { downloadImageToAzure, initDriveApi, saveAndReadExcelAndMakeModuleApi } from 'src/_api/drive';
import { AuthContext } from 'src/lib/context/authContext';
import { DEFAULT_TEACHER_ID, LOCAL_STORAGE_KEYS, POPUP_CLOSE_URL } from 'src/lib/utils/constant';
import useDrivePicker from 'react-google-drive-picker'
import { Typography, Form, Upload, Button, Input, message, Image } from 'antd';
import { Select } from 'antd';
import { ToastContext } from 'src/lib/context/toastContext';
import { DeleteOutlined } from '@ant-design/icons';
const CLIENT_ID = "723971262594-srf14n1s0jcfb266rkh1g9b7vt0bmoav.apps.googleusercontent.com";
const API_KEY = "AIzaSyB7xsYgjv2tMGdEbUBmXObhff6DYwZ_KI0";
import Cookies from 'universal-cookie';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { DISPLAY_STATE } from 'src/lib/hooks/useCreateQuestion';
const { Title } = Typography;
import { UploadOutlined, RetweetOutlined  } from '@ant-design/icons';
import { baseURL } from 'src/_api';
import { newAbortSignal } from 'src/lib/utils/abortController';
import { setInputValue } from 'src/lib/utils/dom';

export default function DrivePickerImage({ name, label, previewImage }) {
  const [fileList, setFileList] = useState([]);
  const [isShowReview, setIsShowReview] = useState(true);
  return (
    <>
      <input id={name} name={name} type="hidden" />
      
      <Form.Item
        label={label ?? "No label"}
      >
        <div style={{ position: "relative" }}>
          <Upload
            style={{ display: "inline !important", maxWidth: "150px" }}
            name='file'
            action={baseURL + "/api/v1/blob/upload"}
            headers={{
              Authorization: localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZATION) ?? "",
            }}
            onChange={(info) => {
              console.log({ info })
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                if (info.file.response?.data?.file == null) {
                  message.error(`${info.file.name} file upload failed.`);
                  return;
                }
                setIsShowReview(true);
                setInputValue(name, info.file.response.data?.file)
                message.success(`${info.file.name} file uploaded successfully`);
                setFileList((prev) => { 
                  return [...prev, info.file];
                }  )
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            }}
          >
            <Button
              id={label ?? "No label"}
              style={{ display: "inline !important", borderRadius: "50%", borderColor: "1px solid gray" }}
              icon={<UploadOutlined />}>
            </Button>
          </Upload>
          <Button
            style={{
              display: "inline !important", borderRadius: "50%", borderColor: "1px solid gray",
              position: "absolute", top: "0px", left: "40px"
            }}
            icon={isShowReview ? <DeleteOutlined />: <RetweetOutlined/>}
            onClick={() => {
              if (isShowReview){
              setInputValue(name, null);
              setFileList([])
              setIsShowReview(false);
              message.success(`Deleted images!`);
              } else {
                setIsShowReview(true);
                setInputValue(name, previewImage);
                message.success(`Reset images done  !`);
              }
            }}
          >
          </Button>
          <span
            style={{
              display: "inline !important", borderRadius: "50%", borderColor: "1px solid gray",
              position: "absolute", top: "3px", left: "90px"
            }}
          >
            {/* {fileList[0] == null ? "No image added" : ""} */}
          </span>
        </div>
      </Form.Item>
      {
        previewImage!=null && isShowReview && 
        <Form.Item
          label="Preview"
        >
          <Image
            src={previewImage}
            style={{ maxHeight: "10vh", maxWidth: '10vw' }}
          />
        </Form.Item>
      }
    </>
  )
}