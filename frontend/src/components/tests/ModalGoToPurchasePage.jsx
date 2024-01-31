import { UserOutlined } from "@ant-design/icons";
import { Input, Modal, message } from "antd";
import { useState, useEffect, useContext } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { selectModalState, setModalState } from "src/redux/services/lesson";
import { MODAL_ROUTE_MESSAGE } from "src/lib/utils/constant";
import { useNavigate } from "react-router-dom";
import Typography from "antd/es/typography/Typography";
import { gray } from "@ant-design/colors";

export function ModalGoToPurchasePage({
}) {
    const modalState = useSelector(selectModalState)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleCancel = () => {
        setIsModalOpen(false);
        dispatch(setModalState(null));
    };
    useEffect(() => {
        console.log("modalState", modalState);
        if (modalState == MODAL_ROUTE_MESSAGE.EXAM_PAY_TO_VIEW_MODAL) {
            setIsModalOpen(true);
        }
        
    }, [modalState]);

    const handleSubmit = async () => {
        dispatch(setModalState(null));
        navigate('/app/pricing');
    }

    return (
        <Modal title="Start Exam..." open={isModalOpen} okText="Let's upgrade!" cancelText="Later!"
            onOk={handleSubmit} onCancel={handleCancel}>
            <br />
            <Typography.Title level={4}> This exam is not in your bundle. </Typography.Title>
            <br />
            <Typography.Text > Please upgrade to view this exam. </Typography.Text>
            <br />
            <Typography.Text style={{ color: gray[3] }}> View pricing plans? </Typography.Text>
            <br /><br />
        </Modal>
    )
}