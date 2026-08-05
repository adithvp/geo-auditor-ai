import asyncio
import httpx
import json
import uvicorn
import multiprocessing
import time
from backend.main import app

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8005, log_level="warning")

async def test_live_api():
    print("=" * 60)
    print("      GEO AUDITOR - FULL SYSTEM LIVE API INTEGRATION TEST      ")
    print("=" * 60)

    # 1. Start Server Process
    server_process = multiprocessing.Process(target=run_server, daemon=True)
    server_process.start()
    print("[1/5] Starting live FastAPI server on http://127.0.0.1:8005...")
    await asyncio.sleep(2.5)  # Wait for server startup

    async with httpx.AsyncClient(timeout=15.0) as client:
        # 2. Test GET /api/health
        print("\n[2/5] Testing GET /api/health...")
        try:
            health_res = await client.get("http://127.0.0.1:8005/api/health")
            print(f"Health Status Code: {health_res.status_code}")
            health_data = health_res.json()
            print(f"Health Payload: {json.dumps(health_data, indent=2)}")
            assert health_res.status_code == 200, "Health endpoint failed!"
            print(">>> GET /api/health PASSED ✓")
        except Exception as e:
            print(f"!!! Health Endpoint FAILED: {e}")
            server_process.terminate()
            return False

        # 3. Test POST /api/analyze with Real Website (Stripe)
        print("\n[3/5] Testing POST /api/analyze with 'stripe.com'...")
        try:
            req_body = {"url": "stripe.com"}
            analyze_res = await client.post("http://127.0.0.1:8005/api/analyze", json=req_body)
            print(f"Analyze Status Code: {analyze_res.status_code}")
            assert analyze_res.status_code == 200, f"Analyze endpoint returned status {analyze_res.status_code}"
            
            data = analyze_res.json()
            print(f"Domain Audited: {data.get('domain')}")
            print(f"Overall Score: {data.get('overall_score')}/100 (Grade {data.get('grade')})")
            print(f"Status Label: {data.get('status_label')}")
            print(f"Score Formula: {data.get('score_formula')}")
            print(f"Engine Used: {data.get('engine_used')}")
            print(f"Issues Count: {len(data.get('issues', []))}")
            
            # Verify Required Response Schema Keys
            required_keys = ["url", "domain", "overall_score", "grade", "score_formula", "breakdown", "meta", "summary", "issues"]
            for key in required_keys:
                assert key in data, f"Missing required response key: '{key}'"
                
            print(">>> POST /api/analyze ('stripe.com') PASSED ✓")
        except Exception as e:
            print(f"!!! POST /api/analyze FAILED: {e}")
            server_process.terminate()
            return False

        # 4. Test POST /api/analyze with Second Real Website (Vercel)
        print("\n[4/5] Testing POST /api/analyze with 'vercel.com'...")
        try:
            res_vercel = await client.post("http://127.0.0.1:8005/api/analyze", json={"url": "vercel.com"})
            assert res_vercel.status_code == 200
            data_vercel = res_vercel.json()
            print(f"Vercel Domain: {data_vercel.get('domain')}")
            print(f"Vercel Score: {data_vercel.get('overall_score')}/100")
            print(">>> POST /api/analyze ('vercel.com') PASSED ✓")
        except Exception as e:
            print(f"!!! Vercel Test FAILED: {e}")
            server_process.terminate()
            return False

        # 5. Test Error Handling with Empty URL
        print("\n[5/5] Testing POST /api/analyze with empty/invalid URL...")
        try:
            err_res = await client.post("http://127.0.0.1:8005/api/analyze", json={"url": ""})
            print(f"Error Response Status Code: {err_res.status_code}")
            assert err_res.status_code == 400, "Should return 400 Bad Request for empty URL"
            print(f"Error Detail: {err_res.json().get('detail')}")
            print(">>> Invalid URL Error Handling PASSED ✓")
        except Exception as e:
            print(f"!!! Error Handling Test FAILED: {e}")
            server_process.terminate()
            return False

    server_process.terminate()
    print("\n" + "=" * 60)
    print("      ALL LIVE API INTEGRATION TESTS PASSED SUCCESSFULLY!      ")
    print("=" * 60)
    return True

if __name__ == "__main__":
    asyncio.run(test_live_api())
