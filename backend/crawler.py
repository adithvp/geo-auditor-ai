import httpx
from bs4 import BeautifulSoup
import json
from urllib.parse import urlparse, urljoin

async def extract_site_data(target_url: str) -> dict:
    if not target_url.startswith(("http://", "https://")):
        target_url = f"https://{target_url}"
        
    parsed_url = urlparse(target_url)
    domain = parsed_url.netloc
    base_scheme_domain = f"{parsed_url.scheme}://{domain}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 GEOAuditor/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }

    async with httpx.AsyncClient(timeout=12.0, follow_redirects=True, verify=False) as client:
        # 1. Fetch Main Page HTML
        try:
            res = await client.get(target_url, headers=headers)
            html = res.text
            status_code = res.status_code
        except Exception as e:
            return {"error": f"Failed to crawl URL ({target_url}): {str(e)}"}

        if status_code >= 400:
            return {"error": f"HTTP status {status_code} returned when fetching {target_url}"}

        # 2. Check Robots.txt for AI bots (GPTBot, PerplexityBot, ClaudeBot)
        robots_url = f"{base_scheme_domain}/robots.txt"
        has_robots_txt = False
        ai_bots_blocked = False
        try:
            robots_res = await client.get(robots_url, headers=headers)
            if robots_res.status_code == 200:
                has_robots_txt = True
                robots_txt = robots_res.text.lower()
                # Check for explicit disallow rules for AI crawlers
                for bot in ["gptbot", "perplexitybot", "claudebot", "google-extended"]:
                    if f"user-agent: {bot}" in robots_txt and "disallow: /" in robots_txt:
                        ai_bots_blocked = True
                        break
        except Exception:
            pass

        # 3. Check Sitemap.xml
        sitemap_url = f"{base_scheme_domain}/sitemap.xml"
        has_sitemap = False
        try:
            sitemap_res = await client.get(sitemap_url, headers=headers)
            if sitemap_res.status_code == 200 and ("xml" in sitemap_res.headers.get("content-type", "").lower() or "<urlset" in sitemap_res.text.lower() or "<sitemapindex" in sitemap_res.text.lower()):
                has_sitemap = True
        except Exception:
            pass

    soup = BeautifulSoup(html, "html.parser")
    
    # 4. Extract Schemas & Entity Types
    schemas = []
    schema_types = []
    has_author_schema = False
    same_as_links = []

    for script in soup.find_all("script", type="application/ld+json"):
        try:
            if script.string:
                parsed = json.loads(script.string.strip())
                schemas.append(parsed)
                
                # Check schema types & sameAs
                items = parsed if isinstance(parsed, list) else [parsed]
                for item in items:
                    if isinstance(item, dict):
                        stype = item.get("@type", "")
                        if isinstance(stype, list):
                            schema_types.extend(stype)
                        elif stype:
                            schema_types.append(stype)

                        if stype in ["Person", "Author"] or "author" in item:
                            has_author_schema = True

                        if "sameAs" in item:
                            s_as = item["sameAs"]
                            if isinstance(s_as, list):
                                same_as_links.extend(s_as)
                            elif isinstance(s_as, str):
                                same_as_links.append(s_as)
        except Exception:
            continue

    # 5. Metadata Extraction (Title, Meta Description, OG Tags, Canonical)
    meta_desc = ""
    desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
    if desc_tag and desc_tag.get("content"):
        meta_desc = desc_tag["content"].strip()

    og_title_tag = soup.find("meta", attrs={"property": "og:title"})
    og_title = og_title_tag["content"].strip() if og_title_tag and og_title_tag.get("content") else ""

    canonical_tag = soup.find("link", attrs={"rel": "canonical"})
    canonical_url = canonical_tag["href"].strip() if canonical_tag and canonical_tag.get("href") else ""

    title = soup.title.string.strip() if soup.title and soup.title.string else ""

    # 6. Headings & Question Anchors (AI Readability)
    headings = [h.get_text(strip=True) for h in soup.find_all(["h1", "h2", "h3"]) if h.get_text(strip=True)]
    question_headings = [h for h in headings if "?" in h or any(q in h.lower() for q in ["how", "what", "why", "where", "can", "is"])]
    
    tables_count = len(soup.find_all("table"))
    lists_count = len(soup.find_all(["ul", "ol"]))

    # 7. Internal Links Extraction
    internal_links = []
    external_links = []
    for a_tag in soup.find_all("a", href=True):
        href = a_tag["href"].strip()
        if not href or href.startswith(("#", "javascript:", "mailto:", "tel:")):
            continue
        full_link = urljoin(target_url, href)
        link_domain = urlparse(full_link).netloc
        if link_domain == domain:
            internal_links.append(full_link)
        else:
            external_links.append(full_link)

    # Extract readable body text snippet
    for element in soup(["script", "style", "nav", "footer", "header", "svg"]):
        element.extract()

    body_text = ' '.join([p.get_text(strip=True) for p in soup.find_all(['p', 'li', 'article', 'section']) if p.get_text(strip=True)])
    clean_raw_text = ' '.join(body_text.split())[:3500]

    return {
        "url": target_url,
        "domain": domain,
        "title": title,
        "meta_description": meta_desc,
        "og_title": og_title,
        "canonical_url": canonical_url,
        "has_robots_txt": has_robots_txt,
        "ai_bots_blocked": ai_bots_blocked,
        "has_sitemap": has_sitemap,
        "headings": headings[:15],
        "question_headings": question_headings[:5],
        "schemas": schemas,
        "schema_types": schema_types,
        "has_author_schema": has_author_schema,
        "same_as_links": same_as_links,
        "tables_count": tables_count,
        "lists_count": lists_count,
        "internal_links_count": len(internal_links),
        "external_links_count": len(external_links),
        "raw_text": clean_raw_text,
        "has_schema": len(schemas) > 0,
        "schema_count": len(schemas)
    }
