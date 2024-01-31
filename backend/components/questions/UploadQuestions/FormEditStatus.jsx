import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Typography,
  Select,
  Row,
  Col,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { QUESTION_STATUS, USER_ROLE, } from 'src/lib/utils/constant';
import { editQuestionStatusApi } from 'src/_api/question';
import { ToastContext } from 'src/lib/context/toastContext';
import { AuthContext } from 'src/lib/context/authContext';
import { useDispatch, useSelector } from 'react-redux';
import { editQuestionList, selectCurrentQuestion, setCurrentQuestion, setQuestionList } from 'src/redux/services/exam';
const { Option } = Select;
const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 12,
    },
  },
};

export const FormEditStatus = ({
  question, setIsOpenModal
}) => {
  const dispatch = useDispatch();
  const { role } = useContext(AuthContext);
  const { toastCatchError, toastSuccess, toastError } = useContext(ToastContext);
  const [form] = Form.useForm();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const onFinish = async (values) => {
    if (role == USER_ROLE.BACKOFFICEUPLOADER) {
      toastError("You are not allowed to edit question status!");
      return;
    }
    let postData = {}

    postData = {
      status: values.status,
      comment: values.comment,
    }

    try {
      const id = question?.id;

      const respose = await editQuestionStatusApi(id, postData);

      if (respose && respose.data && respose.data.question) {
        let isChanged = 0;  // 0 for false
        if ('isChanged' in question) {
          isChanged = question.isChanged + 1;
        }
        else {
          isChanged = currentQuestion?.isChanged ? 1 : currentQuestion?.isChanged + 1;
        }
        dispatch(setCurrentQuestion({ ...respose.data.question, isChanged }))
        dispatch(editQuestionList({ ...respose.data.question, isChanged }));

        toastSuccess("Question status edited successfully!");
        setIsOpenModal(false);
      }
      else toastError("Question edit failed!");
    }
    catch (err) { toastCatchError(err); }

    form.resetFields();
  };

  const onFinishFailed = () => {
    toastError('Error', 'Sign up failed due to incorrect user input!');
  };

  useEffect(() => {
    form.resetFields();
  }, [question?.id, question?.isChanged]);


  return (
    <Form
      {...formItemLayout}
      form={form}
      name={`edit-question-status-${question?.id}`}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{
        status: question?.questionStatus,
        comment: question?.comment,
      }}
      labelAlign="left"
      style={{
        marginTop: '25px'
      }}
      scrollToFirstError
    >
      <Row>
        <Col xs={24} lg={12}>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              { required: true, message: 'Please input the subject!' }
            ]}
          >
            <Select
              disabled={role == USER_ROLE.BACKOFFICEUPLOADER}
            >
              <Option value={QUESTION_STATUS.ACCEPTED}>
                {QUESTION_STATUS.ACCEPTED}
              </Option>
              <Option value={QUESTION_STATUS.REJECTED}>
                {QUESTION_STATUS.REJECTED}
              </Option>
              <Option value={QUESTION_STATUS.PENDING}>
                {QUESTION_STATUS.PENDING}
              </Option>
              <Option value={QUESTION_STATUS.CREATED}>
                {QUESTION_STATUS.CREATED}
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            name="comment"
            label="Reviewer's comment"
          >
            <TextArea
              readOnly={role == USER_ROLE.BACKOFFICEUPLOADER}
              rows={3}
            />
            </Form.Item>
        </Col>
      </Row>

      {
        role != USER_ROLE.BACKOFFICEUPLOADER &&
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" style={{ minWidth: "250px" }} htmlType="submit">
            Submit
          </Button>
        </div>
      }
    </Form>
  );
};