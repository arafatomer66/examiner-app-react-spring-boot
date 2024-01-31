import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Typography,
  Select,
  Alert,
} from 'antd';
import { fetchSubjectByExamIdAndTeacherIdApi, fetchTopicBySubjectIdAndTeacherIdApi } from 'src/_api/exam';
import { ToastContext } from 'src/lib/context/toastContext';
const { Option } = Select;
const { Title } = Typography;
import { useSelector, useDispatch } from "react-redux";
import { selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { CustomModal } from 'src/components/sharing/CustomModal';
import { createLessonApi, fetchLessonsApi } from 'src/_api/lesson';
import {  selectLessonMap, selectModalState, selectSubjectList, selectTopicMap, setLessonMap, setModalState, setTopicMap } from 'src/redux/services/lesson';
import { MODAL_ROUTE_MESSAGE } from 'src/lib/utils/constant';
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

export const FormAddLesson = ({
}) => {
  const dispatch = useDispatch();
  const teacherId = useSelector(selectSystemTeacherId);
  const examId = useSelector(selectSystemExamId);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const modalState = useSelector(selectModalState);
  const lessonMap = useSelector(selectLessonMap);
  const { toastError, toastSuccess, toastCatchError } = useContext(ToastContext);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    let postData = {}
    postData = {
      title: values.lessonTitle,
      url: values.lessonVideoUrl,
      topicId: values.lessonTopic,
      subjectId: values.lessonSubject,
    }
    try {
      const respose = await createLessonApi(postData);
      if (respose && respose.data && respose.data.lesson && respose.data.lesson.topicId && respose.data.lesson.subjectId) {
        fetchLessonsApi(
          {
            examId,
            subjectId: respose.data.lesson.subjectId,
          }
        )
          .then((response) => {
            dispatch(setLessonMap(response.data?.list ?? {}))
            dispatch(setTopicMap(response.data?.topicMap ?? {}))
          })
          .catch(() => {
            dispatch(setLessonMap({}))
            dispatch(setTopicMap({}))
            toastError("Failed to fetch lessons or lessons for this subject/ exam is empty");
          });
        toastSuccess("Lesson created successfully!");
        if (values.submitType != "again") {
          setIsOpenModal(false);
        }
      }
      else toastError("Lesson creation failed!");
    }
    catch (err) { toastCatchError(err); }
    form.resetFields();
  };

  const onFinishFailed = () => {
    toastError('Error', 'Sign up failed due to incorrect user input!');
  };

  const [topicList, setTopicList] = useState([]);
  const subjectList = useSelector(selectSubjectList)

  const fetchTopics = async (subjectId, examId) => {
    const response = await fetchTopicBySubjectIdAndTeacherIdApi(subjectId, examId);
    const data = await response.data.topic;
    setTopicList(data);
  }

  const closeModal = () => {
    setIsOpenModal(false);
  }

  useEffect(() => {
    if (modalState==MODAL_ROUTE_MESSAGE.LESSON_ADD_MODAL) {
        setIsOpenModal(true);
    }
    else if (isOpenModal == true) {
      setIsOpenModal(false);
    }
  }, [modalState]);

  if (subjectList == null || subjectList[0] == null) {
    return <Alert type="error"  message="No subject list for this exam! Can't add or use Excel file!" />
  }

  return (
    <CustomModal
      isOpenModal={isOpenModal}
      setIsOpenModal={setIsOpenModal}
      title="Add Lesson"
      onOk={() => {
        closeModal();
      }}
      onCancel={() => {
        closeModal();
      }}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="add"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
        }}
        style={{
          maxWidth: 600,
          margin: 'auto',
        }}
        scrollToFirstError
      >
        <br />

        <Title level={5} style={{ marginLeft: "20px" }}>
          Enter the lesson details.
        </Title>

        <Form.Item
          name="lessonTitle"
          label="Lesson title"
          rules={[
            { required: true, message: 'Please input the title!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lessonSubject"
          label="Subject"
          rules={[
            { required: true, message: 'Please input the subject!' }
          ]}
        >
          <Select
            onChange={(value) => {
              fetchTopics(value, examId);
            }}
          >
            {subjectList.map((subject) => {
              return (
                <Option key={`${subject.id}${subject.title}`} value={subject.id}>{subject.title}</Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="lessonTopic"
          label="Category"
          rules={[
            { required: true, message: 'Please input the category!' }
          ]}
        >
          <Select
          >
            {topicList.map((topic) => {
              return (
                <Option key={`${topic.id}${topic.title}`} value={topic.id}>{topic.title}</Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="lessonVideoUrl"
          label="Video Link"
          rules={[
            { required: true, message: 'Please input the video link!' },
            {
              pattern: new RegExp(
                "^(https://vimeo.com/)([0-9]{9})$"
              ),
              message: "Please input a valid Vimeo link!"
            }
          
          ]}
        >
          <Input />
        </Form.Item>

        <div style={{ justifyContent: "space-around", display: "flex" }}>
          <Form.Item
            name="submitType"
          >
            <Button value="close" type="primary" style={{ minWidth: "250px" }} htmlType="submit">
              Submit
            </Button>
          </Form.Item>
            {/* <Form.Item
              name="submitType"
            >
              <Button value="again" type="primary" style={{ minWidth: "250px" }} htmlType="submit">
                Submit and Add New
              </Button>
            </Form.Item> */}
        </div>

      </Form>
    </CustomModal>
  );
};