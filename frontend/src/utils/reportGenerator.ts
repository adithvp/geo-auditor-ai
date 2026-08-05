/**
 * Utility for generating professional GEO Audit Reports (HTML & JSON)
 */

export interface AuditReportData {
  url: string;
  domain: string;
  title: string;
  overall_score: number;
  grade?: string;
  status_label?: string;
  score_formula: string;
  is_mocked?: boolean;
  engine_used?: string;
  breakdown: {
    clarity_score: number;
    citation_score: number;
    schema_score: number;
  };
  summary: string;
  qna_coverage: string;
  meta?: {
    has_schema: boolean;
    schema_count: number;
    headings_count: number;
    tables_count?: number;
  };
  issues: Array<{
    id: string;
    title: string;
    impact: string;
    effort: string;
    evidence: string;
    jargon_explained?: string;
    why_ai_cares: string;
    copy_paste_fix: string;
  }>;
}

export function downloadJsonReport(report: AuditReportData) {
  const jsonString = JSON.stringify(report, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GEO_Audit_Report_${report.domain || 'website'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadHtmlReport(report: AuditReportData) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const issuesHtml = report.issues.map((issue, idx) => `
    <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; background: #ffffff; page-break-inside: avoid;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #edf2f7; padding-bottom: 12px; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 18px; color: #1a202c;">#${idx + 1} ${escapeHtml(issue.title)}</h3>
        <div>
          <span style="background: ${issue.impact === 'HIGH' ? '#fff5f5' : '#fffaf0'}; color: ${issue.impact === 'HIGH' ? '#c53030' : '#dd6b20'}; border: 1px solid ${issue.impact === 'HIGH' ? '#feb2b2' : '#fbd38d'}; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px; margin-right: 6px;">
            Impact: ${issue.impact}
          </span>
          <span style="background: #f0fff4; color: #276749; border: 1px solid #9ae6b4; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px;">
            Effort: ${issue.effort}
          </span>
        </div>
      </div>

      ${issue.jargon_explained ? `
        <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 13px; color: #2b6cb0;">
          <strong>Plain English Business Explanation:</strong> ${escapeHtml(issue.jargon_explained)}
        </div>
      ` : ''}

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; font-size: 13px;">
        <div style="background: #f7fafc; padding: 12px; border-radius: 8px; border: 1px solid #edf2f7;">
          <strong style="color: #4a5568;">Crawled Evidence:</strong>
          <p style="margin: 4px 0 0 0; color: #718096; font-family: monospace; font-size: 12px;">${escapeHtml(issue.evidence)}</p>
        </div>
        <div style="background: #f7fafc; padding: 12px; border-radius: 8px; border: 1px solid #edf2f7;">
          <strong style="color: #4a5568;">Why AI Engines Care:</strong>
          <p style="margin: 4px 0 0 0; color: #718096;">${escapeHtml(issue.why_ai_cares)}</p>
        </div>
      </div>

      ${issue.copy_paste_fix ? `
        <div style="margin-top: 12px;">
          <div style="font-size: 11px; font-weight: bold; color: #718096; text-transform: uppercase; margin-bottom: 4px;">Copy-Paste Fix Solution:</div>
          <pre style="background: #1a202c; color: #68d391; padding: 14px; border-radius: 8px; font-size: 12px; font-family: monospace; overflow-x: auto; white-space: pre-wrap; margin: 0;">${escapeHtml(issue.copy_paste_fix)}</pre>
        </div>
      ` : ''}
    </div>
  `).join('');

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GEO Audit Executive Report - ${escapeHtml(report.domain)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #2d3748; background: #f7fafc; margin: 0; padding: 40px 20px; }
    .container { max-width: 900px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .brand { font-size: 24px; font-weight: 800; color: #06b6d4; }
    .meta { text-align: right; font-size: 13px; color: #718096; }
    .score-banner { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; border-radius: 16px; padding: 30px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; }
    .score-circle { width: 100px; height: 100px; border-radius: 50%; border: 6px solid #06b6d4; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; }
    .score-details { max-width: 550px; }
    .pillars { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 30px; }
    .pillar-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; }
    .pillar-score { font-size: 24px; font-weight: bold; color: #0f172a; margin-top: 4px; }
    .section-title { font-size: 20px; font-weight: 700; margin: 30px 0 16px 0; color: #0f172a; border-left: 4px solid #06b6d4; padding-left: 12px; }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand">GEO Search Auditor</div>
        <div style="font-size: 13px; color: #718096; margin-top: 4px;">Executive AI Visibility Report</div>
      </div>
      <div class="meta">
        <div><strong>Domain:</strong> ${escapeHtml(report.domain)}</div>
        <div><strong>Audited:</strong> ${dateStr}</div>
      </div>
    </div>

    <div class="score-banner">
      <div class="score-circle">
        ${report.overall_score}
        <span style="font-size: 10px; font-weight: normal; color: #94a3b8;">/ 100</span>
      </div>
      <div class="score-details">
        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #38bdf8; margin-bottom: 4px;">
          ${escapeHtml(report.status_label || 'AI Visibility Index')} • Grade ${escapeHtml(report.grade || 'B')}
        </div>
        <h2 style="margin: 0 0 8px 0; font-size: 22px;">GEO Health Score Summary</h2>
        <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">${escapeHtml(report.summary)}</p>
      </div>
    </div>

    <div class="pillars">
      <div class="pillar-card">
        <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Schema Infrastructure (40%)</div>
        <div class="pillar-score">${report.breakdown.schema_score}/100</div>
      </div>
      <div class="pillar-card">
        <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Direct Chunking (35%)</div>
        <div class="pillar-score">${report.breakdown.clarity_score}/100</div>
      </div>
      <div class="pillar-card">
        <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Citation Verifiability (25%)</div>
        <div class="pillar-score">${report.breakdown.citation_score}/100</div>
      </div>
    </div>

    <div class="section-title">Prioritized Action Plan (Impact x Effort)</div>
    ${issuesHtml}

    <div style="margin-top: 40px; pt: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
      Generated by GEO Search Auditor &copy; ${new Date().getFullYear()} • Generative Engine Optimization Platform
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GEO_Audit_Executive_Report_${report.domain || 'website'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
