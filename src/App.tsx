import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioProvider";
import { MuteButton } from "./components/MuteButton";
import { AudioCaption } from "./components/AudioCaption";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import SecretGamePage from "./pages/SecretGamePage";
import BodyTrafficLightPage from "./pages/BodyTrafficLightPage";
import PickDollPage from "./pages/PickDollPage";
import BodyMarkPage from "./pages/BodyMarkPage";
import TouchTestPage from "./pages/TouchTestPage";
import TrustedAdultPage from "./pages/TrustedAdultPage";
import NetworkSafetyPage from "./pages/NetworkSafetyPage";
import FacilitatorModePage from "./pages/FacilitatorModePage";
import EndingPage from "./pages/EndingPage";

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-header__brand" to="/" aria-label="回到保護自己大冒險首頁">
        <img
          className="site-header__identity"
          src="/images/community/飲料提袋正.png"
          alt="仁和社區發展協會教材圖像"
        />
        <span className="site-header__brand-copy">
          <strong>仁和社區發展協會</strong>
          <span>保護自己 大冒險</span>
        </span>
      </Link>
      <p className="site-header__title">兒少防暴宣導互動網站</p>
    </header>
  );
}

export default function App() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, "");
  // Keep calibrated mark/touch-test and presenter routes in their full-screen shells.
  const showBrandHeader = ![
    "/body-traffic-light/mark",
    "/body-traffic-light/touch-test",
    "/facilitator",
  ].includes(pathname);

  return (
    <AudioProvider>
      <div className={`mx-auto flow-root min-h-dvh ${showBrandHeader ? "max-w-[1160px]" : "max-w-[960px]"}`}>
        {showBrandHeader && <SiteHeader />}
        {pathname === "/ending" && <AudioCaption inline />}
        <div className={showBrandHeader ? "site-content site-content--with-header" : "site-content"}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/secret-game" element={<SecretGamePage />} />
            <Route path="/body-traffic-light" element={<BodyTrafficLightPage />} />
            <Route path="/body-traffic-light/pick-doll" element={<PickDollPage />} />
            <Route path="/body-traffic-light/mark" element={<BodyMarkPage />} />
            <Route path="/body-traffic-light/touch-test" element={<TouchTestPage />} />
            <Route path="/trusted-adult" element={<TrustedAdultPage />} />
            <Route path="/network-safety" element={<NetworkSafetyPage />} />
            <Route path="/facilitator" element={<FacilitatorModePage />} />
            <Route path="/ending" element={<EndingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        {pathname !== "/menu" && pathname !== "/ending" && pathname !== "/body-traffic-light" && pathname !== "/trusted-adult" && (
          <div className={pathname === "/body-traffic-light/touch-test" ? "pb-[calc(5rem+env(safe-area-inset-bottom))]" : ""}>
            <AudioCaption inline />
          </div>
        )}
        <MuteButton />
      </div>
    </AudioProvider>
  );
}
