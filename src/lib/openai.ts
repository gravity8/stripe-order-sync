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
  const prompt = `You are a senior software engineer assistant helping developers understand programming concepts in real-world use cases.

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
      "code": "// Actual working code example"
    },
    {
      "language": "Python (FastAPI)",
      "syntax": "python", 
      "code": "# Actual working code example"
    },
    {
      "language": "Java (Spring Boot)",
      "syntax": "java",
      "code": "// Actual working code example"
    }
  ],
  "relatedConcepts": ["Related concept 1", "Related concept 2", "Related concept 3"],
  "visualDiagram": "A Mermaid.js diagram that explains the concept in simple terms a 10-year-old could understand, showing the flow with simple nodes like User, Server, Database, etc."
}

Make sure the code examples are practical, working examples that demonstrate the concept in the given scenario. Each code example should be complete and functional.

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