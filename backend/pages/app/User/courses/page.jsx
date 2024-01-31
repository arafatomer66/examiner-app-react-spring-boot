
import { Typography } from 'antd';
const { Title, Text } = Typography;
import {
    RightCircleFilled
} from '@ant-design/icons'
import DrawerLayout from '../../DrawerLayout';
import { ToastContext } from 'src/lib/context/toastContext';
import { useContext, useEffect } from 'react';
import { fetchExamsApi, fetchSubjectByExamIdAndTeacherIdApi } from 'src/_api/exam';
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';
import { setSubjectList } from 'src/redux/services/lesson';
import { selectExamList, setExamList } from 'src/redux/services/exam';
import ViewSubject from 'src/components/lessons/DisplayLesson/ViewSubject';
import { VimeoPlayerLesson } from 'src/components/lessons/DisplayLesson/VimeoPlayerLesson';
import ViewLesson from 'src/components/lessons/DisplayLesson/ViewLesson';
import { AuthContext } from 'src/lib/context/authContext';
import { gray, purple } from '@ant-design/colors';

export default function CoursePage() {
    const { toastError } = useContext(ToastContext);
    const examList = useSelector(selectExamList);
    const teacherId = useSelector(selectSystemTeacherId);
    const dispatch = useDispatch();
    const examId = useSelector(selectSystemExamId);
    const { role } = useContext(AuthContext);
    const fetchSubjectsByExamIdAndTeacherIdApiFunction = async (_examId) => {
        try {
            const response = await fetchSubjectByExamIdAndTeacherIdApi(_examId, teacherId);
            if (response && response.data && response.data.subject) {
                dispatch(setSubjectList(response.data.subject));
            }
            else {
                throw new Error("No subject list for this exam or failed to fetch subject list");
            }
        }
        catch (error) {
            dispatch(setSubjectList([]))
            toastError("Subjects for this exam is empty");
        }
    }

    const fetchExamsApiFunction = async (signal) => {
        const respose = await fetchExamsApi({ signal })
        if (respose && respose.data && respose.data.exam) {
            const options = respose.data.exam.map(exam => {
                return {
                    label: exam.title,
                    value: exam.id
                }
            })
            dispatch(setExamList(options));
        }
    }

    const handleChange = (value) => {
        dispatch(changeExamId(value));
        fetchSubjectsByExamIdAndTeacherIdApiFunction(value);
    };

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        if (examList == null) fetchExamsApiFunction(signal);
        if (examId != null) fetchSubjectsByExamIdAndTeacherIdApiFunction(examId);
        return () => {
            abortController.abort();
        };
    }, [])


    return (
        <DrawerLayout>
            <main
            >
                <div className='bg-gradient wrapper wrapper-padding '>

                    <div >
                        <Text style={{ color: gray[1] }}>
                            Exam prep resources
                        </Text>
                        <Title level={5} className='color-white' >
                            Watch videos on your exam's subjects to prepare for your exam!
                        </Title>
                    </div>
                </div>
                <VimeoPlayerLesson />
                <section className='wrapper-padding' style={{ paddingTop: "0px" }}>
                    <div className="card-grid">
                        {
                            examList && examList.map((exam) => {
                                return (
                                    <div className="card"
                                        key={exam.id + "card"}
                                        onClick={() => {
                                            handleChange(exam?.value)
                                        }}
                                        style={{ width: 240 }}
                                    >
                                        <div class="card-image">
                                            {/* <img src="your-image-url.jpg" alt="Card Image" /> */}
                                        </div>
                                        <div class="card-title" > {exam.label} </div>
                                        <br />
                                        <div class="card-content" style={{ color: gray[6] }}>
                                            View
                                            &nbsp;
                                            <RightCircleFilled style={{ fontSize: "20px", color: purple[5] }} />
                                        </div>

                                        {/* <div class="card-content" style={{ color: gray[6] }}> {exam.description} </div> */}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <br />
                    <div>
                        <ViewSubject />

                        <ViewLesson />
                    </div>
                </section>
            </main>
        </DrawerLayout >
    )
}