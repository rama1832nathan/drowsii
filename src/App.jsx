import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function App() {
  const [analytics, setAnalytics] = useState([]);

  const startDetection = async () => {
    try {
      await axios.get("http://localhost:5000/start-detection");
      alert("Drowsiness Detection Started. Webcam window should open.");
    } catch (error) {
      alert("Failed to start detection. Make sure backend is running.");
    }
  };

  const stopDetection = async () => {
    try {
      await axios.get("http://localhost:5000/stop-detection");
      alert("Drowsiness Detection Stopped.");
    } catch (error) {
      alert("Failed to stop detection. Make sure backend is running.");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🛑 Drowsiness Detection Dashboard</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "20px 0" }}>
        <button
          onClick={startDetection}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ▶️ Start Detection
        </button>

        <button
          onClick={stopDetection}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ⏹️ Stop Detection
        </button>
      </div>

      <h2 style={{ marginBottom: 10 }}>📊 Analytics (Table)</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 40,
        }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Start Time</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>End Time</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Duration (s)</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map((entry, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{entry.start_time}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{entry.end_time}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{entry.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 30 }}>
        <h3>Live Webcam Feed</h3>
        <img
          src="http://localhost:5000/video_feed"
          alt="Live Camera Feed"
          style={{ width: "100%", maxWidth: "600px", border: "2px solid #444", borderRadius: "10px" }}
        />
      </div>

      <h2>📈 Drowsiness Duration Graph</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analytics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="start_time" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="duration" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: 50 }}>📊 Duration Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analytics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="start_time" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="duration" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
