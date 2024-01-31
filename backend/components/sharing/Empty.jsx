import { Empty } from "antd"

export const NotFound = ({ description }) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "0vh" }}>
            <Empty size="large" description={description} />
        </div >
    )
}