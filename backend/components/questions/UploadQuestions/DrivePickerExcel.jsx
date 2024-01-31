
import { useContext, useEffect, useState } from 'react';
import { initDriveApi, saveAndReadExcelAndMakeModuleApi, saveImagesforModuleApi } from 'src/_api/drive';
import { AuthContext } from 'src/lib/context/authContext';
import { LOCAL_STORAGE_KEYS, POPUP_CLOSE_URL } from 'src/lib/utils/constant';
import useDrivePicker from 'react-google-drive-picker'
import { Button, Space, Timeline, Popover, Typography, Select, Popconfirm } from 'antd';
import { ToastContext } from 'src/lib/context/toastContext';
import { DropboxOutlined, LogoutOutlined } from '@ant-design/icons';
const CLIENT_ID = "723971262594-srf14n1s0jcfb266rkh1g9b7vt0bmoav.apps.googleusercontent.com";
const API_KEY = "AIzaSyB7xsYgjv2tMGdEbUBmXObhff6DYwZ_KI0";
import Cookies from 'universal-cookie';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, changeIsCookieSet, selectSystemExamId, selectSystemIsCookieSet, selectSystemTeacherId } from 'src/redux/services/system';
import { fetchExamModulesApi } from 'src/_api/exam';
import { setModuleList } from 'src/redux/services/exam';
const { Title } = Typography;

const content = (
  <div>
    <br />
    <Title level={5}>Steps to upload via Google Drive</Title>
    <br />
    <Timeline
      items={[
        {
          children: 'Create a seperate folder for each exam in your Google Drive.',
        },
        {
          children: 'Click this button and sign in to your Google account to allow access to your Google Drive.',
        },
        {
          children: '(Optional) Choose "Upload" and upload the Excel file and images.',
        },
        {
          children: "(Alternative) You can do the previous step manually too, if you have a large number of images.",
        },
        {
          children: 'Click this button again and sign in to your Google account.',
        },
        {
          children: 'Choose "Google drive" and select the Excel file to download your questions.',
        },
      ]}
    />
  </div>
);


export default function DrivePickerExcel() {
  const dispatch = useDispatch();
  const teacherId = useSelector(selectSystemTeacherId);
  const examId = useSelector(selectSystemExamId);
  const cookies = new Cookies({ path: '/' });
  const isCookieSet = useSelector(selectSystemIsCookieSet);
  const [openPicker, authResponse] = useDrivePicker();
  const { toastSuccess, toastWarning, toastError } = useContext(ToastContext);
  console.log({ authResponse })
  const handleOpenPicker = () => {
    if (examId == null) {
      toastError("Please select an exam");
      return;
    }
    const driveAccessToken = cookies.get(LOCAL_STORAGE_KEYS.GOOGLE_DRIVE_AUTHORIZATION);

    const abortController = new AbortController();
    const signal = abortController.signal;
    // const driveAccessToken = null; 
    if (driveAccessToken == null) {
      fetchToken(signal);
      toastWarning("Login using the pop-up window!");
    }

    if (driveAccessToken != null) {
      openPicker({
        clientId: CLIENT_ID,
        developerKey: API_KEY,
        viewId: "DOCS",
        token: driveAccessToken,
        showUploadView: false,
        showUploadFolders: true,
        supportDrives: true,
        setSelectFolderEnabled: true,
        setIncludeFolders: true,
        customScopes: ['https://www.googleapis.com/auth/drive.readonly'],
        // if you need wider scope than default [https://www.googleapis.com/auth/drive.readonly
        multiselect: true,
        // customViews,
        // disableDefaultView: true,
        callbackFunction: (data) => {
          if (data.action === 'cancel') {
            console.log('User clicked cancel/close button')
          }
          else if (data.action === 'picked' && data.viewToken[0] === "all") {
            console.log({ selectedData: data })
            saveImagesforModuleApi(data.docs[0].id, examId, teacherId).then(res => {
              saveAndReadExcelAndMakeModuleApi(data.docs[0].id, {
                fileName: res.data?.fileName ?? "", examId, teacherId, uploadResults: res.data?.uploadResults ?? {}
              }
              ).then(_res2 => {
                fetchExamModulesApi(examId, teacherId, 0, 12).then(res3 => {
                  let { list, ...paginationData } = res3.data;
                  dispatch(setModuleList(list));
                })
                  .catch((error) => { console.log({ error }) })
                toastSuccess("File uploaded successfully with name= " + res.data?.fileName);
              })
                .catch((error) => { console.log({ error }) })
            })
              .catch((error) => { console.log({ error }) })
            // setSelected((prev) => [...prev, ...data.docs])
          }
          else if (data.action === 'picked' && data.viewToken[0] === "upload") {
            console.log({ uploadedData: data })
            // setUploads((prev) => [...prev, ...data.docs])
          }
        },
      })
    }
  }

  const fetchToken = (signal) => {
    const driveAccessToken = cookies.get(LOCAL_STORAGE_KEYS.GOOGLE_DRIVE_AUTHORIZATION);
    // const driveAccessToken = null;
    if (driveAccessToken == null) {
      initDriveApi({ signal }).then(res => {
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        const left = 200
        const top = 100

        window.open(
          res.data.url,
          "drive-excel-upload-module",
          `top=0, 
          scrollbars=yes,
          width=${width / 2}, 
          height=${height * 5 / 6}, 
          top=${top}, 
          left=${left}`
        );
      })
    }
  }

  useEffect(() => {
    const driveAccessToken = cookies.get(LOCAL_STORAGE_KEYS.GOOGLE_DRIVE_AUTHORIZATION);
    dispatch(changeIsCookieSet(driveAccessToken))
  }, [])
  return (
    <>
      {
        isCookieSet ?
          <>
            <Button id="drive-excel-upload-module" onClick={() => {
              handleOpenPicker()
            }}>
              Use Drive
              &nbsp;
              <DropboxOutlined style={{ fontSize: '1.5em', marginLeft: '5px', cursor: "pointer" }} />
            </Button>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to logout?"
              onConfirm={() => {
                const domain = import.meta.env.VITE_ENV == 'dev'? import.meta.env.VITE_DEV_DOMAIN : import.meta.env.VITE_TEST_DOMAIN;
                console.log({domain})
                console.log({domain})
                console.log({domain})
                cookies.remove(LOCAL_STORAGE_KEYS.GOOGLE_DRIVE_AUTHORIZATION, { path: '/', domain });
                toastSuccess("Logged out successfully");
                dispatch(changeIsCookieSet(false))
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button id="drive-excel-upload-module">
                Logout
                &nbsp;
                <LogoutOutlined style={{ fontSize: '1.5em', marginLeft: '5px', cursor: "pointer" }} />
              </Button>
            </Popconfirm>
          </>
          :
          <Popover placement="left" content={content} >
            <Button id="drive-excel-upload-module" onClick={
              () => { handleOpenPicker() }
            }>
              Signin
              &nbsp;
              <DropboxOutlined style={{ fontSize: '1.5em', marginLeft: '5px', cursor: "pointer" }} />
            </Button>
          </Popover>
      }

    </>
  )
}