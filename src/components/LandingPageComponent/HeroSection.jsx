import React from 'react';
import HeroHeadline from './hero/HeroHeadline';
import HeroCtaButtons from './hero/HeroCtaButtons';
import HeroVideoShowcase from './hero/HeroVideoShowcase';

export default function HeroSection() {
    return (
        <main className="relative z-20 min-h-screen flex flex-col items-center pt-6 md:pt-10 pb-20 w-full max-w-[1400px] mx-auto overflow-hidden">
            {/* โชว์รูปศิลปินแบบสายรุ้ง (Arc Showcase) */}
            <div className="w-full relative z-10 -mb-20 md:-mb-32 lg:-mb-40">
                <HeroVideoShowcase />
            </div>
            
            {/* ข้อความและปุ่ม ซ้อนทับขึ้นไปใต้ส่วนโค้งของรูปภาพให้เป็นหนึ่งเดียวกัน */}
            <div className="w-full flex flex-col items-center relative z-20 px-4">
                <HeroHeadline />
                <div className="mt-8 md:mt-10">
                    <HeroCtaButtons />
                </div>
            </div>
        </main>
    );
}