import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.innerHTML = chart;
      mermaid.init(undefined, ref.current);
    }
  }, [chart]);

  return (
    <div className="flex justify-center my-4">
      <div ref={ref} className="mermaid bg-background p-4 rounded-lg border" />
    </div>
  );
}