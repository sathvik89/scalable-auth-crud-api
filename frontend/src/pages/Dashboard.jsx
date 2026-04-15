import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  LogoutOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { App, Button, Layout, Table, Space, Popconfirm, Typography, Spin } from "antd";
import * as api from "../api/client";
import TaskModal from "../components/TaskModal";

const { Header, Sider, Content } = Layout;

function taskOwnerEmail(row) {
  const u = row.user;
  if (u && typeof u === "object" && u.email) return u.email;
  return null;
}

export default function Dashboard() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/tasks");
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      message.error(api.errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const removeTask = async (id) => {
    setDeletingId(id);
    try {
      const data = await api.del(`/tasks/${id}`);
      message.success(data?.message || "Deleted");
      await loadTasks();
    } catch (e) {
      message.error(api.errMsg(e));
    } finally {
      setDeletingId(null);
    }
  };

  const showOwnerColumn = tasks.some((t) => taskOwnerEmail(t));

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "t",
      render: (text) => (
        <Typography.Text strong style={{ color: "#0f172a" }}>
          {text}
        </Typography.Text>
      ),
    },
    ...(showOwnerColumn
      ? [
          {
            title: "Owner",
            key: "owner",
            width: 200,
            ellipsis: true,
            render: (_, row) => (
              <Typography.Text type="secondary">{taskOwnerEmail(row) || "—"}</Typography.Text>
            ),
          },
        ]
      : []),
    {
      title: "Description",
      dataIndex: "description",
      key: "d",
      ellipsis: true,
      render: (v) => (
        <Typography.Text type="secondary">{v || "—"}</Typography.Text>
      ),
    },
    {
      title: "Actions",
      key: "a",
      width: 180,
      align: "right",
      render: (_, row) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(row);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm title="Delete this task?" okText="Delete" cancelText="Cancel" onConfirm={() => removeTask(row._id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} loading={deletingId === row._id}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="dashboard-layout">
      <Sider theme="light" width={220} className="dashboard-sider">
        <div className="dashboard-brand">
          <span className="dashboard-brand-icon" aria-hidden>
            <CheckSquareOutlined />
          </span>
          <span>Tasks</span>
        </div>
        <div className="dashboard-sider-actions">
          <Button icon={<LogoutOutlined />} danger block onClick={logout}>
            Log out
          </Button>
        </div>
      </Sider>
      <Layout>
        <Header className="dashboard-header">
          <UnorderedListOutlined style={{ marginRight: 10, color: "var(--app-primary)", fontSize: 20 }} />
          <h1 className="dashboard-header-title">Task manager</h1>
        </Header>
        <Content className="dashboard-content">
          <Spin spinning={loading} tip="Loading tasks…" size="large">
            <div className="dashboard-panel">
              <div className="dashboard-toolbar">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => {
                    setEditing(null);
                    setModalOpen(true);
                  }}
                >
                  Add task
                </Button>
              </div>
              <Table
                rowKey="_id"
                size="middle"
                loading={false}
                dataSource={tasks}
                columns={columns}
                pagination={{ pageSize: 10, showSizeChanger: false }}
              />
            </div>
          </Spin>
        </Content>
      </Layout>
      <TaskModal
        open={modalOpen}
        task={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSaved={loadTasks}
      />
    </Layout>
  );
}
