
import { useContext, useEffect, useState } from 'react';
import { deleteModuleById, fetchExamModuleQuestionsApi, fetchExamModulesApi, fetchExamsApi } from 'src/_api/exam';
import {
  Button,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Pagination,
  theme,
  Divider,
  Popconfirm,
  List,
  Drawer,
  Tag
} from 'antd';
import { ToastContext } from 'src/lib/context/toastContext';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useJSMediaQuery } from 'src/lib/hooks/useJSMediaQuery';
import { useSelector, useDispatch } from "react-redux";
import { selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { setModuleList, setQuestionStringToFetch, setModuleId, deleteModuleList, selectCurrentModule, selectExamModuleId, selectModuleList } from 'src/redux/services/exam';
import { getQuestionsLength } from 'src/lib/utils/getQuestionsLength';
import './ViewModule.css'
import { gray } from '@ant-design/colors';
import { getMonthFromInteger } from 'src/lib/utils/helper';
export default function ViewModule({
  editModalInitFunction = null
}) {
  const dispatch = useDispatch();
  const teacherId = useSelector(selectSystemTeacherId);
  const examId = useSelector(selectSystemExamId);
  const examModules = useSelector(selectModuleList);
  const currentModule = useSelector(selectCurrentModule)
  const [pagination, setPagination] = useState(null);
  const moduleId = useSelector(selectExamModuleId);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const { toastSuccess: showToastSuccess } = useContext(ToastContext);
  const { isMobile } = useJSMediaQuery();
  function fetchExamModulesApiFunction(examId = examId, teacherId = teacherId, page = 0, size = 10) {
    if (examId === null) {
      return;
    }
    fetchExamModulesApi(examId, teacherId, page, size).then(res => {
      let { list, ...paginationData } = res.data;
      dispatch(setModuleList(list));
      setPagination(paginationData);
    })
      .catch(error => {
        console.log({ error })
      })
  }

  useEffect(() => {
    fetchExamModulesApiFunction(examId, teacherId, 0, 10);
  }, [examId])

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        View Exam selection
      </Button>
      <br />
      <Drawer
        style={{ width: '800px' }}
        title="Choose exam to view" placement="right" onClose={onClose} open={open}>
        <Pagination
          total={pagination?.totalItems ?? 0}
          responsive
          onChange={(page, size) => {
            if (page != 0) {
              page = page - 1;
            }
            fetchExamModulesApiFunction(examId, teacherId, page, size)
          }}
          showTotal={() => `Total ${pagination?.totalItems ?? 0} items`}
        />
        <br />  <br />
        <Row
          justify='left'
          gutter={
            [{ xs: 0, lg: 16 },
            { xs: 0, lg: 16 }]
          } style={{
            paddingLeft: "30px",
            paddingRight: "30px",
            // minHeight: '30vh'
          }
          }>
          {examModules != null && examModules[0] == undefined && editModalInitFunction == null &&
            <div>
              <br />  <br />  <br />
              <p>No modules to show!</p>
            </div>
          }

          <div className='exam-grid'>
            {
              examModules != null && examModules[0] != undefined && examModules.map((module, index) => {
                console.log({ module })
                return (
                  <Card
                    key={module.id + "modulexyz" + index}
                    style={
                      {
                        minWidth: 150,
                        cursor: "pointer",
                        height: "min-height",
                        padding: '5px',
                        marginBottom: editModalInitFunction != null ? "0xp" : "15px",
                        ...(moduleId === module?.id &&
                        {
                          boxShadow: "0 0 10px rgba(0,0,0,0.6)",
                          color: "rgba(0,0,0,0.6)",
                          fontWeight: "bold"
                        }
                        )
                      }
                    }
                    onClick={() => {
                      if (moduleId != module.id) {
                        dispatch(setModuleId(module.id))
                        dispatch(setQuestionStringToFetch(module.questions));
                      }
                    }}
                  >
                    <p>
                      Exam
                      {/* {index + 1 + (pagination?.currentPage ?? 0) * (pagination?.size ?? 10)} */}
                      &nbsp; #{module.id}
                      &nbsp; {'('}{getQuestionsLength(module?.questions) ?? 0} questions{')'}
                    </p>
                    <p>
                      <div>
                        <p style={{ color: gray[3] }}>
                          Created: {module?.createdDateTime[2]}th {getMonthFromInteger(module?.createdDateTime[1])}, {module?.createdDateTime[0]}
                        </p>
                        <p style={{ color: gray[3] }}>
                          Updated: {module?.updatedDateTime[2]}th {getMonthFromInteger(module?.updatedDateTime[1])}, {module?.updatedDateTime[0]}
                        </p>
                        {
                          module?.fileName &&
                          <p> File: {module?.fileName} </p>
                        }
                      </div>
                    </p>
                    {
                      editModalInitFunction != null &&
                      <div style={{
                        display: editModalInitFunction != null ? "flex" : "none",
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginTop: editModalInitFunction != null ? "15px" : "0px",
                      }}>
                        <>
                          {
                            editModalInitFunction == null && <br />
                          }
                          <div>
                            <Button
                              className='group-parent-hover'
                              // size='small'
                              onClick={() => {
                                editModalInitFunction();
                              }}
                              bordered={false}
                              style={{ border: "none", boxShadow: "none" }}
                            >
                              <span className='group-child-hover-show'>Add </span>
                              <PlusCircleOutlined style={{ fontSize: "20px" }} />
                            </Button>
                            <Popconfirm
                              title="Delete"
                              description="Are you sure to delete this?"
                              onConfirm={
                                () => {
                                  deleteModuleById(module.id).then(() => {
                                    showToastSuccess("Delete module successfully for id= " + module.id)
                                    dispatch(deleteModuleList(module.id));
                                  });
                                }
                              }
                              // onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                className='group-parent-hover'
                                // size='small'
                                bordered={false}
                                style={{ border: "none", boxShadow: "none" }}
                              >
                                <span className='group-child-hover-show'>Delete </span>
                                <DeleteOutlined style={{ fontSize: "20px" }} />
                              </Button>
                            </Popconfirm>
                          </div>
                        </>
                      </div>
                    }
                  </Card>
                )
              })
            }
          </div>
        </Row>
        <br /> <br />
      </Drawer>
    </>
  )
}