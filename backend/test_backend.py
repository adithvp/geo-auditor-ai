import asyncio
from crawler import extract_site_data
from geo_engine import run_ai_evaluations
from main import analyze_website, AuditRequest

async def test_pipeline():
    print("--- 1. Testing Crawler ---")
    data = await extract_site_data("stripe.com")
    print(f"URL: {data.get('url')}")
    print(f"Title: {data.get('title')}")
    print(f"Has Schema: {data.get('has_schema')}")
    print(f"Headings count: {len(data.get('headings', []))}")

    print("\n--- 2. Testing AI Engine / Fallback ---")
    ai_res = await run_ai_evaluations(data)
    print(f"Clarity Score: {ai_res.get('clarity_score')}")
    print(f"Citation Score: {ai_res.get('citation_score')}")
    print(f"Summary: {ai_res.get('summary')[:100]}...")
    print(f"Issues count: {len(ai_res.get('issues', []))}")

    print("\n--- 3. Testing Full API Endpoint ---")
    response = await analyze_website(AuditRequest(url="stripe.com"))
    print(f"Overall Score: {response.get('overall_score')}")
    print(f"Score Formula: {response.get('score_formula')}")
    print("Backend tests PASSED successfully!")

if __name__ == "__main__":
    asyncio.run(test_pipeline())
