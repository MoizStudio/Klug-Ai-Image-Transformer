import React, { useState, useCallback, useRef, ChangeEvent, DragEvent, useMemo } from 'react';
import { editImageWithPrompt } from '../services/geminiService';
import { Header } from './Header';
import { TOOLS } from '../constants';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { DownloadIcon, ResetIcon, UploadIcon, MagicWandIcon } from './Icons';
import type { EditorTool, ImageData } from '../types';

interface EditorPageProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ToolButton: React.FC<{ tool: EditorTool; onClick: () => void; isActive: boolean }> = ({ tool, onClick, isActive }) => (
  <button
    onClick={onClick}
    aria-label={`Select ${tool.name} tool`}
    className={`flex flex-col items-center justify-center p-2 text-center rounded-lg transition-all duration-200 w-full h-20 border ${
      isActive
        ? 'bg-brand-purple/10 dark:bg-brand-purple/20 border-brand-purple text-brand-purple dark:text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800/80 text-gray-600 dark:text-gray-300'
    }`}
  >
    <tool.icon className="w-7 h-7 mb-1" />
    <span className="text-xs font-medium leading-tight">{tool.name}</span>
  </button>
);

const Spinner: React.FC = () => (
    <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
        <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">AI is creating magic...</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">This can take a few seconds.</p>
    </div>
);

const TOOL_CATEGORIES = ['All', 'Style', 'Enhancement', 'Background'];

export const EditorPage: React.FC<EditorPageProps> = ({ theme, toggleTheme }) => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [editedImage, setEditedImage] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeToolId, setActiveToolId] = useState<string>(TOOLS[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const activeTool = useMemo(() => TOOLS.find(t => t.id === activeToolId), [activeToolId]);
  const filteredTools = useMemo(() => {
    if (activeCategory === 'All') return TOOLS;
    return TOOLS.filter(tool => tool.category === activeCategory);
  }, [activeCategory]);
  
  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData: ImageData = {
            url: reader.result as string,
            base64: (reader.result as string).split(',')[1],
            mimeType: file.type
        };
        setOriginalImage(imageData);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please select a valid image file (PNG, JPG, WEBP).");
    }
  }, []);

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] || null);
  };
  
  const handleDragEvents = (e: DragEvent<HTMLDivElement>, isOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isOver);
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files?.[0];
    if(file) handleFileChange(file);
  }

  const handleApplyTool = useCallback(async () => {
    if (!originalImage || !activeTool) return;

    let promptToUse = activeTool.prompt;
    if (activeTool.id === 'custom-prompt') {
      if (!customPrompt.trim()) {
        setError("Please enter a custom prompt.");
        return;
      }
      promptToUse = customPrompt;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await editImageWithPrompt(originalImage, promptToUse);
      setEditedImage(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, activeTool, customPrompt]);
  
  const resetEditor = useCallback(() => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    setIsLoading(false);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const downloadImage = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage.url;
    const fileExtension = editedImage.mimeType.split('/')[1] || 'png';
    link.download = `klug-ai-edit-${Date.now()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const glassCardClasses = "bg-white dark:bg-slate-800/40 backdrop-blur-lg border border-gray-200 dark:border-slate-700/50";

  return (
    <div className="min-h-screen flex flex-col text-gray-800 dark:text-white">
      <Header theme={theme} toggleTheme={toggleTheme}/>
      <main className="flex-grow flex flex-col lg:flex-row p-4 pt-24 gap-4">
        <div className={`flex-grow flex flex-col ${glassCardClasses} rounded-2xl overflow-hidden relative min-h-[50vh] lg:min-h-0`}>
          {isLoading && <Spinner />}
          {!originalImage ? (
             <div 
                className={`w-full h-full flex flex-col items-center justify-center p-8 transition-colors duration-300 ${isDragging ? 'bg-brand-purple/10' : ''}`}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDrop={handleDrop}
             >
              <div className={`w-full h-full flex flex-col items-center justify-center border-4 border-dashed rounded-2xl transition-colors duration-300 ${isDragging ? 'border-brand-purple' : 'border-gray-400 dark:border-gray-600'}`}>
                <UploadIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">Drag & Drop or Upload Image</p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Supports JPG, PNG, WEBP</p>
                <input type="file" ref={fileInputRef} onChange={onFileInputChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-brand-purple rounded-lg font-semibold text-white hover:bg-purple-500 transition-colors">
                  Browse Files
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2 md:p-4 w-full h-full flex items-center justify-center">
              <BeforeAfterSlider 
                before={originalImage} 
                after={editedImage || originalImage}
              />
            </div>
          )}
        </div>

        <aside className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-4">
          <div className={`${glassCardClasses} p-4 rounded-2xl flex flex-col gap-4 flex-grow`}>
            <h2 className="text-lg font-bold text-center">AI Tools</h2>
            <div className="flex flex-wrap justify-center bg-gray-200 dark:bg-gray-900/50 p-1 rounded-lg">
                {TOOL_CATEGORIES.map(category => (
                    <button key={category} onClick={() => setActiveCategory(category)} className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${activeCategory === category ? 'bg-brand-purple text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/50'}`}>
                        {category}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-3 gap-2">
              {filteredTools.map(tool => (
                <ToolButton 
                    key={tool.id} 
                    tool={tool} 
                    onClick={() => setActiveToolId(tool.id)}
                    isActive={activeToolId === tool.id}
                />
              ))}
            </div>
             {activeTool?.id === 'custom-prompt' && (
              <div className="flex flex-col gap-2">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Make the sky a vibrant sunset"
                  className="w-full h-24 p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-purple focus:outline-none transition"
                />
              </div>
            )}
            <button
              onClick={handleApplyTool}
              disabled={!originalImage || isLoading}
              className="w-full py-3 mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition pulse-glow"
            >
              <MagicWandIcon className="w-5 h-5" />
              Apply
            </button>
          </div>
          <div className={`${glassCardClasses} p-4 rounded-2xl flex flex-col gap-3`}>
             {error && <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-500/10 dark:bg-red-900/30 p-2 rounded-lg">{error}</p>}
             <div className="flex gap-2">
                <button onClick={resetEditor} className="w-full py-2 flex items-center justify-center gap-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                    <ResetIcon className="w-5 h-5"/> New Image
                </button>
                <button onClick={downloadImage} disabled={!editedImage || isLoading} className="w-full py-2 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition">
                    <DownloadIcon className="w-5 h-5"/> Download
                </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};