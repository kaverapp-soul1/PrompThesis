import React, { useState } from 'react';
import { Download, FileText, BookOpen, User, GraduationCap, Calendar, Building2, UserCheck, Loader2, CheckCircle, AlertCircle, Bot, Sparkles, Code, Eye } from 'lucide-react';
import { AIAssistant } from './components/AIAssistant';

interface ThesisData {
  title: string;
  author: string;
  university: string;
  degree: string;
  supervisor: string;
  year: string;
  chapters: Array<{
    title: string;
    content: string;
  }>;
  bibliography: string;
}

interface CompilationStatus {
  status: 'idle' | 'compiling' | 'success' | 'error';
  message: string;
  downloadUrl?: string;
  latexCode?: string;
}

function App() {
  const [thesisData, setThesisData] = useState<ThesisData>({
    title: "Machine Learning Applications in Renewable Energy Systems",
    author: "John Doe",
    university: "University of Technology",
    degree: "Master of Technology",
    supervisor: "Dr. Jane Smith",
    year: "2024",
    chapters: [
      {
        title: "Introduction",
        content: "This chapter introduces the research problem and objectives. The rapid growth of renewable energy systems has created new challenges in optimization and prediction that can be addressed through machine learning techniques."
      },
      {
        title: "Literature Review",
        content: "This chapter reviews existing literature on machine learning applications in renewable energy. Previous studies have shown promising results in wind power forecasting and solar energy optimization."
      },
      {
        title: "Methodology",
        content: "This chapter describes the methodology used in the research. We employed deep learning neural networks and ensemble methods to predict energy output from weather data."
      },
      {
        title: "Results and Analysis",
        content: "This chapter presents the results of our experiments. The proposed model achieved 95% accuracy in predicting solar energy output, outperforming traditional statistical methods."
      },
      {
        title: "Conclusion",
        content: "This chapter concludes the thesis with a summary of findings and future work. Our research demonstrates the potential of machine learning in optimizing renewable energy systems."
      }
    ],
    bibliography: `@article{smith2023ml,
  title={Machine Learning for Renewable Energy: A Comprehensive Review},
  author={Smith, Jane and Johnson, Bob},
  journal={Energy Systems Journal},
  volume={45},
  number={3},
  pages={123--145},
  year={2023},
  publisher={Academic Press}
}

@inproceedings{doe2022solar,
  title={Deep Learning Approaches for Solar Energy Prediction},
  author={Doe, John and Wilson, Alice},
  booktitle={International Conference on Renewable Energy},
  pages={67--78},
  year={2022},
  organization={IEEE}
}`
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'chapters' | 'bibliography' | 'preview'>('basic');
  const [compilationStatus, setCompilationStatus] = useState<CompilationStatus>({
    status: 'idle',
    message: ''
  });
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const updateThesisData = (field: keyof ThesisData, value: any) => {
    setThesisData(prev => ({ ...prev, [field]: value }));
  };

  const updateChapter = (index: number, field: 'title' | 'content', value: string) => {
    const newChapters = [...thesisData.chapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    updateThesisData('chapters', newChapters);
  };

  const addChapter = () => {
    if (thesisData.chapters.length < 6) {
      updateThesisData('chapters', [
        ...thesisData.chapters,
        { title: "New Chapter", content: "Chapter content goes here..." }
      ]);
    }
  };

  const removeChapter = (index: number) => {
    if (thesisData.chapters.length > 1) {
      const newChapters = thesisData.chapters.filter((_, i) => i !== index);
      updateThesisData('chapters', newChapters);
    }
  };

  const handleAIContentGenerated = (content: string, chapterIndex?: number) => {
    if (activeTab === 'chapters' && chapterIndex !== undefined) {
      updateChapter(chapterIndex, 'content', content);
    } else if (activeTab === 'bibliography') {
      updateThesisData('bibliography', content);
    }
    setShowAIAssistant(false);
  };

  const generateLatexFiles = () => {
    // Clean and escape special LaTeX characters
    const escapeLatex = (text: string) => {
      return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/[{}]/g, '\\$&')
        .replace(/[$]/g, '\\$')
        .replace(/[&%#^_~]/g, '\\$&')
        .replace(/\n\n/g, '\n\n\\par\n');
    };

    const cleanTitle = escapeLatex(thesisData.title);
    const cleanAuthor = escapeLatex(thesisData.author);
    const cleanUniversity = escapeLatex(thesisData.university);
    const cleanDegree = escapeLatex(thesisData.degree);
    const cleanSupervisor = escapeLatex(thesisData.supervisor);

    const mainTex = `\\documentclass[12pt,a4paper]{report}

% Essential packages
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\geometry{margin=1in}
\\usepackage{setspace}
\\doublespacing
\\usepackage{fancyhdr}
\\usepackage{graphicx}
\\usepackage{amsmath,amsthm,amssymb}
\\usepackage{listings}
\\usepackage{xcolor}
\\usepackage[style=ieee,backend=bibtex]{biblatex}
\\usepackage{hyperref}

% Bibliography setup
\\addbibresource{references.bib}

% Hyperref setup
\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,      
    urlcolor=cyan,
    citecolor=red,
    pdftitle={${cleanTitle}},
    pdfauthor={${cleanAuthor}}
}

% Header and footer setup
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[RO,LE]{\\thepage}
\\fancyhead[LO]{\\leftmark}
\\renewcommand{\\headrulewidth}{0.4pt}

% Title information
\\title{${cleanTitle}}
\\author{${cleanAuthor}}
\\date{${thesisData.year}}

% Theorem environments
\\newtheorem{theorem}{Theorem}[chapter]
\\newtheorem{lemma}[theorem]{Lemma}
\\newtheorem{definition}[theorem]{Definition}
\\newtheorem{corollary}[theorem]{Corollary}

\\begin{document}

% Title Page
\\begin{titlepage}
    \\centering
    \\vspace*{2cm}
    
    {\\Huge\\bfseries ${cleanTitle}\\par}
    \\vspace{2cm}
    
    {\\Large A thesis submitted in partial fulfillment\\par}
    {\\Large of the requirements for the degree of\\par}
    \\vspace{1cm}
    
    {\\Large\\bfseries ${cleanDegree}\\par}
    \\vspace{2cm}
    
    {\\large by\\par}
    {\\Large\\bfseries ${cleanAuthor}\\par}
    \\vspace{2cm}
    
    {\\large Under the supervision of\\par}
    {\\Large ${cleanSupervisor}\\par}
    \\vspace{2cm}
    
    {\\large ${cleanUniversity}\\par}
    {\\large ${thesisData.year}\\par}
    
    \\vfill
\\end{titlepage}

% Front matter
\\pagenumbering{roman}
\\setcounter{page}{2}

% Abstract
\\chapter*{Abstract}
\\addcontentsline{toc}{chapter}{Abstract}
This thesis presents research on ${cleanTitle.toLowerCase()}. The work contributes to the field by providing new insights and methodologies that advance our understanding of the subject matter.

\\vspace{1cm}
\\noindent\\textbf{Keywords:} thesis, research, academic work

\\newpage

% Table of Contents
\\tableofcontents
\\newpage

% List of Figures and Tables
\\listoffigures
\\addcontentsline{toc}{chapter}{List of Figures}
\\newpage

\\listoftables
\\addcontentsline{toc}{chapter}{List of Tables}
\\newpage

% Main content
\\pagenumbering{arabic}
\\setcounter{page}{1}

${thesisData.chapters.map((chapter, index) => {
      const cleanChapterTitle = escapeLatex(chapter.title);
      const cleanChapterContent = escapeLatex(chapter.content);

      return `\\chapter{${cleanChapterTitle}}
\\label{chap:${index + 1}}

${cleanChapterContent}

\\section{Overview}
This section provides an overview of the chapter content and its significance to the overall thesis.

\\section{Key Concepts}
This section introduces the key concepts and terminology used throughout the chapter.

% Sample equation
\\begin{equation}
\\label{eq:sample${index + 1}}
y = f(x) + \\epsilon
\\end{equation}

Where $y$ represents the output variable, $f(x)$ is the function of input $x$, and $\\epsilon$ is the error term.

% Sample figure placeholder
\\begin{figure}[htbp]
\\centering
\\fbox{\\parbox{0.8\\textwidth}{\\centering\\vspace{2cm}Figure ${index + 1}: Sample Figure\\\\(Replace with actual figure)\\vspace{2cm}}}
\\caption{Sample figure for Chapter ${index + 1}}
\\label{fig:sample${index + 1}}
\\end{figure}

% Sample table
\\begin{table}[htbp]
\\centering
\\begin{tabular}{|l|c|r|}
\\hline
\\textbf{Parameter} & \\textbf{Value} & \\textbf{Unit} \\\\
\\hline
Sample Parameter 1 & 10.5 & units \\\\
Sample Parameter 2 & 25.3 & units \\\\
Sample Parameter 3 & 8.7 & units \\\\
\\hline
\\end{tabular}
\\caption{Sample data table for Chapter ${index + 1}}
\\label{tab:sample${index + 1}}
\\end{table}

\\section{Summary}
This chapter has presented the key findings and contributions related to ${cleanChapterTitle.toLowerCase()}. The results demonstrate the importance of this work in the broader context of the thesis.

\\newpage`;
    }).join('\n')}

% Appendices
\\appendix
\\chapter{Additional Materials}
\\label{app:additional}

This appendix contains supplementary materials, additional data, and detailed calculations that support the main thesis content.

\\section{Supplementary Data}
Additional data and results that support the main findings.

\\section{Code Listings}
Sample code implementations and algorithms used in the research.

\\begin{lstlisting}[language=Python, caption=Sample Python Code]
# Sample code for demonstration
def sample_function(x, y):
    """
    A sample function for demonstration purposes
    """
    result = x * y + 10
    return result

# Usage example
output = sample_function(5, 3)
print(f"Result: {output}")
\\end{lstlisting}

% Bibliography
\\newpage
\\printbibliography[title=References]
\\addcontentsline{toc}{chapter}{References}

\\end{document}`;

    return {
      'main.tex': mainTex,
      'references.bib': thesisData.bibliography
    };
  };

  const compileLatex = async () => {
    setCompilationStatus({ status: 'compiling', message: 'Generating LaTeX files and compiling PDF...' });

    try {
      const files = generateLatexFiles();

      // Store the LaTeX code for preview
      setCompilationStatus(prev => ({ ...prev, latexCode: files['main.tex'] }));

      // Try multiple compilation services
      const compilationServices = [
        {
          name: 'LaTeX.Online',
          url: 'https://latex.ytotech.com/builds/sync',
          method: 'POST'
        },
        {
          name: 'LaTeXOnline.cc',
          url: 'https://latexonline.cc/compile',
          method: 'POST'
        }
      ];

      let compilationSuccess = false;
      let lastError = '';

      for (const service of compilationServices) {
        try {
          setCompilationStatus(prev => ({
            ...prev,
            message: `Trying ${service.name} compilation service...`
          }));

          const formData = new FormData();

          if (service.name === 'LaTeX.Online') {
            formData.append('compiler', 'pdflatex');
            formData.append('resources', new Blob([files['main.tex']], { type: 'text/plain' }), 'main.tex');
            formData.append('resources', new Blob([files['references.bib']], { type: 'text/plain' }), 'references.bib');
          } else {
            formData.append('compiler', 'pdflatex');
            formData.append('files[]', new Blob([files['main.tex']], { type: 'text/plain' }), 'main.tex');
            formData.append('files[]', new Blob([files['references.bib']], { type: 'text/plain' }), 'references.bib');
          }

          const response = await fetch(service.url, {
            method: service.method,
            body: formData,
            headers: {
              'Accept': 'application/pdf'
            }
          });

          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/pdf')) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);

              setCompilationStatus({
                status: 'success',
                message: `PDF compiled successfully using ${service.name}! Click to download your thesis.`,
                downloadUrl: url,
                latexCode: files['main.tex']
              });
              compilationSuccess = true;
              break;
            } else {
              throw new Error(`Invalid response type: ${contentType}`);
            }
          } else {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
        } catch (error) {
          lastError = error instanceof Error ? error.message : 'Unknown error';
          console.warn(`${service.name} failed:`, lastError);
          continue;
        }
      }

      if (!compilationSuccess) {
        throw new Error(`All compilation services failed. Last error: ${lastError}`);
      }

    } catch (error) {
      console.error('Compilation error:', error);
      setCompilationStatus({
        status: 'error',
        message: `Compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}. You can still download the LaTeX source files to compile manually.`,
        latexCode: generateLatexFiles()['main.tex']
      });
    }
  };

  const downloadFiles = () => {
    if (compilationStatus.downloadUrl) {
      const link = document.createElement('a');
      link.href = compilationStatus.downloadUrl;
      link.download = `${thesisData.title.replace(/[^a-zA-Z0-9]/g, '_')}_thesis.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadLatexSource = () => {
    const files = generateLatexFiles();

    // Create a zip-like structure by downloading individual files
    Object.entries(files).forEach(([filename, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">ThesisTemplate Builder</h1>
                <p className="text-slate-600">Professional LaTeX thesis generator with AI assistance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
              >
                <Bot className="h-4 w-4" />
                <span>AI Assistant</span>
                <div className="flex items-center space-x-1 text-xs bg-purple-500 px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  <span>Free</span>
                </div>
              </button>
              <button
                onClick={compileLatex}
                disabled={compilationStatus.status === 'compiling'}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {compilationStatus.status === 'compiling' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    <span>Generate PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeTab === 'basic'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <User className="inline-block h-4 w-4 mr-2" />
                  Basic Information
                </button>
                <button
                  onClick={() => setActiveTab('chapters')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeTab === 'chapters'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <BookOpen className="inline-block h-4 w-4 mr-2" />
                  Chapters
                </button>
                <button
                  onClick={() => setActiveTab('bibliography')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeTab === 'bibliography'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <FileText className="inline-block h-4 w-4 mr-2" />
                  Bibliography
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeTab === 'preview'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <Eye className="inline-block h-4 w-4 mr-2" />
                  Preview
                </button>
              </div>

              <div className="p-8">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Thesis Title
                        </label>
                        <input
                          type="text"
                          value={thesisData.title}
                          onChange={(e) => updateThesisData('title', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Enter your thesis title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={thesisData.author}
                          onChange={(e) => updateThesisData('author', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          University/Institution
                        </label>
                        <input
                          type="text"
                          value={thesisData.university}
                          onChange={(e) => updateThesisData('university', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Institution name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Degree Program
                        </label>
                        <select
                          value={thesisData.degree}
                          onChange={(e) => updateThesisData('degree', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                          <option value="Bachelor of Technology">Bachelor of Technology</option>
                          <option value="Bachelor of Science">Bachelor of Science</option>
                          <option value="Master of Technology">Master of Technology</option>
                          <option value="Master of Science">Master of Science</option>
                          <option value="Master of Business Administration">Master of Business Administration</option>
                          <option value="Doctor of Philosophy">Doctor of Philosophy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Supervisor/Guide
                        </label>
                        <input
                          type="text"
                          value={thesisData.supervisor}
                          onChange={(e) => updateThesisData('supervisor', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Supervisor's name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Year
                        </label>
                        <input
                          type="text"
                          value={thesisData.year}
                          onChange={(e) => updateThesisData('year', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="2024"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'chapters' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-slate-900">Thesis Chapters</h3>
                      <button
                        onClick={addChapter}
                        disabled={thesisData.chapters.length >= 6}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Add Chapter
                      </button>
                    </div>

                    {thesisData.chapters.map((chapter, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-md font-medium text-slate-900">Chapter {index + 1}</h4>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setActiveChapterIndex(index);
                                setShowAIAssistant(true);
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors duration-200"
                            >
                              <Bot className="h-3 w-3" />
                              <span>AI Generate</span>
                            </button>
                            {thesisData.chapters.length > 1 && (
                              <button
                                onClick={() => removeChapter(index)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => updateChapter(index, 'title', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            placeholder="Chapter title"
                          />
                          <div className="relative">
                            <textarea
                              value={chapter.content}
                              onChange={(e) => updateChapter(index, 'content', e.target.value)}
                              rows={4}
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical"
                              placeholder="Chapter content and abstract"
                            />
                            <button
                              onClick={() => {
                                setActiveChapterIndex(index);
                                setShowAIAssistant(true);
                              }}
                              className="absolute top-2 right-2 bg-purple-100 hover:bg-purple-200 text-purple-700 p-1 rounded transition-colors duration-200"
                              title="Improve with AI"
                            >
                              <Sparkles className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'bibliography' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-semibold text-slate-700">
                        Bibliography (BibTeX format)
                      </label>
                      <button
                        onClick={() => setShowAIAssistant(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
                      >
                        <Bot className="h-3 w-3" />
                        <span>AI Generate</span>
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        value={thesisData.bibliography}
                        onChange={(e) => updateThesisData('bibliography', e.target.value)}
                        rows={12}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 font-mono text-sm resize-vertical"
                        placeholder="@article{author2023title,
  title={Article Title},
  author={Author Name},
  journal={Journal Name},
  year={2023}
}"
                      />
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">BibTeX Help</h4>
                      <p className="text-blue-800 text-sm">
                        Add your references in BibTeX format. Each entry should start with @ followed by the type (article, book, inproceedings, etc.).
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-slate-900">LaTeX Source Preview</h3>
                      <button
                        onClick={downloadLatexSource}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Source</span>
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                        {generateLatexFiles()['main.tex']}
                      </pre>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-medium text-amber-900 mb-2">Manual Compilation Instructions</h4>
                      <div className="text-amber-800 text-sm space-y-2">
                        <p>If PDF compilation fails, you can compile manually:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-4">
                          <li>Download the source files using the button above</li>
                          <li>Install LaTeX (TeX Live, MiKTeX, or MacTeX)</li>
                          <li>Run: <code className="bg-amber-100 px-1 rounded">pdflatex main.tex</code></li>
                          <li>Run: <code className="bg-amber-100 px-1 rounded">bibtex main</code></li>
                          <li>Run: <code className="bg-amber-100 px-1 rounded">pdflatex main.tex</code> (twice)</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant Panel */}
            {showAIAssistant && (
              <AIAssistant
                type={activeTab === 'chapters' ? 'chapter' : activeTab === 'bibliography' ? 'bibliography' : 'chapter'}
                context={{
                  thesisTitle: thesisData.title,
                  chapterIndex: activeChapterIndex || undefined,
                  currentContent: activeChapterIndex !== null ? thesisData.chapters[activeChapterIndex]?.content : undefined
                }}
                onContentGenerated={(content) => handleAIContentGenerated(content, activeChapterIndex || undefined)}
              />
            )}

            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Compilation Status</h3>
              <div className="space-y-4">
                {compilationStatus.status === 'idle' && (
                  <div className="flex items-center space-x-3 text-slate-600">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-sm">Ready to compile</span>
                  </div>
                )}
                {compilationStatus.status === 'compiling' && (
                  <div className="flex items-center space-x-3 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{compilationStatus.message}</span>
                  </div>
                )}
                {compilationStatus.status === 'success' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">{compilationStatus.message}</span>
                    </div>
                    <button
                      onClick={downloadFiles}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                )}
                {compilationStatus.status === 'error' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 text-red-600">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{compilationStatus.message}</span>
                    </div>
                    <button
                      onClick={downloadLatexSource}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
                    >
                      <Code className="h-4 w-4" />
                      <span>Download LaTeX Source</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Template Features</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Professional title page</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Table of contents & lists</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Proper chapter formatting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Figures & tables support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Mathematical equations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Bibliography integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Academic page layout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>AI-powered content generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>LaTeX source download</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Chapters</span>
                  <span className="font-bold">{thesisData.chapters.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">References</span>
                  <span className="font-bold">{thesisData.bibliography.split('@').length - 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Word Count</span>
                  <span className="font-bold">
                    {thesisData.chapters.reduce((acc, chapter) => acc + chapter.content.split(' ').length, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;