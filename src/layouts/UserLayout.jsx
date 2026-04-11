import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import React from 'react';
import Footer from '../components/Footer';
import NavbarUser from '../components/NavbarUser';

function UserLayout() {
    return (

            <div className="min-h-screen">
                <NavbarUser />
                <div>
                <Outlet />
                </div>
                <Footer />
            </div>
    )
}

export default UserLayout;