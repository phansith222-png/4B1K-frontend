import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import NavbarUser from '../components/NavbarUser';
import MobileBottomNav from '../components/navbar/MobileBottomNav';
import FloatingChat from '../components/chat/FloatingChat';

export default function MainLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#0B0C10] flex flex-col relative">
            <NavbarUser />

            {/* 📌 2. ใส่ PageTransition ครอบ Outlet โดยห้ามลืมใส่ key={location.pathname} */}
            <main className="flex-grow relative z-10">
                <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
                    <PageTransition key={location.pathname}>
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
            </main>

            {location.pathname !== '/nearby-events' && <Footer />}

            {/* Responsive Extras */}
            <MobileBottomNav />
            <FloatingChat />
        </div>
    );
}