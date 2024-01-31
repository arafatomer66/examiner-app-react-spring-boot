import {
  Typography,
  Collapse,
  Checkbox,
  Popconfirm,
  Tag,
  List,
  Skeleton,
  Avatar,
  Button,
  Empty
} from 'antd';
const { Title, Text } = Typography;
import { Fragment, useContext, useEffect, useState } from 'react';
import { ToastContext } from 'src/lib/context/toastContext';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import theme from 'src/lib/ThemeConfig';
import { selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { useDispatch, useSelector } from "react-redux";
import { deleteLessonMap, selectCurrentSubject, selectCurrentTopicId, selectLessonMap, selectSubjectList, selectSubjectPagination, selectTopicMap, setCurrentLesson, setLessonMap, setModalState, setSubjectPagination, setTopicMap } from 'src/redux/services/lesson';
import { isEmptyObject, returnNullIfIsEmptyString } from 'src/lib/utils/isEmpty';

import { AuthContext } from 'src/lib/context/authContext';
import { deleteLessonById, fetchLessonsApi } from 'src/_api/lesson';
import { MODAL_ROUTE_MESSAGE, USER_ROLE } from 'src/lib/utils/constant';
import { NotFound } from 'src/components/sharing/Empty';


export function ViewLesson({
}) {
  const dispatch = useDispatch();
  const subjectList = useSelector(selectSubjectList);
  const lessonMap = useSelector(selectLessonMap);
  const topicMapper = useSelector(selectTopicMap);
  const { role } = useContext(AuthContext);

  const { toastSuccess } = useContext(ToastContext);
  return (
    <div style={{ minHeight: '85vh', }}>
      {lessonMap == null ?
        <div>
          <p style={{ textAlign: "center" }}></p>
        </div>
        :
        <>
          {isEmptyObject(lessonMap) &&
            <div>
              <NotFound />
            </div>
          }
        </>
      }
      {lessonMap != null && subjectList != null && subjectList[0] != null &&
        <div>
          <Collapse
            defaultActiveKey={`${subjectList[0]?.id}SUBJECT`}
            style={{ width: "100%", }}
            items={
              Object.keys(topicMapper).filter(
                topicId => lessonMap[topicId] != null
              ).map((topicId, index) => {
                return (
                  {
                    key: `${subjectList[index]?.id}SUBJECT`, label: topicMapper[topicId]?.title ?? "Undefined",
                    children:
                      <List
                        itemLayout="horizontal"
                        dataSource={lessonMap[topicId]}
                        renderItem={(item) => {
                          return (
                            <List.Item
                              loading={false}
                              actions={
                                [USER_ROLE.PARENT, USER_ROLE.STUDENT].includes(role) ?
                                  []
                                  :
                                  [
                                    <Popconfirm
                                      key={`${topicId}${item.id}`}
                                      title="Are you sure to delete this lesson?"
                                      onConfirm={
                                        () => {
                                          deleteLessonById(item.id).then(res => {
                                            toastSuccess("Lesson deleted successfully!");
                                            if (res.data && 'isDeleted' in res.data) {
                                              dispatch(deleteLessonMap({ topicId: item.topicId, lessonId: item.id }))
                                            }
                                          })
                                        }
                                      }
                                    >
                                      <DeleteOutlined
                                        key="delete"
                                        style={{ color: theme?.token?.colorPrimary }}
                                      />
                                    </Popconfirm>,
                                    <EditOutlined
                                      key={`${topicId}`}
                                      style={{ color: theme?.token?.colorPrimary }}
                                      onClick={() => {
                                        dispatch(setCurrentLesson(item));
                                        dispatch(setModalState(MODAL_ROUTE_MESSAGE.LESSON_EDIT_MODAL));
                                      }
                                      } />
                                  ]}
                            >

                              <List.Item.Meta
                                avatar={<Avatar src={item.picture} />}
                                title={item?.title}
                                description={
                                  <>
                                  {
                                    [USER_ROLE.STUDENT, USER_ROLE.PARENT].includes(role) ?
                                      <></> :
                                      <>
                                        <Tag color="blue">Sequence: {item?.sequence}</Tag>
                                      </>
                                  }
                                  </>
                                }
                              />
                              {returnNullIfIsEmptyString(item?.url) &&
                                item?.url?.includes("https://vimeo.com/") &&
                                <Button type="link" onClick={() => {
                                  dispatch(setCurrentLesson(item));
                                  dispatch(setModalState(MODAL_ROUTE_MESSAGE.LESSON_VIDEO_MODAL));
                                }}>
                                  Watch Video
                                </Button>
                              }

                            </List.Item>
                          )
                        }}
                      />

                  }
                )
              })
            }
          />

          <br /><br />
        </div>
      }
    </div>
  )
}

export default ViewLesson;

