import { Modal } from "antd";

export function CustomModal({ children, isOpenModal, onOk, onCancel, title, width=1000, style }) {
    return (
        <Modal
            width={width}
            {...(title ? { title } : {})}
            {...(style ? { style } : {})}
            open={isOpenModal}
            onOk={onOk}
            onCancel={onCancel}
            okButtonProps={{ style: { display: "none" } }}
        >
            {children}
        </Modal>
    )
}