import React from 'react';
import { MoonIcon, SunIcon } from './Icons';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        <header className="fixed top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-50">
            <div className="container mx-auto max-w-none px-0">
                <div className="flex items-center justify-end p-2 md:p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-gray-200/80 dark:border-slate-700/80 shadow-sm">
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-600/50 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
                    </button>
                </div>
            </div>
        </header>
    );
};