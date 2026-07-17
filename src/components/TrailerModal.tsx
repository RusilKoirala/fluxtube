'use client';

import { X } from 'lucide-react'
import { useEffect } from 'react';


interface TrailerModalProps {
    isOpen : boolean;
    onClose: ()=> void;
    videoKey: string;
    title: string;
}



export function TrailerModal ({isOpen, onClose, videoKey, title}: TrailerModalProps) {
    useEffect(()=> {
        if (isOpen){
            document.body.style.overflow = 'hidden';
        }
        else { 
            document.body.style.overflow = 'unset';
        }

        return()=> {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen])

    if (!isOpen) return null;


    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90' onClick={onClose}>
            <div className='relative w-full max-w-5xl'>
            
            <button 
                onClick={onClose} 
                className='absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors'
            >
                <X className='w-6 h-6 text-white'/>
            </button>

            <div className='relative bg-black border border-white/10 rounded-lg overflow-hidden aspect-video' onClick={(e) => e.stopPropagation()}>
                <iframe
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                title={title}
                allow='accelerometer; autoplay; clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture'
                allowFullScreen
                className='w-full h-full'
                />
            </div>
            </div>
        </div>
    )
}