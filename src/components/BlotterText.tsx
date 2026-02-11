"use client";

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

interface BlotterTextProps {
    text: string;
}

const BlotterText: React.FC<BlotterTextProps> = ({ text }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const initBlotter = () => {
        if (typeof window === 'undefined' || !(window as any).Blotter) return;

        const Blotter = (window as any).Blotter;
        const material = new Blotter.LiquidDistortMaterial();

        material.uniforms.uSpeed.value = 0.2;
        material.uniforms.uVolatility.value = 0.1;
        material.uniforms.uSeed.value = 0.1;

        const blotterText = new Blotter.Text(text, {
            family: "'Outfit', sans-serif",
            size: 120,
            fill: "#ffffff",
            paddingLeft: 40,
            paddingRight: 40
        });

        const scope = new Blotter(material, { texts: blotterText });

        if (containerRef.current) {
            containerRef.current.innerHTML = '';
            scope.appendTo(containerRef.current);
        }
    };

    return (
        <div className="contrast-125 brightness-110">
            <Script
                src="https://cdn.jsdelivr.net/npm/blotterjs@0.1.0/build/blotter.min.js"
                onLoad={() => {
                    // Need to load material after core
                    const matScript = document.createElement('script');
                    matScript.src = "https://cdn.jsdelivr.net/npm/blotterjs@0.1.0/build/materials/liquidDistortMaterial.js";
                    matScript.onload = initBlotter;
                    document.head.appendChild(matScript);
                }}
            />
            <div ref={containerRef} className="flex justify-center items-center h-40 overflow-hidden" />
        </div>
    );
};

export default BlotterText;
