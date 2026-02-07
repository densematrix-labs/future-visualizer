import httpx
from typing import Optional
from app.config import get_settings

settings = get_settings()


async def generate_future_vision(concept: str, language: str = "en") -> dict:
    """
    Call LLM to generate a vision of what a concept will look like in 10 years.
    
    Args:
        concept: The product/website/concept to visualize
        language: Target language for the response
        
    Returns:
        dict with title, summary, sections (technology, experience, society, wildcard)
    """
    
    language_prompts = {
        "en": "Respond in English.",
        "zh": "用中文回答。",
        "ja": "日本語で回答してください。",
        "de": "Antworte auf Deutsch.",
        "fr": "Répondez en français.",
        "ko": "한국어로 답변해 주세요.",
        "es": "Responde en español.",
    }
    
    lang_instruction = language_prompts.get(language, language_prompts["en"])
    
    system_prompt = f"""You are a futurist and technology analyst with deep expertise in predicting technological evolution.
Your task is to envision what a given product, website, or concept will look like in 10 years (around 2035-2036).

Be creative, imaginative, and grounded in current technological trends. Consider:
- AI integration and automation
- Hardware miniaturization and new form factors
- Social and cultural shifts
- Environmental and sustainability factors
- Economic and business model evolution

{lang_instruction}

Respond in valid JSON format with this structure:
{{
  "title": "A catchy headline about the future of [concept]",
  "year": 2036,
  "summary": "A 2-3 sentence overview of the transformation",
  "sections": {{
    "technology": {{
      "title": "Technology Evolution",
      "content": "3-4 paragraphs about technical changes"
    }},
    "experience": {{
      "title": "User Experience",
      "content": "3-4 paragraphs about how people will interact with it"
    }},
    "society": {{
      "title": "Social Impact",
      "content": "3-4 paragraphs about societal implications"
    }},
    "wildcard": {{
      "title": "The Unexpected",
      "content": "1-2 paragraphs with a surprising or unconventional prediction"
    }}
  }},
  "key_changes": ["change 1", "change 2", "change 3", "change 4", "change 5"]
}}"""

    user_prompt = f"Imagine what '{concept}' will look like in 10 years. Provide a detailed, creative, and insightful vision of its future evolution."

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{settings.llm_proxy_url}/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.llm_proxy_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gemini-2.5-flash",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "max_tokens": 4000,
                "temperature": 0.8,
            },
        )
        
        if response.status_code != 200:
            raise Exception(f"LLM API error: {response.status_code} - {response.text}")
        
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        
        # Parse JSON from response
        import json
        # Handle potential markdown code blocks
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        
        try:
            result = json.loads(content.strip())
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            result = {
                "title": f"The Future of {concept}",
                "year": 2036,
                "summary": content[:500],
                "sections": {
                    "technology": {"title": "Technology", "content": content},
                    "experience": {"title": "Experience", "content": ""},
                    "society": {"title": "Society", "content": ""},
                    "wildcard": {"title": "Wildcard", "content": ""},
                },
                "key_changes": [],
            }
        
        return result
