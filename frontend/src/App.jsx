import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./pages/Dashboard";
import { processExcelFile } from "./api/tickets";

// Three screens: "upload" | "loading" | "dashboard"
export default function App() {
  const [screen, setScreen] = useState("upload");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSubmit = async (file) => {
    setError(null);
    setScreen("loading");
    try {
      const result = await processExcelFile(file);
      setData(result);
      setScreen("dashboard");
    } catch (err) {
      setError(err.message);
      setScreen("upload");
    }
  };

  const handleReset = () => {
    setData(null);
    setScreen("upload");
  };

  return (
    <div className="app">
      {screen === "upload" && (
        <UploadPage onSubmit={handleFileSubmit} error={error} />
      )}
      {screen === "loading" && <LoadingScreen />}
      {screen === "dashboard" && (
        <Dashboard data={data} onReset={handleReset} />
      )}
    </div>
  );
}
