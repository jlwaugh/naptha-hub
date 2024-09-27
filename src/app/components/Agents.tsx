'use client';

import { useState, useEffect } from "react";
import CopyButton from './CopyButton';

interface AgentsProps {
  scriptToRun: string | null;
}

interface AgentData {
  author: string;
  description: string;
  id: string;
  name: string;
  type: string;
  url: string;
  version: string;
}

const Agents: React.FC<AgentsProps> = ({ scriptToRun }) => {
  const [results, setResults] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scriptToRun) {
      runScript(scriptToRun);
    }
  }, [scriptToRun]);

  const runScript = async (scriptName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/run-script?script=${scriptName}`);
      const data = await response.json();

      if (response.ok) {
        let parsedResult;
        try {
          const correctedJson = data.result.replace(/(?<=\{|,)\s*'(\w+)'\s*:/g, '"$1":')
                                           .replace(/:\s*'([^']*)'/g, ':"$1"');
          parsedResult = JSON.parse(correctedJson);
        } catch (resultParseError) {
          console.error("Result parse error:", resultParseError);
          throw new Error(`Invalid result data: ${data.result.slice(0, 100)}...`);
        }

        if (Array.isArray(parsedResult)) {
          setResults(parsedResult);
        } else {
          throw new Error(`Unexpected data format: ${typeof parsedResult}`);
        }
      } else {
        throw new Error(`${data.error}${data.details ? ` - ${data.details}` : ''}`);
      }
    } catch (error) {
      console.error('ERROR:', error);
      setError(`Failed to run script: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAgentData = (agents: AgentData[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-gray-800 text-left">Name</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">ID</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">Type</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">Version</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">Author</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent, index) => (
            <tr key={agent.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2 border-b text-gray-800">
                <a 
                  href={agent.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  {agent.name}
                </a>
              </td>
              <td className="px-4 py-2 border-b text-gray-800">
                {agent.id}
                <CopyButton text={agent.id} />
              </td>
              <td className="px-4 py-2 border-b text-gray-800">{agent.type}</td>
              <td className="px-4 py-2 border-b text-gray-800">{agent.version}</td>
              <td className="px-4 py-2 border-b text-gray-800">{agent.author}</td>
              <td className="px-4 py-2 border-b text-gray-800">{agent.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="m-2 bg-[#FAFAFB] p-7">
      {isLoading ? (
        <div className="m-2">
          <h3 className="text-xl font-semibold text-[#0A0A18]">Loading...</h3>
        </div>
      ) : error ? (
        <div className="m-2 text-red-600">{error}</div>
      ) : results.length > 0 ? (
        <div className="m-2">
          <h1 className="text-2xl font-semibold text-[#0A0A18] m-1 mb-5">Agents</h1>
          {formatAgentData(results)}
        </div>
      ) : (
        <p>None Found</p>
      )}
    </div>
  );
};

export default Agents;