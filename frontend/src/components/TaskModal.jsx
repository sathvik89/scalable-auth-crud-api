import { useEffect, useState } from "react";
import { FormOutlined } from "@ant-design/icons";
import { App, Form, Input, Modal, Typography } from "antd";
import * as api from "../api/client";

export default function TaskModal({ open, onClose, task, onSaved }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (task) {
      form.setFieldsValue({ title: task.title, description: task.description || "" });
    } else {
      form.resetFields();
    }
  }, [open, task, form]);

  const submit = async () => {
    const values = await form.validateFields();
    setBusy(true);
    try {
      if (task?._id) {
        await api.put(`/tasks/${task._id}`, values);
      } else {
        await api.post("/tasks", values);
      }
      message.success("Saved");
      onSaved?.();
      onClose?.();
    } catch (e) {
      message.error(api.errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const title = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <FormOutlined style={{ color: "var(--app-primary)" }} />
      <Typography.Text strong>{task ? "Edit task" : "New task"}</Typography.Text>
    </span>
  );

  return (
    <Modal title={title} open={open} onCancel={onClose} onOk={submit} confirmLoading={busy} destroyOnHidden>
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="What needs to be done?" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Optional details" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
