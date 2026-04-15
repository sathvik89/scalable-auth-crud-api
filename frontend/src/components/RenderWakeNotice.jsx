import { useEffect } from "react";
import { App, Button, Typography } from "antd";
import { CloudServerOutlined } from "@ant-design/icons";

/** New key so users who dismissed the old modal still see this notice once. */
const STORAGE_KEY = "render_cold_start_notice_dismissed";
const NOTIF_KEY = "render-wake-cold-start";

export default function RenderWakeNotice() {
  const { notification } = App.useApp();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "1") return;

    const dismiss = () => {
      localStorage.setItem(STORAGE_KEY, "1");
      notification.destroy(NOTIF_KEY);
    };

    notification.info({
      key: NOTIF_KEY,
      icon: <CloudServerOutlined style={{ color: "#2563eb", fontSize: 22 }} />,
      message: "Hosted backend, cold start",
      description: (
        <Typography.Paragraph style={{ marginBottom: 0 }}>
          <p>
            ⚠️ On Render, the first request may take{" "}
            <strong>20–30 seconds</strong> as the server wakes up. If sign-up or
            login is slow, please wait, this is normal. Tap <strong>OK</strong>{" "}
            to continue.
          </p>
        </Typography.Paragraph>
      ),
      duration: 0,
      placement: "top",
      style: { width: 420, maxWidth: "calc(100vw - 32px)" },
      btn: (
        <Button type="primary" onClick={dismiss}>
          OK
        </Button>
      ),
    });

    return () => {
      notification.destroy(NOTIF_KEY);
    };
  }, [notification]);

  return null;
}
