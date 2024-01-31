/* eslint-disable no-fallthrough */

import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Typography,
  Select,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { MCQ_KEYS_LIST, QUESTION_DIFFICULTY, QUESTION_STATUS, QUESTION_TYPE } from 'src/lib/utils/constant';
import { fetchSubjectByExamIdAndTeacherIdApi, fetchTopicBySubjectIdAndTeacherIdApi } from 'src/_api/exam';
import { createQuestionApi } from 'src/_api/question';
import { ToastContext } from 'src/lib/context/toastContext';
const { Option } = Select;
const { Title } = Typography;
import { useSelector, useDispatch } from "react-redux";
import { selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { selectExamModuleId, setQuestionStringToFetch } from 'src/redux/services/exam';
import DrivePickerImage from './DrivePickerImage';
import { getInputValue } from 'src/lib/utils/dom';
import { isEmptyString, returnNullIfIsEmptyString } from 'src/lib/utils/isEmpty';
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

export const FormAdd = ({
  setIsOpenModal,
}) => {
  const dispatch = useDispatch();
  const moduleId = useSelector(selectExamModuleId)
  const teacherId = useSelector(selectSystemTeacherId);
  const examId = useSelector(selectSystemExamId);
  const { toastError, toastSuccess, toastCatchError } = useContext(ToastContext);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    let postData = {}, isValid = true;

    let imageUrl = getInputValue("imageUrl");
    if (isEmptyString(values.questionText) && isEmptyString(imageUrl)) {
      isValid = false;
      toastError("Please input a text or image for the question")
    }
    // Question
    postData.question = {
      status: QUESTION_STATUS.CREATED,
      text: values.questionText,
      imageUrl,
      difficulty: values.questionDifficulty,
      exam_id: examId,
      topic_id: values.questionTopic,
      teacher: {
        id: teacherId
      },
      subject_id: values.questionSubject,
      comment: null,
    }
    if (isEmptyString(values.questionText) && isEmptyString(imageUrl)) {
      isValid = false;
      toastError("Please input a text or image for the quuestion! ")
    }
    // Options
    postData.options = [];
    if (optionsLength > 0) {
      for (let i = 0; i < optionsLength; i++) {
        let optionImageUrl = returnNullIfIsEmptyString(getInputValue(`optionImageValue${i}`))
        if (isEmptyString(values[`optionValue${i}`]) && optionImageUrl == null) {
          isValid = false;
          toastError("Please input a text or image for the option! " + MCQ_KEYS_LIST[i])
        }
        postData.options.push({
          'key': MCQ_KEYS_LIST[i],
          value: values[`optionValue${i}`],
          imageUrl: optionImageUrl
        })
      }
    }

    let imageUrlExplanation = returnNullIfIsEmptyString(getInputValue("explanationImageUrl"))
    let videoUrlExplanation = returnNullIfIsEmptyString(values.explanationVideoUrl)
    if (
      isEmptyString(values.explanationAnswer)
    ) {
      isValid = false;
      toastError("Error", "Please input a correct answer!")
    }
    // Explanation
    postData.explanation = {
      text: values.explanationText,
      imageUrl: imageUrlExplanation,
      videoUrl: videoUrlExplanation,
      correctAnswer: values.explanationAnswer,
    }

    if (!isValid) {
      return;
    }

    try {
      const respose = await createQuestionApi(postData, moduleId);

      if (respose && respose.data && respose.data.module && respose.data.module.questions) {
        dispatch(setQuestionStringToFetch(respose.data.module.questions))
        toastSuccess("Question created successfully!");
        if (values.submitType != "again") {
          setIsOpenModal(false);
        }
      }
      else toastError("Error occurred");
    }
    catch (err) { toastCatchError(err); }
    finally {
      form.resetFields();
    }
  };

  const onFinishFailed = () => {
    toastError('Error', 'Sign up failed due to incorrect user input!');
  };

  const [optionsLength, setOptionsLength] = useState(0);
  const [subjectList, setSubjectList] = useState([]);
  const [topicList, setTopicList] = useState([]);

  const fetchSubjects = async (examId, teacherId) => {
    const response = await fetchSubjectByExamIdAndTeacherIdApi(examId, teacherId);
    const data = await response.data.subject;
    setSubjectList(data);
  }


  const fetchTopics = async (subjectId, examId) => {
    const response = await fetchTopicBySubjectIdAndTeacherIdApi(subjectId, examId);
    const data = await response.data.topic;
    setTopicList(data);
  }

  useEffect(() => {
    fetchSubjects(examId, teacherId);
  }, []);

  return (
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
        Enter the question details.
      </Title>

      <Form.Item
        name="questionText"
        label="Question text"
      >
        <TextArea rows={5} />
      </Form.Item>

      <DrivePickerImage
        name="imageUrl"
        label={`Question image`}
      />

      <Form.Item
        name="questionSubject"
        label="Subject"
        rules={[
          { required: true, message: 'Please input the subject!' }
        ]}
      >
        <Select
          loading={subjectList[0] == null}
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
        name="questionTopic"
        label="Category"
        rules={[
          { required: true, message: 'Please input the category!' }
        ]}
      >
        <Select
          loading={topicList[0] == null}
        >
          {topicList.map((topic) => {
            return (
              <Option key={`${topic.id}${topic.title}`} value={topic.id}>{topic.title}</Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item
        name="questionDifficulty"
        label="Difficulty"
        rules={[
          {
            required: true,
            message: 'Please input the difficulty!',
          },
        ]}
      >
        <Select>
          <Option value={QUESTION_DIFFICULTY.DFFICULT}>Difficult</Option>
          <Option value={QUESTION_DIFFICULTY.MEDIUM}>Medium</Option>
          <Option value={QUESTION_DIFFICULTY.EASY}>Easy</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="questionType"
        label="Type"
        rules={[
          {
            required: true,
            message: 'Please input the question type!',
          },
        ]}
      >
        <Select
          onChange={(value) => {
            switch (value) {
              case QUESTION_TYPE.QUESTION:
                setOptionsLength(0);
                break;
              case QUESTION_TYPE.MCQ_2OPTIONS:
                setOptionsLength(2);
                break;
              case QUESTION_TYPE.MCQ_3OPTIONS:
                setOptionsLength(3);
              case QUESTION_TYPE.MCQ_4OPTIONS:
                setOptionsLength(4);
                break;
              case QUESTION_TYPE.MCQ_5OPTIONS:
                setOptionsLength(5);
                break;
            }
          }}
        >
          <Option value={QUESTION_TYPE.QUESTION}>Question/ Answer (No Multiple Choice)</Option>
          <Option value={QUESTION_TYPE.MCQ_2OPTIONS}>Multiple Choice (2 Options)</Option>
          <Option value={QUESTION_TYPE.MCQ_3OPTIONS}>Multiple Choice (3 Options)</Option>
          <Option value={QUESTION_TYPE.MCQ_4OPTIONS}>Multiple Choice (4 Options)</Option>
          <Option value={QUESTION_TYPE.MCQ_5OPTIONS}>Multiple Choice (5 Options)</Option>
        </Select>
      </Form.Item>
      {
        optionsLength > 0 &&
        <Title level={5} style={{ marginLeft: "20px" }}>
          Choose your options.
        </Title>
      }
      {
        Array.from(Array(optionsLength).keys()).map((index) => {
          return (
            <Fragment key={`optionValue${index}`}>
              <Form.Item
                name={`optionValue${index}`}
                label={`Option ${MCQ_KEYS_LIST[index]} (textual)`}
                rules={[
                  {
                    required: true,
                    message: 'Please input the option!',
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
              <DrivePickerImage
                name={`optionImageValue${index}`}
                label={`Option ${MCQ_KEYS_LIST[index]} (image)`}
              />
            </Fragment>
          )
        })
      }

      <Title level={5} style={{ marginLeft: "20px" }}>
        Choose your answer
      </Title>

      <Form.Item
        name="explanationAnswer"
        label="Answer"
        tooltip="What do you want the question answer to be?"
        rules={[
          {
            required: true,
            message: 'Please input your question answer!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Title level={5} style={{ marginLeft: "20px" }}>
        You can add some information about the question's answer.
      </Title>

      <Form.Item
        name="explanationText"
        label="Textual Explanation"
      >
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item
        name="explanationVideoUrl"
        label="Video Link"
      >
        <Input />
      </Form.Item>

      <DrivePickerImage
        name="explanationImageUrl"
        label="Image Link"
      />

      <div style={{ justifyContent: "space-around", display: "flex" }}>
        <Form.Item
          name="submitType"
        >
          <Button value="close" type="primary" style={{ minWidth: "250px" }} htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item
          name="submitType"
        >
          <Button value="again" type="primary" style={{ minWidth: "250px" }} htmlType="submit">
            Submit and Add New
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};