import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Button, Layout, Table, Space, Popconfirm } from "antd";
import * as api from "../api/client";
import TaskModal from "../components/TaskModal";

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const removeTask = async (id) => {
    try {
      const data = await api.del(`/tasks/${id}`);
      message.success(data?.message || "OK");
      loadTasks();
    } catch (e) {
      message.error(api.errMsg(e));
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "t" },
    { title: "Description", dataIndex: "description", key: "d", render: (v) => v || "—" },
    {
      title: "",
      key: "a",
      width: 140,
      render: (_, row) => (
        <Space>
          <Button type="link" size="small" onClick={() => { setEditing(row); setModalOpen(true); }}>
            Edit
          </Button>
          <Popconfirm title="Delete?" onConfirm={() => removeTask(row._id)}>
            <Button type="link" size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" width={200} style={{ borderRight: "1px solid #eee" }}>
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 16, fontWeight: 600 }}>Tasks</div>
          <Button danger block onClick={logout}>Logout</Button>
        </div>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", lineHeight: "64px", borderBottom: "1px solid #eee", padding: "0 16px" }}>
          Task manager
        </Header>
        <Content style={{ padding: 16, background: "#f5f5f5" }}>
          <div style={{ background: "#fff", padding: 16, border: "1px solid #eee" }}>
            <Button type="primary" onClick={() => { setEditing(null); setModalOpen(true); }} style={{ marginBottom: 12 }}>
              Add task
            </Button>
            <Table rowKey="_id" size="small" loading={loading} dataSource={tasks} columns={columns} pagination={{ pageSize: 10 }} />
          </div>
        </Content>
      </Layout>
      <TaskModal
        open={modalOpen}
        task={editing}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSaved={loadTasks}
      />
    </Layout>
  );
}
