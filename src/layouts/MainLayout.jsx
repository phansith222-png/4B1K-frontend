import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import React from 'react';
import Footer from '../components/Footer';

function MainLayout() {
    return (

            <div className="min-h-screen">
                <Navbar />
                <div>
                <Outlet />
                </div>
                <Footer />
            </div>
    )
}

export default MainLayout;