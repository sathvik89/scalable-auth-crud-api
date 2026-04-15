import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { App, Button, Card, Form, Input, Typography } from "antd";
import * as api from "../api/client";

export default function Login() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/", { replace: true });
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      const data = await api.post("/auth/login", values);
      localStorage.setItem("token", data.token);
      message.success("Logged in");
      navigate("/", { replace: true });
    } catch (e) {
      message.error(api.errMsg(e));
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f5f5f5" }}>
      <Card style={{ width: "100%", maxWidth: 380 }} variant="borderless">
        <Typography.Title level={4} style={{ marginTop: 0 }}>Login</Typography.Title>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign in
          </Button>
        </Form>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Link to="/register">Register</Link>
        </div>
      </Card>
    </div>
  );
}
