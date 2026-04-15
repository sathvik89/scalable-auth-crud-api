import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IdcardOutlined, MailOutlined, LockOutlined, TeamOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Radio, Typography } from "antd";
import AuthLayout from "../components/AuthLayout";
import * as api from "../api/client";

export default function Register() {
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
      const data = await api.post("/auth/register", values);
      message.success(data?.message || "Registered");
      navigate("/login", { replace: true });
    } catch (e) {
      message.error(api.errMsg(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Join to organize your tasks">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{ role: "user" }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Name is required" },
            { min: 2, message: "At least 2 characters" },
            { max: 120, message: "Max 120 characters" },
          ]}
        >
          <Input prefix={<IdcardOutlined style={{ color: "#94a3b8" }} />} autoComplete="name" placeholder="Your name" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input prefix={<MailOutlined style={{ color: "#94a3b8" }} />} autoComplete="email" placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
          <Input.Password prefix={<LockOutlined style={{ color: "#94a3b8" }} />} autoComplete="new-password" placeholder="At least 6 characters" />
        </Form.Item>
        <Form.Item
          name="role"
          label="Account type"
          rules={[{ required: true, message: "Choose account type" }]}
        >
          <Radio.Group className="register-role-group" optionType="button" buttonStyle="solid" block>
            <Radio.Button value="user">
              <TeamOutlined /> User
            </Radio.Button>
            <Radio.Button value="admin">
              <SafetyCertificateOutlined /> Admin
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
          Create account
        </Button>
      </Form>
      <div className="auth-footer">
        <Typography.Text type="secondary">Already have an account? </Typography.Text>
        <Link to="/login">Sign in</Link>
      </div>
    </AuthLayout>
  );
}
