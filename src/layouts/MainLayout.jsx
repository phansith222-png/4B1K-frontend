import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import MobileBottomNav from '../components/navbar/MobileBottomNav';
import useSearchStore from '../stores/searchStore';
import SectionErrorFallback from "../components/SectionErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

export default function MainLayout() {
    const location = useLocation();
    const { isSearchOpen } = useSearchStore();

    return (
        <div className="min-h-screen bg-[#0B0C10] flex flex-col relative">
            <Navbar />

            {/* 📌 2. ใส่ PageTransition ครอบ Outlet โดยห้ามลืมใส่ key={location.pathname} */}
            <main className="flex-grow relative z-10">
                <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
                    <PageTransition key={location.pathname}>
                        <ErrorBoundary
                            FallbackComponent={SectionErrorFallback}
                            // 💡 Tip: เมื่อเปลี่ยน Path ให้รีเซ็ต Error อัตโนมัติ
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
