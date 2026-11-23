import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Composants
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardBody from "./components/DashboardBody";
import MessagesContact from "./components/MessagesContact";
import PublicHeader from "./components/PublicHeader";
import Footer from "./components/Footer";

// Pages publiques
import HomePage from "./pages/HomePage";
import LicenceActivationPage from "./pages/LicenceActivationPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LegalNoticePage from "./pages/LegalNoticePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import PvPage from "./pages/PvPage";
import { PV_TYPES } from "./config/pvTypes";
import PVHome from './pages/pv/PVHome';
import PVList from './pages/pv/PVList';
import PVDetail from './pages/pv/PVDetail';

// Pages d'authentification
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Pages nécessitant une connexion
const PAGES_PROTEGEES = ["/dashboard", "/chantiers"];

// ⚠ Doit correspondre à ROLES_ADMIN dans backend/routes/contact.routes.js
const ROLES_ADMIN = ["superadmin"];

function App() {
  const location = useLocation();

  const isProtectedPage = PAGES_PROTEGEES.some(
    (page) => location.pathname === page || location.pathname.startsWith(page + "/")
  );

  return (
    <div className="app-container">
      {/* En-tête public */}
      {!isProtectedPage && <PublicHeader />}

      <main>
        <Routes>
          {/* ACCUEIL */}
          <Route path="/" element={<HomePage />} />

          {/* ACTIVATION DE LICENCE */}
          <Route path="/activation-licence" element={<LicenceActivationPage />} />

          {/* PAGES PV (menu PV de l'en-tête) */}
          {PV_TYPES.map((pv) => (
            <Route key={pv.slug} path={`/${pv.slug}`} element={<PvPage slug={pv.slug} />} />
          ))}

          {/* PAGES PUBLIQUES */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal" element={<LegalNoticePage />} />
          <Route path="/mentions-legales" element={<LegalNoticePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          <Route path="/pv" element={<PVHome />} />
          <Route path="/pv-mise-en-eau" element={<Navigate to="/pv/mise-en-eau" replace />} />
          <Route path="/pv-reception" element={<Navigate to="/pv/reception" replace />} />
          <Route path="/pv-autre" element={<Navigate to="/pv/liste" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/pv/liste" element={<PVList />} />
            <Route path="/pv/voir/:id" element={<PVDetail />} />
            <Route path="/pv/:code" element={<PVList />} />
          </Route>

          {/* TARIFS */}
          <Route path="/tarifs" element={<PlaceholderPage title="Tarifs" />} />

          {/* AUTHENTIFICATION */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* PAGES PROTÉGÉES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardBody />} />
            {/* Provisoire : remplacée par la vraie page Chantiers plus tard */}
            <Route path="/chantiers" element={<PlaceholderPage title="Chantiers" />} />
          </Route>

          {/* RUBRIQUE ADMINISTRATEUR */}
          <Route element={<ProtectedRoute roles={ROLES_ADMIN} />}>
            <Route path="/dashboard/messages" element={<MessagesContact />} />
          </Route>

          {/* PAGE INCONNUE */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* FOOTER : masqué sur les pages protégées */}
      {!isProtectedPage && <Footer />}
    </div>
  );
}

export default App;