import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { WeightDetailPage } from "./pages/WeightDetailPage";
import { ExerciseDetailPage } from "./pages/ExerciseDetailPage";
import { BloodPressureDetailPage } from "./pages/BloodPressureDetailPage";
import { BloodSugarDetailPage } from "./pages/BloodSugarDetailPage";
import { NavigationBar } from "./components/NavigationBar";
import { VoiceConfirmModal } from "./components/VoiceConfirmModal";
import { useState } from "react";

export default function App() {
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceResult, setVoiceResult] = useState<any>(null);

  const handleVoiceRecognition = (result: any) => {
    setVoiceResult(result);
    setShowVoiceModal(true);
  };

  const handleVoiceModalClose = () => {
    setShowVoiceModal(false);
    setVoiceResult(null);
  };

  return (
    <Router>
      <NavigationBar onRecognitionComplete={handleVoiceRecognition} />
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/weight" element={<WeightDetailPage />} />
          <Route path="/exercise" element={<ExerciseDetailPage />} />
          <Route path="/blood-pressure" element={<BloodPressureDetailPage />} />
          <Route path="/blood-sugar" element={<BloodSugarDetailPage />} />
        </Routes>
      </div>
      <VoiceConfirmModal isOpen={showVoiceModal} onClose={handleVoiceModalClose} result={voiceResult} />
    </Router>
  );
}
