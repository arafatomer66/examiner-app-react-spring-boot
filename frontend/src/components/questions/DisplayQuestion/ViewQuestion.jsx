import { DeleteOutlined, EditOutlined, DownOutlined } from '@ant-design/icons';
import {
  Card,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  Image,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Space,
  Tag,
  Typography
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchExamModuleQuestionsApi } from 'src/_api/exam';
import { deleteQuestionById } from 'src/_api/question';
import theme from 'src/lib/ThemeConfig';
import { AuthContext } from 'src/lib/context/authContext';
import { ToastContext } from 'src/lib/context/toastContext';
import { QUESTION_STATUS, INTEGER_DIFFICULTY } from 'src/lib/utils/constant';
import {
  deleteQuestionList, selectCurrentModule,
  selectCurrentQuestion, selectExamModuleId,
  selectExamQuestionList, selectExamQuestionStringToFetch,
  setCurrentQuestion, setQuestionList
} from 'src/redux/services/exam';
import { selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { FormEditStatus } from '../UploadQuestions/FormEditStatus';
import { isEmptyString } from 'src/lib/utils/isEmpty';
import Vimeo from '@u-wave/react-vimeo';
import { nanoid } from '@reduxjs/toolkit';
const { Title, Text } = Typography;
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

export function ViewQuestion({
  isHideEdit = true,
  setIsOpenModal = null,
  isShowStatus = false,
}) {
  const dispatch = useDispatch();
  const teacherId = useSelector(selectSystemTeacherId);
  const examId = useSelector(selectSystemExamId);
  const [form] = Form.useForm();
  const currentModule = useSelector(selectCurrentModule);
  const questionStringToFetch = useSelector(selectExamQuestionStringToFetch);
  const currentQuestion = useSelector(selectCurrentQuestion);
  const questions = useSelector(selectExamQuestionList);
  const moduleId = useSelector(selectExamModuleId);
  const { role } = useContext(AuthContext);
  const [pagination, setPagination] = useState(null);
  const [subjectMapper, setSubjectMapper] = useState({});
  const [topicMapper, setTopicMapper] = useState({});
  const { toastError, toastSuccess } = useContext(ToastContext);
  const fetchExamModuleQuestionsApiFunction = ({
    difficulty = null,
    topic = null,
    subject = null,
    status = null,
    // type = null,
  }, page = 0, size = 12) => {

    fetchExamModuleQuestionsApi({
      questionString: questionStringToFetch,
      examId,
      teacherId,
      difficulty,
      topicId: topic,
      questionStatus: status,
      subjectId: subject,
    }, page, size).then(res => {
      let { questionList, subjectMap, topicMap, ...paginationData } = res.data;
      dispatch(setQuestionList(questionList));
      setPagination(paginationData);
      setSubjectMapper(subjectMap);
      setTopicMapper(topicMap);
    })
  }

  useEffect(() => {
    // find currentQuestion in questionList
    let index = questions ? questions.findIndex(question => question?.id == currentQuestion?.id) : -1;
    if (index != -1) {
      let newQuestions = [...questions];
      newQuestions[index] = currentQuestion;
      dispatch(setQuestionList(newQuestions));
    }

  }, [currentQuestion?.isChanged])

  useEffect(() => {
    form.resetFields();
    // dispatch(setQuestionList([]));
    fetchExamModuleQuestionsApiFunction({ questionStringToFetch }, 0, 10);
  }, [questionStringToFetch])


  const onChangeForm = (changedValue, allValues) => {
    console.log({ changedValue, allValues });
    let postData = {
      difficulty: allValues.difficulty,
      topic: allValues.topic,
      subject: allValues.subject,
      type: allValues.type,
      questionStringToFetch,
      status: allValues.status
    }
    fetchExamModuleQuestionsApiFunction(postData, 0, 12);
  }

  return (
    <div className='min-h-100vh' style={{ paddingTop: 0, paddingRight: "20px" }}>
      <Row>
        <Col xs={24} lg={4}>
          <Popover
            placement='right'
            trigger={'click'}
            content={
              (<div>
                <Title level={5} style={{
                  paddingLeft: "20px"
                }}>
                  Filter by the following properties:
                </Title>
                <div className='flexbox-center-horizontal'>
                  <Form
                    form={form}
                    name="filtering"
                    labelAlign='left'
                    onValuesChange={onChangeForm}
                    initialValues={{
                    }}
                    scrollToFirstError
                  >
                    {
                      isShowStatus == false ?
                        <>
                          <Form.Item
                            label="Question Category"
                            name="topic"
                          >
                            <Checkbox.Group
                              options={Object.entries(topicMapper).map(([key, value], index) => {
                                return {
                                  label: value.title,
                                  value: key,
                                }
                              })}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Question Subject"
                            name="subject"
                          >
                            <Checkbox.Group
                              options={Object.entries(subjectMapper).map(([key, value], index) => {
                                return {
                                  label: value.title,
                                  value: key
                                }
                              })}
                            />

                          </Form.Item>
                        </>
                        :
                        <>
                          <Form.Item
                            label="Question Status"
                            name="status"
                          >
                            <Checkbox.Group
                              options={Object.keys(QUESTION_STATUS).map((status, index) => {
                                return {
                                  label: status,
                                  value: status
                                }
                              })}
                            />
                          </Form.Item>
                        </>
                    }
                  </Form>
                </div>
              </div>)
            }
          ><a onClick={(e) => e.preventDefault()}>
              <Space>
                Filter
                <DownOutlined />
              </Space>
            </a>
          </Popover>
        </Col>
        <Col xs={24} lg={20}>
          <Pagination
            total={pagination?.totalItems ?? 0}
            responsive
            showQuickJumper
            onChange={(page, size) => {
              if (page != 0) {
                page = page - 1;
              }
              fetchExamModuleQuestionsApiFunction(
                {
                  questionStringToFetch
                }, page, size)
            }}
            showTotal={() => `Total ${pagination?.totalItems} items`}
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={24}>
          <>
            {questions != null && questions[0] != null &&
              <>
                {
                  questions.map((question, index) => {
                    const key = nanoid()
                    return (
                      <Card
                        key={key}
                        bordered={true}
                        actions={[
                          ...(
                            isHideEdit == true ||
                              isShowStatus == true ?
                              []
                              :
                              [
                                <Popconfirm
                                  title="Delete"
                                  description="Are you sure to delete this?"
                                  key={key+ question?.id}
                                  onConfirm={
                                    () => {
                                      deleteQuestionById(question?.id, moduleId)
                                        .then(res => {
                                          dispatch(deleteQuestionList(question?.id));
                                          toastSuccess("Question deleted successfully!");
                                        })
                                        .catch(() => {
                                          toastError("Question delete failed!");
                                        })
                                    }
                                  }
                                  // onCancel={cancel}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <DeleteOutlined
                                    key="delete"
                                    style={{ color: theme?.token?.colorPrimary }}
                                  />
                                </Popconfirm>
                                ,
                                <EditOutlined
                                key={key}
                                style={{ color: theme?.token?.colorPrimary }}
                                  onClick={() => {
                                    dispatch(setCurrentQuestion(question));
                                    setIsOpenModal(true)
                                  }
                                  } />,
                              ]
                          )]
                        }
                        title={`Question ${index + 1 + (pagination?.currentPage ?? 0) * (pagination?.size ?? 10)} [ID: #${question?.id}] ${question?.key ? '[Key: '+ question.key + ']' : '' } `}
                        style={{
                          marginBottom: "20px",
                          width: "100%",
                          ...(question?.isAdded &&
                          {
                            boxShadow: "0 0 10px rgba(0,0,0,0.6)",
                            color: "rgba(0,0,0,0.6)",
                            fontWeight: "bold"
                          }
                          ),
                          ...(question?.isChanged &&
                          {
                            boxShadow: "0 0 10px yellow",
                            color: "rgba(0,0,0,0.6)",
                            fontWeight: "bold"
                          }
                          )
                        }}
                        onClick={() => {
                        }}
                      >
                        <Tag color="orange">
                          {INTEGER_DIFFICULTY[question?.difficulty] ?? "Undefined"}
                        </Tag>
                        <Tag color="green">
                          {subjectMapper[question?.subject_id]?.title ?? "Undefined"}
                        </Tag>
                        <Tag color="blue">
                          {topicMapper[question?.topic_id]?.title ?? "Undefined"}
                        </Tag>
                        <Tag color="purple">
                          {question?.questionStatus ?? "Undefined"}
                        </Tag>
                        <Tag color="red">
                          Sequence: {question?.sequence ?? "None"}
                        </Tag>
                        {
                          question?.isChanged &&
                          <Tag color="green">
                            Changed: {question?.isChanged}
                          </Tag>}
                        <br />
                        <div>
                          {
                            question?.tagList?.map((tag, index) => {
                              return (
                                <Tag
                                style={{marginTop: "5px"}}
                                  key={'tag'+ tag + index + question?.id + 'question'}
                                >
                                  # {tag} &nbsp;&nbsp;
                                </Tag>
                              )
                            })
                          }
                        </div>
                        <Divider orientation="left">
                          Question
                        </Divider>
                        <Row gutter={[0, 12]} >
                          <Col xs={24} lg={12}>
                            {!isEmptyString(question?.text) &&
                              <div style={{
                                whiteSpace: "pre-line", marginTop: "5px"
                              }}>
                                {question?.text}
                              </div>
                            }
                          </Col>
                          <Col xs={24} lg={12}>
                            {!isEmptyString(question?.imageUrl) &&
                              <div>
                                <Image src={question?.imageUrl} style={{ maxHeight: '20vh', maxWidth: '20vw', textAlign: 'left' }} />
                              </div>}
                          </Col>
                        </Row>
                        {
                          question?.options[0] != null &&
                          <Divider orientation="left">
                            Options
                          </Divider>
                        }
                        <div className='module-grid'>
                          {question?.options?.map((option, _index) => {
                            return (
                              <div key={nanoid()} >
                                <input type="radio" id={question?.id} name={question?.id} value={question?.key} />
                                <span>&nbsp; &nbsp;{option?.key}{')'}</span>
                                {!isEmptyString(option?.value) && <>
                                  <span>&nbsp; &nbsp;{option?.value}</span>
                                </>}
                                {!isEmptyString(option?.imageUrl) && <>
                                  <br />
                                  <span>&nbsp; &nbsp;<Image style={{ maxHeight: '20vh', maxWidth: '20vw', textAlign: 'left' }} src={option?.imageUrl} /></span>
                                </>}
                              </div>
                            )
                          })
                          }
                        </div>
                        <Divider orientation="left">
                          Explanation
                        </Divider>
                        <Row>
                          {
                            !isEmptyString(question?.explanation?.videoUrl) &&
                            <Col xs={24}>
                              <Vimeo
                                video={question?.explanation?.videoUrl}
                                autoplay={false}
                                paused={true}
                                width="640px"
                              />
                            </Col>
                          }
                          {!isEmptyString(question?.explanation?.imageUrl) &&
                            <Col xs={24} lg={12}>
                              <Image src={question?.explanation?.imageUrl} style={{ maxHeight: '20vh', maxWidth: '  20vw', textAlign: 'left' }} />
                            </Col>}
                          {
                            !isEmptyString(question?.explanation?.correctAnswer) &&
                            <Col xs={24} lg={12}>
                              <Text>
                                The answer is: {question?.explanation?.correctAnswer}.
                              </Text>
                            </Col>
                          }
                          {
                            !isEmptyString(question?.explanation?.text) &&
                            <Col xs={24} lg={12}>
                              <Text>Explanation: </Text>
                              <Text>{question?.explanation?.text + "."}</Text>
                            </Col>
                          }
                        </Row>
                        {
                          isShowStatus && teacherId != null && examId != null ?
                            <>
                              <FormEditStatus
                                question={question}
                                setIsOpenModal={setIsOpenModal}
                              />
                            </> :
                            <></>
                        }
                      </Card>
                    )
                  })
                }
              </>
            }
          </>
        </Col>
      </Row>
      <br /><br />
    </div >
  )
}

export default ViewQuestion;

