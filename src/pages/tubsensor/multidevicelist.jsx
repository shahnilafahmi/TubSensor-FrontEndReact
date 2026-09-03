import { useCallback, useEffect, useRef, useState } from "react";

// In dev, "/api" is proxied to the Railway backend by Vite (see vite.config.js).
// In production, VITE_API_BASE points at the backend origin.
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

// Command sent to the device on every poll.
const DEVICE_COMMAND = "GET_STATUS";

// Both the detail panel and the fault table re-poll this often.
const REFRESH_MS = 5000;

const RED = "#d40000";

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
  tablesRow: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  table: {
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
    border: "1px solid #b3d7f2",
    borderRadius: "8px",
    overflow: "hidden",
    minWidth: "420px",
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
  tdFaultId: {
    borderTop: "1px solid #e0eefb",
    padding: "12px 16px",
    fontSize: "14px",
    color: RED,
    fontWeight: "bold",
  },
  tdFaultValue: {
    borderTop: "1px solid #e0eefb",
    padding: "12px 16px",
    fontSize: "14px",
    color: RED,
    wordBreak: "break-word",
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
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
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

// Turn "STATUS MODE=OFF TARGET=-89.0 FAULT=NONE" into [{field:"MODE",value:"OFF"}, ...]
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

function faultOf(raw) {
  const match = parseStatus(raw).find((row) => row.field === "FAULT");
  return match ? match.value : null;
}

// Normalize an error body into a single readable line.
function describeError(payload, status) {
  if (payload && typeof payload === "object") {
    const parts = [payload.message, payload.error].filter(Boolean);
    if (parts.length) return parts.join(" — ");
  }
  if (typeof payload === "string" && payload.trim()) return payload.trim();
  return `HTTP ${status}`;
}

// One round-trip to a device. Never throws: returns {deviceId, ok, raw?} or
// {deviceId, ok:false, error}.
async function probeDevice(deviceId) {
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

    if (!response.ok) {
      return { deviceId, ok: false, error: describeError(payload, response.status) };
    }

    const raw =
      payload && typeof payload === "object" && "response" in payload
        ? String(payload.response)
        : typeof payload === "string"
        ? payload
        : JSON.stringify(payload, null, 2);
    return { deviceId, ok: true, raw };
  } catch (err) {
    return { deviceId, ok: false, error: err.message };
  }
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
  const [faults, setFaults] = useState([]);
  const requestSeq = useRef(0);

  // Detail panel: poll the selected device.
  const fetchStatus = useCallback(async (deviceId, { initial = false } = {}) => {
    const seq = ++requestSeq.current;
    if (initial) {
      setLoading(true);
      setResult(null);
      setError(null);
    }

    const res = await probeDevice(deviceId);
    if (seq !== requestSeq.current) return; // superseded by a newer click/tick

    if (!res.ok) {
      setError(res.error);
      setResult(null);
    } else {
      setError(null);
      setResult({
        deviceId,
        topic: `${deviceId}/response`,
        raw: res.raw,
        at: new Date().toLocaleTimeString(),
      });
    }
    setLoading(false);
  }, []);

  const handleDeviceClick = (deviceId) => {
    setSelectedId(deviceId);
    fetchStatus(deviceId, { initial: true });
  };

  // Detail panel auto-refresh every REFRESH_MS for the selected device.
  useEffect(() => {
    if (!selectedId) return undefined;
    let cancelled = false;
    let timer;
    const tick = async () => {
      await fetchStatus(selectedId);
      if (!cancelled) timer = setTimeout(tick, REFRESH_MS);
    };
    timer = setTimeout(tick, REFRESH_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedId, fetchStatus]);

  // Fault table: loop every device from the list, hit the API, keep only the
  // ones where FAULT != NONE or the call errored. Re-runs every REFRESH_MS.
  useEffect(() => {
    let cancelled = false;
    let timer;

    const pollAll = async () => {
      const results = await Promise.all(
        DEVICES.map((device) => probeDevice(device.deviceId))
      );
      if (cancelled) return;

      const rows = [];
      for (const res of results) {
        if (!res.ok) {
          rows.push({ deviceId: res.deviceId, fault: res.error });
        } else {
          const fault = faultOf(res.raw);
          if (fault && fault !== "NONE") {
            rows.push({ deviceId: res.deviceId, fault });
          }
        }
      }
      setFaults(rows);
      timer = setTimeout(pollAll, REFRESH_MS);
    };

    pollAll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Devices</h2>

      <div style={styles.tablesRow}>
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

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>DeviceId</th>
              <th style={styles.th}>FAULT</th>
            </tr>
          </thead>
          <tbody>
            {faults.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan={2}>
                  No faults
                </td>
              </tr>
            ) : (
              faults.map((row) => (
                <tr key={row.deviceId}>
                  <td style={styles.tdFaultId}>{row.deviceId}</td>
                  <td style={styles.tdFaultValue}>{row.fault}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
