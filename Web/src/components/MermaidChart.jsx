import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'JetBrains Mono, Inter, sans-serif',
  themeVariables: {
    primaryColor: '#020617',
    primaryTextColor: '#22d3ee',
    primaryBorderColor: '#22d3ee',
    lineColor: '#22d3ee',
    secondaryColor: '#020617',
    tertiaryColor: '#020617',
    edgeLabelBackground: '#020617',
    nodeBorder: '#22d3ee',
    clusterBkg: 'rgba(34, 211, 238, 0.05)',
  },
});

const MermaidChart = ({ code }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !code) return;
    ref.current.innerHTML = '';

    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      })
      .catch((err) => console.error('Mermaid render error:', err));
  }, [code]);

  return (
    <div
      ref={ref}
      className="mermaid-container w-full h-full flex items-center justify-center overflow-auto p-2"
    />
  );
};

export default MermaidChart;
