import { useState, useRef } from "react";
import UploadPage from "./pages/UploadPage";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./pages/Dashboard";
import { processExcelFile } from "./api/tickets";

const LOADING_DURATION_MS = 10000;

// Three screens: "upload" | "loading" | "dashboard"
export default function App() {
  const [screen, setScreen] = useState("upload");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // We track both: API result ready + 10s timer elapsed.
  // Dashboard only shows when BOTH are done.
  const apiResultRef = useRef(null);
  const timerDoneRef = useRef(false);
  const apiDoneRef = useRef(false);

  const maybeShowDashboard = () => {
    if (timerDoneRef.current && apiDoneRef.current && apiResultRef.current !== "error") {
      setData(apiResultRef.current);
      setScreen("dashboard");
    }
  };

  const handleFileSubmit = async (file) => {
    setError(null);
    apiResultRef.current = null;
    timerDoneRef.current = false;
    apiDoneRef.current = false;
    setScreen("loading");

    // Start the 10s minimum display timer
    setTimeout(() => {
      timerDoneRef.current = true;
      maybeShowDashboard();
    }, LOADING_DURATION_MS);

    // Fire the API call in parallel
    try {
      const result = await processExcelFile(file);
      apiResultRef.current = result;
      apiDoneRef.current = true;
      maybeShowDashboard();
    } catch (err) {
      apiResultRef.current = "error";
      apiDoneRef.current = true;
      // On error we still wait for the timer so the animation completes,
      // but we go back to upload instead.
      setTimeout(() => {
        setError(err.message);
        setScreen("upload");
      }, timerDoneRef.current ? 0 : LOADING_DURATION_MS);
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
