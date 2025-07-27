interface CodeExample {
  language: string;
  syntax: string;
  code: string;
}

interface RelatedConceptResponse {
  relatedConceptExplanation: string;
  relatedConceptInScenario: string;
}

interface ConceptResponse {
  explanation: string;
  scenarioApplication: string;
  codeExamples: CodeExample[];
  relatedConcepts: string[];
  visualDiagram: string;
}

export async function explainConcept(
  concept: string,
  scenario: string,
  apiKey: string
): Promise<ConceptResponse> {
  const prompt = `You are a senior software engineer assistant helping developers understand programming concepts in real-world use cases. Focus on promoting secure, ethical coding and clean code principles.

The user wants to understand: "${concept}"
In the context of: "${scenario}"

Return a JSON response with the following structure:
{
  "explanation": "A clear, beginner-friendly explanation of the concept",
  "scenarioApplication": "How the concept is used in the provided context",
  "codeExamples": [
    {
      "language": "Node.js (Express)",
      "syntax": "js",
      "code": "// Secure, well-structured code example with proper error handling, validation, and clean code principles. Include meaningful variable names, separation of concerns, and security best practices like input validation, proper error handling, and avoiding hardcoded secrets."
    },
    {
      "language": "Python (FastAPI)",
      "syntax": "python", 
      "code": "# Secure, well-structured code example following Python best practices, proper error handling, type hints, and security considerations."
    },
    {
      "language": "Java (Spring Boot)",
      "syntax": "java",
      "code": "// Secure, well-structured code example following Java best practices, proper exception handling, and clean code principles."
    }
  ],
  "relatedConcepts": ["Related concept 1", "Related concept 2", "Related concept 3"],
  "visualDiagram": "A Mermaid.js diagram that explains the concept in simple terms a 10-year-old could understand, showing the flow with simple nodes like User, Server, Database, etc."
}

CRITICAL REQUIREMENTS for code examples:
- Follow secure coding practices (no hardcoded secrets, proper input validation, error handling)
- Use meaningful variable and function names
- Apply separation of concerns and modular design
- Include proper error handling and validation
- Follow language-specific best practices and conventions
- Make code readable and maintainable
- Include security considerations relevant to the concept

Make sure the code examples are practical, working examples that demonstrate the concept in the given scenario while following best practices.

The visual diagram should be a valid Mermaid.js syntax diagram (sequenceDiagram, graph, or flowchart) that shows the concept flow in the scenario using simple terms.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful programming tutor. Always return valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI API');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

interface SmartComment {
  line: number;
  type: 'security' | 'improvement' | 'principle' | 'warning';
  message: string;
  principle?: string;
}

interface CodeBlockExplanation {
  blockType: string;
  intent: string;
  conditionExplanation?: string;
  bestPractices: string[];
  principles: string[];
  smartComments: SmartComment[];
}

interface WhyExplanation {
  approach: string;
  reasoning: string;
  tradeoffs: string[];
  alternatives: Array<{
    name: string;
    description: string;
    pros: string[];
    cons: string[];
  }>;
}

export async function explainCodeBlock(
  codeBlock: string,
  language: string,
  apiKey: string
): Promise<CodeBlockExplanation> {
  const prompt = `You are a senior software engineer and coding mentor. Analyze this ${language} code block and provide educational insights:

Code:
\`\`\`${language}
${codeBlock}
\`\`\`

Return a JSON response with:
{
  "blockType": "Brief description of what this code block is (e.g., 'if-else statement', 'try-catch block', 'function definition')",
  "intent": "What this code is trying to accomplish",
  "conditionExplanation": "If applicable, explain what happens in different conditions (true/false, success/error, etc.)",
  "bestPractices": ["List of best practices for writing this type of code"],
  "principles": ["Relevant coding principles like SOLID, DRY, KISS, etc."],
  "smartComments": [
    {
      "line": 1,
      "type": "security|improvement|principle|warning",
      "message": "Specific advice for this line",
      "principle": "Related principle if applicable"
    }
  ]
}

Focus on security, maintainability, and educational value. Provide practical, actionable advice.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful coding mentor focused on teaching best practices and security. Always return valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI API');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

export async function explainWhy(
  originalResponse: ConceptResponse,
  concept: string,
  scenario: string,
  apiKey: string
): Promise<WhyExplanation> {
  const prompt = `You are a senior software engineer explaining your decision-making process. The user asked about "${concept}" in the context of "${scenario}".

You provided this response: ${JSON.stringify(originalResponse)}

Explain WHY you made these choices:

Return a JSON response with:
{
  "approach": "Brief summary of the overall approach you took",
  "reasoning": "Why you chose this specific explanation and examples",
  "tradeoffs": ["List of trade-offs and assumptions you made"],
  "alternatives": [
    {
      "name": "Alternative approach name",
      "description": "Brief description",
      "pros": ["Advantages of this approach"],
      "cons": ["Disadvantages of this approach"]
    }
  ]
}

Be honest about limitations and provide educational insights into the decision-making process.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful coding mentor explaining your reasoning. Always return valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI API');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

export async function explainRelatedConcept(
  relatedConcept: string,
  originalConcept: string,
  scenario: string,
  apiKey: string
): Promise<RelatedConceptResponse> {
  const prompt = `You are a senior software engineer assistant. The user originally asked about "${originalConcept}" in the context of "${scenario}".

Now they want to understand the related concept: "${relatedConcept}"

Explain how "${relatedConcept}" relates to their original scenario "${scenario}" and how it could enhance or be relevant to their use case with "${originalConcept}".

Return a JSON response with:
{
  "relatedConceptExplanation": "Clear explanation of what ${relatedConcept} means",
  "relatedConceptInScenario": "How ${relatedConcept} would be relevant, useful, or enhance the ${scenario} scenario with ${originalConcept}"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful programming tutor. Always return valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI API');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}