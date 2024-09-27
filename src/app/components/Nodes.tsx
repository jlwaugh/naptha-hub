'use client';

import { useState, useEffect } from "react";
import CopyButton from './CopyButton';

interface NodesProps {
  scriptToRun: string | null;
}

interface NodeData {
  arch: string;
  docker_jobs: boolean;
  id: string;
  ip: string;
  node_type: string;
  num_gpus: number;
  num_servers: number;
  ollama_models: string[];
  os: string;
  owner: string;
  ports: number[];
  public_key: string;
  ram: number;
  routing: string;
  vram: number;
}

const Nodes: React.FC<NodesProps> = ({ scriptToRun }) => {
  const [results, setResults] = useState<NodeData[]>([]);
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
        let correctedJson = data.result.trim();
        
        // Replace single quotes with double quotes
        correctedJson = correctedJson.replace(/'/g, '"');
        
        // Replace Python boolean values
        correctedJson = correctedJson.replace(/: False/g, ': false').replace(/: True/g, ': true');
        
        // Ensure all property names are in double quotes
        correctedJson = correctedJson.replace(/([{,]\s*)(\w+):/g, '$1"$2":');

        const parsedResult = JSON.parse(correctedJson);

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

  const formatNodeData = (nodes: NodeData[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-gray-800 text-left">ID</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">IP</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">Node Type</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">OS</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">Architecture</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">RAM (GB)</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">GPUs</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">Ollama Models</th>
            <th className="px-4 py-2 border-b text-gray-800 text-left">Owner</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node, index) => (
            <tr key={node.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2 border-b text-gray-800">
                {node.id.split(':')[1].slice(0, 8)}...
                <CopyButton text={node.id} />
              </td>
              <td className="px-4 py-2 border-b text-gray-800">{node.ip}</td>
              <td className="px-4 py-2 border-b text-gray-800">{node.node_type}</td>
              <td className="px-4 py-2 border-b text-gray-800">{node.os}</td>
              <td className="px-4 py-2 border-b text-gray-800">{node.arch}</td>
              <td className="px-4 py-2 border-b text-gray-800">{(node.ram / 1024 / 1024 / 1024).toFixed(2)}</td>
              <td className="px-4 py-2 border-b text-gray-800">{node.num_gpus}</td>
              <td className="px-4 py-2 border-b text-gray-800">{node.ollama_models.join(', ')}</td>
              <td className="px-4 py-2 border-b text-gray-800">{node.owner}</td>
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
          <h1 className="text-2xl font-semibold text-[#0A0A18] m-1 mb-5">Nodes</h1>
          {formatNodeData(results)}
        </div>
      ) : (
        <p>None Found</p>
      )}
    </div>
  );
};

export default Nodes;