import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export type AIModel = 
  | "deepseek/deepseek-r1-0528:free"
  | "deepseek/deepseek-r1-0528-qwen3-8b:free"
  | "mistralai/mistral-small-3.2-24b-instruct:free";

export interface AIRequest {
  prompt: string;
  context?: string;
  type: 'content' | 'improve' | 'latex' | 'bibliography' | 'structure' | 'diagram' | 'outline';
  model?: AIModel;
  complexity?: 'basic' | 'intermediate' | 'advanced';
}

export interface ThesisStructure {
  title: string;
  chapters: ChapterStructure[];
  totalPages: number;
  academicLevel: 'bachelor' | 'master' | 'phd';
}

export interface ChapterStructure {
  title: string;
  sections: string[];
  subsections: { [key: string]: string[] };
  estimatedPages: number;
  diagrams?: DiagramSpec[];
}

export interface DiagramSpec {
  type: 'flowchart' | 'architecture' | 'timeline' | 'conceptual' | 'methodology';
  title: string;
  description: string;
  tikzCode?: string;
}

export class AIService {
  private static getOptimalModel(type: AIRequest['type']): AIModel {
    const modelMapping = {
      'content': "deepseek/deepseek-r1-0528:free",
      'improve': "mistralai/mistral-small-3.2-24b-instruct:free",
      'latex': "deepseek/deepseek-r1-0528-qwen3-8b:free",
      'bibliography': "mistralai/mistral-small-3.2-24b-instruct:free",
      'structure': "deepseek/deepseek-r1-0528:free",
      'diagram': "deepseek/deepseek-r1-0528-qwen3-8b:free",
      'outline': "deepseek/deepseek-r1-0528:free"
    };
    // return modelMapping[type];
    return modelMapping[type] || "deepseek/deepseek-r1-0528:free"; // Default to a common model
  }

  static async generateContent(request: AIRequest): Promise<string> {
    try {
      const systemPrompts = {
        content: "You are an expert academic writing assistant. Generate comprehensive, well-structured scholarly content with proper citations, examples, and academic rigor. Use formal academic language appropriate for peer review.",
        improve: "You are a senior academic editor with expertise in scholarly writing. Enhance clarity, coherence, academic tone, and logical flow while preserving original meaning. Focus on precision and scholarly excellence.",
        latex: "You are a LaTeX expert specializing in academic documents. Generate clean, well-formatted LaTeX code with proper document structure, mathematical equations, figures, tables, and cross-references. Include TikZ diagrams when appropriate.",
        bibliography: "You are a bibliography specialist. Create properly formatted BibTeX entries following academic standards. Include DOI, proper capitalization, and complete bibliographic information.",
        structure: "You are a thesis structure expert. Create detailed, logical thesis outlines with proper academic hierarchy, estimated page counts, and comprehensive section breakdowns.",
        diagram: "You are a technical diagram specialist. Generate detailed TikZ/LaTeX code for academic diagrams including flowcharts, architectural diagrams, timelines, and conceptual frameworks.",
        outline: "You are an academic planning expert. Create detailed chapter outlines with learning objectives, key concepts, and logical progression suitable for thesis-level work."
      };

      const model = request.model || this.getOptimalModel(request.type);
      
      const completion = await client.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompts[request.type]
          },
          {
            role: "user",
            content: request.context ? 
              `Context: ${request.context}\n\nComplexity Level: ${request.complexity || 'intermediate'}\n\nRequest: ${request.prompt}` : 
              request.prompt
          }
        ],
        temperature: request.type === 'latex' || request.type === 'bibliography' ? 0.3 : 0.7,
        max_tokens: request.type === 'structure' || request.type === 'content' ? 4000 : 2000
      });

      return completion.choices[0]?.message?.content || "Unable to generate content. Please try again.";
    } catch (error) {
  console.error('AI Service Error:', error);
  throw new Error('Failed to generate AI content. Please check your connection and try again.');
}
  }

  static async generateThesisStructure(
    title: string, 
    field: string, 
    academicLevel: 'bachelor' | 'master' | 'phd' = 'master'
  ): Promise<ThesisStructure> {
    const prompt = `Create a comprehensive thesis structure for "${title}" in ${field} at ${academicLevel} level. 
    Include:
    - Detailed chapter breakdown with sections and subsections
    - Estimated page counts for each chapter
    - Suggested diagrams and figures for each chapter
    - Academic milestones and deliverables
    - Timeline considerations
    
    Format as a structured outline with clear hierarchy.`;

    const structureText = await this.generateContent({
      prompt,
      type: 'structure',
      complexity: academicLevel === 'phd' ? 'advanced' : academicLevel === 'master' ? 'intermediate' : 'basic'
    });

    // Parse the generated structure (simplified implementation)
    return this.parseThesisStructure(structureText, title, academicLevel);
  }

  private static parseThesisStructure(text: string, title: string, level: ThesisStructure['academicLevel']): ThesisStructure {
    // Simplified parsing - in practice, you'd implement robust parsing
    const defaultStructure: ThesisStructure = {
      title,
      academicLevel: level,
      totalPages: level === 'phd' ? 200 : level === 'master' ? 100 : 60,
      chapters: [
        {
          title: "Introduction",
          sections: ["Background", "Problem Statement", "Objectives", "Thesis Outline"],
          subsections: {
            "Background": ["Context", "Motivation"],
            "Problem Statement": ["Research Problem", "Research Questions"],
            "Objectives": ["Primary Objectives", "Secondary Objectives"]
          },
          estimatedPages: level === 'phd' ? 20 : 12,
          diagrams: [
            { type: 'conceptual', title: 'Research Framework', description: 'Overview of research approach' }
          ]
        },
        {
          title: "Literature Review",
          sections: ["Theoretical Foundation", "Related Work", "Research Gaps"],
          subsections: {
            "Theoretical Foundation": ["Core Theories", "Frameworks"],
            "Related Work": ["Recent Studies", "Comparative Analysis"],
            "Research Gaps": ["Identified Gaps", "Contribution Positioning"]
          },
          estimatedPages: level === 'phd' ? 40 : 25,
          diagrams: [
            { type: 'timeline', title: 'Literature Evolution', description: 'Timeline of key research developments' }
          ]
        }
      ]
    };
    
    return defaultStructure;
  }

  static async generateChapterContent(
    title: string, 
    thesisTitle: string, 
    chapterType: string,
    academicLevel: 'bachelor' | 'master' | 'phd' = 'master'
  ): Promise<string> {
    const complexityMap = {
      bachelor: 'basic',
      master: 'intermediate',
      phd: 'advanced'
    } as const;

    const prompts = {
      introduction: `Write a comprehensive introduction chapter for a ${academicLevel}-level thesis titled "${thesisTitle}". 
      Include: background with context and significance, clear problem statement with research questions, 
      specific objectives and hypotheses, scope and limitations, thesis structure overview, and contribution summary.
      Use formal academic language with proper citations and examples.`,
      
      literature: `Write an extensive literature review for "${thesisTitle}" at ${academicLevel} level. 
      Include: systematic review of relevant literature, theoretical frameworks, methodological approaches in the field,
      critical analysis of existing work, identification of research gaps, and positioning of current research.
      Organize thematically with proper academic citations.`,
      
      methodology: `Write a detailed methodology chapter for "${thesisTitle}" at ${academicLevel} level.
      Include: research paradigm and philosophy, research design and approach, data collection methods,
      sampling strategy, data analysis techniques, validity and reliability measures, ethical considerations,
      and limitations. Justify all methodological choices.`,
      
      results: `Write a comprehensive results and analysis chapter for "${thesisTitle}" at ${academicLevel} level.
      Include: presentation of findings, statistical analysis, interpretation of results, comparison with existing research,
      discussion of implications, and references to figures and tables. Maintain objectivity and academic rigor.`,
      
      conclusion: `Write a thorough conclusion chapter for "${thesisTitle}" at ${academicLevel} level.
      Include: summary of key findings, theoretical contributions, practical implications, limitations and challenges,
      recommendations for practice, suggestions for future research, and final reflections. Synthesize the entire work.`,
      
      default: `Write comprehensive academic content for a chapter titled "${title}" in a ${academicLevel}-level thesis about "${thesisTitle}".
      Ensure scholarly depth, proper structure, academic language, and appropriate complexity for the academic level.`
    };

    const chapterKey = chapterType.toLowerCase() as keyof typeof prompts;
    const prompt = prompts[chapterKey] || prompts.default;

    return this.generateContent({
      prompt,
      type: 'content',
      complexity: complexityMap[academicLevel]
    });
  }

  static async generateDiagram(spec: DiagramSpec, context?: string): Promise<string> {
    const prompt = `Generate TikZ/LaTeX code for a ${spec.type} diagram titled "${spec.title}".
    Description: ${spec.description}
    ${context ? `Context: ${context}` : ''}
    
    Requirements:
    - Use proper TikZ syntax with necessary packages
    - Include clear labels and annotations
    - Make it publication-ready for academic documents
    - Ensure proper spacing and professional appearance
    - Include positioning and styling commands`;

    return this.generateContent({
      prompt,
      type: 'diagram'
    });
  }

  static async generateLatexDocument(structure: ThesisStructure): Promise<string> {
    const prompt = `Generate a complete LaTeX thesis template for "${structure.title}" at ${structure.academicLevel} level.
    Include:
    - Proper document class and packages for thesis
    - Title page, abstract, acknowledgments, table of contents
    - Chapter structure: ${structure.chapters.map(ch => ch.title).join(', ')}
    - Bibliography setup with BibTeX
    - Appendices section
    - Proper formatting for academic standards
    - Figure and table environments
    - Cross-referencing setup
    
    Make it a complete, compilable LaTeX document.`;

    return this.generateContent({
      prompt,
      type: 'latex',
      complexity: 'advanced'
    });
  }

  static async improveText(text: string, focus?: 'clarity' | 'flow' | 'grammar' | 'academic-tone'): Promise<string> {
    const focusPrompt = focus ? ` Focus specifically on improving ${focus.replace('-', ' ')}.` : '';
    
    return this.generateContent({
      prompt: `Improve this academic text for better scholarly quality:

"${text}"

${focusPrompt} Maintain academic rigor while enhancing readability and precision.`,
      type: 'improve'
    });
  }

  static async generateBibliography(topic: string, count: number = 10, style: 'recent' | 'foundational' | 'mixed' = 'mixed'): Promise<string> {
    const stylePrompt = {
      recent: 'Focus on publications from the last 5 years',
      foundational: 'Include seminal works and foundational papers',
      mixed: 'Include a mix of recent work and foundational papers'
    };

    return this.generateContent({
      prompt: `Generate ${count} realistic, high-quality BibTeX entries for academic references related to "${topic}". 
      ${stylePrompt[style]}. Include:
      - Mix of journal articles, conference papers, books, and technical reports
      - Proper DOI and URL fields where applicable
      - Complete author names and affiliations
      - Accurate publication details
      - Relevant keywords and abstracts where appropriate`,
      type: 'bibliography'
    });
  }

  static async generateResearchOutline(topic: string, researchQuestions: string[], academicLevel: 'bachelor' | 'master' | 'phd'): Promise<string> {
    const prompt = `Create a detailed research outline for "${topic}" at ${academicLevel} level.
    Research Questions:
    ${researchQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
    
    Include:
    - Research methodology framework
    - Literature review strategy
    - Data collection approach
    - Analysis methodology
    - Timeline and milestones
    - Expected deliverables
    - Risk assessment and mitigation`;

    return this.generateContent({
      prompt,
      type: 'outline',
      complexity: academicLevel === 'phd' ? 'advanced' : academicLevel === 'master' ? 'intermediate' : 'basic'
    });
  }

  static async generateMultiModelContent(request: AIRequest): Promise<{model: AIModel, content: string}[]> {
    const models: AIModel[] = [
      "deepseek/deepseek-r1-0528:free",
      "deepseek/deepseek-r1-0528-qwen3-8b:free",
      "mistralai/mistral-small-3.2-24b-instruct:free"
    ];

    const results = await Promise.allSettled(
      models.map(async (model) => ({
        model,
        content: await this.generateContent({ ...request, model })
      }))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<{model: AIModel, content: string}> => 
        result.status === 'fulfilled')
      .map(result => result.value);
  }
}
export default AIService;