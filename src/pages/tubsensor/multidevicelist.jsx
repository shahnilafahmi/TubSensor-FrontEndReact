import { useState } from "react";

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
    maxWidth: "640px",
  },
  detailHeading: {
    margin: "0 0 20px",
    color: "#001f54",
    fontSize: "40px",
  },
  detailRow: {
    fontSize: "26px",
    color: "#0d1b2a",
    margin: "10px 0",
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#001f54",
  },
};

const DEVICES = [
  {
    deviceId: "device1",
    macAddress: "A4:CF:12:9B:00:11",
    ipAddress: "192.168.1.101",
    status: "Online",
    temperature: "37.2 °C",
    lastSeen: "2026-09-02 10:14:03",
    firmware: "v1.4.2",
  },
  {
    deviceId: "device2",
    macAddress: "A4:CF:12:9B:00:22",
    ipAddress: "192.168.1.102",
    status: "Offline",
    temperature: "-- °C",
    lastSeen: "2026-09-01 22:47:51",
    firmware: "v1.4.0",
  },
  {
    deviceId: "device3",
    macAddress: "A4:CF:12:9B:00:33",
    ipAddress: "192.168.1.103",
    status: "Online",
    temperature: "39.8 °C",
    lastSeen: "2026-09-02 10:13:58",
    firmware: "v1.4.2",
  },
];

function MultiDeviceList() {
  const [selected, setSelected] = useState(null);

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
                  onClick={() => setSelected(device)}
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

      {selected && (
        <div style={styles.detail}>
          <h1 style={styles.detailHeading}>{selected.deviceId}</h1>
          <p style={styles.detailRow}>
            <span style={styles.detailLabel}>Status: </span>
            {selected.status}
          </p>
          <p style={styles.detailRow}>
            <span style={styles.detailLabel}>Temperature: </span>
            {selected.temperature}
          </p>
          <p style={styles.detailRow}>
            <span style={styles.detailLabel}>Mac Address: </span>
            {selected.macAddress}
          </p>
          <p style={styles.detailRow}>
            <span style={styles.detailLabel}>IP Address: </span>
            {selected.ipAddress}
          </p>
          <p style={styles.detailRow}>
            <span style={styles.detailLabel}>Firmware: </span>
            {selected.firmware}
          </p>
          <p style={styles.detailRow}>
            <span style={styles.detailLabel}>Last Seen: </span>
            {selected.lastSeen}
          </p>
        </div>
      )}
    </div>
  );
}

export default MultiDeviceList;
