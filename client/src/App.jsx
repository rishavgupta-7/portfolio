import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import api from './services/api.js';

// Public Components & Pages
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Services from './pages/Services.jsx';
import Stack from './pages/Stack.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

// Admin Components & Pages
import AdminLayout from './admin/components/AdminLayout.jsx';
import Login from './admin/pages/Login.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import HeroAdmin from './admin/pages/HeroAdmin.jsx';
import TechnologiesAdmin from './admin/pages/TechnologiesAdmin.jsx';
import ProjectsAdmin from './admin/pages/ProjectsAdmin.jsx';
import ServicesAdmin from './admin/pages/ServicesAdmin.jsx';
import ProcessAdmin from './admin/pages/ProcessAdmin.jsx';
import AboutAdmin from './admin/pages/AboutAdmin.jsx';
import TestimonialsAdmin from './admin/pages/TestimonialsAdmin.jsx';
import StatsAdmin from './admin/pages/StatsAdmin.jsx';
import MessagesAdmin from './admin/pages/MessagesAdmin.jsx';
import SettingsAdmin from './admin/pages/SettingsAdmin.jsx';

function PublicLayout({ data, children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const heroName = data?.hero?.name || 'Rishav Gupta';

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col selection:bg-purple-500/30 selection:text-cyan-400">
      <Navbar heroName={heroName} />
      <main className="flex-grow">{children}</main>
      <Footer
        heroName={heroName}
        socialLinks={data?.socialLinks || []}
        settings={data?.settings || {}}
      />
    </div>
  );
}

export default function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getPortfolio();
        setPortfolioData(data);
        if (data.settings?.siteTitle) {
          document.title = data.settings.siteTitle;
        }
      } catch (err) {
        console.error('Failed to load portfolio payload:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route
            path="/"
            element={
              <PublicLayout data={portfolioData}>
                <Home data={portfolioData || {}} />
              </PublicLayout>
            }
          />
          <Route
            path="/work"
            element={
              <PublicLayout data={portfolioData}>
                <Projects projects={portfolioData?.projects || []} />
              </PublicLayout>
            }
          />
          <Route
            path="/services"
            element={
              <PublicLayout data={portfolioData}>
                <Services services={portfolioData?.services || []} />
              </PublicLayout>
            }
          />
          <Route
            path="/stack"
            element={
              <PublicLayout data={portfolioData}>
                <Stack technologies={portfolioData?.technologies || []} />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout data={portfolioData}>
                <About
                  about={portfolioData?.about || {}}
                  skills={portfolioData?.skills || []}
                  experiences={portfolioData?.experiences || []}
                />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout data={portfolioData}>
                <Contact
                  about={portfolioData?.about || {}}
                  settings={portfolioData?.settings || {}}
                />
              </PublicLayout>
            }
          />

          {/* ================= ADMIN AUTHENTICATION ================= */}
          <Route path="/stark/login" element={<Login />} />
          <Route path="/stark" element={<Navigate to="/stark/dashboard" replace />} />

          {/* ================= PROTECTED ADMIN CMS ================= */}
          <Route path="/stark" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hero" element={<HeroAdmin />} />
            <Route path="technologies" element={<TechnologiesAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="process" element={<ProcessAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="stats" element={<StatsAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>

          {/* Fallback 404 Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
