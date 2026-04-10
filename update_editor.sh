cat << 'INNER_EOF' > src/components/report-editor.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamically import the UIW React MD Editor strictly on the client side
// This avoids hydration mismatch and ensures SSR compatibility with React 18
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface SynthesisData {
  paperTitle: string;
  niche: string;
  methodology: string;
}

interface ReportEditorProps {
  initialValue?: string;
  projectId?: string;
  synthesisList?: SynthesisData[];
}

export default function ReportEditor({ initialValue, projectId, synthesisList = [] }: ReportEditorProps) {
  const [value, setValue] = useState(
    initialValue || "## Chapter 1: Establishing the Territory\n\nBegin your theoretical grounding here...\n"
  );
  const [isExporting, setIsExporting] = useState(false);

  const handleExportGoogleDocs = async () => {
    setIsExporting(true);
    try {
      alert("Triggering Google Docs export pipeline... (Requires Drive Scopes)");
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleInjectInsights = () => {
    if (synthesisList.length === 0) {
      alert("No synthesis data available to inject. Please analyze some papers first.");
      return;
    }

    let injection = "\n### Identified Research Gaps\n\n";
    synthesisList.forEach(syn => {
      injection += `#### ${syn.paperTitle}\n`;
      injection += `- **Methodology:** ${syn.methodology}\n`;
      injection += `- **Niche/Gap:** ${syn.niche}\n\n`;
    });

    setValue(value + injection);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-t-lg border border-neutral-200 dark:border-neutral-800 border-b-0">
        <div className="flex gap-2">
          <button
            onClick={handleInjectInsights}
            className="px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
          >
            + Auto-Inject Synthesis
          </button>
        </div>
        <button
          onClick={handleExportGoogleDocs}
          disabled={isExporting}
          className="px-4 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.727 6.727H9.273v10.546h5.454V6.727zm-5.454-1.364h5.454c.754 0 1.364.61 1.364 1.364v10.546c0 .754-.61 1.364-1.364 1.364H9.273A1.363 1.363 0 0 1 7.91 17.273V6.727c0-.754.61-1.364 1.364-1.364z" /></svg>
          {isExporting ? "Exporting..." : "Export to Google Docs"}
        </button>
      </div>

      <div data-color-mode="light" className="dark:hidden">
        <MDEditor
          value={value}
          onChange={(val) => setValue(val || "")}
          height={600}
          preview="live"
        />
      </div>
      <div data-color-mode="dark" className="hidden dark:block">
        <MDEditor
          value={value}
          onChange={(val) => setValue(val || "")}
          height={600}
          preview="live"
        />
      </div>
    </div>
  );
}
INNER_EOF
