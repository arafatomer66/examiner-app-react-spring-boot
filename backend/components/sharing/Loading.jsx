import { Spin } from 'antd';

export const Loading = () => {
    return (
        <div style={{display: "flex", justifyContent: "center", marginTop: "10vh"}}>
            <Spin size="large" />
        </div>
    );
}