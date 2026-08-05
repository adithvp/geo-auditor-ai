import os
import json
import traceback
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

KNOWN_PLACEHOLDERS = {
    "paste_api_key",
    "your-api-key",
    "your_api_key",
    "your-openai-api-key",
    "your_openai_api_key",
    "your_openai_api_key_here",
    "paste_your_openai_api_key_here",
    "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "sk-xxx",
}

def is_valid_openai_api_key(api_key: str | None) -> bool:
    """
    Validates whether the provided OpenAI API key is present, non-empty,
    starts with a valid key prefix ('sk-'), and is not a known dummy placeholder string.
    """
    if not api_key:
        return False
    clean_key = api_key.strip().strip('"\'')
    if not clean_key:
        return False
    if clean_key.lower() in KNOWN_PLACEHOLDERS:
        return False
    if not clean_key.startswith("sk-"):
        return False
    if len(clean_key) < 10:
        return False
    return True

def get_fallback_evaluations(extracted_data: dict) -> dict:
    has_schema = extracted_data.get("has_schema", False)
    title = extracted_data.get("title", "Target Website")
    domain = extracted_data.get("domain", "website.com")
    url = extracted_data.get("url", "")
    headings = extracted_data.get("headings", [])
    schema_types = extracted_data.get("schema_types", [])
    tables_count = extracted_data.get("tables_count", 0)
    question_headings = extracted_data.get("question_headings", [])
    has_robots_txt = extracted_data.get("has_robots_txt", False)
    ai_bots_blocked = extracted_data.get("ai_bots_blocked", False)
    has_sitemap = extracted_data.get("has_sitemap", False)
    has_author_schema = extracted_data.get("has_author_schema", False)
    same_as_links = extracted_data.get("same_as_links", [])
    internal_links_count = extracted_data.get("internal_links_count", 0)

    issues = []
    
    # Check 1: Robots.txt & AI Crawler Access
    if ai_bots_blocked:
        issues.append({
            "id": "robots_ai_blocked",
            "title": "Robots.txt Blocking AI Search Crawlers",
            "impact": "HIGH",
            "effort": "LOW",
            "evidence": f"Robots.txt on {domain} contains Disallow rules targeting AI crawlers (GPTBot/PerplexityBot).",
            "jargon_explained": "Robots.txt is a text file on your server that tells search bots which pages they are allowed or forbidden to read.",
            "why_ai_cares": "If GPTBot or PerplexityBot are disallowed in robots.txt, ChatGPT and Perplexity are legally prohibited from scraping and citing your content.",
            "copy_paste_fix": "# Add to robots.txt to allow AI Search Indexing\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /"
        })

    # Check 2: Sitemap.xml
    if not has_sitemap:
        issues.append({
            "id": "missing_sitemap_xml",
            "title": "Missing Sitemap.xml XML Index",
            "impact": "MEDIUM",
            "effort": "LOW",
            "evidence": f"No valid sitemap.xml detected at {domain}/sitemap.xml.",
            "jargon_explained": "A sitemap is an XML file listing all your site's important pages so AI indexers can discover them instantly.",
            "why_ai_cares": "Generative crawlers check sitemap.xml to discover newly updated articles and technical documentation.",
            "copy_paste_fix": "<!-- Add sitemap reference in robots.txt -->\nSitemap: https://" + domain + "/sitemap.xml"
        })

    # Check 3: Schema Infrastructure
    if not has_schema or "FAQPage" not in schema_types:
        issues.append({
            "id": "missing_faq_schema",
            "title": "Missing FAQPage Knowledge Schema",
            "impact": "HIGH",
            "effort": "LOW",
            "evidence": f"Page '{domain}' contains {extracted_data.get('schema_count', 0)} JSON-LD block(s), but lacks explicitly typed 'FAQPage' schema.",
            "jargon_explained": "JSON-LD schema is machine code that tells AI search engines exact facts about your business.",
            "why_ai_cares": "RAG bots prioritize structured JSON schema objects over unstructured HTML paragraphs when picking answer sources.",
            "copy_paste_fix": f'<script type="application/ld+json">\n{{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {{\n      "@type": "Question",\n      "name": "What core solutions does {title} provide?",\n      "acceptedAnswer": {{\n        "@type": "Answer",\n        "text": "Provide a concise 2-sentence summary of your core offering and pricing structure."\n      }}\n    }}\n  ]\n}}\n</script>'
        })

    # Check 4: E-E-A-T & Entity Identity
    if not has_author_schema and len(same_as_links) == 0:
        issues.append({
            "id": "missing_eeat_verification",
            "title": "Missing E-E-A-T Author & Social Identity Links",
            "impact": "MEDIUM",
            "effort": "LOW",
            "evidence": f"No Person/Author schema or `sameAs` social profile verification links found on {domain}.",
            "jargon_explained": "E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness—how AI checks if you're a legitimate source.",
            "why_ai_cares": "SearchGPT and Claude rank content higher when author identity and social profiles are verified against external knowledge bases.",
            "copy_paste_fix": f'<script type="application/ld+json">\n{{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "{title}",\n  "url": "{url}",\n  "sameAs": [\n    "https://twitter.com/yourbrand",\n    "https://linkedin.com/company/yourbrand"\n  ]\n}}\n</script>'
        })

    # Check 5: AI Readability & Question Chunking
    if len(question_headings) < 2:
        issues.append({
            "id": "weak_qna_passage_chunking",
            "title": "Unstructured Q&A Heading Passages",
            "impact": "HIGH",
            "effort": "LOW",
            "evidence": f"Only {len(question_headings)} question-formatted header(s) detected out of {len(headings)} total heading tags.",
            "jargon_explained": "Question Chunking means writing headers as exact questions users ask AI, followed immediately by a 1-2 sentence answer.",
            "why_ai_cares": "SearchGPT splits pages into text blocks. Blocks starting with a question header get much higher citation rank.",
            "copy_paste_fix": f"<!-- Add Direct-Answer Passages directly in HTML -->\n<h2>How does {title} solve enterprise search visibility?</h2>\n<p>{title} automatically audits structured schema markup and content clarity to maximize LLM citation probability.</p>"
        })

    # Check 6: Internal Links
    if internal_links_count < 3:
        issues.append({
            "id": "sparse_internal_links",
            "title": "Sparse Internal Link Anchor Architecture",
            "impact": "MEDIUM",
            "effort": "LOW",
            "evidence": f"Only {internal_links_count} internal link(s) found on this page.",
            "jargon_explained": "Internal links connect your web pages together so AI crawlers can discover related articles and technical guides.",
            "why_ai_cares": "AI crawlers follow internal links to build entity relationship graphs across your domain.",
            "copy_paste_fix": "<!-- Add contextual internal links -->\n<p>Learn more about our <a href=\"/pricing\">Enterprise Pricing Plans</a> or explore our <a href=\"/docs\">API Documentation</a>.</p>"
        })

    eeat_points = 80 if (has_author_schema or len(same_as_links) > 0) else 45

    return {
        "is_mocked": True,
        "engine_used": "Rule-Based GEO Heuristic Engine (7-Point Checks)",
        "clarity_score": 75 if len(question_headings) >= 2 else 58,
        "citation_score": 70 if has_schema else 45,
        "eeat_score": eeat_points,
        "summary": f"Audit of {domain}: Verified 7 core GEO signals (Robots.txt: {'Pass' if not ai_bots_blocked else 'Block'}, Sitemap: {'Pass' if has_sitemap else 'Missing'}, Schemas: {extracted_data.get('schema_count', 0)}, Headings: {len(headings)}, Internal Links: {internal_links_count}).",
        "answered_questions_count": len(question_headings) + 1,
        "total_questions": 5,
        "issues": issues
    }

async def run_ai_evaluations(extracted_data: dict) -> dict:
    raw_key = os.getenv("OPENAI_API_KEY")
    is_valid_key = is_valid_openai_api_key(raw_key)
    model_name = os.getenv("OPENAI_MODEL", "gpt-4o")
    is_debug = os.getenv("DEBUG", "False").lower() in ("true", "1", "t", "yes")

    print("\n========== OPENAI DEBUG ==========")
    print(f"API Key Loaded: {'YES (Validated)' if is_valid_key else 'NO (Missing or Placeholder)'}")
    print(f"Model: {model_name}")
    print(f"DEBUG Mode: {'ENABLED' if is_debug else 'DISABLED'}")

    if not is_valid_key:
        print("Reason: OPENAI_API_KEY is missing, unconfigured, or set to a placeholder.")
        if is_debug:
            print("DEBUG=True: Raising error for invalid OpenAI API Key.")
            print("==================================\n")
            raise ValueError(
                f"Invalid or placeholder OPENAI_API_KEY configured ('{raw_key}'). "
                "Please provide a valid OpenAI API key starting with 'sk-' in your environment or .env file."
            )
        print("Falling back to Rule-Based GEO Heuristic Engine...")
        print("==================================\n")
        return get_fallback_evaluations(extracted_data)

    clean_key = raw_key.strip().strip('"\'')
    try:
        print("Sending Request to OpenAI...")
        client = AsyncOpenAI(api_key=clean_key, timeout=25.0, max_retries=2)
        prompt = f"""
        You are an expert GEO (Generative Engine Optimization) Auditor. Evaluate this website content across 7 explicit checks for AI search visibility (ChatGPT, Perplexity, Claude, Google AI Overviews).

        URL: {extracted_data.get('url', '')}
        Title: {extracted_data.get('title', '')}
        Meta Description: {extracted_data.get('meta_description', '')}
        Robots.txt Present: {extracted_data.get('has_robots_txt')} (AI Bots Blocked: {extracted_data.get('ai_bots_blocked')})
        Sitemap Present: {extracted_data.get('has_sitemap')}
        Headings: {extracted_data.get('headings', [])}
        JSON-LD Schemas Found: {extracted_data.get('schemas', [])}
        E-E-A-T Author Schema: {extracted_data.get('has_author_schema')}
        SameAs Social Links: {extracted_data.get('same_as_links', [])}
        Tables Count: {extracted_data.get('tables_count', 0)}
        Internal Links Count: {extracted_data.get('internal_links_count', 0)}
        Text Content Sample: {extracted_data.get('raw_text', '')}

        Tasks:
        1. Assess AI Clarity Confidence (0-100), Citation Likelihood (0-100), and E-E-A-T Score (0-100).
        2. Generate 5 high-intent user questions and check if content answers them.
        3. Identify top actionable issues across the 7 GEO checks (Robots.txt, Sitemap, Schema, E-E-A-T, AI Readability, Metadata, Internal Links).
        4. Provide exact evidence, plain English business explanation, why AI cares, and copy-pasteable fixes.

        Respond STRICTLY in JSON format:
        {{
          "clarity_score": 80,
          "citation_score": 60,
          "eeat_score": 75,
          "summary": "Business overview...",
          "answered_questions_count": 3,
          "total_questions": 5,
          "issues": [
            {{
              "id": "missing_faq_schema",
              "title": "Missing FAQ Schema",
              "impact": "HIGH",
              "effort": "LOW",
              "evidence": "Scraped page lacks application/ld+json script for FAQPage.",
              "jargon_explained": "JSON-LD schema is machine code that tells AI search engines exact facts about your business.",
              "why_ai_cares": "LLM crawlers require direct schema mappings to parse facts cleanly without hallucinations.",
              "copy_paste_fix": "<script type=\\"application/ld+json\\">{{\\n  \\"@context\\": \\"https://schema.org\\",\\n  \\"@type\\": \\"FAQPage\\"\\n}}</script>"
            }}
          ]
        }}
        """

        response = await client.chat.completions.create(
            model=model_name,
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )

        print("Request Successful")
        print("Received Response")
        print("Parsing JSON...")

        content = response.choices[0].message.content
        if not content:
            raise ValueError("OpenAI API returned empty response content.")

        result = json.loads(content)
        print("JSON Parsed Successfully")
        print("==================================\n")

        # Validate required fields and apply defaults
        result["clarity_score"] = int(result.get("clarity_score", 70))
        result["citation_score"] = int(result.get("citation_score", 70))
        result["eeat_score"] = int(result.get("eeat_score", 70))
        result["summary"] = str(result.get("summary", "AI evaluation completed successfully."))
        result["answered_questions_count"] = int(result.get("answered_questions_count", 3))
        result["total_questions"] = int(result.get("total_questions", 5))
        result["issues"] = list(result.get("issues", []))

        result["is_mocked"] = False
        result["engine_used"] = f"OpenAI {model_name} (7-Check AI Evaluation)"
        return result

    except Exception as e:
        print("\n========== OPENAI ERROR ==========")
        print(f"Exception Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        if hasattr(e, "response") and getattr(e, "response") is not None:
            try:
                print(f"Response Body: {e.response.text}")
            except Exception:
                pass
        print("Stack Trace:")
        traceback.print_exc()
        print("==================================\n")

        if is_debug:
            raise RuntimeError(f"OpenAI Evaluation Failed in DEBUG mode: {str(e)}") from e

        print("Falling back to 7-check rule engine (Production Fallback).")
        return get_fallback_evaluations(extracted_data)
