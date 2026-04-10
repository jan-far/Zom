cat << 'INNER_EOF' > src/components/knowledge-graph.tsx
"use client";

import React, { useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import * as d3 from 'd3';

export interface GraphNode {
  id: string;
  title: string;
  methodology: string;
  group?: string;
  niche?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface KnowledgeGraphProps {
  dataNodes: GraphNode[];
  dataLinks: GraphLink[];
}

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  methodology: string;
}

export default function KnowledgeGraph({ dataNodes, dataLinks }: KnowledgeGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!dataNodes || dataNodes.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // 1. Initialize D3 Headless Force Simulation
    const simulationNodes = dataNodes.map(d => ({ ...d, x: Math.random() * 800, y: Math.random() * 600 }));
    const simulationLinks = dataLinks.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(simulationNodes as any)
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(400, 300))
      .force('link', d3.forceLink(simulationLinks).id((d: any) => d.id).distance(150))
      .force('collision', d3.forceCollide().radius(60));

    // 2. Sync D3 ticks to React Flow State
    simulation.on('tick', () => {
      const flowNodes: Node<CustomNodeData>[] = simulationNodes.map(node => ({
        id: node.id,
        position: { x: node.x, y: node.y },
        data: { label: node.title, methodology: node.methodology },
        type: 'default',
        style: {
          background: 'var(--color-background, #fff)',
          color: 'var(--color-foreground, #000)',
          border: '2px solid var(--color-primary-500, #22c55e)',
          borderRadius: '8px',
          padding: '10px',
          width: 150,
          fontSize: '12px',
          textAlign: 'center' as const,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          opacity: hoveredNode && hoveredNode !== node.id && !dataLinks.some(l => (l.source === hoveredNode && l.target === node.id) || (l.target === hoveredNode && l.source === node.id)) ? 0.3 : 1,
          transition: 'opacity 0.3s'
        }
      }));

      const flowEdges: Edge[] = dataLinks.map((link, i) => ({
        id: \`e\${i}\`,
        source: link.source,
        target: link.target,
        animated: true,
        style: { stroke: 'var(--color-primary-300, #86efac)', strokeWidth: 2, opacity: hoveredNode ? 0.3 : 1 }
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    });

    return () => {
      simulation.stop();
    };
  }, [hoveredNode, setNodes, setEdges, dataNodes, dataLinks]);

  return (
    <div style={{ width: '100%', height: '600px' }} className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden relative bg-neutral-50 dark:bg-neutral-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={(_, node) => setHoveredNode(node.id)}
        onNodeMouseLeave={() => setHoveredNode(null)}
        fitView
      >
        <Background gap={16} size={1} color="var(--color-neutral-300, #d4d4d8)" />
        <Controls />
      </ReactFlow>

      {hoveredNode && (
        <div className="absolute top-4 right-4 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-lg p-4 z-10">
          <h3 className="font-bold text-sm mb-2">{dataNodes.find(d => d.id === hoveredNode)?.title}</h3>
          <div className="space-y-2 text-xs">
            <p><span className="font-semibold text-primary-600">Methodology:</span> {dataNodes.find(d => d.id === hoveredNode)?.methodology}</p>
            <p><span className="font-semibold text-accent-600">Identified Gap:</span> {dataNodes.find(d => d.id === hoveredNode)?.niche}</p>
          </div>
        </div>
      )}
    </div>
  );
}
INNER_EOF
