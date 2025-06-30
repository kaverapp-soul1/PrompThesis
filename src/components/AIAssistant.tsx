import React, { useState } from 'react';
import { Bot, Loader2, Sparkles, RefreshCw, BookOpen, FileText, Wand2, Target, Lightbulb, Zap, Brain, Rocket } from 'lucide-react';
import { AIService } from '../services/aiService';

interface AIAssistantProps {
  onContentGenerated: (content: string) => void;
  onThesisRewrite?: (newThesisData: any) => void;
  context?: {
    thesisTitle: string;
    chapterIndex?: number;
    currentContent?: string;
  };
  type: 'chapter' | 'improve' | 'bibliography' | 'dynamic';
}

interface QuickPrompt {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'topic' | 'structure' | 'content' | 'style';
  action: 'rewrite_thesis' | 'generate_chapters' | 'enhance_content' | 'create_bibliography';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  onContentGenerated, 
  onThesisRewrite,
  context, 
  type 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<'topic' | 'structure' | 'content' | 'style' | 'all'>('all');

  const quickPrompts: QuickPrompt[] = [
    {
      id: 'ai_ml_thesis',
      title: 'AI & Machine Learning',
      description: 'Transform thesis to focus on AI/ML applications',
      icon: <Brain className="h-4 w-4" />,
      category: 'topic',
      action: 'rewrite_thesis'
    },
    {
      id: 'renewable_energy',
      title: 'Renewable Energy',
      description: 'Shift focus to renewable energy systems',
      icon: <Zap className="h-4 w-4" />,
      category: 'topic',
      action: 'rewrite_thesis'
    },
    {
      id: 'blockchain_crypto',
      title: 'Blockchain & Crypto',
      description: 'Rewrite for blockchain technology focus',
      icon: <Target className="h-4 w-4" />,
      category: 'topic',
      action: 'rewrite_thesis'
    },
    {
      id: 'iot_smart_systems',
      title: 'IoT & Smart Systems',
      description: 'Transform to IoT and smart systems research',
      icon: <Rocket className="h-4 w-4" />,
      category: 'topic',
      action: 'rewrite_thesis'
    },
    {
      id: 'expand_chapters',
      title: 'Expand to 8 Chapters',
      description: 'Restructure thesis with comprehensive 8-chapter format',
      icon: <BookOpen className="h-4 w-4" />,
      category: 'structure',
      action: 'generate_chapters'
    },
    {
      id: 'phd_level',
      title: 'PhD-Level Depth',
      description: 'Enhance all content to PhD-level complexity',
      icon: <Wand2 className="h-4 w-4" />,
      category: 'content',
      action: 'enhance_content'
    },
    {
      id: 'modern_references',
      title: 'Latest References',
      description: 'Generate 20+ cutting-edge references (2023-2024)',
      icon: <FileText className="h-4 w-4" />,
      category: 'content',
      action: 'create_bibliography'
    },
    {
      id: 'academic_polish',
      title: 'Academic Polish',
      description: 'Enhance writing style for top-tier publication',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'style',
      action: 'enhance_content'
    }
  ];

  const filteredPrompts = activeCategory === 'all' 
    ? quickPrompts 
    : quickPrompts.filter(p => p.category === activeCategory);

  const handleQuickPrompt = async (quickPrompt: QuickPrompt) => {
    setIsGenerating(true);
    setError('');

    try {
      switch (quickPrompt.action) {
        case 'rewrite_thesis':
          await handleThesisRewrite(quickPrompt);
          break;
        case 'generate_chapters':
          await handleChapterGeneration(quickPrompt);
          break;
        case 'enhance_content':
          await handleContentEnhancement(quickPrompt);
          break;
        case 'create_bibliography':
          await handleBibliographyGeneration(quickPrompt);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleThesisRewrite = async (quickPrompt: QuickPrompt) => {
    const topicMappings = {
      'ai_ml_thesis': {
        title: 'Advanced Machine Learning Applications in Predictive Analytics',
        field: 'Artificial Intelligence and Machine Learning',
        chapters: [
          { title: 'Introduction to Machine Learning in Modern Applications', content: 'This chapter introduces the fundamental concepts of machine learning and its transformative impact on predictive analytics across various industries.' },
          { title: 'Literature Review: ML Algorithms and Predictive Models', content: 'Comprehensive review of state-of-the-art machine learning algorithms, deep learning architectures, and their applications in predictive modeling.' },
          { title: 'Methodology: Advanced ML Framework Design', content: 'Detailed methodology for developing robust machine learning frameworks, including data preprocessing, feature engineering, and model selection strategies.' },
          { title: 'Implementation: Deep Learning Architecture', content: 'Implementation details of the proposed deep learning architecture, including neural network design, training procedures, and optimization techniques.' },
          { title: 'Results: Performance Analysis and Validation', content: 'Comprehensive analysis of experimental results, performance metrics, statistical validation, and comparison with baseline models.' },
          { title: 'Discussion: Implications and Future Directions', content: 'Critical discussion of findings, practical implications, limitations, and recommendations for future research in ML applications.' },
          { title: 'Conclusion and Contributions', content: 'Summary of key contributions, theoretical and practical implications, and the significance of the research in advancing machine learning applications.' }
        ]
      },
      'renewable_energy': {
        title: 'Smart Grid Integration of Renewable Energy Systems: Optimization and Control',
        field: 'Renewable Energy and Smart Grid Technology',
        chapters: [
          { title: 'Introduction to Smart Grid and Renewable Integration', content: 'Introduction to smart grid technologies and the challenges of integrating renewable energy sources into modern electrical grids.' },
          { title: 'Literature Review: Renewable Energy Grid Integration', content: 'Comprehensive review of renewable energy integration techniques, smart grid technologies, and optimization strategies for grid stability.' },
          { title: 'Methodology: Optimization Framework for Grid Integration', content: 'Development of optimization algorithms and control strategies for efficient renewable energy integration in smart grid systems.' },
          { title: 'System Design: Smart Grid Architecture', content: 'Detailed design of smart grid architecture incorporating renewable energy sources, energy storage systems, and intelligent control mechanisms.' },
          { title: 'Simulation and Analysis: Performance Evaluation', content: 'Simulation results and performance analysis of the proposed smart grid system under various renewable energy scenarios.' },
          { title: 'Case Study: Real-world Implementation', content: 'Case study analysis of real-world smart grid implementations and validation of proposed optimization strategies.' },
          { title: 'Conclusion and Future Smart Grid Development', content: 'Conclusions on smart grid optimization and future directions for renewable energy integration technologies.' }
        ]
      },
      'blockchain_crypto': {
        title: 'Blockchain Technology for Secure Decentralized Systems: Architecture and Applications',
        field: 'Blockchain Technology and Cryptography',
        chapters: [
          { title: 'Introduction to Blockchain and Decentralized Systems', content: 'Introduction to blockchain technology, distributed ledger systems, and the paradigm shift towards decentralized architectures.' },
          { title: 'Literature Review: Blockchain Protocols and Consensus Mechanisms', content: 'Comprehensive review of blockchain protocols, consensus algorithms, cryptographic techniques, and security considerations.' },
          { title: 'Methodology: Secure Blockchain Architecture Design', content: 'Methodology for designing secure and scalable blockchain architectures with enhanced privacy and performance characteristics.' },
          { title: 'Implementation: Smart Contract Development', content: 'Implementation of smart contracts, decentralized applications (DApps), and blockchain-based security protocols.' },
          { title: 'Security Analysis: Cryptographic Validation', content: 'Security analysis, cryptographic validation, and vulnerability assessment of the proposed blockchain system.' },
          { title: 'Performance Evaluation: Scalability and Efficiency', content: 'Performance evaluation focusing on transaction throughput, scalability, energy efficiency, and network consensus.' },
          { title: 'Conclusion and Blockchain Future', content: 'Conclusions on blockchain technology advancement and future directions for decentralized system development.' }
        ]
      },
      'iot_smart_systems': {
        title: 'Internet of Things (IoT) for Smart City Infrastructure: Design and Implementation',
        field: 'Internet of Things and Smart Systems',
        chapters: [
          { title: 'Introduction to IoT and Smart City Concepts', content: 'Introduction to Internet of Things technology and its application in developing intelligent smart city infrastructure.' },
          { title: 'Literature Review: IoT Architectures and Smart City Solutions', content: 'Comprehensive review of IoT architectures, sensor networks, communication protocols, and existing smart city implementations.' },
          { title: 'Methodology: IoT System Design for Smart Cities', content: 'Methodology for designing scalable IoT systems for smart city applications including sensor deployment and data management.' },
          { title: 'Implementation: Smart Infrastructure Development', content: 'Implementation of IoT-based smart infrastructure including traffic management, environmental monitoring, and energy optimization.' },
          { title: 'Data Analytics: IoT Big Data Processing', content: 'Big data analytics for IoT systems, real-time data processing, and intelligent decision-making algorithms for smart cities.' },
          { title: 'Case Studies: Smart City Deployments', content: 'Case studies of successful smart city IoT deployments and analysis of their impact on urban efficiency and sustainability.' },
          { title: 'Conclusion and Smart City Future', content: 'Conclusions on IoT-enabled smart cities and future directions for intelligent urban infrastructure development.' }
        ]
      }
    };

    const newThesisData = topicMappings[quickPrompt.id as keyof typeof topicMappings];
    if (newThesisData && onThesisRewrite) {
      // Generate enhanced bibliography for the new topic
      const bibliography = await AIService.generateBibliography(newThesisData.field, 15, 'mixed');
      
      onThesisRewrite({
        title: newThesisData.title,
        chapters: newThesisData.chapters,
        bibliography: bibliography
      });
    }
  };

  const handleChapterGeneration = async (quickPrompt: QuickPrompt) => {
    if (quickPrompt.id === 'expand_chapters') {
      const expandedChapters = [
        { title: 'Introduction and Background', content: 'Comprehensive introduction with detailed background, motivation, and research context.' },
        { title: 'Literature Review and Theoretical Framework', content: 'Extensive literature review covering theoretical foundations and current state of research.' },
        { title: 'Research Methodology and Design', content: 'Detailed research methodology, experimental design, and theoretical framework development.' },
        { title: 'System Architecture and Design', content: 'Comprehensive system architecture, design principles, and technical specifications.' },
        { title: 'Implementation and Development', content: 'Detailed implementation process, development methodologies, and technical challenges.' },
        { title: 'Experimental Results and Analysis', content: 'Comprehensive experimental results, statistical analysis, and performance evaluation.' },
        { title: 'Discussion and Implications', content: 'Critical discussion of results, theoretical implications, and practical applications.' },
        { title: 'Conclusion and Future Work', content: 'Comprehensive conclusions, contributions summary, and detailed future research directions.' }
      ];

      if (onThesisRewrite) {
        onThesisRewrite({ chapters: expandedChapters });
      }
    }
  };

  const handleContentEnhancement = async (quickPrompt: QuickPrompt) => {
    if (quickPrompt.id === 'phd_level' && context?.currentContent) {
      const enhancedContent = await AIService.improveText(
        context.currentContent,
        'academic-tone'
      );
      onContentGenerated(enhancedContent);
    } else if (quickPrompt.id === 'academic_polish' && context?.currentContent) {
      const polishedContent = await AIService.improveText(
        context.currentContent,
        'clarity'
      );
      onContentGenerated(polishedContent);
    }
  };

  const handleBibliographyGeneration = async (quickPrompt: QuickPrompt) => {
    if (quickPrompt.id === 'modern_references') {
      const modernBibliography = await AIService.generateBibliography(
        context?.thesisTitle || 'advanced technology research',
        20,
        'recent'
      );
      onContentGenerated(modernBibliography);
    }
  };

  const handleCustomGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');

    try {
      let result = '';
      
      // Detect if user wants to rewrite entire thesis
      if (prompt.toLowerCase().includes('rewrite') || prompt.toLowerCase().includes('change topic')) {
        const newContent = await AIService.generateChapterContent(
          prompt,
          context?.thesisTitle || '',
          'default'
        );
        
        // If it's a topic change, generate new structure
        if (prompt.toLowerCase().includes('topic') || prompt.toLowerCase().includes('field')) {
          const newTitle = await AIService.generateContent({
            prompt: `Generate a professional thesis title for: ${prompt}`,
            type: 'content'
          });
          
          if (onThesisRewrite) {
            onThesisRewrite({
              title: newTitle.trim(),
              chapters: [
                { title: 'Introduction', content: newContent },
                { title: 'Literature Review', content: 'Updated literature review content...' },
                { title: 'Methodology', content: 'Updated methodology content...' },
                { title: 'Results', content: 'Updated results content...' },
                { title: 'Conclusion', content: 'Updated conclusion content...' }
              ]
            });
            setPrompt('');
            return;
          }
        }
      }
      
      // Regular content generation
      switch (type) {
        case 'chapter':
          result = await AIService.generateChapterContent(
            prompt,
            context?.thesisTitle || '',
            prompt.toLowerCase().includes('introduction') ? 'introduction' :
            prompt.toLowerCase().includes('literature') ? 'literature' :
            prompt.toLowerCase().includes('methodology') ? 'methodology' :
            prompt.toLowerCase().includes('result') ? 'results' :
            prompt.toLowerCase().includes('conclusion') ? 'conclusion' : 'default'
          );
          break;
        case 'improve':
          if (context?.currentContent) {
            result = await AIService.improveText(context.currentContent);
          }
          break;
        case 'bibliography':
          result = await AIService.generateBibliography(prompt, 10);
          break;
        case 'dynamic':
          result = await AIService.generateContent({
            prompt: prompt,
            type: 'content',
            context: `Thesis: ${context?.thesisTitle || ''}`
          });
          break;
      }

      onContentGenerated(result);
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'chapter':
        return 'Describe chapter content or type "change topic to [new topic]" to rewrite thesis';
      case 'improve':
        return 'AI will improve the current content';
      case 'bibliography':
        return 'Enter research topic or type "modern references for [topic]"';
      case 'dynamic':
        return 'Type anything: rewrite thesis, change topic, enhance content, generate chapters...';
      default:
        return 'Enter your request...';
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: <Sparkles className="h-3 w-3" /> },
    { id: 'topic', label: 'Topics', icon: <Target className="h-3 w-3" /> },
    { id: 'structure', label: 'Structure', icon: <BookOpen className="h-3 w-3" /> },
    { id: 'content', label: 'Content', icon: <FileText className="h-3 w-3" /> },
    { id: 'style', label: 'Style', icon: <Wand2 className="h-3 w-3" /> }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-semibold text-purple-900">Dynamic AI Assistant</span>
            <div className="flex items-center space-x-1 text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              <span>One-Click Rewrite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as any)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeCategory === category.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            {category.icon}
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Action Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {filteredPrompts.map((quickPrompt) => (
          <button
            key={quickPrompt.id}
            onClick={() => handleQuickPrompt(quickPrompt)}
            disabled={isGenerating}
            className="group bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 border border-purple-200 hover:border-purple-300 rounded-lg p-3 text-left transition-all duration-200 hover:shadow-md disabled:opacity-50"
          >
            <div className="flex items-start space-x-3">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200 p-2 rounded-lg transition-colors duration-200">
                {quickPrompt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-purple-900 text-sm group-hover:text-purple-700 transition-colors duration-200">
                  {quickPrompt.title}
                </h4>
                <p className="text-xs text-purple-600 mt-1 line-clamp-2">
                  {quickPrompt.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Prompt Input */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white/80 backdrop-blur-sm"
            disabled={isGenerating}
            onKeyPress={(e) => e.key === 'Enter' && handleCustomGenerate()}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Lightbulb className="h-4 w-4 text-purple-400" />
          </div>
        </div>

        <button
          onClick={handleCustomGenerate}
          disabled={isGenerating || (!prompt.trim() && type !== 'improve')}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-400 disabled:to-blue-400 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              <span>Generate with AI</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-purple-600 bg-white/50 rounded-lg p-3 border border-purple-100">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-3 w-3" />
          <span className="font-medium">Powered by DeepSeek R1 & Advanced Models</span>
        </div>
        <p className="text-purple-500">
          ✨ One-click thesis transformation • 🎯 Smart topic detection • 🚀 Instant content generation
        </p>
      </div>
    </div>
  );
};