import { useCallback, useEffect, useRef, useState } from "react";

// In dev, "/api" is proxied to the Railway backend by Vite (see vite.config.js).
// In production, VITE_API_BASE points at the backend origin.
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

// Command sent to the device when its DeviceId is clicked.
const DEVICE_COMMAND = "GET_STATUS";

// The detail panel re-polls the selected device this often.
const REFRESH_MS = 5000;

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#eaf6ff",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    color: "#001f54",
    marginBottom: "24px",
  },
  table: {
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
    border: "1px solid #b3d7f2",
    borderRadius: "8px",
    overflow: "hidden",
    minWidth: "520px",
  },
  th: {
    backgroundColor: "#001f54",
    color: "#ffffff",
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "15px",
  },
  td: {
    borderTop: "1px solid #e0eefb",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#0d1b2a",
  },
  link: {
    background: "none",
    border: "none",
    padding: 0,
    color: "#0b5fff",
    fontSize: "14px",
    fontWeight: "bold",
    textDecoration: "underline",
    cursor: "pointer",
  },
  detail: {
    marginTop: "32px",
    backgroundColor: "#ffffff",
    border: "1px solid #b3d7f2",
    borderRadius: "8px",
    padding: "28px",
    maxWidth: "760px",
  },
  detailHeading: {
    margin: "0 0 20px",
    color: "#001f54",
    fontSize: "44px",
  },
  detailBody: {
    fontSize: "28px",
    color: "#0d1b2a",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: 0,
  },
  detailError: {
    fontSize: "28px",
    color: "#b00020",
    margin: 0,
  },
  rawLabel: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#4a6178",
    margin: "0 0 6px",
  },
  rawText: {
    fontFamily: "Consolas, monospace",
    fontSize: "14px",
    color: "#0d1b2a",
    backgroundColor: "#f2f8ff",
    border: "1px solid #d6e8fb",
    borderRadius: "6px",
    padding: "12px 14px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: "0 0 20px",
  },
};

// Turn "STATUS MODE=OFF TARGET=-89.0 TUB=38.5" into [{field:"MODE",value:"OFF"}, ...]
function parseStatus(text) {
  return String(text)
    .trim()
    .split(/\s+/)
    .filter((token) => token.includes("="))
    .map((token) => {
      const i = token.indexOf("=");
      return { field: token.slice(0, i), value: token.slice(i + 1) };
    });
}

const DEVICES = [
  { deviceId: "device1", macAddress: "A4:CF:12:9B:00:11", ipAddress: "192.168.1.101" },
  { deviceId: "device2", macAddress: "A4:CF:12:9B:00:22", ipAddress: "192.168.1.102" },
];

function MultiDeviceList() {
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const requestSeq = useRef(0);

  // Poll the given device once. `initial` = first fetch after a click:
  // it clears the panel and surfaces errors. Periodic refreshes keep the
  // last good data on screen if a poll fails.
  const fetchStatus = useCallback(async (deviceId, { initial = false } = {}) => {
    const seq = ++requestSeq.current;
    if (initial) {
      setLoading(true);
      setResult(null);
      setError(null);
    }

    const url = `${API_BASE}/api/mqtt/publisher/command-dynamic?topic=${deviceId}/response`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: DEVICE_COMMAND,
      });

      const text = await response.text();
      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }

      // A later click / tick already superseded this request — drop its result.
      if (seq !== requestSeq.current) return;

      if (!response.ok) {
        if (initial) {
          setError(
            `Request failed (${response.status})\n` +
              (typeof payload === "string" ? payload : JSON.stringify(payload, null, 2))
          );
        }
        return;
      }

      const raw =
        payload && typeof payload === "object" && "response" in payload
          ? String(payload.response)
          : typeof payload === "string"
          ? payload
          : JSON.stringify(payload, null, 2);

      setError(null);
      setResult({
        deviceId,
        topic: `${deviceId}/response`,
        raw,
        at: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      if (seq === requestSeq.current && initial) setError(err.message);
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, []);

  const handleDeviceClick = (deviceId) => {
    setSelectedId(deviceId);
    fetchStatus(deviceId, { initial: true });
  };

  // While a device is selected, re-call the same API every REFRESH_MS using the
  // deviceId shown in the heading (device1 / device2 / ...).
  useEffect(() => {
    if (!selectedId) return undefined;
    const timer = setInterval(() => {
      fetchStatus(selectedId);
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [selectedId, fetchStatus]);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Devices</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>DeviceId</th>
            <th style={styles.th}>Mac Address</th>
            <th style={styles.th}>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {DEVICES.map((device) => (
            <tr key={device.deviceId}>
              <td style={styles.td}>
                <button
                  type="button"
                  style={styles.link}
                  onClick={() => handleDeviceClick(device.deviceId)}
                >
                  {device.deviceId}
                </button>
              </td>
              <td style={styles.td}>{device.macAddress}</td>
              <td style={styles.td}>{device.ipAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedId && (
        <div style={styles.detail}>
          <h1 style={styles.detailHeading}>{selectedId}</h1>
          {loading && <p style={styles.detailBody}>Loading...</p>}
          {!loading && error && <p style={styles.detailError}>{error}</p>}
          {!loading && !error && result && (
            <>
              <p style={styles.rawLabel}>
                {result.topic} &middot; {result.at} &middot; auto-refresh {REFRESH_MS / 1000}s
              </p>
              <pre style={styles.rawText}>{result.raw}</pre>
              {(() => {
                const rows = parseStatus(result.raw);
                if (rows.length === 0) return null;
                return (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Field</th>
                        <th style={styles.th}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.field}>
                          <td style={styles.td}>{row.field}</td>
                          <td style={styles.td}>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiDeviceList;
