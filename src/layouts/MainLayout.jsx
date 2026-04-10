import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import NavbarUser from '../components/NavbarUser';


function MainLayout() {
    return (
        
        <div className="min-h-screen bg-[#fcfdf7] flex flex-col">
            
            <Navbar />
            
            
            <div className="flex-grow">
                <Outlet />
            </div>

            <Footer />
        </div>
    )
}

export default MainLayout;