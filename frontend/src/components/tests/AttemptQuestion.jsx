import {
  Button,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Input,
  Affix,
  Segmented,
  Avatar,
  Space,
  Form,
  Statistic,
  Checkbox,
  Badge,
  Radio,
  Tag,
  Popconfirm,
  Image,
  message
} from 'antd';
import { fetchExamModuleQuestionsApi } from 'src/_api/exam';
const { Title, Text } = Typography;
import { useContext, useEffect, useState, useCallback, memo } from 'react';
import { ToastContext } from 'src/lib/context/toastContext';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import theme from 'src/lib/ThemeConfig';
import { MODAL_ROUTE_MESSAGE, QUESTION_DIFFICULTY, QUESTION_STATUS, QUESTION_TYPE } from 'src/lib/utils/constant';
import { selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { useDispatch, useSelector } from "react-redux";
import { deleteQuestionList, selectExamQuestionList, setCurrentQuestion, setQuestionList } from 'src/redux/services/exam';
import { deleteQuestionById } from 'src/_api/question';
import { AuthContext } from 'src/lib/context/authContext';
import './TestQuestion.css'
import { useNavigate } from 'react-router-dom';
import { blue, gray, green } from '@ant-design/colors';
import { isEmptyString } from 'src/lib/utils/isEmpty';
import { createHistoryApi } from 'src/_api/history/history';
import { setModalState } from 'src/redux/services/lesson';
const { Countdown } = Statistic;

export function AttemptQuestion({
  urlModuleId
}) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const questions = useSelector(selectExamQuestionList);
  const { profile } = useContext(AuthContext)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const deadline = Date.now() + ((1000) * (10 * 10 * 60));
  const dispatch = useDispatch();
  const onFinishTime = async () => {
    const formValues = form.getFieldsValue();
    const createeSubmission = await createHistoryApi({
      moduleId: urlModuleId,
      attempt: formValues,
      userId: profile?.user?.id
    })
    if (createeSubmission && createeSubmission.data
      && createeSubmission.data.attemptHistory
      && createeSubmission.data.attemptHistory.id) {
      message.success('Submit successfully');
      navigate(`/app/tests/result/${createeSubmission.data.attemptHistory.id}`);
    }
    else {
      message.error('Submit failed');
    }
  };
  const onSubmitExam = () => {
    const key = 'test' + urlModuleId;
    const formValues = form.getFieldsValue();
    localStorage.setItem(key, JSON.stringify(formValues));
    dispatch(setModalState(MODAL_ROUTE_MESSAGE.SUBMIT_EXAM_CONFIRM));
  };

  const onFinish = async (values) => {
    const createeSubmission = await createHistoryApi({
      moduleId: urlModuleId,
      attempt: values,
      userId: profile?.user?.id
    })
    if (createeSubmission
      && createeSubmission.data
      && createeSubmission.data.attemptHistory
      && createeSubmission.data.attemptHistory.id
    ) {
      message.success('Submit successfully');
      navigate(`/app/tests/result/${createeSubmission.data.attemptHistory.id}`);
    }
    else {
      message.error('Submit failed');
    }
    // navigate('/app/tests/result/' + urlModuleId)
  }
  let [arrayQuestions, setArrayQuestionsArray] = useState([]);
  useEffect(() => {
    setArrayQuestionsArray(Array(questions?.length ?? 0).fill(0))
  }, [questions?.length])
  return (
    <div className='w-100 min-h-100vh'>
      <Form
        style={{ padding: "10px", width: "100%", }}
        form={form}
        onFinish={onFinish}
        initialValues={
          arrayQuestions.map((_, index) => {
            const formName = questions[index]?.id;
            return {
              [formName]: null
            }
          })
        }
      >
        {questions != null &&
          <>
            <div className='flexbox-center-horizontal'>
              <br />  <br />
              <Row style={{ width: "100%" }}>
                <Col xs={18}>
                  <>
                    <Row gutter={[6, 12]} style={{ padding: "10px", width: "100%", }}>

                      {
                        questions.map((question, index) => {
                          if (currentQuestionIndex != index)
                            return (
                              <>
                                <Form.Item
                                  name={question?.id}
                                  hidden={true}
                                >
                                  {question?.options[0] != undefined ?
                                    <Radio.Group
                                      key={`${question.id}${index}option`}
                                    >
                                      {question?.options?.map((option, _index) => {
                                        return (
                                          <>
                                            <Radio value={option?.key} style={{ marginBottom: "10px" }}>
                                              &nbsp; &nbsp;{option?.key}{')'}
                                              &nbsp; &nbsp;{option?.value}
                                              {option?.imageUrl != null && <>
                                                <span>&nbsp; &nbsp;<img style={{ maxHeight: '40vh', maxWidth: '40vw', textAlign: 'left' }} src={option?.imageUrl} /></span>
                                              </>}
                                            </Radio>
                                            <br />  <br />
                                          </>
                                        )
                                      })}
                                    </Radio.Group>
                                    :
                                    <Input onChange={(value) => {
                                    }} />
                                  }
                                </Form.Item>
                              </>
                            )
                          else
                            return (
                              <Col key={`${question?.id}${index}QUESTION`} xs={24}>
                                <Card
                                  bordered={false}
                                  title={`Question ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    margin: "auto",
                                    fontSize: '16px'
                                  }}
                                  onClick={() => {
                                  }}
                                >
                                  {/* <Tag color="green">
                                {subjectMapper[question?.subject_id]?.title ?? "Undefined"}
                              </Tag>
                                */}
                                  {!isEmptyString(question?.text) &&
                                    <div style={{
                                      whiteSpace: "pre-line",
                                    }}>
                                      {question?.text}
                                    </div>
                                  }
                                  {!isEmptyString(question?.imageUrl) &&
                                    <>
                                      <Image src={question?.imageUrl} style={{ maxHeight: '40vh', maxWidth: '40vw', textAlign: 'left' }} />
                                    </>}
                                  <br />
                                  <div>
                                    <Form.Item
                                      name={question?.id}
                                    >
                                      {question?.options[0] != undefined ?
                                        <Radio.Group key={`${question.id}${index}option`}>
                                          {question?.options?.map((option, _index) => {
                                            return (
                                              <>
                                                <Radio value={option?.key} style={{ marginBottom: "10px" }}>
                                                  &nbsp; &nbsp;{option?.key}{')'}
                                                  {!isEmptyString(option?.value) && <>
                                                    <span>&nbsp; &nbsp;{option?.value}</span><br />
                                                  </>}
                                                  {!isEmptyString(option?.imageUrl) && <>
                                                    <span>&nbsp; &nbsp;<Image style={{ maxHeight: '40vh', maxWidth: '40vw', textAlign: 'left' }} src={option?.imageUrl} /></span>
                                                  </>}
                                                </Radio>
                                                <br />  <br />
                                              </>
                                            )
                                          })}
                                        </Radio.Group>
                                        :
                                        <Input />
                                      }

                                    </Form.Item>
                                    <div style={{
                                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                      {currentQuestionIndex != 0 ?
                                        <Button type='primary' onClick={() => { setCurrentQuestionIndex((val) => val - 1) }}
                                        >Previous
                                        </Button>
                                        :
                                        <div></div>
                                      }
                                      {
                                        questions[currentQuestionIndex + 1] &&
                                        <Button type='primary' onClick={() => { setCurrentQuestionIndex((val) => val + 1) }}
                                        >Next
                                        </Button>
                                      }
                                    </div>
                                    <br /><br />
                                  </div>

                                </Card>

                              </Col>
                            )
                        })
                      }

                    </Row>

                  </>
                </Col>
                <Col
                  xs={6}

                >
                  <div
                    style={{
                      position: 'fixed', top: '90px',
                    }}>
                    <CountDownMemo value={deadline} onFinish={onFinishTime} />
                    <div className='test-question-grid'>
                      {
                        arrayQuestions[0] == undefined && <>
                          No questions
                        </>
                      }
                      {arrayQuestions?.map((value, index) => {
                        return (
                          <div key={index + "questionvalue"}
                          >
                            <Avatar style={{
                              background: index != currentQuestionIndex ? (value == 0 ? gray[5] : green[6]) : blue[5],
                              cursor: 'pointer'
                            }} onClick={() => setCurrentQuestionIndex(index)} >{index + 1}</Avatar>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Col>

              </Row>

            </div>
          </>
        }
        <div style={{
          background: "white", borderTop: '1px solid gray',
          position: 'fixed', bottom: '0px', width: "100vw",
          padding: "10px"
        }}>
          <Popconfirm
            title="Back"
            description="Are you sure to go back?"
            onConfirm={() => { navigate('/app/tests') }}
          >
            <Button danger htmlType="button" style={{ marginLeft: "30px" }}>
              Leave screen
            </Button>
          </Popconfirm>
          <Button
            onClick={() => { onSubmitExam() }}
            type="primary" htmlType="button" style={{ marginLeft: "30px" }}>
            Submit exam now...
          </Button>
          {/* <Button type="link" style={{ marginLeft: "30px" }} onClick={() => openDrawer()}>
            Change Module
          </Button> */}
        </div>
      </Form>
    </div >
  )
}

const CountDownMemo = memo(function Counter({ value, onFinish }) {
  return (
    <Countdown style={{ marginLeft: "25px" }} title="Countdown" value={value} onFinish={onFinish} />
  )
},
  (prevProps, nextProps) => (
    prevProps.value != nextProps.value
  )
)


export default AttemptQuestion;

