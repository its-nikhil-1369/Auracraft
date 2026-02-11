"use client";

import React, { useState, useRef, useEffect } from 'react';

const Product3DViewer = () => {
    const [rotation, setRotation] = useState({ x: -20, y: 45 });
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;

        setRotation(prev => ({
            x: prev.x - deltaY * 0.5,
            y: prev.y + deltaX * 0.5
        }));

        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            className="relative w-full aspect-square bg-[#0a0a0a] overflow-hidden group cursor-grab active:cursor-grabbing border border-white/5"
            onMouseDown={handleMouseDown}
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className={`text-center transition-opacity duration-500 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Interactive Module Active</p>
                    <p className="text-white/20 text-[9px] italic">Drag to verify spatial rendering</p>
                </div>
            </div>

            {/* 3D Scene Container */}
            <div className="w-full h-full flex items-center justify-center perspective-[1000px]">
                <div
                    className="relative w-40 h-40 transition-transform duration-100 ease-out"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                    }}
                >
                    {/* Cube Faces representing product volume */}
                    {[
                        { transform: 'translateZ(80px)', label: 'FRONT' },
                        { transform: 'rotateY(180deg) translateZ(80px)', label: 'BACK' },
                        { transform: 'rotateY(90deg) translateZ(80px)', label: 'RIGHT' },
                        { transform: 'rotateY(-90deg) translateZ(80px)', label: 'LEFT' },
                        { transform: 'rotateX(90deg) translateZ(80px)', label: 'TOP' },
                        { transform: 'rotateX(-90deg) translateZ(80px)', label: 'BOTTOM' },
                    ].map((face, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 border-2 border-red-500/40 bg-red-500/5 backdrop-blur-sm flex items-center justify-center overflow-hidden"
                            style={{ transform: face.transform, backfaceVisibility: 'hidden' }}
                        >
                            <div className="text-[8px] font-black text-red-500/30 tracking-[0.5em]">{face.label}</div>
                            {/* Decorative lines */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-red-500" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-red-500" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-red-500" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-red-500" />
                            </div>
                        </div>
                    ))}

                    {/* Inner Core */}
                    <div className="absolute inset-8 border border-white/20 bg-white/5 animate-pulse" style={{ transform: 'translateZ(0)' }} />
                </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-20 pointer-events-none">
                <span className="text-[9px] font-black text-white/40 tracking-widest bg-black/40 px-3 py-1.5 rounded-full backdrop-blur uppercase">Drag Rotate</span>
                <span className="text-[9px] font-black text-white/40 tracking-widest bg-black/40 px-3 py-1.5 rounded-full backdrop-blur uppercase">Precision View</span>
            </div>

            {/* Visual scanned effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-scan" />
            </div>
        </div>
    );
};

export default Product3DViewer;
