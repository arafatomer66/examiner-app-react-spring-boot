import { Button, Form, Input, Typography } from 'antd';
import DrivePickerExcel from './DrivePickerExcel';
const { Title, Text } = Typography;
import { useSelector, useDispatch } from "react-redux";
import { changeExamId, selectSystemExamId, selectSystemTeacherId } from 'src/redux/services/system';

export default function DriveBulkUpload() {
    const teacherId = useSelector(selectSystemTeacherId);
    const examId = useSelector(selectSystemExamId);
    return (
        <>
        <br /> <br /> 
            <Title level={2}>Upload Questions Using Drive</Title>

            <Form
                name="wrap"
                labelCol={{ flex: '110px' }}
                labelAlign="left"
                labelWrap
                wrapperCol={{ flex: 1 }}
                colon={false}
                style={{ maxWidth: 600 }}
            >
                <Form.Item>
                    <DrivePickerExcel />
                </Form.Item>
            </Form>
        </>
    )
}