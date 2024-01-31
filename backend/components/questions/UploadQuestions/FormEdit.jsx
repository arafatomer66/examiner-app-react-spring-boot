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
  Image,
  Divider,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { QUESTION_DIFFICULTY, QUESTION_STATUS, QUESTION_TYPE, MCQ_KEYS_LIST, USER_ROLE } from 'src/lib/utils/constant';
import { fetchSubjectByExamIdAndTeacherIdApi, fetchTopicBySubjectIdAndTeacherIdApi } from 'src/_api/exam';
import { editQuestionApi } from 'src/_api/question';
import { ToastContext } from 'src/lib/context/toastContext';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { editQuestionList, selectCurrentExam, selectCurrentQuestion, setCurrentQuestion } from 'src/redux/services/exam';
import DrivePickerImage from './DrivePickerImage';
import { getInputValue, setInputValue } from 'src/lib/utils/dom';
import { isEmptyString, returnNullIfIsEmptyString } from 'src/lib/utils/isEmpty';
import { useCallback } from 'react';
import { AuthContext } from 'src/lib/context/authContext';

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

export const FormEdit = ({
  setIsOpenModal
}) => {
  const dispatch = useDispatch();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const teacherId = useSelector(selectSystemTeacherId);
  const examId = useSelector(selectSystemExamId);
  const { toastError, toastSuccess } = useContext(ToastContext);
  const [form] = Form.useForm();
  const { role } = useContext(AuthContext)
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);

    let postData = {}
    let isValid = true;

    values.questionType = (currentQuestion?.options == null || currentQuestion?.options[0] == undefined) ?
      QUESTION_TYPE.QUESTION : currentTypeGetter(currentQuestion?.options?.length);

    let imageUrl = getInputValue("imageUrl");
    if (isEmptyString(values.questionText) && isEmptyString(imageUrl)) {
      isValid = false;
      toastError("Please input a text or image for the question")
    }
    // Question
    postData.question = {
      id: currentQuestion?.id,
      status: role == USER_ROLE.BACKOFFICEUPLOADER ? QUESTION_STATUS.PENDING : QUESTION_STATUS.ACCEPTED,
      text: values.questionText,
      imageUrl,
      // type: values.questionType,
      difficulty: values.questionDifficulty,
      exam_id: examId,
      topic_id: values.questionTopic,
      subject_id: values.questionSubject,
      comment: null,
      teacher: {
        id: teacherId
      },
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
          id: currentQuestion?.options[i]?.id ?? null,
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
      id: currentQuestion?.explanation?.id,
      text: values.explanationText,
      imageUrl: imageUrlExplanation,
      videoUrl: videoUrlExplanation,
      correctAnswer: values.explanationAnswer,
    }

    if (!isValid) {
      return;
    }

    try {
      const respose = await editQuestionApi(postData);
      if (respose && respose.data && respose.data.question) {
        let isChanged = 0;  // 0 for false
        if ('isChanged' in currentQuestion) {
          isChanged = currentQuestion.isChanged + 1;
        }
        else {
          isChanged = 1;
        }
        dispatch(setCurrentQuestion({ ...respose.data.question, isChanged }));
        dispatch(editQuestionList({ ...respose.data.question, isChanged }));
        toastSuccess(`Question edited successfully for id: ${postData.question.id}!`);
        setIsOpenModal(false);
      }
      else {
        toastError("Question edit failed!");
      }
    }
    catch (err) {
      toastError(err.message);
    }
  };

  const onFinishFailed = () => {
    toastError('Error', 'Sign up failed due to incorrect user input!');
  };

  const [optionsLength, setOptionsLength] = useState(currentQuestion?.options.length ?? 0);
  const [subjectList, setSubjectList] = useState([]);
  const [topicList, setTopicList] = useState([]);

  const fetchSubjects = async (examId, teacherId) => {
    const response = await fetchSubjectByExamIdAndTeacherIdApi(examId, teacherId);
    const data = await response.data.subject;
    setSubjectList(data);
  }

  const currentTypeGetter = (value) => {
    let type = QUESTION_TYPE.QUESTION;
    if (value == 0) {
      type = QUESTION_TYPE.QUESTION;
    }
    else if (value == 2) {
      type = QUESTION_TYPE.MCQ_2OPTIONS;
    }
    else if (value == 3) {
      type = QUESTION_TYPE.MCQ_3OPTIONS;
    }
    else if (value == 4) {
      type = QUESTION_TYPE.MCQ_4OPTIONS;
    }
    else if (value == 5) {
      type = QUESTION_TYPE.MCQ_5OPTIONS;
    }
    return type;
  }

  const fetchTopics = async (subjectId, examId) => {
    const response = await fetchTopicBySubjectIdAndTeacherIdApi(subjectId, examId);
    const data = await response.data.topic;
    setTopicList(data);
  }
  const getInitialValues = useCallback(() => {
    return {
      explanationText: returnNullIfIsEmptyString(currentQuestion?.explanation?.text) ?? "",
      imageUrl: returnNullIfIsEmptyString(currentQuestion?.imageUrl) ?? "",
      questionStatus: currentQuestion?.explanation?.questionStatus ?? "",
      explanationImageUrl: !isEmptyString(currentQuestion?.explanation?.imageUrl) ?
        currentQuestion?.explanation?.imageUrl : null,
      explanationVideoUrl: !isEmptyString(currentQuestion?.explanation?.videoUrl) ?
        currentQuestion?.explanation?.videoUrl : null,
      explanationAnswer: currentQuestion?.explanation?.correctAnswer ?? "",
      // status: currentQuestion?.question?.status,
      questionText: currentQuestion?.text,
      type: currentQuestion?.questionType,
      questionType: (currentQuestion?.options == null || currentQuestion?.options[0] == undefined) ?
        QUESTION_TYPE.QUESTION : currentTypeGetter(currentQuestion?.options?.length),
      questionDifficulty: currentQuestion?.difficulty ?? QUESTION_DIFFICULTY.EASY,
      // examId: question?.exam_id,
      questionTopic: currentQuestion?.topic_id,
      questionSubject: currentQuestion?.subject_id,
      optionValue0: currentQuestion?.options[0]?.value ?? "",
      optionValue1: currentQuestion?.options[1]?.value ?? "",
      optionValue2: currentQuestion?.options[2]?.value ?? "",
      optionValue3: currentQuestion?.options[3]?.value ?? "",
      optionValue4: currentQuestion?.options[4]?.value ?? "",
      optionImageValue0: !isEmptyString(currentQuestion?.options[0]?.imageUrl) ?
        currentQuestion?.options[0]?.imageUrl : null,
      optionImageValue1: !isEmptyString(currentQuestion?.options[1]?.imageUrl) ?
        currentQuestion?.options[1]?.imageUrl : null,
      optionImageValue2: !isEmptyString(currentQuestion?.options[2]?.imageUrl) ?
        currentQuestion?.options[2]?.imageUrl : null,
      optionImageValue3: !isEmptyString(currentQuestion?.options[3]?.imageUrl) ?
        currentQuestion?.options[3]?.imageUrl : null,
      optionImageValue4: !isEmptyString(currentQuestion?.options[4]?.imageUrl) ?
        currentQuestion?.options[4]?.imageUrl : null,
    }
  }, [currentQuestion?.id, currentQuestion?.isChanged])

  useEffect(() => {
    console.log({ currentQuestion })
    console.log({ currentQuestion })
    console.log({ currentQuestion })
    console.log({ currentQuestion })
    form.setFieldsValue(getInitialValues());
    setInputValue("imageUrl", currentQuestion?.imageUrl ?? null);
    setInputValue("explanationImageUrl", currentQuestion?.explanation?.imageUrl ?? null);
    for (let i = 0; i < optionsLength; i++) {
      setInputValue(`optionImageValue${i}`, currentQuestion?.options[i]?.imageUrl ?? null);
    }
    setOptionsLength(currentQuestion?.options?.length ?? 0);
    fetchSubjects(examId, teacherId);
    fetchTopics(currentQuestion?.subject_id, examId);
  }, [currentQuestion?.id, currentQuestion?.isChanged]);


  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={getInitialValues()}
      style={{
        maxWidth: 600,
        margin: 'auto',
      }}
      scrollToFirstError
    >
      <br />

      <Title level={5} style={{ marginLeft: "20px" }}>
        Enter the question details for {currentQuestion?.id ?? "None"}
      </Title>

      <Form.Item
        name="questionText"
        label="Question text"
      >
        <TextArea rows={5} value={currentQuestion?.text} />
      </Form.Item>


      <DrivePickerImage
        name={`imageUrl`}
        label={`Question image url`}
        previewImage={currentQuestion?.imageUrl ?? null}
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
                break;
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
        </Title>
      }
      {
        Array.from(Array(optionsLength).keys()).map((index) => {
          return (
            <>
              <Form.Item
                name={`optionValue${index}`}
                label={`Option ${currentQuestion?.options[index]?.key ?? MCQ_KEYS_LIST[index]} 
                  ${currentQuestion?.options[index]?.id != null ? "#" + currentQuestion?.options[index]?.id : ""}`}
                rules={[
                ]}
              >
                <TextArea />
              </Form.Item>
              <DrivePickerImage
                name={`optionImageValue${index}`}
                label={`Option ${MCQ_KEYS_LIST[index]} (image)`}
                previewImage={currentQuestion?.options[index]?.imageUrl ?? null}
              />
              <Divider />
            </>
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
        You can add some information ({currentQuestion?.explanation?.id}) about the question's answer.
      </Title>

      <Form.Item
        name="explanationText"
        label="Textual Explanation"
      >
        <TextArea rows={3} value={currentQuestion?.explanation?.explanationText} />
      </Form.Item>

      <DrivePickerImage
        name={`explanationImageUrl`}
        label={`Explanation Image URL`}
        previewImage={currentQuestion?.explanation?.imageUrl ?? null}
      />
      
      <Form.Item
        name="explanationVideoUrl"
        label="Video Link"
      >
        <Input />
      </Form.Item>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button type="primary" style={{ minWidth: "250px" }} htmlType="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};