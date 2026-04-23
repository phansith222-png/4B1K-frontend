import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import NavbarUser from '../components/NavbarUser';

export default function UserLayout() {
    const location = useLocation();
    const isChat = location.pathname === '/chat';

    return (
        <div className={`bg-[#0B0C10] flex flex-col relative ${isChat ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
            <NavbarUser />

            <main className={`relative z-10 ${isChat ? 'flex-1 overflow-hidden h-full' : 'flex-grow min-h-[80vh]'}`}>
                {isChat ? (
                    <Outlet />
                ) : (
                    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
                        <PageTransition key={location.pathname}>
                            <Outlet />
                        </PageTransition>
                    </AnimatePresence>
                )}
            </main>

            {!isChat && <Footer />}
        </div>
    );
}