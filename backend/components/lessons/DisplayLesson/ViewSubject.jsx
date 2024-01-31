import {
  Radio,
} from 'antd';
import { Fragment, useContext } from 'react';
import { ToastContext } from 'src/lib/context/toastContext';
import { selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { useDispatch, useSelector } from "react-redux";
import { selectSubjectList, setLessonMap, setCurrentSubject, setTopicMap } from 'src/redux/services/lesson';
import './ViewSubject.css';
import { fetchLessonsApi } from 'src/_api/lesson';
import { NotFound } from 'src/components/sharing/Empty';
import { purple } from '@ant-design/colors';

export function ViewSubject({
}) {
  const dispatch = useDispatch();
  const examId = useSelector(selectSystemExamId);
  const subjectList = useSelector(selectSubjectList);
  const { toastError } = useContext(ToastContext);

  const handleValueChange = (event) => {
    let value = event.target.value
    let index = subjectList.findIndex(subject => subject?.id == value);
    // if (index == -1) toastError("No subject list for this exam");
    let _currentSubject = {
      ...subjectList[index]
    }
    dispatch(setCurrentSubject(_currentSubject))
    if (_currentSubject?.id == null) {
      toastError("Choose a subject first!");
    }
    fetchLessonsApi(
      {
        examId,
        subjectId: _currentSubject?.id,
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
  }

  return (
    <div style={{ paddingTop: "0px", paddingBottom: "10px" }}>
      {subjectList == null ?
        <div>

        </div>
        :
        <>
          {subjectList[0] == null &&
            <div>
              <NotFound />
            </div>
          }
        </>
      }
      {subjectList != null &&
        <>
          <div >
            {subjectList[0] != null &&
              <div>
                <Radio.Group onChange={handleValueChange} >
                  {
                    subjectList.map((subject, _index) => {
                      return (
                        <Fragment key={subject?.id}>
                          <Radio.Button 
                          
                          style={{
                            marginRight: "50px", minWidth: "100px",
                            textAlign: "center", 
                          }}
                            value={subject?.id}>{subject?.title}</Radio.Button>
                        </Fragment>
                      )
                    })
                  }
                </Radio.Group>
              </div>
            }
          </div>
          <br />
        </>
      }
    </div >
  )
}

export default ViewSubject;

