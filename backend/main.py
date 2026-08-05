from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

print("[GEO Auditor] Backend loaded successfully")

from crawler import extract_site_data
from geo_engine import run_ai_evaluations, is_valid_openai_api_key
from scoring import calculate_geo_score

app = FastAPI(
    title="GEO Auditor API",
    description="Generative Engine Optimization (GEO) Website Auditor & AI Visibility Scoring Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuditRequest(BaseModel):
    url: str

@app.get("/")
@app.get("/api/health")
async def health_check():
    api_key = os.getenv("OPENAI_API_KEY")
    return {
        "status": "online",
        "service": "GEO Search Auditor API",
        "openai_configured": is_valid_openai_api_key(api_key)
    }

@app.post("/api/analyze")
async def analyze_website(req: AuditRequest):
    if not req.url or not req.url.strip():
        raise HTTPException(status_code=400, detail="Target URL cannot be empty")

    data = await extract_site_data(req.url.strip())
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])

    try:
        ai_results = await run_ai_evaluations(data)
    except Exception as e:
        is_debug = os.getenv("DEBUG", "False").lower() in ("true", "1", "t", "yes")
        if is_debug:
            raise HTTPException(status_code=500, detail=f"OpenAI Evaluation Error (DEBUG=True): {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    schema_points = 100 if data["has_schema"] else 0
    has_metadata = bool(data.get("title") and data.get("meta_description"))

    # Calculate 7-Point GEO Matrix Score
    scoring_result = calculate_geo_score(
        has_robots_txt=data.get("has_robots_txt", False),
        ai_bots_blocked=data.get("ai_bots_blocked", False),
        has_sitemap=data.get("has_sitemap", False),
        schema_score=schema_points,
        eeat_score=ai_results.get("eeat_score", 70),
        clarity_score=ai_results.get("clarity_score", 70),
        has_metadata=has_metadata,
        internal_links_count=data.get("internal_links_count", 0)
    )

    return {
        "url": data["url"],
        "domain": data.get("domain", ""),
        "title": data.get("title", ""),
        "meta_description": data.get("meta_description", ""),
        "overall_score": scoring_result["overall_score"],
        "grade": scoring_result["grade"],
        "status_label": scoring_result["status_label"],
        "score_formula": scoring_result["formula"],
        "is_mocked": ai_results.get("is_mocked", False),
        "engine_used": ai_results.get("engine_used", "7-Point GEO Engine"),
        "breakdown": {
            "clarity_score": ai_results.get("clarity_score", 70),
            "citation_score": ai_results.get("citation_score", 70),
            "schema_score": schema_points,
            "eeat_score": ai_results.get("eeat_score", 70),
            "robots_score": scoring_result["checks_breakdown"]["robots_txt"],
            "sitemap_score": scoring_result["checks_breakdown"]["sitemap"],
            "metadata_score": scoring_result["checks_breakdown"]["metadata_quality"],
            "internal_links_score": scoring_result["checks_breakdown"]["internal_links"]
        },
        "meta": {
            "has_robots_txt": data.get("has_robots_txt", False),
            "ai_bots_blocked": data.get("ai_bots_blocked", False),
            "has_sitemap": data.get("has_sitemap", False),
            "has_schema": data["has_schema"],
            "schema_count": data.get("schema_count", 0),
            "headings_count": len(data.get("headings", [])),
            "tables_count": data.get("tables_count", 0),
            "internal_links_count": data.get("internal_links_count", 0),
            "external_links_count": data.get("external_links_count", 0),
            "content_length": len(data.get("raw_text", ""))
        },
        "summary": ai_results.get("summary", ""),
        "qna_coverage": f"{ai_results.get('answered_questions_count', 3)}/{ai_results.get('total_questions', 5)}",
        "issues": ai_results.get("issues", [])
    }
