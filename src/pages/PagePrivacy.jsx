import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

export default function PagePrivacy() {
    return (
        <InfoPageLayout 
            title="Privacy Policy" 
            subtitle="How we collect, use, and protect your data."
            accentColor="#00E5FF"
        >
            <p className="text-gray-400 text-sm mb-8">Last Updated: October 2026</p>

            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
                We collect information you provide directly to us, such as when you create or modify your account, 
                interact with the community feed, participate in chat rooms, or contact customer support. This may 
                include your name, email address, profile picture, and any content you post.
            </p>

            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Information</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services. This includes 
                personalizing your feed with artists and events you care about, facilitating real-time chat, and 
                ensuring a safe environment for all fans.
            </p>

            <h2 className="text-xl font-bold text-white mb-3">3. Data Security</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized or unlawful processing, accidental loss, destruction, or damage. However, please note 
                that no system is 100% secure.
            </p>

            <h2 className="text-xl font-bold text-white mb-3">4. Cookies and Tracking</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
                4B1K uses cookies and similar tracking technologies to track the activity on our service and hold 
                certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie 
                is being sent.
            </p>
        </InfoPageLayout>
    );
}
