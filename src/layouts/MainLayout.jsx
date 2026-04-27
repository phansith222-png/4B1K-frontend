import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import MobileBottomNav from '../components/navbar/MobileBottomNav';
import SectionErrorFallback from "../components/SectionErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

export default function MainLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#0B0C10] flex flex-col relative">
            <Navbar />

            {/* 📌 Wrap Outlet with PageTransition and ensure key={location.pathname} is set */}
            <main className="flex-grow relative z-10">
                <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
                    <PageTransition key={location.pathname}>
                        <ErrorBoundary
                            FallbackComponent={SectionErrorFallback}
                            // 💡 Tip: Auto-reset error boundaries when the path changes
                            resetKeys={[location.pathname]}
                        >
                            <Outlet />
                        </ErrorBoundary>
                    </PageTransition>
                </AnimatePresence>
            </main>

            {!['/nearby-events', '/chat'].includes(location.pathname) && <Footer />}

            {/* Responsive Extras */}
            <MobileBottomNav />
        </div>
    );
}
