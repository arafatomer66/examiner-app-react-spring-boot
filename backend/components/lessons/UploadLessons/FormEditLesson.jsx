import React, { useContext, useEffect, useState } from 'react';
import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Typography,
  Select,
  Modal,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { fetchSubjectByExamIdAndTeacherIdApi, fetchTopicBySubjectIdAndTeacherIdApi } from 'src/_api/exam';
import { ToastContext } from 'src/lib/context/toastContext';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { CustomModal } from 'src/components/sharing/CustomModal';
import { editLessonMap, selectCurrentLesson, selectModalState, selectSubjectList, setCurrentLesson, setModalState } from 'src/redux/services/lesson';
import { editLessonApi } from 'src/_api/lesson';
import { MODAL_ROUTE_MESSAGE } from 'src/lib/utils/constant';
const { Option } = Select;
const { Title } = Typography;

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

export const FormEditLesson = ({
}) => {
  const dispatch = useDispatch();
  const currentLesson = useSelector(selectCurrentLesson);
  const teacherId = useSelector(selectSystemTeacherId);
  const examId = useSelector(selectSystemExamId);
  const modalState = useSelector(selectModalState);
  const { toastError, toastSuccess } = useContext(ToastContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    let postData = {}
    postData = {
      title: values.lessonTitle,
      url: values.lessonVideoUrl,
      topicId: values.lessonTopic,
      subjectId: values.lessonSubject,
      sequence: values.lessonSequence,
    }
    try {
      const respose = await editLessonApi(currentLesson?.id, postData);
      if (respose && respose.data && respose.data.lesson) {
        let isChanged = 0;  // 0 for false
        if ('isChanged' in currentLesson) {
          isChanged = currentLesson.isChanged + 1;
        }
        else {
          isChanged = 1;
        }
        dispatch(editLessonMap({ ...respose.data?.lesson ?? {}, isChanged }));

        toastSuccess("Lesson edit successfully!");
        setIsOpenModal(false);
      }
      else {
        toastError("Lesson edit failed!");
      }
    }
    catch (err) {
      toastError(err.message);
    }

    form.resetFields();
  };

  const closeModal = () => {
    dispatch(setModalState(null));
    setIsOpenModal(false);
  }

  const onFinishFailed = () => {
    toastError('Error', 'Sign up failed due to incorrect user input!');
  };

  const subjectList = useSelector(selectSubjectList);
  const [topicList, setTopicList] = useState([]);

  const fetchTopics = async (subjectId, examId) => {
    const response = await fetchTopicBySubjectIdAndTeacherIdApi(subjectId, examId);
    const data = await response.data.topic;
    setTopicList(data);
  }

  useEffect(() => { 
    fetchTopicBySubjectIdAndTeacherIdApi(currentLesson?.subjectId, examId).then((response) => {
      const data = response.data.topic;
      setTopicList(data);
    })
  }, [currentLesson?.id]);

  useEffect(() => {
    if (modalState==MODAL_ROUTE_MESSAGE.LESSON_EDIT_MODAL) {
      setIsOpenModal(true);
      form.setFieldsValue({
        lessonTitle: currentLesson?.title ?? "",
        lessonVideoUrl: currentLesson?.url ?? "",
        lessonTopic: currentLesson?.topicId ?? -1,
        lessonSubject: currentLesson?.subjectId ?? -1,
        lessonSequence: currentLesson?.sequence ?? -1,
      })
    }
    else {
      dispatch(setModalState(null))
    }
  }, [modalState, currentLesson?.id]);

  if (subjectList == null) {
    return <></>
  }

  return (
    <CustomModal
      isOpenModal={isOpenModal}
      title="Edit Lesson"
      onCancel={() => closeModal()}
      onOk={() => closeModal()}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
          <Input type="text" />
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
          name="lessonSequence"
          label="Sequence"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lessonVideoUrl"
          label="Video URL"
        >
          <Input />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" style={{ minWidth: "250px" }} htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </CustomModal>
  );
};