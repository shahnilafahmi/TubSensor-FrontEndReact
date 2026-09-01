import { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#eaf6ff",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  buttonRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#001f54",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  input: {
    border: "1px solid #b3d7f2",
    borderRadius: "6px",
    padding: "12px 14px",
    fontSize: "16px",
    minWidth: "260px",
    outline: "none",
  },
  jsonBox: {
    backgroundColor: "#ffffff",
    border: "1px solid #b3d7f2",
    borderRadius: "8px",
    padding: "20px",
    minHeight: "400px",
    overflow: "auto",
  },
  jsonText: {
    margin: 0,
    fontFamily: "Consolas, monospace",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};

// In dev, "/api" is proxied to the Railway backend by Vite (see vite.config.js)
// to avoid CORS. In production, set VITE_API_BASE to the backend origin.
const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const PUBLISH_TEXT_URL = `${API_BASE}/api/mqtt/publisher/publish-text?topic=sensors/data`;
const COMMAND_URL = `${API_BASE}/api/mqtt/publisher/command`;

// POST a plain-text body and return a normalized result object for the JSON box.
async function postText(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body,
    });

    const responseText = await response.text();
    let payload;
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = responseText;
    }

    return { status: response.status, ok: response.ok, request: body, response: payload };
  } catch (error) {
    return { error: error.message, request: body };
  }
}

function TubSensorTest() {
  const [data, setData] = useState(null);
  const [temperatureText, setTemperatureText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSetTemperature = async () => {
    const body = temperatureText.trim();
    if (!body || isSubmitting) return;

    setIsSubmitting(true);
    setData(await postText(PUBLISH_TEXT_URL, body));
    setIsSubmitting(false);
  };

  const handleGetStatus = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setData(await postText(COMMAND_URL, "GET_STATUS"));
    setIsSubmitting(false);
  };

  const handleClear = () => {
    setTemperatureText("");
    setData(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.buttonRow}>
        <input
          style={styles.input}
          type="text"
          maxLength={25}
          value={temperatureText}
          onChange={(e) => setTemperatureText(e.target.value)}
          placeholder="e.g. SET_TARGET_TEMP 400"
        />
        <button
          style={styles.button}
          onClick={handleSetTemperature}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Setting..." : "Set Temperature"}
        </button>
        <button
          style={styles.button}
          onClick={handleGetStatus}
          disabled={isSubmitting}
        >
          Get Status
        </button>
        <button
          style={styles.button}
          onClick={handleClear}
          disabled={isSubmitting}
        >
          Clear
        </button>
      </div>

      <div style={styles.jsonBox}>
        <pre style={styles.jsonText}>
          {data ? JSON.stringify(data, null, 2) : "No data yet."}
        </pre>
      </div>
    </div>
  );
}

export default TubSensorTest;
