import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { App, Button, Card, Form, Input, Typography } from "antd";
import * as api from "../api/client";

export default function Register() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/", { replace: true });
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      const data = await api.post("/auth/register", values);
      message.success(data?.message || "Registered");
      navigate("/login", { replace: true });
    } catch (e) {
      message.error(api.errMsg(e));
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f5f5f5" }}>
      <Card style={{ width: "100%", maxWidth: 380 }} variant="borderless">
        <Typography.Title level={4} style={{ marginTop: 0 }}>Register</Typography.Title>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Name is required" },
              { min: 2, message: "At least 2 characters" },
              { max: 120, message: "Max 120 characters" },
            ]}
          >
            <Input autoComplete="name" placeholder="Your name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create account
          </Button>
        </Form>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Link to="/login">Back to login</Link>
        </div>
      </Card>
    </div>
  );
}
