
import { useContext, useEffect, useState } from 'react';
import { initDriveApi, saveAndReadExcelAndMakeLessonApi, saveAndReadExcelAndMakeModuleApi } from 'src/_api/drive';
import { AuthContext } from 'src/lib/context/authContext';
import { LOCAL_STORAGE_KEYS, POPUP_CLOSE_URL } from 'src/lib/utils/constant';
import useDrivePicker from 'react-google-drive-picker'
import { Button, Popconfirm, Space } from 'antd';
import { Typography } from 'antd';
import { Select } from 'antd';
import { ToastContext } from 'src/lib/context/toastContext';
import { DropboxOutlined } from '@ant-design/icons';
const CLIENT_ID = "723971262594-srf14n1s0jcfb266rkh1g9b7vt0bmoav.apps.googleusercontent.com";
const API_KEY = "AIzaSyB7xsYgjv2tMGdEbUBmXObhff6DYwZ_KI0";
import Cookies from 'universal-cookie';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, changeIsCookieSet, selectSystemExamId, selectSystemIsCookieSet, selectSystemTeacherId } from 'src/redux/services/system';
import { DISPLAY_STATE } from 'src/lib/hooks/useCreateQuestion';
import { selectCurrentSubject, selectLessonMap, selectTopicMap, setLessonMap, setTopicMap } from 'src/redux/services/lesson';
import { fetchLessonsApi } from 'src/_api/lesson';
const { Title } = Typography;

export default function DrivePickerExcelLesson({ setDisplayState }) {
  const dispatch = useDispatch();
  const teacherId = useSelector(selectSystemTeacherId);
  const examId = useSelector(selectSystemExamId);
  const cookies = new Cookies({ path: '/' });
  const currentSubject = useSelector(selectCurrentSubject);
  const [openPicker, authResponse] = useDrivePicker();
  const isCookieSet = useSelector(selectSystemIsCookieSet);
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
        showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        setSelectFolderEnabled: true,
        setIncludeFolders: true,
        customScopes: ['https://www.googleapis.com/auth/drive.readonly'],
        multiselect: true,
        callbackFunction: (data) => {
          if (data.action === 'cancel') {
            console.log('User clicked cancel/close button')
          }
          else if (data.action === 'picked' && data.viewToken[0] === "all") {
            console.log({ selectedData: data })
            saveAndReadExcelAndMakeLessonApi(data.docs[0].id, examId, teacherId).then(res => {
              toastSuccess("File uploaded successfully");
              if (currentSubject == null || currentSubject?.id == null) return;
              if (res.data && res.data.lesson && Array.isArray(res.data.lesson)) {
                fetchLessonsApi({
                  examId,
                  subjectId: currentSubject?.id,
                }).then(res => {
                  let { list, topicMap } = res.data;
                  dispatch(setLessonMap(list));
                  dispatch(setTopicMap(topicMap));
                })
                  .catch(err => {
                    toastError("Failed to fetch lessons or lessons for this subject/ exam is empty");
                  })
              }
            })

              .catch(() => toastError("File upload failed"))
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
      {isCookieSet ?
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
              onConfirm={()=>{
                const domain = import.meta.env.VITE_ENV == 'dev'? import.meta.ev.VITE_DEV_DOMAIN : import.meta.ev.VITE_TEST_DOMAIN;
                console.log({domain})
                console.log({domain})
                console.log({domain})
                cookies.remove(LOCAL_STORAGE_KEYS.GOOGLE_DRIVE_AUTHORIZATION, { path: '/',
                
              });
                toastSuccess("Logged out successfully");
                dispatch(changeIsCookieSet(false))
              }}
              okText="Yes"
              cancelText="No"
          >
            <Button id="drive-excel-upload-module">
              <DropboxOutlined style={{ fontSize: '1.5em', marginLeft: '5px', cursor: "pointer" }} />
            </Button>
          </Popconfirm>

        </>
        :
        <Button id="drive-excel-upload-module" onClick={() => {
          handleOpenPicker()
        }}>
          Signin
          &nbsp;
          <DropboxOutlined style={{ fontSize: '1.5em', marginLeft: '5px', cursor: "pointer" }} />
        </Button>
      }
    </>
  )
}