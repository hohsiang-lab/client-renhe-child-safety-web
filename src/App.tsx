import { Routes, Route, Navigate } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioProvider";
import { MuteButton } from "./components/MuteButton";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import SecretGamePage from "./pages/SecretGamePage";
import BodyTrafficLightPage from "./pages/BodyTrafficLightPage";
import PickDollPage from "./pages/PickDollPage";
import BodyMarkPage from "./pages/BodyMarkPage";
import TouchTestPage from "./pages/TouchTestPage";
import TrustedAdultPage from "./pages/TrustedAdultPage";
import EndingPage from "./pages/EndingPage";

export default function App() {
  return (
    <AudioProvider>
      <div className="mx-auto min-h-dvh max-w-[960px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/secret-game" element={<SecretGamePage />} />
          <Route path="/body-traffic-light" element={<BodyTrafficLightPage />} />
          <Route path="/body-traffic-light/pick-doll" element={<PickDollPage />} />
          <Route path="/body-traffic-light/mark" element={<BodyMarkPage />} />
          <Route path="/body-traffic-light/touch-test" element={<TouchTestPage />} />
          <Route path="/trusted-adult" element={<TrustedAdultPage />} />
          <Route path="/ending" element={<EndingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <MuteButton />
      </div>
    </AudioProvider>
  );
}
