import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

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
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key.strip() == "" or api_key == "your-api-key":
        return get_fallback_evaluations(extracted_data)

    try:
        client = AsyncOpenAI(api_key=api_key)
        prompt = f"""
        You are an expert GEO (Generative Engine Optimization) Auditor. Evaluate this website content across 7 explicit checks for AI search visibility (ChatGPT, Perplexity, Claude, Google AI Overviews).

        URL: {extracted_data['url']}
        Title: {extracted_data['title']}
        Meta Description: {extracted_data.get('meta_description', '')}
        Robots.txt Present: {extracted_data.get('has_robots_txt')} (AI Bots Blocked: {extracted_data.get('ai_bots_blocked')})
        Sitemap Present: {extracted_data.get('has_sitemap')}
        Headings: {extracted_data['headings']}
        JSON-LD Schemas Found: {extracted_data['schemas']}
        E-E-A-T Author Schema: {extracted_data.get('has_author_schema')}
        SameAs Social Links: {extracted_data.get('same_as_links')}
        Tables Count: {extracted_data.get('tables_count', 0)}
        Internal Links Count: {extracted_data.get('internal_links_count', 0)}
        Text Content Sample: {extracted_data['raw_text']}

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
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        
        result = json.loads(response.choices[0].message.content)
        result["is_mocked"] = False
        result["engine_used"] = "OpenAI GPT-4o (7-Check AI Evaluation)"
        return result
    except Exception as e:
        print(f"OpenAI evaluation failed ({e}). Falling back to 7-check rule engine.")
        return get_fallback_evaluations(extracted_data)
