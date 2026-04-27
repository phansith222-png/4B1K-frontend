import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

export default function PageAbout() {
    return (
        <InfoPageLayout 
            title="About 4B1K" 
            subtitle="The ultimate universe for concert enthusiasts and fandoms."
            accentColor="#FF007F"
        >
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
                At 4B1K, we believe that live music is the heartbeat of human connection. 
                Our platform was designed to bridge the gap between artists and fans, providing a seamless universe 
                where you can discover upcoming concerts, connect with your favorite artists, and chat with a community 
                that shares your passion.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">The Universe</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
                More than just a ticketing or news site, 4B1K is a fully interactive social ecosystem. 
                From real-time chat rooms to personalized music feeds, we've built a space that celebrates 
                the culture of fandoms.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-[#FF007F] mb-2">Connect</h3>
                    <p className="text-sm text-gray-400">Join community chat rooms and interact with fans from around the globe in real-time.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-[#FF007F] mb-2">Discover</h3>
                    <p className="text-sm text-gray-400">Find new artists, explore music genres, and never miss an upcoming live event near you.</p>
                </div>
            </div>
        </InfoPageLayout>
    );
}
