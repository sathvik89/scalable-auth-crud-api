import { Card, Typography } from "antd";
import { CheckSquareOutlined } from "@ant-design/icons";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-brand">
          <span className="auth-logo" aria-hidden>
            <CheckSquareOutlined />
          </span>
          <Typography.Title level={3} className="auth-heading">
            {title}
          </Typography.Title>
          {subtitle ? (
            <Typography.Text type="secondary" className="auth-subtitle">
              {subtitle}
            </Typography.Text>
          ) : null}
        </div>
        <Card className="auth-card" variant="borderless">
          {children}
        </Card>
      </div>
    </div>
  );
}
