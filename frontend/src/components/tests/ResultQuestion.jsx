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
  Checkbox,
  Badge,
  Radio,
  Tag,
  Image,
  Divider,
  Switch,
  Alert
} from 'antd';
import { fetchExamModuleQuestionsApi } from 'src/_api/exam';
const { Title, Text } = Typography;
import { useContext, useEffect, useState } from 'react';
import { ToastContext } from 'src/lib/context/toastContext';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import theme from 'src/lib/ThemeConfig';
import { MODAL_ROUTE_MESSAGE, QUESTION_DIFFICULTY, QUESTION_STATUS, QUESTION_TYPE, RESULT_TYPE_BACKEND } from 'src/lib/utils/constant';
import { selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { useDispatch, useSelector } from "react-redux";
import { deleteQuestionList, selectExamQuestionList, setCurrentQuestion, setQuestionList } from 'src/redux/services/exam';
import { deleteQuestionById } from 'src/_api/question';
import { AuthContext } from 'src/lib/context/authContext';
import './TestQuestion.css'
import Vimeo from '@u-wave/react-vimeo';
import { blue, green, grey, magenta, red, yellow } from '@ant-design/colors';
import { isEmptyString } from 'src/lib/utils/isEmpty';
import { useNavigate } from 'react-router-dom';
import { setCurrentLesson, setModalState } from 'src/redux/services/lesson';
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    }
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
  }
};

export function ResultQuestion({
  openDrawer, urlModuleId, attemptHistory
}) {
  const questions = useSelector(selectExamQuestionList);

  const RESULT_TYPE_UI = {
    CORRECT: {
      color: green[5], text: "Correct"
    },
    STUDENT_NO_ANSWER: {
      color: yellow[9], text: "Not submitted by student"
    },
    WRONG: {
      color: red[5], text: "Wrong"
    },
    EXAMINER_NO_ANSWER: {
      color: blue[5], text: "No answer by examiner"
    },
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { result } = attemptHistory;


  // questions?.forEach(item => {
  //   questionMap[item.id] = {
  //     ...item,
  //     submission: questionIdToSubmissionMap[item.id]
  //   };
  // });
  // let countCorrect = 0, countBlank = 0;
  // questions?.forEach(item => {
  //   const isSubmitted = questionMap[item.id]?.submission != null
  //   const isCorrectAnswer = questionMap[item.id]?.submission == item?.explanation?.correctAnswer
  //   if (!isSubmitted) {
  //     countBlank++;
  //     questionMap[item.id].isBlank = true;
  //   }
  //   if (isSubmitted && isCorrectAnswer) {
  //     countCorrect++;
  //     questionMap[item.id].isCorrect = true;
  //   }
  // });

  const count = questions?.length ?? 0;

  const { role } = useContext(AuthContext);
  let arrayQuestions = Array(count).fill(0);
  return (
    <div className='w-100 min-h-100vh'>

      {questions && questions[0] &&
        <>
          <div className='flexbox-center-horizontal'>
            <br />  <br />
            <Row style={{ width: "100%" }}>
              <Col xs={18}>
                <>
                  <Row gutter={[6, 12]} style={{ padding: "10px", width: "100%", paddingBottom: "100px" }}>
                    {
                      questions.map((question, index) => {
                        return (
                          <Col key={`${question?.id}${index}QUESTION`} xs={24}>
                            <Card
                              id={`#${index}HYPERLINK`}
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
                              {!isEmptyString(question?.text) &&
                                <div style={{
                                  whiteSpace: "pre-line", marginTop: "5px"
                                }}>
                                  {question?.text}
                                </div>
                              }
                              {!isEmptyString(question?.imageUrl) &&
                                <>
                                  <Image src={question?.imageUrl} style={{ maxHeight: '20vh', maxWidth: '20vw', textAlign: 'left' }} />
                                </>
                              }
                              <br />
                              <div>
                                {question?.options[0] != undefined ?
                                  <Radio.Group key={`${question.id}${index}option`}>
                                    {question?.options?.map((option, _index) => {
                                      return (
                                        <>
                                          <Radio key={`${question.id}${option?.id}optionradio`} value={option?.key} style={{ marginBottom: "10px" }}>
                                            &nbsp; &nbsp;{option?.key}{')'}
                                            {!isEmptyString(option?.value) && <>
                                              <span>&nbsp; &nbsp;{option?.value}</span><br />
                                            </>}
                                            {!isEmptyString(option?.imageUrl) && <>
                                              <span>&nbsp; &nbsp;<Image style={{ maxHeight: '20vh', maxWidth: '20vw', textAlign: 'left' }} src={option?.imageUrl} /></span>
                                            </>}
                                          </Radio>
                                          <br />
                                        </>
                                      )
                                    })}
                                  </Radio.Group>
                                  :
                                  <Input />
                                }
                                <br /><br />
                              </div>


                              <Tag color={RESULT_TYPE_UI[result[question?.id]['questionResultType']]?.color}>
                                {RESULT_TYPE_UI[result[question?.id]['questionResultType']]?.text}
                              </Tag>
                              <br />
                              <Text>Your submission: {result[question?.id]['submittedValue']}</Text>
                              <br /><br />
                              <div style={{
                                border:
                                  `1px solid  ${RESULT_TYPE_UI[result[question?.id]['questionResultType']]?.color}`,
                                borderRadius: "5px",
                                padding: "10px",
                              }}>
                                
                                {
                                  !isEmptyString(question?.explanation?.correctAnswer) &&
                                  <Text>
                                    The answer is: {question?.explanation?.correctAnswer}.
                                  </Text>
                                }
                                {
                                  !isEmptyString(question?.explanation?.text) &&
                                  <>
                                    <br />
                                    <Text>Explanation: </Text>
                                    <Text>{question?.explanation?.text}.</Text>
                                  </>
                                }
                                <br /><br />
                                <Row>
                                  {
                                    !isEmptyString(question?.explanation?.videoUrl) &&
                                    question?.explanation?.videoUrl.includes('https://vimeo.com/') &&
                                    <Col xs={24} lg={12}>
                                      <Button
                                        onClick={() => {
                                          dispatch(setCurrentQuestion(question))
                                          dispatch(setModalState(MODAL_ROUTE_MESSAGE.LESSON_VIDEO_MODAL));
                                        }}
                                      > Watch video </Button>
                                    </Col>
                                  }
                                  {!isEmptyString(question?.explanation?.imageUrl) &&
                                    <Col xs={24} lg={12}>
                                      <Image src={question?.explanation?.imageUrl} style={{ maxHeight: '20vh', maxWidth: '20vw', textAlign: 'left' }} />
                                    </Col>}
                                </Row>
                              </div>
                            </Card>

                          </Col>
                        )
                      })
                    }

                  </Row>

                </>
              </Col>
              <Col xs={6}>
                <div style={{ position: 'fixed', top: '60px' }}>
                  <div className='test-question-grid'>
                    {arrayQuestions.map((_, index) => {
                      return (
                        <a key={`#${questions[index]?.id}HYPERLINK`} href={`#${index}HYPERLINK`}>
                          <div style={{ padding: 2 }}>
                            <Avatar
                              size='small'
                              style={{
                                backgroundColor:
                                  RESULT_TYPE_UI[result[questions[index]?.id]['questionResultType']]?.color,
                              }}
                              onClick={() => {
                                document.getElementById(`#${index}HYPERLINK`).scrollIntoView();
                              }} >{index + 1}</Avatar>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                  <br />
                  <div style={{ marginLeft: "20px" }}>
                    <div>Total: {attemptHistory?.totalQuestion} questions</div>
                    <div>Correct Answers: 
                      &nbsp;{attemptHistory?.totalCorrect} /
                      {attemptHistory?.totalQuestion- attemptHistory?.totalAnswerMissing}
                      &nbsp;answers</div>
                    <div>Blank: {attemptHistory?.totalBlank} blank answers</div>
                    <div>Percentage: {attemptHistory?.percentage} submissions</div>

                  </div>
                </div>
              </Col>
            </Row>
            <br /><br />

          </div>
        </>
      }
      <div style={{
        background: "white", borderTop: '1px solid gray',
        position: 'fixed', bottom: '0px', width: "100vw",
        padding: "10px"
      }}>
        {/* <Button type="primary" onClick={() => { openDrawer() }} style={{ marginLeft: "30px" }}>
          Go to module
        </Button> */}
        <Button type="dashed" style={{ marginLeft: "30px" }} onClick={() => navigate("/app/tests/")}>
          Back to test view
        </Button>
      </div>
    </div >
  )
}

export default ResultQuestion;

