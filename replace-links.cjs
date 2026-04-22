const fs = require('fs');
const path = require('path');

const files = [
    'src/components/PageRockComponent/ConcertSection.jsx',
    'src/components/PageRockComponent/HeroSection.jsx',
    'src/components/PagePopComponent/ConcertSection.jsx',
    'src/components/PagePopComponent/HeroSection.jsx',
    'src/components/PageEtcComponent/ConcertSection.jsx',
    'src/components/PageEtcComponent/HeroSection.jsx',
    'src/components/PageClassicComponent/ConcertSection.jsx',
    'src/components/PageClassicComponent/HeroSection.jsx'
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    if (!content.includes('useNavigate')) {
        content = content.replace(/(import React.*?;\r?\n)/, "$1import { useNavigate } from 'react-router-dom';\n");
        changed = true;
    }

    const componentRegex = /(export default function [A-Za-z]+\([^)]*\)\s*\{)/;
    if (content.match(componentRegex) && !content.includes('const navigate = useNavigate()')) {
        content = content.replace(componentRegex, "$1\n    const navigate = useNavigate();");
        changed = true;
    }

    if (content.includes('thaiticketmajor')) {
        content = content.replace(/window\.open\('https:\/\/www\.thaiticketmajor\.com\/?',\s*'_blank'\)/g, "navigate('/new-event')");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated ' + file);
    }
});
