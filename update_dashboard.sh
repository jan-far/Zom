cat << 'INNER_EOF' > src/app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { fetchOpenAlexData, OpenAlexWork } from "@/lib/api/openalex";
import KnowledgeGraph, { GraphNode, GraphLink } from "@/components/knowledge-graph";
import ReportEditor from "@/components/report-editor";

type Operator = "AND" | "OR" | "NOT";

interface QueryBlock {
  id: string;
  field: string;
  value: string;
  operator: Operator;
}

interface SynthesisData {
  paperTitle: string;
  niche: string;
  methodology: string;
}

export default function Dashboard() {
  const [queryBlocks, setQueryBlocks] = useState<QueryBlock[]>([
    { id: "1", field: "title_abstract", value: "Vehicle Routing Problem", operator: "AND" }
  ]);
  const [results, setResults] = useState<OpenAlexWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

  // Graph State
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphLinks, setGraphLinks] = useState<GraphLink[]>([]);
  const [synthesisList, setSynthesisList] = useState<SynthesisData[]>([]);

  const addBlock = () => {
    setQueryBlocks([...queryBlocks, { id: Math.random().toString(), field: "title_abstract", value: "", operator: "AND" }]);
  };

  const updateBlock = (id: string, updates: Partial<QueryBlock>) => {
    setQueryBlocks(blocks => blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    if (queryBlocks.length > 1) {
      setQueryBlocks(blocks => blocks.filter(b => b.id !== id));
    }
  };

  const buildQueryString = () => {
    return queryBlocks.map(block => `${block.operator !== "AND" && block.id !== queryBlocks[0].id ? block.operator + ' ' : ''}"${block.value}"`).join(' ');
  };

  const handleSearch = async () => {
    setLoading(true);
    const queryString = buildQueryString();
    const data = await fetchOpenAlexData(queryString);
    setResults(data);
    setLoading(false);
  };

  const analyzeAndAddToProject = async (work: OpenAlexWork) => {
    setAnalyzingIds(prev => new Set(prev).add(work.id));

    try {
      const paperText = `Title: ${work.title}\nAbstract: ${work.abstract || "No abstract available."}`;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperText })
      });

      if (!res.ok) {
        throw new Error("Failed to analyze paper");
      }

      const synthesis = await res.json();

      // Add to Graph State
      const newNode: GraphNode = {
        id: work.id,
        title: work.title || "Untitled",
        methodology: synthesis.methodology || "Unknown",
        niche: synthesis.niche || "No gap identified"
      };

      setGraphNodes(prev => [...prev, newNode]);

      // Simple heuristic for linking: link to other nodes with the same methodology
      setGraphNodes(currentNodes => {
        const newLinks: GraphLink[] = [];
        currentNodes.forEach(node => {
          if (node.id !== newNode.id && node.methodology === newNode.methodology) {
            newLinks.push({ source: node.id, target: newNode.id, value: 1 });
          }
        });
        setGraphLinks(prev => [...prev, ...newLinks]);
        return [...currentNodes]; // state unchanged, just needed the values
      });

      // Add to synthesis list for the Editor
      setSynthesisList(prev => [...prev, {
        paperTitle: work.title || "Untitled",
        niche: synthesis.niche,
        methodology: synthesis.methodology
      }]);

    } catch (error) {
      console.error("Error adding to project:", error);
      alert("Failed to analyze paper. Make sure your GEMINI_API_KEY is set in .env.");
    } finally {
      setAnalyzingIds(prev => {
        const next = new Set(prev);
        next.delete(work.id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <header className="flex justify-between items-center pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-3xl font-bold">Research Ingestion</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-md text-sm font-medium hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
              OpenAlex (Active)
            </button>
            <a href="/api/auth/scopus" className="px-4 py-2 bg-accent-500 text-white rounded-md text-sm font-medium hover:bg-accent-600 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Connect Scopus
            </a>
          </div>
        </header>

        <section className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Query Builder</h2>
          <div className="space-y-4">
            {queryBlocks.map((block, index) => (
              <div key={block.id} className="flex items-center gap-4">
                {index > 0 ? (
                  <select
                    value={block.operator}
                    onChange={(e) => updateBlock(block.id, { operator: e.target.value as Operator })}
                    className="w-24 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                    <option value="NOT">NOT</option>
                  </select>
                ) : (
                  <div className="w-24 text-center text-sm font-medium text-neutral-500">MATCH</div>
                )}

                <input
                  type="text"
                  value={block.value}
                  onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                  placeholder="e.g. Meta-heuristics"
                  className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />

                <button onClick={() => removeBlock(block.id)} className="text-neutral-400 hover:text-red-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button onClick={addBlock} className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
              + Add Condition
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search Literature"}
            </button>
          </div>
        </section>

        <section>
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Topology Knowledge Graph</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Interactive visualization of semantic similarities and theoretical lineages based on the CARS model extraction. Headless physical layouts calculated via D3.js.
            </p>
            {graphNodes.length > 0 ? (
              <KnowledgeGraph dataNodes={graphNodes} dataLinks={graphLinks} />
            ) : (
              <div className="w-full h-[600px] border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-center text-neutral-500 bg-neutral-50 dark:bg-neutral-950">
                Analyze papers below to generate the knowledge graph.
              </div>
            )}
          </div>

          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Academic Synthesis Report Suite</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Compile your structured findings into a formal academic layout. Auto-inject identified CARS gaps directly into your manuscript and seamlessly batch export to Google Docs.
            </p>
            <ReportEditor synthesisList={synthesisList} />
          </div>

          <h2 className="text-lg font-semibold mb-4">Raw Ingestion Results ({results.length})</h2>
          <div className="space-y-4">
            {results.map((work) => (
              <div key={work.id} className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-primary-700 dark:text-primary-400 leading-tight mb-1">{work.title || "Untitled Document"}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {work.authorships.slice(0, 3).map(a => a.author.display_name).join(", ")} {work.authorships.length > 3 ? "et al." : ""} • {work.publication_year}
                  </p>
                  {work.doi && <a href={work.doi} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-2 inline-block">DOI: {work.doi}</a>}
                </div>
                <button
                  onClick={() => analyzeAndAddToProject(work)}
                  disabled={analyzingIds.has(work.id) || graphNodes.some(n => n.id === work.id)}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-sm rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  {analyzingIds.has(work.id) ? "Analyzing..." : graphNodes.some(n => n.id === work.id) ? "Added" : "Analyze & Add"}
                </button>
              </div>
            ))}
            {results.length === 0 && !loading && (
              <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                No literature found. Adjust your Boolean query.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
INNER_EOF
