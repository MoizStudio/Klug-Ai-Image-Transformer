import React, { useState, useEffect } from 'react';
import { EditorPage } from './components/EditorPage';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <EditorPage theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
};

export default App;
