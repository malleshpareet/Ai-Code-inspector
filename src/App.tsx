import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { LandingPage } from "./pages/landing";
import {
  Dashboard,
  DashboardHome,
  ProfilePage,
  HistoryPage,
  NewReviewPage,
  ReviewResultsPage,
  AIAssistantPage
} from "./pages/dashboard";
import BillingPage from "./pages/BillingPage";
import { LoginCard, AuthCard, ForgotPasswordCard } from "./pages/auth";
import AuthLayout from "./layouts/AuthLayout";

import { authService } from "./services/authService";

export default function App() {
  // Check if user is logged in by checking for token in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const navigate = useNavigate();

  const handleLogin = (_email: string, _pass: string) => {
    // Set logged in state (the actual authentication is handled by the backend)
    setIsLoggedIn(true);
    // Redirect to landing page
    navigate("/");
  };

  return (
    <>
      <Routes>
        <Route path="/" element={
          <LandingPage
            isLoggedIn={isLoggedIn}
            onLogout={() => {
              setIsLoggedIn(false);
              authService.logout();
              navigate("/login");
            }}
            onSignUpClick={() => navigate("/signup")}
            onLoginClick={() => navigate("/login")}
            onNavigateToBilling={() => navigate("/billing")}
            onNavigateToDashboard={() => navigate("/dashboard")}
          />
        } />

        <Route path="/login" element={
          <AuthLayout>
            <LoginCard
              onSignUpClick={() => navigate("/signup")}
              onForgotPasswordClick={() => navigate("/forgot-password")}
              onLogin={handleLogin}
            />
          </AuthLayout>
        } />

        <Route path="/signup" element={
          <AuthLayout>
            <AuthCard onSignInClick={() => navigate("/login")} onLogin={handleLogin} />
          </AuthLayout>
        } />

        <Route path="/forgot-password" element={
          <AuthLayout image="https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2668&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
            <ForgotPasswordCard onSignInClick={() => navigate("/login")} />
          </AuthLayout>
        } />

        <Route path="/billing" element={<BillingPage onBack={() => navigate("/")} />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={
            <DashboardHome
              onStartNewReview={() => navigate("/dashboard/new-review")}
              onManageSubscription={() => navigate("/dashboard/billing")}
            />
          } />
          <Route path="new-review" element={<NewReviewPage onRunReview={() => navigate("/dashboard/results")} />} />
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="billing" element={<BillingPage onBack={() => navigate("/dashboard")} embedded={true} />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="results" element={<ReviewResultsPage onBack={() => navigate("/dashboard/new-review")} />} />
        </Route>

      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
