import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import NavbarUser from '../components/NavbarUser';
import MobileBottomNav from '../components/navbar/MobileBottomNav';
import useSearchStore from '../stores/searchStore';
import { ErrorBoundary } from 'react-error-boundary';
import SectionErrorFallback from "../components/SectionErrorFallback";
export default function UserLayout() {
    const location = useLocation();
    const { isSearchOpen } = useSearchStore();
    const isChat = location.pathname === '/chat';

    return (
        <div className={`bg-[#0B0C10] flex flex-col relative ${isChat ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
            <NavbarUser />

            {/* 📌 2. ใส่ PageTransition ครอบ Outlet โดยห้ามลืมใส่ key={location.pathname} */}
            <main className={`flex-grow relative z-10 ${isChat ? 'flex flex-col h-full overflow-hidden' : ''}`}>
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
