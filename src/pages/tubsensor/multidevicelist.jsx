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
};

const DEVICES = [
  { deviceId: "device1", macAddress: "A4:CF:12:9B:00:11", ipAddress: "192.168.1.101" },
  { deviceId: "device2", macAddress: "A4:CF:12:9B:00:22", ipAddress: "192.168.1.102" },
  { deviceId: "device3", macAddress: "A4:CF:12:9B:00:33", ipAddress: "192.168.1.103" },
];

function MultiDeviceList() {
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
              <td style={styles.td}>{device.deviceId}</td>
              <td style={styles.td}>{device.macAddress}</td>
              <td style={styles.td}>{device.ipAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MultiDeviceList;
