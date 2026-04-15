import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Space, Typography } from "antd";
import AuthLayout from "../components/AuthLayout";
import { DEMO_ADMIN, DEMO_USER } from "../config/demoAccounts";
import * as api from "../api/client";

export default function Login() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/", { replace: true });
  }, [navigate]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const data = await api.post("/auth/login", values);
      localStorage.setItem("token", data.token);
      message.success("Logged in");
      navigate("/", { replace: true });
    } catch (e) {
      message.error(api.errMsg(e));
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (acc) => {
    form.setFieldsValue({ email: acc.email, password: acc.password });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your tasks">
      <div className="demo-fill">
        <Typography.Text type="secondary" className="demo-fill-label">
          Demo (run <code>npm run seed</code> in backend)
        </Typography.Text>
        <Space wrap size="small">
          <Button size="small" onClick={() => fillDemo(DEMO_ADMIN)}>
            {DEMO_ADMIN.label}
          </Button>
          <Button size="small" onClick={() => fillDemo(DEMO_USER)}>
            {DEMO_USER.label}
          </Button>
        </Space>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input prefix={<UserOutlined style={{ color: "#94a3b8" }} />} placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password prefix={<LockOutlined style={{ color: "#94a3b8" }} />} placeholder="••••••••" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
          Sign in
        </Button>
      </Form>
      <div className="auth-footer">
        <Typography.Text type="secondary">No account? </Typography.Text>
        <Link to="/register">Create one</Link>
      </div>
    </AuthLayout>
  );
}
