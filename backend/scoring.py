"""
Scoring Module: Transparent 7-Point GEO Matrix Calculation
Defends against magic numbers by evaluating 7 distinct GEO checks.
"""

def calculate_geo_score(
    has_robots_txt: bool,
    ai_bots_blocked: bool,
    has_sitemap: bool,
    schema_score: int,
    eeat_score: int,
    clarity_score: int,
    has_metadata: bool,
    internal_links_count: int
) -> dict:
    """
    Calculates overall GEO Health Score (0-100) using 7 explicit checks:
    1. Robots.txt AI Bot Access (15%)
    2. Sitemap.xml Availability (10%)
    3. JSON-LD Schema Infrastructure (25%)
    4. E-E-A-T & Entity Authority (15%)
    5. AI Readability & Passage Chunking (15%)
    6. Metadata Quality (10%)
    7. Internal Linking Architecture (10%)
    """
    # 1. Robots.txt score
    if ai_bots_blocked:
        s_robots = 0
    elif has_robots_txt:
        s_robots = 100
    else:
        s_robots = 60  # Robots.txt missing, but bots not explicitly blocked

    # 2. Sitemap score
    s_sitemap = 100 if has_sitemap else 30

    # 3. Schema score
    s_schema = max(0, min(100, schema_score))

    # 4. E-E-A-T score
    s_eeat = max(0, min(100, eeat_score))

    # 5. AI Readability score
    s_readability = max(0, min(100, clarity_score))

    # 6. Metadata score
    s_meta = 100 if has_metadata else 40

    # 7. Internal links score
    if internal_links_count >= 10:
        s_links = 100
    elif internal_links_count >= 3:
        s_links = 75
    elif internal_links_count >= 1:
        s_links = 50
    else:
        s_links = 20

    w_robots = 0.15
    w_sitemap = 0.10
    w_schema = 0.25
    w_eeat = 0.15
    w_readability = 0.15
    w_meta = 0.10
    w_links = 0.10

    overall = round(
        (s_robots * w_robots) +
        (s_sitemap * w_sitemap) +
        (s_schema * w_schema) +
        (s_eeat * w_eeat) +
        (s_readability * w_readability) +
        (s_meta * w_meta) +
        (s_links * w_links)
    )

    if overall >= 80:
        status_label = "Optimal AI Visibility"
        summary_grade = "A"
    elif overall >= 60:
        status_label = "Moderate AI Indexation"
        summary_grade = "B"
    elif overall >= 40:
        status_label = "Low AI Citation Rank"
        summary_grade = "C"
    else:
        status_label = "Invisible to AI Search"
        summary_grade = "D"

    return {
        "overall_score": overall,
        "grade": summary_grade,
        "status_label": status_label,
        "formula": "Score = 0.15(Robots.txt) + 0.10(Sitemap) + 0.25(Schema) + 0.15(E-E-A-T) + 0.15(Readability) + 0.10(Metadata) + 0.10(Internal Links)",
        "checks_breakdown": {
            "robots_txt": s_robots,
            "sitemap": s_sitemap,
            "schema_infrastructure": s_schema,
            "eeat_authority": s_eeat,
            "ai_readability": s_readability,
            "metadata_quality": s_meta,
            "internal_links": s_links
        }
    }
