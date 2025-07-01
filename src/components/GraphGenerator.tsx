import React, { useState } from 'react';
import { BarChart3, PieChart, LineChart, TrendingUp, Download, Code, Eye, Sparkles, Bot, Zap, Target, Activity } from 'lucide-react';

interface GraphGeneratorProps {
  onGraphGenerated: (graphData: GraphData) => void;
  context?: {
    thesisTitle: string;
    chapterTitle?: string;
  };
}

interface GraphData {
  type: 'chart' | 'diagram' | 'tikz' | 'mermaid';
  title: string;
  description: string;
  code: string;
  imageUrl?: string;
  data?: any;
}

interface GraphTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'statistical' | 'flow' | 'architecture' | 'conceptual' | 'timeline';
  prompt: string;
}

export const GraphGenerator: React.FC<GraphGeneratorProps> = ({ onGraphGenerated, context }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<GraphTemplate | null>(null);
  const [generatedGraph, setGeneratedGraph] = useState<GraphData | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'custom' | 'preview'>('templates');

  const graphTemplates: GraphTemplate[] = [
    {
      id: 'performance_comparison',
      title: 'Performance Comparison',
      description: 'Bar chart comparing algorithm/method performance',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'statistical',
      prompt: 'Create a performance comparison bar chart showing accuracy, speed, and efficiency metrics for different algorithms or methods in {context}'
    },
    {
      id: 'research_methodology_flow',
      title: 'Research Methodology Flow',
      description: 'Flowchart showing research process steps',
      icon: <Activity className="h-4 w-4" />,
      category: 'flow',
      prompt: 'Generate a comprehensive research methodology flowchart showing data collection, analysis, validation, and conclusion steps for {context}'
    },
    {
      id: 'system_architecture',
      title: 'System Architecture',
      description: 'Technical architecture diagram',
      icon: <Target className="h-4 w-4" />,
      category: 'architecture',
      prompt: 'Create a detailed system architecture diagram showing components, data flow, and interactions for {context}'
    },
    {
      id: 'conceptual_framework',
      title: 'Conceptual Framework',
      description: 'Theoretical framework visualization',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'conceptual',
      prompt: 'Design a conceptual framework diagram illustrating theoretical relationships, variables, and hypotheses for {context}'
    },
    {
      id: 'timeline_milestones',
      title: 'Project Timeline',
      description: 'Research timeline with milestones',
      icon: <TrendingUp className="h-4 w-4" />,
      category: 'timeline',
      prompt: 'Create a project timeline showing research phases, milestones, deliverables, and dependencies for {context}'
    },
    {
      id: 'data_distribution',
      title: 'Data Distribution',
      description: 'Statistical distribution charts',
      icon: <PieChart className="h-4 w-4" />,
      category: 'statistical',
      prompt: 'Generate statistical distribution charts (histogram, pie chart, box plot) showing data patterns and insights for {context}'
    },
    {
      id: 'trend_analysis',
      title: 'Trend Analysis',
      description: 'Line chart showing trends over time',
      icon: <LineChart className="h-4 w-4" />,
      category: 'statistical',
      prompt: 'Create a trend analysis line chart showing changes, patterns, and projections over time for {context}'
    },
    {
      id: 'process_workflow',
      title: 'Process Workflow',
      description: 'Detailed process workflow diagram',
      icon: <Zap className="h-4 w-4" />,
      category: 'flow',
      prompt: 'Design a detailed workflow diagram showing process steps, decision points, and outcomes for {context}'
    }
  ];

  const generateTikZCode = (prompt: string, graphType: string): string => {
    const contextualPrompt = prompt.replace('{context}', `${context?.thesisTitle || 'research project'}${context?.chapterTitle ? ` - ${context.chapterTitle}` : ''}`);
    
    const tikzTemplates = {
      'performance_comparison': `
\\begin{tikzpicture}
\\begin{axis}[
    ybar,
    enlargelimits=0.15,
    legend style={at={(0.5,-0.15)},anchor=north,legend columns=-1},
    ylabel={Performance (\\%)},
    symbolic x coords={Method A,Method B,Method C,Proposed},
    xtick=data,
    nodes near coords,
    nodes near coords align={vertical},
    width=12cm,
    height=8cm
]
\\addplot coordinates {(Method A,75) (Method B,82) (Method C,78) (Proposed,94)};
\\addplot coordinates {(Method A,68) (Method B,79) (Method C,85) (Proposed,91)};
\\addplot coordinates {(Method A,72) (Method B,76) (Method C,80) (Proposed,89)};
\\legend{Accuracy,Precision,Recall}
\\end{axis}
\\end{tikzpicture}`,

      'research_methodology_flow': `
\\begin{tikzpicture}[node distance=2cm, auto]
\\tikzstyle{process} = [rectangle, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=blue!20]
\\tikzstyle{decision} = [diamond, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=green!20]
\\tikzstyle{arrow} = [thick,->,>=stealth]

\\node (start) [process] {Literature Review};
\\node (design) [process, below of=start] {Research Design};
\\node (collect) [process, below of=design] {Data Collection};
\\node (analyze) [process, below of=collect] {Data Analysis};
\\node (validate) [decision, below of=analyze] {Results Valid?};
\\node (conclude) [process, below of=validate] {Conclusions};

\\draw [arrow] (start) -- (design);
\\draw [arrow] (design) -- (collect);
\\draw [arrow] (collect) -- (analyze);
\\draw [arrow] (analyze) -- (validate);
\\draw [arrow] (validate) -- node[anchor=west] {Yes} (conclude);
\\draw [arrow] (validate.west) -- ++(-2,0) |- (collect.west) node[anchor=south] {No};
\\end{tikzpicture}`,

      'system_architecture': `
\\begin{tikzpicture}[scale=0.8]
\\tikzstyle{component} = [rectangle, draw, fill=blue!20, text width=2.5cm, text centered, minimum height=1.5cm]
\\tikzstyle{database} = [cylinder, draw, fill=green!20, text width=2cm, text centered, minimum height=1.5cm]
\\tikzstyle{interface} = [ellipse, draw, fill=yellow!20, text width=2cm, text centered, minimum height=1cm]

\\node (ui) [interface] at (0,4) {User Interface};
\\node (api) [component] at (0,2) {API Gateway};
\\node (auth) [component] at (-3,0) {Authentication};
\\node (core) [component] at (0,0) {Core Logic};
\\node (ml) [component] at (3,0) {ML Engine};
\\node (db) [database] at (0,-2) {Database};

\\draw[->] (ui) -- (api);
\\draw[->] (api) -- (auth);
\\draw[->] (api) -- (core);
\\draw[->] (core) -- (ml);
\\draw[->] (core) -- (db);
\\draw[->] (auth) -- (db);
\\end{tikzpicture}`,

      'default': `
\\begin{tikzpicture}
\\node[draw, rectangle, fill=blue!20] (A) at (0,0) {Component A};
\\node[draw, rectangle, fill=green!20] (B) at (3,0) {Component B};
\\node[draw, rectangle, fill=red!20] (C) at (1.5,-2) {Component C};
\\draw[->] (A) -- (B);
\\draw[->] (A) -- (C);
\\draw[->] (B) -- (C);
\\end{tikzpicture}`
    };

    return tikzTemplates[graphType as keyof typeof tikzTemplates] || tikzTemplates.default;
  };

  const generateMermaidCode = (prompt: string, graphType: string): string => {
    const mermaidTemplates = {
      'research_methodology_flow': `
graph TD
    A[Literature Review] --> B[Problem Identification]
    B --> C[Research Questions]
    C --> D[Methodology Design]
    D --> E[Data Collection]
    E --> F[Data Analysis]
    F --> G{Results Valid?}
    G -->|Yes| H[Conclusions]
    G -->|No| E
    H --> I[Future Work]
    
    style A fill:#e1f5fe
    style H fill:#c8e6c9
    style G fill:#fff3e0`,

      'system_architecture': `
graph TB
    subgraph "Frontend Layer"
        UI[User Interface]
        WEB[Web Application]
    end
    
    subgraph "API Layer"
        API[API Gateway]
        AUTH[Authentication]
    end
    
    subgraph "Business Layer"
        CORE[Core Logic]
        ML[ML Engine]
        PROC[Data Processor]
    end
    
    subgraph "Data Layer"
        DB[(Database)]
        CACHE[(Cache)]
        FILES[(File Storage)]
    end
    
    UI --> API
    WEB --> API
    API --> AUTH
    API --> CORE
    CORE --> ML
    CORE --> PROC
    CORE --> DB
    PROC --> CACHE
    ML --> FILES`,

      'default': `
graph LR
    A[Start] --> B[Process]
    B --> C[Decision]
    C -->|Yes| D[Success]
    C -->|No| E[Retry]
    E --> B`
    };

    return mermaidTemplates[graphType as keyof typeof mermaidTemplates] || mermaidTemplates.default;
  };

  const generateChartJSCode = (prompt: string, graphType: string): string => {
    const chartTemplates = {
      'performance_comparison': `
{
  type: 'bar',
  data: {
    labels: ['Method A', 'Method B', 'Method C', 'Proposed Method'],
    datasets: [{
      label: 'Accuracy (%)',
      data: [75, 82, 78, 94],
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }, {
      label: 'Precision (%)',
      data: [68, 79, 85, 91],
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Performance Comparison Analysis'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
}`,

      'trend_analysis': `
{
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Performance Trend',
      data: [65, 72, 78, 85, 89, 94],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Performance Trend Over Time'
      }
    }
  }
}`,

      'data_distribution': `
{
  type: 'pie',
  data: {
    labels: ['Category A', 'Category B', 'Category C', 'Category D'],
    datasets: [{
      data: [30, 25, 25, 20],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Data Distribution Analysis'
      }
    }
  }
}`
    };

    return chartTemplates[graphType as keyof typeof chartTemplates] || chartTemplates.performance_comparison;
  };

  const handleTemplateSelect = async (template: GraphTemplate) => {
    setSelectedTemplate(template);
    setIsGenerating(true);

    try {
      // Generate multiple formats
      const tikzCode = generateTikZCode(template.prompt, template.id);
      const mermaidCode = generateMermaidCode(template.prompt, template.id);
      const chartCode = generateChartJSCode(template.prompt, template.id);

      const graphData: GraphData = {
        type: 'tikz',
        title: template.title,
        description: template.description,
        code: tikzCode,
        data: {
          tikz: tikzCode,
          mermaid: mermaidCode,
          chartjs: chartCode
        }
      };

      setGeneratedGraph(graphData);
      setActiveTab('preview');
      onGraphGenerated(graphData);
    } catch (error) {
      console.error('Graph generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomGenerate = async () => {
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    try {
      // For custom prompts, generate a basic TikZ diagram
      const tikzCode = `
\\begin{tikzpicture}
\\node[draw, rectangle, fill=blue!20, text width=3cm, text centered] (A) at (0,2) {${customPrompt.slice(0, 20)}...};
\\node[draw, rectangle, fill=green!20, text width=3cm, text centered] (B) at (4,2) {Process};
\\node[draw, rectangle, fill=red!20, text width=3cm, text centered] (C) at (2,0) {Output};
\\draw[->] (A) -- (B);
\\draw[->] (B) -- (C);
\\end{tikzpicture}`;

      const graphData: GraphData = {
        type: 'tikz',
        title: 'Custom Graph',
        description: customPrompt,
        code: tikzCode
      };

      setGeneratedGraph(graphData);
      setActiveTab('preview');
      onGraphGenerated(graphData);
    } catch (error) {
      console.error('Custom graph generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadGraph = (format: 'tikz' | 'mermaid' | 'chartjs') => {
    if (!generatedGraph) return;

    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    switch (format) {
      case 'tikz':
        content = `\\documentclass{standalone}
\\usepackage{tikz}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\begin{document}
${generatedGraph.code}
\\end{document}`;
        filename = `${generatedGraph.title.replace(/\s+/g, '_')}.tex`;
        break;
      case 'mermaid':
        content = generatedGraph.data?.mermaid || 'graph LR\nA --> B';
        filename = `${generatedGraph.title.replace(/\s+/g, '_')}.mmd`;
        break;
      case 'chartjs':
        content = generatedGraph.data?.chartjs || '{}';
        filename = `${generatedGraph.title.replace(/\s+/g, '_')}.json`;
        mimeType = 'application/json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const categories = ['statistical', 'flow', 'architecture', 'conceptual', 'timeline'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Dynamic Graph Generator</h3>
            <p className="text-blue-100">Create professional diagrams and charts for your thesis</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'templates'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="inline-block h-4 w-4 mr-2" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'custom'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bot className="inline-block h-4 w-4 mr-2" />
          Custom
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'preview'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Eye className="inline-block h-4 w-4 mr-2" />
          Preview
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium capitalize"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {graphTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  disabled={isGenerating}
                  className="group bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg p-4 text-left transition-all duration-200 hover:shadow-md disabled:opacity-50"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 group-hover:bg-blue-200 p-2 rounded-lg transition-colors duration-200">
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors duration-200">
                        {template.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {template.description}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs capitalize">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Describe your graph or diagram
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Example: Create a flowchart showing the machine learning pipeline with data preprocessing, model training, validation, and deployment steps..."
              />
            </div>

            <button
              onClick={handleCustomGenerate}
              disabled={isGenerating || !customPrompt.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Graph</span>
                </>
              )}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Be specific about the type of graph (flowchart, bar chart, architecture diagram)</li>
                <li>• Include the data or components you want to visualize</li>
                <li>• Mention the context of your research for better results</li>
                <li>• Specify colors, styles, or layout preferences if needed</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'preview' && generatedGraph && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{generatedGraph.title}</h4>
                <p className="text-slate-600">{generatedGraph.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadGraph('tikz')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
                >
                  <Download className="h-3 w-3" />
                  <span>TikZ</span>
                </button>
                <button
                  onClick={() => downloadGraph('mermaid')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
                >
                  <Download className="h-3 w-3" />
                  <span>Mermaid</span>
                </button>
                <button
                  onClick={() => downloadGraph('chartjs')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
                >
                  <Download className="h-3 w-3" />
                  <span>Chart.js</span>
                </button>
              </div>
            </div>

            {/* Code Preview */}
            <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 text-sm font-medium">TikZ/LaTeX Code</span>
                <Code className="h-4 w-4 text-green-400" />
              </div>
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                {generatedGraph.code}
              </pre>
            </div>

            {/* Usage Instructions */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">Usage Instructions</h4>
              <div className="text-amber-800 text-sm space-y-2">
                <p><strong>For LaTeX/TikZ:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Add <code className="bg-amber-100 px-1 rounded">\usepackage{`{tikz}`}</code> to your preamble</li>
                  <li>For charts, also add <code className="bg-amber-100 px-1 rounded">\usepackage{`{pgfplots}`}</code></li>
                  <li>Insert the TikZ code in your document where you want the graph</li>
                  <li>Compile with pdflatex</li>
                </ol>
                <p className="mt-3"><strong>For Mermaid:</strong> Use in Markdown documents or online Mermaid editors</p>
                <p><strong>For Chart.js:</strong> Use in web applications with Chart.js library</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && !generatedGraph && (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-600 mb-2">No Graph Generated Yet</h4>
            <p className="text-slate-500">Select a template or create a custom graph to see the preview</p>
          </div>
        )}
      </div>
    </div>
  );
};