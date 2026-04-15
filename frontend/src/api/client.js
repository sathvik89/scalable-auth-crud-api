
const base = String(import.meta.env.VITE_API_BASE_URL || "").trim();

function headers() {
  const h = { "Content-Type": "application/json" };
  const t = localStorage.getItem("token");
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

async function handle(res) {
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  if (!res.ok) {
    if (res.status === 401) {
      const p = window.location.pathname;
      if (p !== "/login" && p !== "/register") {
        localStorage.removeItem("token");
        window.location.assign("/login");
      }
    }
    const err = new Error(data?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function errMsg(e) {
  return e?.data?.message || e?.message || "Request failed";
}

export async function get(path) {
  const res = await fetch(`${base}${path}`, { headers: headers() });
  return handle(res);
}

export async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  return handle(res);
}

export async function put(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });
  return handle(res);
}

export async function del(path) {
  const res = await fetch(`${base}${path}`, {
    method: "DELETE",
    headers: headers(),
  });
  return handle(res);
}
