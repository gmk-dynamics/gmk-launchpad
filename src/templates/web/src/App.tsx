import React from 'react';
import './App.css';

const PROJECT_NAME = '{{PROJECT_NAME}}';

const App: React.FC = () => {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-semibold">{PROJECT_NAME}</h1>

        <p className="mt-2 text-sm text-neutral-500">Powered by GMK Launchpad</p>
      </div>
    </main>
  );
};

export default App;
