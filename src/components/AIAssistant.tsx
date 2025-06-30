import React, { useState } from 'react';
import { Bot, Loader2, Sparkles, RefreshCw, BookOpen, FileText } from 'lucide-react';
import { AIService } from '../services/aiService';

interface AIAssistantProps {
  onContentGenerated: (content: string) => void;
  context?: {
    thesisTitle: string;
    chapterIndex?: number;
    currentContent?: string;
  };
  type: 'chapter' | 'improve' | 'bibliography';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onContentGenerated, context, type }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() && type !== 'improve') return;
    
    setIsGenerating(true);
    setError('');

    try {
      let result = '';
      
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
          result = await AIService.generateBibliography(prompt, 5);
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
        return 'Describe what you want in this chapter (e.g., "Introduction to machine learning applications")';
      case 'improve':
        return 'AI will improve the current content';
      case 'bibliography':
        return 'Enter research topic for bibliography generation (e.g., "machine learning renewable energy")';
      default:
        return 'Enter your request...';
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'chapter':
        return 'Generate Chapter';
      case 'improve':
        return 'Improve Text';
      case 'bibliography':
        return 'Generate References';
      default:
        return 'Generate';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'chapter':
        return <BookOpen className="h-4 w-4" />;
      case 'improve':
        return <RefreshCw className="h-4 w-4" />;
      case 'bibliography':
        return <FileText className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="bg-purple-600 p-1.5 rounded-lg">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-purple-900">AI Assistant</span>
        <div className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          <Sparkles className="h-3 w-3" />
          <span>Free</span>
        </div>
      </div>

      {type !== 'improve' && (
        <div className="mb-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            disabled={isGenerating}
          />
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || (!prompt.trim() && type !== 'improve')}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              {getIcon()}
              <span>{getButtonText()}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </div>
      )}

      <div className="mt-3 text-xs text-purple-600">
        <p>✨ Powered by DeepSeek R1 - Free AI model via OpenRouter</p>
      </div>
    </div>
  );
};