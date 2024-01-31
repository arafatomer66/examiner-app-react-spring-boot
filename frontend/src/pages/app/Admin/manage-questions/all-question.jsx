
import { useContext, useEffect, useState } from 'react';
import { fetchExamsApi } from 'src/_api/exam';
import {
  Divider,
  Select,
  Typography,
} from 'antd';
const { Title, Text } = Typography;
import {
  OrderedListOutlined
} from '@ant-design/icons'
import DrawerLayout from '../../DrawerLayout';
import ViewQuestion from 'src/components/questions/DisplayQuestion/ViewQuestion';
import ViewModule from 'src/components/questions/DisplayQuestion/ViewModule';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId } from 'src/redux/services/system';
import { selectExamList, selectExamModuleId, setExamList } from 'src/redux/services/exam';
import { AuthContext } from 'src/lib/context/authContext';
import useRoleAuthorization from 'src/lib/hooks/useRoleAuthorization';
import { USER_ROLE } from 'src/lib/utils/constant';

export default function AllQuestionPage() {
  const { role } = useContext(AuthContext);
  useRoleAuthorization(role, [USER_ROLE.TEACHER, USER_ROLE.ADMIN, USER_ROLE.BACKOFFICEREVIEWER, USER_ROLE.BACKOFFICEUPLOADER]);
  const dispatch = useDispatch();
  const examOptions = useSelector(selectExamList);
  const setExamId = (examId) => { return dispatch(changeExamId(examId)) };
  const moduleId = useSelector(selectExamModuleId);
  const examId = useSelector(selectSystemExamId);
  const [questionRef, setQuestionRef] = useState(null);
  const handleChange = (value) => {
    setExamId(value);
  };
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (examOptions == null) {
      fetchExamsApi({ signal }).then(res => {
        const options = res.data.exam.map(exam => {
          return {
            label: exam.title,
            value: exam.id
          }
        })
        dispatch(setExamList(options));
      })
    }
    return () => {
      abortController.abort();
    }
  }, [])
  return (
    <DrawerLayout>
      <main
      >
        <section>
          <div>
            <div className='min-h-100vh' style={{ paddingLeft: "25px" }}>
              <>
                <br /> <br />
                <Divider orientation='left'>
                  <Title level={2}>
                    <OrderedListOutlined />
                    &nbsp;
                    Choose exam and module
                  </Title>
                </Divider>
                <br />
                <div>
                  <Text>Exam</Text>
                  &nbsp; &nbsp;
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Choose your exam"
                    optionFilterProp="children"
                    onChange={handleChange}
                    defaultValue={examId ?? null}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={examOptions}
                  />
                </div>
                <br /> <br />
                <Divider orientation='left'>
                  <Title level={5}
                  >
                    Choose module by clicking on the card
                  </Title>
                </Divider>
                <ViewModule
                />
                <br />
                {
                  examOptions != null && examOptions.length != 0 &&
                  <>
                    <Divider orientation='left'>
                      <Title level={4}>
                        View questions for exam #{moduleId}
                      </Title>
                    </Divider>
                    <br />
                    <div className='w-100 flexbox-between'>
                      <br ref={questionRef} />
                      <ViewQuestion />
                    </div>
                  </>
                }
              </>
            </div>
          </div>
        </section>
      </main>
    </DrawerLayout>
  )
}