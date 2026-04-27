import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import NavbarUser from '../components/NavbarUser';
import MobileBottomNav from '../components/navbar/MobileBottomNav';
import { ErrorBoundary } from 'react-error-boundary';
import SectionErrorFallback from "../components/SectionErrorFallback";

export default function UserLayout() {
    const location = useLocation();
    const isChat = location.pathname === '/chat';

    return (
        <div className={`bg-[#13141C] flex flex-col relative overflow-hidden ${isChat ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
            {/* 🌌 Premium Foundation Layer - Enabled globally to maintain consistent aesthetic */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-[#00E5FF] opacity-[0.2] blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-[#7000FF] opacity-[0.2] blur-[120px] rounded-full" />
                    <div className="absolute inset-0 opacity-[0.2] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')] mix-blend-overlay" />
                </div>


            <NavbarUser />

            {/* 📌 Wrap Outlet with PageTransition and ensure key={location.pathname} is set */}
            <main className={`flex-grow relative z-10 ${isChat ? 'flex flex-col h-full overflow-hidden' : ''}`}>
                <PageTransition key={location.pathname + location.search}>
                    <Outlet />
                </PageTransition>
            </main>

            {!['/nearby-events', '/chat', '/home', '/'].includes(location.pathname) && <Footer />}

            {/* Responsive Extras */}
            <MobileBottomNav />
        </div>
    );
}
