'use client';

import { useState } from "react";

export default function Scripts() {
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runScript = async (scriptName: string) => {
    setIsLoading(true);
    setResults(`Loading results from ${scriptName}...`);

    try {
      const response = await fetch(`/api/run-script?script=${scriptName}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.result);
      } else {
        setResults(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setResults(`Failed to run script: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          onClick={() => runScript('get_nodes.py')}
          disabled={isLoading}
        >
          Get Nodes
        </button>
        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          onClick={() => runScript('get_modules.py')}
          disabled={isLoading}
        >
          Get Modules
        </button>
      </div>
      <div className="w-full bg-black/[.05] dark:bg-white/[.06] p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Results:</h2>
        <p className="font-[family-name:var(--font-geist-mono)] text-sm">
          {results || 'No results yet. Click a button to run a script.'}
        </p>
      </div>
    </>
  );
}