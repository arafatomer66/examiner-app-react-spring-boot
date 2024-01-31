import { UserOutlined } from "@ant-design/icons";
import { Input, Modal, message } from "antd";
import { useState, useEffect, useContext } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { selectModalState, setModalState } from "src/redux/services/lesson";
import { MODAL_ROUTE_MESSAGE } from "src/lib/utils/constant";
import { useNavigate } from "react-router-dom";
import Typography from "antd/es/typography/Typography";
import { blue, gray, green } from "@ant-design/colors";
import { createHistoryApi } from "src/_api/history/history";
import { AuthContext } from "src/lib/context/authContext";

export function ModalSubmitExam({
    urlModuleId
}) {
    const modalState = useSelector(selectModalState)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile } = useContext(AuthContext);
    const handleCancel = () => {
        setIsModalOpen(false);
        dispatch(setModalState(null));
    };
    useEffect(() => {
        console.log("modalState", modalState);
        if (modalState == MODAL_ROUTE_MESSAGE.SUBMIT_EXAM_CONFIRM) {
            setIsModalOpen(true);
        }
        return () => {
            setIsModalOpen(false);
        }
    }, [modalState]);

    const handleSubmit = async () => {
        const questionIdToSubmissionMap = JSON.parse(localStorage.getItem('test' + urlModuleId));
        const createeSubmission = await createHistoryApi({
            moduleId: urlModuleId,
            attempt: questionIdToSubmissionMap,
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
    }

    return (
        <Modal title="Submit Attempt..." open={isModalOpen} okText="Submit!" cancelText="Later!"
            onOk={handleSubmit} onCancel={handleCancel}>
            <br />
            <Typography.Title level={4}> Are your ready to submit your attempt? </Typography.Title>
            <br />
            <Typography.Text > Please press "Submit" to stop and submit attempt. </Typography.Text>
            <br />
            <Typography.Text style={{ color: blue[6] }}> Press "Later" to continue your attempt.? </Typography.Text>
            <br /><br />
        </Modal>
    )
}