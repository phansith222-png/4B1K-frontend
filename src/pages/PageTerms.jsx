import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

export default function PageTerms() {
    return (
        <InfoPageLayout 
            title="Terms of Use" 
            subtitle="The rules of the 4B1K Universe."
            accentColor="#7000FF"
        >
            <p className="text-gray-400 text-sm mb-8">Effective Date: October 2026</p>

            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
                By accessing or using the 4B1K platform, you agree to be bound by these Terms of Use. If you disagree 
                with any part of the terms, then you may not access the service.
            </p>

            <h2 className="text-xl font-bold text-white mb-3">2. User Conduct</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
                You are solely responsible for your conduct and any data, text, files, information, usernames, images, 
                graphics, photos, profiles, audio and video clips, sounds, musical works, works of authorship, applications, 
                links and other content or materials that you submit, post or display on or via our Service.
                Spam, harassment, and hate speech are strictly prohibited and will result in account termination.
            </p>

            <h2 className="text-xl font-bold text-white mb-3">3. Intellectual Property</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
                The Service and its original content (excluding Content provided by users), features and functionality are 
                and will remain the exclusive property of 4B1K and its licensors.
            </p>

            <h2 className="text-xl font-bold text-white mb-3">4. Termination</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any 
                reason whatsoever, including without limitation if you breach the Terms.
            </p>
        </InfoPageLayout>
    );
}
