import React from 'react';
import { Header } from './Header';
import { TOOLS } from '../constants';
import type { EditorTool } from '../types';
import { UploadCloudIcon, MagicWandIcon, DownloadIcon, CheckIcon, LogoIcon } from './Icons';

interface HomePageProps {
  onGetStarted: () => void;
}

const FeaturedToolCard: React.FC<{ tool: EditorTool }> = ({ tool }) => (
    <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 gradient-border">
        <div className="p-3 bg-gray-900/50 rounded-full mb-4">
          <tool.icon className="w-10 h-10 text-brand-purple" />
        </div>
        <h3 className="font-bold text-lg text-white">{tool.name}</h3>
        <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
    </div>
);

const StepCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center">
    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-brand-purple/20 text-brand-purple">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-center gap-3">
    <CheckIcon className="w-5 h-5 text-green-400" />
    <span className="text-gray-300">{children}</span>
  </li>
);

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
    const featuredTools = TOOLS.slice(0, 6);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-gray-900">
            <div className="absolute inset-0 z-0">
                <div className="blob bg-brand-purple w-96 h-96 top-[-50px] left-[-100px]"></div>
                <div className="blob bg-brand-blue w-[30rem] h-[30rem] bottom-[-80px] right-[-120px] animation-delay-3000"></div>
            </div>
            
            <Header />

            <main className="relative z-10 container mx-auto px-4">
                <section className="py-40 md:py-56 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight mb-4">
                        Transform Your Images with <span className="shimmer-text bg-clip-text text-transparent">AI</span>.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-10">
                        Generate, edit, and enhance images in seconds. Klug AI gives you the creative power of over 30 advanced AI tools, right at your fingertips.
                    </p>
                    <button 
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-brand-purple text-white font-bold rounded-full text-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 pulse-glow"
                    >
                        Get Started For Free
                    </button>
                </section>

                <section className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-4">Featured Tools</h2>
                    <p className="text-lg text-gray-400 text-center mb-12 max-w-2xl mx-auto">Explore some of our most popular tools to kickstart your creativity.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {featuredTools.map(tool => <FeaturedToolCard key={tool.id} tool={tool} />)}
                    </div>
                </section>
                
                <section className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-12">How It Works in 3 Easy Steps</h2>
                    <div className="grid md:grid-cols-3 gap-12 items-start max-w-5xl mx-auto">
                        <StepCard icon={<UploadCloudIcon className="w-8 h-8" />} title="1. Upload Image" description="Start by dragging & dropping your image, or just click to browse files from your device." />
                        <StepCard icon={<MagicWandIcon className="w-8 h-8" />} title="2. Choose a Tool" description="Select from our wide array of AI tools, from background removal to style transfers, or write a custom prompt." />
                        <StepCard icon={<DownloadIcon className="w-8 h-8" />} title="3. Download & Share" description="Preview your masterpiece, make adjustments if needed, and download it in high resolution." />
                    </div>
                </section>

                <section className="py-20">
                     <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="glass-card rounded-2xl p-10">
                           <h2 className="text-4xl font-bold mb-6">Why Klug AI?</h2>
                           <p className="text-gray-400 mb-8">We combine cutting-edge AI with an intuitive interface to deliver a seamless creative experience. No technical skills required.</p>
                           <ul className="space-y-4">
                               <FeatureItem>Dozens of powerful AI tools in one place</FeatureItem>
                               <FeatureItem>Lightning-fast processing times</FeatureItem>
                               <FeatureItem>High-resolution, watermark-free exports</FeatureItem>
                               <FeatureItem>Intuitive and beginner-friendly interface</FeatureItem>
                               <FeatureItem>Constantly updated with new features</FeatureItem>
                           </ul>
                        </div>
                        <div className="flex items-center justify-center">
                            {/* Placeholder for an image or animation */}
                            <div className="w-full aspect-square bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-2xl flex items-center justify-center">
                               <LogoIcon className="w-32 h-32 text-brand-purple opacity-50"/>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="relative z-10 border-t border-gray-800 mt-20">
                <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400">&copy; {new Date().getFullYear()} Klug AI. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};