export interface GraphRequest {
  prompt: string;
  type: 'flowchart' | 'bar_chart' | 'line_chart' | 'pie_chart' | 'architecture' | 'timeline' | 'conceptual';
  format: 'tikz' | 'mermaid' | 'chartjs' | 'svg';
  context?: string;
  style?: 'academic' | 'modern' | 'minimal' | 'colorful';
}

export interface GraphResponse {
  code: string;
  title: string;
  description: string;
  format: string;
  instructions: string[];
}

export class GraphService {
  static generateTikZGraph(request: GraphRequest): GraphResponse {
    const { prompt, type, style = 'academic' } = request;
    
    const styleConfig = {
      academic: {
        colors: ['blue!20', 'green!20', 'red!20', 'yellow!20'],
        nodeStyle: 'draw, rectangle, minimum width=3cm, minimum height=1cm, text centered',
        arrowStyle: 'thick, ->, >=stealth'
      },
      modern: {
        colors: ['cyan!30', 'magenta!30', 'orange!30', 'purple!30'],
        nodeStyle: 'draw, rounded corners, minimum width=3cm, minimum height=1cm, text centered, drop shadow',
        arrowStyle: 'ultra thick, ->, >=stealth, rounded corners'
      },
      minimal: {
        colors: ['gray!10', 'gray!20', 'gray!30', 'gray!40'],
        nodeStyle: 'draw, rectangle, minimum width=2.5cm, minimum height=0.8cm, text centered',
        arrowStyle: '->, >=stealth'
      },
      colorful: {
        colors: ['red!40', 'blue!40', 'green!40', 'yellow!40', 'purple!40', 'orange!40'],
        nodeStyle: 'draw, rounded rectangle, minimum width=3cm, minimum height=1cm, text centered, thick',
        arrowStyle: 'very thick, ->, >=stealth, rounded corners'
      }
    };

    const config = styleConfig[style];
    
    const templates = {
      flowchart: this.generateFlowchartTikZ(prompt, config),
      bar_chart: this.generateBarChartTikZ(prompt, config),
      line_chart: this.generateLineChartTikZ(prompt, config),
      pie_chart: this.generatePieChartTikZ(prompt, config),
      architecture: this.generateArchitectureTikZ(prompt, config),
      timeline: this.generateTimelineTikZ(prompt, config),
      conceptual: this.generateConceptualTikZ(prompt, config)
    };

    const code = templates[type] || templates.flowchart;
    
    return {
      code,
      title: this.extractTitle(prompt),
      description: prompt,
      format: 'tikz',
      instructions: [
        'Add \\usepackage{tikz} to your LaTeX preamble',
        'For charts, also add \\usepackage{pgfplots} and \\pgfplotsset{compat=1.18}',
        'Insert the TikZ code where you want the graph to appear',
        'Compile with pdflatex or xelatex'
      ]
    };
  }

  static generateMermaidGraph(request: GraphRequest): GraphResponse {
    const { prompt, type } = request;
    
    const templates = {
      flowchart: this.generateFlowchartMermaid(prompt),
      architecture: this.generateArchitectureMermaid(prompt),
      timeline: this.generateTimelineMermaid(prompt),
      conceptual: this.generateConceptualMermaid(prompt),
      bar_chart: this.generateChartMermaid(prompt, 'bar'),
      line_chart: this.generateChartMermaid(prompt, 'line'),
      pie_chart: this.generateChartMermaid(prompt, 'pie')
    };

    const code = templates[type] || templates.flowchart;
    
    return {
      code,
      title: this.extractTitle(prompt),
      description: prompt,
      format: 'mermaid',
      instructions: [
        'Use in Markdown documents with ```mermaid code blocks',
        'Use online Mermaid editors for standalone diagrams',
        'Integrate with documentation platforms that support Mermaid',
        'Export as SVG or PNG for inclusion in documents'
      ]
    };
  }

  static generateChartJSGraph(request: GraphRequest): GraphResponse {
    const { prompt, type } = request;
    
    const templates = {
      bar_chart: this.generateBarChartJS(prompt),
      line_chart: this.generateLineChartJS(prompt),
      pie_chart: this.generatePieChartJS(prompt),
      flowchart: this.generateBarChartJS(prompt), // Fallback
      architecture: this.generateBarChartJS(prompt), // Fallback
      timeline: this.generateLineChartJS(prompt), // Timeline as line chart
      conceptual: this.generateBarChartJS(prompt) // Fallback
    };

    const code = templates[type] || templates.bar_chart;
    
    return {
      code,
      title: this.extractTitle(prompt),
      description: prompt,
      format: 'chartjs',
      instructions: [
        'Include Chart.js library in your HTML: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
        'Create a canvas element: <canvas id="myChart"></canvas>',
        'Initialize the chart with the provided configuration',
        'Customize colors, labels, and data as needed'
      ]
    };
  }

  private static generateFlowchartTikZ(prompt: string, config: any): string {
    return `\\begin{tikzpicture}[node distance=2cm, auto]
\\tikzstyle{process} = [${config.nodeStyle}, fill=${config.colors[0]}]
\\tikzstyle{decision} = [diamond, ${config.nodeStyle}, fill=${config.colors[1]}]
\\tikzstyle{terminal} = [${config.nodeStyle}, rounded corners, fill=${config.colors[2]}]
\\tikzstyle{arrow} = [${config.arrowStyle}]

\\node (start) [terminal] {Start};
\\node (input) [process, below of=start] {Input Data};
\\node (process1) [process, below of=input] {Process Step 1};
\\node (decision1) [decision, below of=process1] {Decision?};
\\node (process2) [process, below of=decision1, yshift=-1cm] {Process Step 2};
\\node (output) [process, below of=process2] {Generate Output};
\\node (end) [terminal, below of=output] {End};

\\draw [arrow] (start) -- (input);
\\draw [arrow] (input) -- (process1);
\\draw [arrow] (process1) -- (decision1);
\\draw [arrow] (decision1) -- node[anchor=west] {Yes} (process2);
\\draw [arrow] (decision1.east) -- ++(2,0) |- (output.east) node[anchor=south, pos=0.25] {No};
\\draw [arrow] (process2) -- (output);
\\draw [arrow] (output) -- (end);
\\end{tikzpicture}`;
  }

  private static generateBarChartTikZ(prompt: string, config: any): string {
    return `\\begin{tikzpicture}
\\begin{axis}[
    ybar,
    enlargelimits=0.15,
    legend style={at={(0.5,-0.15)},anchor=north,legend columns=-1},
    ylabel={Values},
    symbolic x coords={Category A,Category B,Category C,Category D},
    xtick=data,
    nodes near coords,
    nodes near coords align={vertical},
    width=12cm,
    height=8cm,
    bar width=20pt
]
\\addplot coordinates {(Category A,85) (Category B,92) (Category C,78) (Category D,96)};
\\addplot coordinates {(Category A,75) (Category B,88) (Category C,82) (Category D,89)};
\\legend{Series 1,Series 2}
\\end{axis}
\\end{tikzpicture}`;
  }

  private static generateLineChartTikZ(prompt: string, config: any): string {
    return `\\begin{tikzpicture}
\\begin{axis}[
    xlabel={Time},
    ylabel={Performance},
    legend pos=north west,
    grid=major,
    width=12cm,
    height=8cm
]
\\addplot[color=blue,mark=*] coordinates {
    (1,65) (2,72) (3,78) (4,85) (5,89) (6,94)
};
\\addplot[color=red,mark=square] coordinates {
    (1,60) (2,68) (3,75) (4,82) (5,87) (6,91)
};
\\legend{Method A,Method B}
\\end{axis}
\\end{tikzpicture}`;
  }

  private static generatePieChartTikZ(prompt: string, config: any): string {
    return `\\begin{tikzpicture}
\\pie[text=legend, radius=3]{
    30/Category A,
    25/Category B,
    25/Category C,
    20/Category D
}
\\end{tikzpicture}`;
  }

  private static generateArchitectureTikZ(prompt: string, config: any): string {
    return `\\begin{tikzpicture}[scale=0.8]
\\tikzstyle{component} = [rectangle, ${config.nodeStyle}, fill=${config.colors[0]}]
\\tikzstyle{database} = [cylinder, draw, fill=${config.colors[1]}, text width=2cm, text centered, minimum height=1.5cm]
\\tikzstyle{interface} = [ellipse, draw, fill=${config.colors[2]}, text width=2cm, text centered, minimum height=1cm]

\\node (ui) [interface] at (0,4) {User Interface};
\\node (api) [component] at (0,2) {API Layer};
\\node (auth) [component] at (-3,0) {Authentication};
\\node (core) [component] at (0,0) {Core Logic};
\\node (ml) [component] at (3,0) {ML Engine};
\\node (db) [database] at (0,-2) {Database};
\\node (cache) [database] at (3,-2) {Cache};

\\draw[${config.arrowStyle}] (ui) -- (api);
\\draw[${config.arrowStyle}] (api) -- (auth);
\\draw[${config.arrowStyle}] (api) -- (core);
\\draw[${config.arrowStyle}] (core) -- (ml);
\\draw[${config.arrowStyle}] (core) -- (db);
\\draw[${config.arrowStyle}] (ml) -- (cache);
\\end{tikzpicture}`;
  }

  private static generateTimelineTikZ(prompt: string, config: any): string {
    return `\\begin{tikzpicture}[scale=1.2]
\\draw[thick] (0,0) -- (10,0);
\\foreach \\x/\\year/\\event in {0/2020/Project Start, 2.5/2021/Phase 1, 5/2022/Phase 2, 7.5/2023/Phase 3, 10/2024/Completion} {
    \\draw (\\x,0) -- (\\x,0.2);
    \\node[above] at (\\x,0.2) {\\year};
    \\node[below, text width=2cm, text centered] at (\\x,-0.5) {\\event};
}
\\end{tikzpicture}`;
  }

  private static generateConceptualTikZ(prompt: string, config: any): string {
    return `\\begin{tikzpicture}
\\node[${config.nodeStyle}, fill=${config.colors[0]}] (concept1) at (0,2) {Core Concept};
\\node[${config.nodeStyle}, fill=${config.colors[1]}] (concept2) at (-3,0) {Related Idea A};
\\node[${config.nodeStyle}, fill=${config.colors[2]}] (concept3) at (3,0) {Related Idea B};
\\node[${config.nodeStyle}, fill=${config.colors[3]}] (concept4) at (0,-2) {Application};

\\draw[${config.arrowStyle}] (concept1) -- (concept2);
\\draw[${config.arrowStyle}] (concept1) -- (concept3);
\\draw[${config.arrowStyle}] (concept2) -- (concept4);
\\draw[${config.arrowStyle}] (concept3) -- (concept4);
\\end{tikzpicture}`;
  }

  private static generateFlowchartMermaid(prompt: string): string {
    return `graph TD
    A[Start] --> B[Input Data]
    B --> C[Process Data]
    C --> D{Decision Point}
    D -->|Yes| E[Path A]
    D -->|No| F[Path B]
    E --> G[Output A]
    F --> G
    G --> H[End]
    
    style A fill:#e1f5fe
    style H fill:#c8e6c9
    style D fill:#fff3e0`;
  }

  private static generateArchitectureMermaid(prompt: string): string {
    return `graph TB
    subgraph "Frontend"
        UI[User Interface]
        WEB[Web App]
    end
    
    subgraph "Backend"
        API[API Gateway]
        AUTH[Authentication]
        CORE[Core Logic]
    end
    
    subgraph "Data"
        DB[(Database)]
        CACHE[(Cache)]
    end
    
    UI --> API
    WEB --> API
    API --> AUTH
    API --> CORE
    CORE --> DB
    CORE --> CACHE`;
  }

  private static generateTimelineMermaid(prompt: string): string {
    return `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Research        :2024-01-01, 30d
    Analysis        :2024-02-01, 20d
    section Phase 2
    Development     :2024-03-01, 45d
    Testing         :2024-04-15, 15d
    section Phase 3
    Deployment      :2024-05-01, 10d
    Documentation   :2024-05-11, 10d`;
  }

  private static generateConceptualMermaid(prompt: string): string {
    return `mindmap
  root((Central Concept))
    Branch A
      Sub-concept A1
      Sub-concept A2
    Branch B
      Sub-concept B1
      Sub-concept B2
    Branch C
      Sub-concept C1
      Sub-concept C2`;
  }

  private static generateChartMermaid(prompt: string, type: string): string {
    const templates = {
      bar: `xychart-beta
    title "Performance Comparison"
    x-axis [Method A, Method B, Method C, Proposed]
    y-axis "Accuracy (%)" 0 --> 100
    bar [75, 82, 78, 94]`,
      line: `xychart-beta
    title "Trend Analysis"
    x-axis [Jan, Feb, Mar, Apr, May, Jun]
    y-axis "Performance" 0 --> 100
    line [65, 72, 78, 85, 89, 94]`,
      pie: `pie title Data Distribution
    "Category A" : 30
    "Category B" : 25
    "Category C" : 25
    "Category D" : 20`
    };
    return templates[type as keyof typeof templates] || templates.bar;
  }

  private static generateBarChartJS(prompt: string): string {
    return `{
  type: 'bar',
  data: {
    labels: ['Method A', 'Method B', 'Method C', 'Proposed Method'],
    datasets: [{
      label: 'Performance (%)',
      data: [75, 82, 78, 94],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Performance Comparison Analysis'
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Performance (%)'
        }
      }
    }
  }
}`;
  }

  private static generateLineChartJS(prompt: string): string {
    return `{
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Performance Trend',
      data: [65, 72, 78, 85, 89, 94],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true
    }, {
      label: 'Baseline',
      data: [60, 65, 70, 75, 80, 85],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.1,
      fill: false
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Performance Trend Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Performance Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time Period'
        }
      }
    }
  }
}`;
  }

  private static generatePieChartJS(prompt: string): string {
    return `{
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
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Data Distribution Analysis'
      },
      legend: {
        position: 'bottom'
      }
    }
  }
}`;
  }

  private static extractTitle(prompt: string): string {
    // Extract a meaningful title from the prompt
    const words = prompt.split(' ').slice(0, 5);
    return words.join(' ').replace(/[^\w\s]/gi, '').trim() || 'Generated Graph';
  }
}