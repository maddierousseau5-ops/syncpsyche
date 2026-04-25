/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AlertCircle,
  Archive,
  Book,
  Brain,
  ChevronRight,
  Clock,
  Dna,
  FileText,
  Flame,
  Handshake,
  HeartPulse,
  Lightbulb,
  MessageSquare,
  Moon,
  RefreshCw,
  Scale,
  Search,
  ShieldAlert,
  Sword,
  Upload,
  Users,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useRef, useState } from 'react';

// --- Types ---

interface AnalysisResult {
  relationship_type: string;
  subtext_analysis: {
    attachment: string;
    iceberg: string[];
    metaphors: string;
  };
  turning_points: {
    period: string;
    event: string;
    description: string;
    impact: string;
  }[];
  personality_profiles: {
    user: string;
    profile: string;
    mbti: string;
    traits: string[];
    detailed_analysis: string;
    style_evolution: string;
  }[];
  interaction_evolution: {
    period: string;
    pattern: string;
    dynamic_change: string;
  }[];
  interaction_patterns: {
    power_dynamic: string;
    ta_state: string;
    demand_withdraw: string;
    communication_efficiency: string;
    key_findings: string[];
  };
  detected_issues: {
    severity: 'low' | 'medium' | 'high';
    issue: string;
    description: string;
  }[];
  user_prescriptions: {
    user: string;
    advice_list: {
      situation: string;
      suggestion: string;
      script: string;
    }[];
  }[];
  summary: string;
  notable_moments: {
    time: string;
    content: string;
    analysis: string;
    speaker: string;
  }[];
  sampled_segments: {
    period: string;
    title: string;
    score: number;
    content: string;
  }[];
  linguistic_sync: {
    slang: string[];
    sync_score: number;
    sync_description: string;
  };
  emotional_labor: {
    provider: string;
    consumer: string;
    response_rate: string;
    energy_balance: number;
  };
  chronobiology: {
    late_night_ratio: string;
    avg_response_time: string;
    peak_hours: { hour: number, intensity: number }[];
  };
  conflict_resolution: {
    breaker: string;
    repair_attempts: string;
    style: string;
  };
  fun_facts: {
    book_equivalent: string;
    max_combo: string;
    schrodinger_night: string;
  };
}

type AppState = 'idle' | 'analyzing' | 'result' | 'error';

// --- Components ---

const Sidebar = ({ activeReport, onExportJson, onExportHtml }: { activeReport?: string, onExportJson?: () => void, onExportHtml?: () => void }) => (
  <aside className="w-60 bg-prof-sidebar text-white p-6 flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
    <div className="logo border-l-4 border-prof-accent pl-3 mb-10">
      <div className="text-lg font-bold">关系洞察分析引擎</div>
      <div className="text-[10px] uppercase opacity-60 font-normal">Relationship Insight v4.2</div>
    </div>
    <nav className="flex-1 space-y-2">
      <div className={`py-3 text-[13px] border-b border-white/10 transition-colors ${activeReport ? 'text-prof-accent font-semibold opacity-100' : 'opacity-60'}`}>
        {activeReport ? `当前报告: ${activeReport}` : '等待数据载入...'}
      </div>
      <div className="py-3 text-[13px] opacity-60 border-b border-white/10 hover:opacity-100 cursor-pointer">历史归档</div>
      <div className="py-3 text-[13px] opacity-60 border-b border-white/10 hover:opacity-100 cursor-pointer">分析模型配置</div>
      
      <div className="pt-4 pb-2 text-[10px] uppercase opacity-40 font-bold tracking-widest">导出选项 / Export Options</div>
      <div 
        onClick={onExportJson}
        className={`flex items-center gap-2 py-3 text-[13px] border-b border-white/10 hover:opacity-100 cursor-pointer transition-colors ${activeReport ? 'opacity-100 text-prof-accent font-medium' : 'opacity-30 pointer-events-none'}`}
      >
        <FileText className="w-4 h-4" />
        导出为 JSON 配置
      </div>
      <div 
        onClick={onExportHtml}
        className={`flex items-center gap-2 py-3 text-[13px] border-b border-white/10 hover:opacity-100 cursor-pointer transition-colors ${activeReport ? 'opacity-100 text-prof-accent font-medium' : 'opacity-30 pointer-events-none'}`}
      >
        <Upload className="w-4 h-4 rotate-180" />
        导出为 HTML 报告
      </div>
    </nav>
    <div className="mt-auto pt-6 text-[11px] opacity-40 font-mono">
      © 2026 系统语言学实验室
    </div>
  </aside>
);

const ProfessionalHeader = ({ relationshipType, relationshipProb, metadata }: { relationshipType?: string, relationshipProb?: string, metadata?: { startDate?: string, endDate?: string, count: number, usedCount?: number } | null }) => (
  <header className="col-span-full border-b-2 border-prof-border pb-3 flex justify-between items-end mb-5">
    <div>
      <h1 className="text-2xl font-bold text-prof-text">深度交流特征分析报告</h1>
      <p className="text-sm text-prof-muted mt-1">
        基于多维语言学特征扫描 | 实时关系定性建模
      </p>
      {metadata && (
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-prof-muted font-mono uppercase bg-prof-bg px-2 py-1 rounded w-fit border border-prof-border/50">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-prof-accent" />
            <span>样本范围: {metadata.startDate || '?'} 至 {metadata.endDate || '?'}</span>
          </div>
          <span className="w-1 h-1 bg-prof-border rounded-full hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Archive className="w-3 h-3 text-prof-accent" />
            <span>对话总量: <span className="font-bold">{metadata.count}</span></span>
          </div>
          {metadata.usedCount !== undefined && metadata.usedCount !== metadata.count && (
            <>
              <span className="w-1 h-1 bg-prof-border rounded-full hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Brain className="w-3 h-3 text-prof-accent" />
                <span>实取精选内容: <span className="text-prof-accent font-black tracking-tight">{metadata.usedCount}</span> 条用于分析</span>
              </div>
            </>
          )}
          {metadata.usedCount !== undefined && metadata.usedCount === metadata.count && (
            <>
              <span className="w-1 h-1 bg-prof-border rounded-full hidden sm:block" />
              <span className="text-green-600 font-bold bg-green-50 px-1 rounded border border-green-200/50">100% 全量分析</span>
            </>
          )}
        </div>
      )}
    </div>
    {relationshipType && (
      <div className="text-right">
        <span className="bg-[#e8f5e9] text-[#2e7d32] px-3 py-1.5 rounded-full text-xs font-bold border border-[#2e7d32]">
          关系定性：{relationshipType} {relationshipProb ? `(${relationshipProb})` : ''}
        </span>
      </div>
    )}
  </header>
);

export default function App() {
  const [state, setState] = useState<AppState>('idle');
  const [csvContent, setCsvContent] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');
  const [showTruncateOption, setShowTruncateOption] = useState(false);
  const [truncationLevel, setTruncationLevel] = useState(0);
  const [metadata, setMetadata] = useState<{ startDate?: string, endDate?: string, count: number, usedCount?: number } | null>(null);
  const [serverStatus, setServerStatus] = useState<{ alive: boolean, msg: string, providers?: any }>({ alive: false, msg: '正在检测核心引擎...' });
  const [selectedProvider, setSelectedProvider] = useState<'deepseek' | 'zhipu' | 'qwen'>('deepseek');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Check server health on load
    // Using absolute URL derived from origin to bypass relative resolution issues in some proxies
    const origin = window.location.origin;
    const healthEndpoint = `${origin}/api/health`;
    
    fetch(healthEndpoint)
      .then(r => r.json())
      .then(data => {
        console.log("Server Health Check (Success):", data);
        const hasKey = data.availableProviders?.deepseek || data.availableProviders?.zhipu;
        setServerStatus({ 
          alive: true, 
          msg: hasKey ? '分析引擎就绪' : '分析引擎已启动，但尚未配置任意 API Key',
          providers: data.availableProviders
        });
        
        if (!data.availableProviders?.deepseek) {
          if (data.availableProviders?.zhipu) setSelectedProvider('zhipu');
        }
      })
      .catch(err => {
        console.error("Server Health Check (Failed):", err);
        setServerStatus({ alive: false, msg: '核心引擎通信异常，请检查网络或刷新重试' });
      });
  }, []);

  const getEffectiveMaxChars = () => {
    // DeepSeek V4 Flash Context is 1M tokens. 800k characters is a safe ceiling for mixed text
    // allowing for massive data ingestion.
    const base = 800000; 
    if (truncationLevel === 0) return base;
    if (truncationLevel === 1) return 400000;
    return 150000;
  };

  const smartTruncate = (text: string) => {
    const limit = getEffectiveMaxChars();
    if (text.length <= limit) {
      const lines = text.split('\n');
      return { text, usedCount: lines.length > 0 ? lines.length - 1 : 0 };
    }
    
    const lines = text.split('\n');
    const header = lines[0];
    const dataLines = lines.slice(1);
    const totalLines = dataLines.length;

    // Even for small files, we force 12 segments to maintain analysis structure
    const numSegments = 12;
    const segmentSize = Math.max(1, Math.floor(totalLines / numSegments));
    const charsPerSegment = Math.floor((limit - header.length) / numSegments);
    
    let sampledParts: string[] = [];
    let linesUsed = 0;
    
    for (let i = 0; i < numSegments; i++) {
      const startIdx = i * segmentSize;
      let currentSegmentText = "";
      let j = 0;
      let segmentLines = 0;
      // Greedy grab within segment until quota or segment end
      while (currentSegmentText.length < charsPerSegment && (startIdx + j) < (i + 1) * segmentSize) {
        currentSegmentText += dataLines[startIdx + j] + "\n";
        j++;
        segmentLines++;
      }
      linesUsed += segmentLines;
      sampledParts.push(`\n\n--- [TIME_SEGMENT_${i + 1}] BLOCK START ---\n${currentSegmentText}\n--- [TIME_SEGMENT_${i + 1}] BLOCK END ---\n\n`);
    }
    
    return {
      text: `${header}\n\n[SYSTEM: STRATIFIED SAMPLING ACTIVE - 12 CORE SEGMENTS EXTRACTED]\n\n${sampledParts.join('\n')}`,
      usedCount: linesUsed
    };
  };

  const extractMetadata = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length <= 1) return { count: 0 };
    
    const dataLines = lines.slice(1);
    const count = dataLines.length;
    
    try {
      // Find the first and last non-header line that has content
      const firstLine = dataLines[0].split('\t');
      const lastLine = dataLines[dataLines.length - 1].split('\t');
      
      const getTimeString = (val: string) => {
        if (!val) return null;
        const num = Number(val);
        // Determine if it's unix timestamp (seconds or ms) or just text
        if (!isNaN(num)) {
          const date = new Date(num * (num < 10000000000 ? 1000 : 1));
          return date.toISOString().split('T')[0];
        }
        return val.split(' ')[0]; // Fallback for YYYY-MM-DD HH:MM
      };

      const startDate = getTimeString(firstLine[7]);
      const endDate = getTimeString(lastLine[7]);

      return { startDate, endDate, count };
    } catch (e) {
      console.error("Metadata extraction fail", e);
      return { count };
    }
  };

  const loadSampleData = () => {
    const sample = `id	MsgSvrID	type_name	is_sender	talker	msg	src	CreateTime
1	123456789	文本	0	对方	"最近怎么总是不回消息？明明看到你发朋友圈了。"	WeChat	1678888800
2	123456790	文本	1	我	"在忙，那个朋友圈是自动转发的。"	WeChat	1678888920
3	123456791	文本	0	对方	"行吧。总是这样。我都习惯了。"	WeChat	1678889500
4	123456792	文本	1	我	"怎么又生气了？我真的在开会。"	WeChat	1678891200
5	123456793	文本	0	对方	"我没生气，我只是觉得我们越来越没话说了。"	WeChat	1678891500
6	123456794	文本	0	对方	"算了，你早点睡吧。"	WeChat	1678895000`;
    setCsvContent(sample);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvContent(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const runAnalysis = async () => {
    if (!csvContent.trim()) {
      setError('Please provide chat record content (CSV format preferred).');
      return;
    }

    setState('analyzing');
    setError(null);
    setShowTruncateOption(false);
    setProgress('Initializing analysis engine...');

    const meta = extractMetadata(csvContent);
    setMetadata(meta);

    try {
      let finalContent = csvContent;
      const effectiveLimit = getEffectiveMaxChars();
      const inputSize = csvContent.length;
      let actualUsedCount = meta.count;

      if (inputSize > effectiveLimit) {
        const ratio = Math.round((effectiveLimit / inputSize) * 100);
        setProgress(truncationLevel > 0 
          ? `正在进行深度降阶采样 (保留约 ${ratio}% 核心片段)...` 
          : `数据量较大 (${inputSize} 字符)，正在执行智能云采样 (保留约 ${ratio}% 近期记录)...`);
        const { text, usedCount } = smartTruncate(finalContent);
        finalContent = text;
        actualUsedCount = usedCount;
        await new Promise(r => setTimeout(r, 1500));
      }

      setMetadata(prev => prev ? { ...prev, usedCount: actualUsedCount } : null);

      const steps = [
        'Ingesting data sequences...',
        'Mapping linguistic patterns...',
        'Cross-referencing psychological frameworks...',
        'Synthesizing relationship dynamics...',
        'DeepSeek V4 processing...',
        'Generating clinical report...'
      ];

      // Simulate step-by-step progress for UX
      for (const step of steps) {
        setProgress(step);
        await new Promise(r => setTimeout(r, 500));
      }

      const systemInstruction = `ROLE: 你是一位拥有临床心理学背景、精通依恋理论 (Attachment Theory) 与人际沟通分析 (Transactional Analysis, TA) 的资深情感关系专家。
        
        CORE PRINCIPLES:
        - 透视冰山: 不要只停留在表面情绪，要挖掘底层的心理需求（如渴望认同、害怕抛弃）。
        - 客观中立: 避免任何道德审判。
        - 边界感: 声明分析仅基于文本片段，不作为临床医疗诊断。

        ANALYSIS DIMENSIONS:
        1. Relationship Overview: 基于全生命周期数据，判断关系形态。
        2. Deep Emotional & Subtext Analysis [CORE]:
           - Attachment Pattern: 推测双方属于 安全型、焦虑型 还是 回避型。
           - Iceberg Insights: 识别典型冲突中的底层需求。
           - Metaphors/Projections: 识别字里行间的隐性防御机制。
        3. Power Dynamics & TA Structure:
           - TA States: 对话模式是 "父母-儿童"、"成人-成人" 还是 "儿童-儿童"？
           - Demand-Withdraw: 识别是否存在追逃动态及主导权分布。
        4. Personality Profiling: 基于表达习惯推测性格特质，并分析其 MBTI 人格类型 (如 INTJ, ENFP)。
        5. Interaction Evolution: 
           - 针对提供的12个阶段，分析相处模式是如何随着时间演变的。
        6. Linguistic Synchronization (NEW):
           - 提取专属黑话 (slang)、计算同频指数 (sync_score)、描述变色龙效应。
        7. Emotional Labor Flow (NEW):
           - 识别情绪的“兜底者”(provider) 与 “消耗者”(consumer)，计算有效回应率 (response_rate)，评估能量天平。
        8. Emotional Chronobiology (NEW):
           - 统计深夜聊天占比 (late_night_ratio)、平均回复时差 (avg_response_time)、24小时活动强度 (peak_hours)。
        9. Conflict Resolution Map (NEW):
           - 识别冷战打破者 (breaker)、修复企图 (repair_attempts) 与 破冰风格。
        10. Fun Facts (NEW):
            - 聊天记录字数折合名著 (book_equivalent)、最高连击纪录 (max_combo)、晚安后的活跃度 (schrodinger_night)。
        11. Red Flags: 敏锐识别煤气灯效应、被动攻击等隐性毒素。
        12. User-Specific Prescriptions: 为双方各提供 3 条(共6条)针对性的高情商沟通建议，含具体话术。
        13. Notable Moments: 提取至少 10 条具代表性的对话瞬间。

        MANDATORY: 
        - "sampled_segments" 是对每个阶段的深度分析总结，而不是原文摘录。每个阶段必须包含：一个精炼的短语标题（如"暧昧试探期"、"冲突爆发期"、"冷战僵持期"）、一个 1-100 的好感度评分（score）、以及 150-250 字的深度分析描述，精准捕捉该阶段的相处基调、对话风格变化、情绪温度和互动节奏。
        - 你必须在 "sampled_segments" 数组和 "interaction_evolution" 数组中均按顺序返回 EXACTLY 12 个条目，分别对应输入数据中的 [TIME_SEGMENT_1] 到 [TIME_SEGMENT_12]。
        - 必须输出 "interaction_evolution" 数组，展示完整 12 个阶段的关系模式变迁，每个阶段的 dynamic_change 描述不少于 80 字，深入分析权力结构、情感距离、沟通模式的演变细节。
        - 必须包含至少 15 条具代表性的对话瞬间 (notable_moments)，每条的分析不少于 50 字，深入挖掘潜台词和心理动机。
        - 所有文本输出（包括 summary、attachment、metaphors、detailed_analysis、style_evolution、key_findings 等）均需比默认更详细、更具深度，提供丰富的洞察和具体例证。

        OUTPUT REQUIREMENTS: 
        - Language: Professional Chinese.
        - Tone: Empathetic, Analytical, Professional Clinical Expert.
        - Format: Strictly Valid JSON that matches the following structure:
        {
          "relationship_type": string,
          "subtext_analysis": { "attachment": string, "iceberg": string[], "metaphors": string },
          "turning_points": [{ "period": string, "event": string, "description": string, "impact": string }],
          "personality_profiles": [{ "user": string, "profile": string, "mbti": string, "traits": string[], "detailed_analysis": string, "style_evolution": string }],
          "interaction_evolution": [{ "period": string, "pattern": string, "dynamic_change": string }],
          "interaction_patterns": { "power_dynamic": string, "ta_state": string, "demand_withdraw": string, "communication_efficiency": string, "key_findings": string[] },
          "detected_issues": [{ "severity": "low" | "medium" | "high", "issue": string, "description": string }],
          "user_prescriptions": [{ "user": string, "advice_list": [{ "situation": string, "suggestion": string, "script": string }] }],
          "summary": string,
          "notable_moments": [{ "time": string, "content": string, "analysis": string, "speaker": string }],
          "sampled_segments": [{ "period": string, "title": string, "score": number, "content": string }],
          "linguistic_sync": { "slang": string[], "sync_score": number, "sync_description": string },
          "emotional_labor": { "provider": string, "consumer": string, "response_rate": string, "energy_balance": number },
          "chronobiology": { "late_night_ratio": string, "avg_response_time": string, "peak_hours": [{ "hour": number, "intensity": number }] },
          "conflict_resolution": { "breaker": string, "repair_attempts": string, "style": string },
          "fun_facts": { "book_equivalent": string, "max_combo": string, "schrodinger_night": string }
        }`;

      // Using absolute URL to ensure request reaches the backend consistently
      const origin = window.location.origin;
      const apiEndpoint = `${origin}/api/analyze`;
      console.log(`Starting analysis via ${apiEndpoint}...`);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: finalContent, 
          systemInstruction,
          provider: selectedProvider 
        })
      }).catch(err => {
        console.error("Network level fetch failure:", err);
        throw new Error(`[环节1: 浏览器 -> 后端服务器] 无法建立连接。
        目标接口: ${apiEndpoint}
        浏览器状态: ${navigator.onLine ? '在线' : '离线'}
        详细错误: ${err.message}
        请尝试：1. 确认指示灯为绿色；2. 减少上传文件大小；3. 刷新页面重试。`);
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const stage = errorData.stage || '未知环节';
        throw new Error(`[环节2: ${stage}] 服务器返回错误: ${errorData.error || `HTTP ${response.status}`}`);
      }

      const { result: apiResult } = await response.json();

      let parsedResult: AnalysisResult;
      try {
        parsedResult = JSON.parse(apiResult);
      } catch (parseErr) {
        console.error("JSON Parse Error:", parseErr, "Raw Text:", apiResult);
        throw new Error("[环节3: 结果解析] AI 响应内容解析失败。模型返回了非标准 JSON 格式。");
      }
      setResult(parsedResult);
      setState('result');
    } catch (err: any) {
      console.error(err);
      let errorMessage = err?.message || 'An error occurred during analysis.';
      
      if (errorMessage.includes('exceeds the maximum number of tokens')) {
        errorMessage = truncationLevel > 0 
          ? '深层精简后依然超出限制，请尝试手动截取对话最频繁的一部分记录进行上传。'
          : '上传的数据量已超过 AI 引擎单次处理上限。请尝试使用下方的“执行深层采样重试”，系统将自动聚焦于交流最密集的关键片段。';
        setShowTruncateOption(truncationLevel === 0);
      } else if (errorMessage.includes('Rpc failed') || errorMessage.includes('xhr error') || errorMessage.includes('ProxyUnaryCall')) {
        errorMessage = '网络传输数据负荷过重导致系统响应异常（RPC 500）。由于网络基础设施限制，单次分析建议控制在 40 万字符内。请尝试使用下方的“执行深层采样重试”，系统将自动压缩载荷至稳定范围。';
        setShowTruncateOption(truncationLevel === 0);
      }
      
      setError(errorMessage);
      setState('error');
    }
  };

  const handleTruncateAndRetry = () => {
    setTruncationLevel(1); // Flag as a deep truncation attempt
    setTimeout(() => runAnalysis(), 100);
  };

  const reset = () => {
    setState('idle');
    setResult(null);
    setCsvContent('');
    setError(null);
    setShowTruncateOption(false);
    setTruncationLevel(0);
    setMetadata(null);
  };

  const exportToJson = () => {
    if (!result || state !== 'result') return;

    try {
      const dataStr = JSON.stringify(result, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `SyncPsyche_Analysis_${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Failed to export JSON:', err);
      alert('导出 JSON 失败，请稍后重试。');
    }
  };

  const exportToHtml = () => {
    if (!result || state !== 'result') return;

    try {
      const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SyncPsyche 深度交流特征分析报告</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #f8f9fa; color: #1a1a1a; -webkit-print-color-adjust: exact; }
        .prof-card { background: white; border: 1px solid #eef0f3; border-radius: 1.5rem; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); height: 100%; }
        .prof-accent { color: #2196f3; }
        .bg-prof-sidebar { background: #1a1c1e; }
        .page-break { page-break-after: always; }
        @media print {
            .no-print { display: none; }
            body { background: white; padding: 0; }
            .prof-card { box-shadow: none; border: 1px solid #eee; break-inside: avoid; }
        }
    </style>
</head>
<body class="p-4 md:p-8 max-w-6xl mx-auto">
    <header class="border-b-2 border-gray-200 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 class="text-3xl font-black tracking-tight">深度交流特征分析报告</h1>
            <p class="text-gray-500 mt-1">基于多维语言学特征扫描 | 实时关系定性建模</p>
            <div class="mt-4 flex gap-2">
                <div class="inline-block bg-white px-3 py-1 rounded-full border border-gray-200 text-[10px] font-mono uppercase text-gray-400">
                    Generated by SyncPsyche v4.2
                </div>
                <div class="inline-block bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-[10px] font-mono uppercase text-blue-400">
                    Analysis Date: ${new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
        <div class="text-left md:text-right">
            <div class="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                关系定性：${result.relationship_type}
            </div>
            ${metadata ? `
                <div class="mt-2 text-[10px] text-gray-400 font-mono uppercase">
                    Records: ${metadata.usedCount} / ${metadata.count} | Range: ${metadata.startDate} - ${metadata.endDate}
                </div>
            ` : ''}
        </div>
    </header>

    <main class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        <!-- Summary -->
        <section class="col-span-12 prof-card border-l-8 border-blue-500">
            <h2 class="text-sm font-black mb-4 uppercase tracking-[0.2em] text-blue-600">核心摘要 (Summary)</h2>
            <p class="text-base leading-relaxed text-gray-800 font-medium">${result.summary}</p>
        </section>

        <!-- Subtext Analysis -->
        <section class="col-span-12 md:col-span-7 prof-card">
            <h2 class="text-sm font-black mb-6 uppercase tracking-[0.2em] text-gray-400">深层情感潜流 (Subtext)</h2>
            <div class="space-y-6">
                <div>
                    <h3 class="text-xs font-bold text-blue-600 uppercase mb-2">依恋模式 (Attachment)</h3>
                    <div class="p-4 bg-blue-50 rounded-xl border border-blue-100 italic text-sm text-gray-700">
                        ${result.subtext_analysis.attachment}
                    </div>
                </div>
                <div>
                    <h3 class="text-xs font-bold text-blue-600 uppercase mb-2">冲突冰山 (Iceberg)</h3>
                    <div class="flex flex-wrap gap-2">
                        ${result.subtext_analysis.iceberg.map(i => `
                            <span class="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">${i}</span>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <h3 class="text-xs font-bold text-blue-600 uppercase mb-2">潜意识原型 (Projections)</h3>
                    <p class="text-xs leading-relaxed text-gray-500">${result.subtext_analysis.metaphors}</p>
                </div>
            </div>
        </section>

        <!-- Personality (MBTI) -->
        <section class="col-span-12 md:col-span-5 prof-card">
            <h2 class="text-sm font-black mb-6 uppercase tracking-[0.2em] text-gray-400">性格画像 (MBTI)</h2>
            <div class="space-y-6">
                ${result.personality_profiles.map((p, idx) => `
                    <div class="p-5 border-l-4 ${idx === 0 ? 'border-blue-500 bg-blue-50/20' : 'border-orange-500 bg-orange-50/20'} rounded-r-2xl">
                        <div class="flex justify-between items-start mb-3">
                            <span class="font-bold text-gray-900">${p.user}</span>
                            <span class="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded uppercase tracking-tighter">MBTI: ${p.mbti}</span>
                        </div>
                        <p class="text-[10px] text-gray-500 font-bold uppercase mb-2">${p.profile}</p>
                        <p class="text-xs text-gray-600 leading-relaxed italic mb-3">"${p.detailed_analysis}"</p>
                        <div class="pt-3 border-t border-gray-200/50">
                            <h4 class="text-[9px] font-black uppercase text-gray-400 mb-1">演化动态</h4>
                            <p class="text-[11px] text-gray-500 leading-tight">${p.style_evolution}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Interaction Evolution -->
        <section class="col-span-12 prof-card">
            <h2 class="text-sm font-black mb-10 uppercase tracking-[0.2em] text-gray-400">关系演化全景图谱 (12 Phases of Evolution)</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                ${result.interaction_evolution.map((evo, i) => {
                    const detailedDesc = result.sampled_segments.find(s => s.period.includes((i + 1).toString()))?.content || "";
                    return `
                        <div class="relative pl-10 border-l-2 border-blue-50/50 pb-2 group">
                            <div class="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-blue-500 shadow-sm group-hover:scale-110 transition-transform"></div>
                            <div class="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span>PHASE ${String(i + 1).padStart(2, '0')}</span>
                                <span class="h-px bg-blue-100 flex-1"></span>
                            </div>
                            <div class="text-xs font-black text-gray-900 mb-2 uppercase group-hover:text-blue-600 transition-colors">${evo.pattern}</div>
                            <div class="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/30 mb-4">
                                <h4 class="text-[9px] font-bold text-blue-800 uppercase mb-2 opacity-60 italic">动力变迁 / Dynamic Change</h4>
                                <p class="text-[11px] text-gray-600 leading-relaxed font-medium">${evo.dynamic_change}</p>
                            </div>
                            <div class="p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <h4 class="text-[9px] font-bold text-gray-400 uppercase mb-2 italic">阶段微观描述 / Phase Insight</h4>
                                <p class="text-[11px] text-gray-400 leading-relaxed italic line-clamp-4 hover:line-clamp-none transition-all duration-500">${detailedDesc || "数据不足以提取独立描述"}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </section>

        <!-- Linguistic Sync & Emotional Labor -->
        <section class="col-span-12 md:col-span-6 prof-card bg-zinc-900 text-white">
            <h2 class="text-sm font-black mb-8 uppercase tracking-[0.2em] text-blue-400">数字指纹与能量流向</h2>
            <div class="space-y-8">
                <div>
                    <h3 class="text-xs font-bold uppercase text-white/40 mb-4 flex justify-between">
                        <span>语言同步 (SYNC INDEX)</span>
                        <span class="text-blue-400">${result.linguistic_sync.sync_score}%</span>
                    </h3>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${result.linguistic_sync.slang.map(s => `
                            <span class="bg-white/10 px-3 py-1 rounded-lg text-xs font-mono">${s}</span>
                        `).join('')}
                    </div>
                    <p class="text-[11px] text-white/60 italic">${result.linguistic_sync.sync_description}</p>
                </div>
                <div class="pt-8 border-t border-white/10">
                    <h3 class="text-xs font-bold uppercase text-white/40 mb-6">情绪劳动与天平 (Labor Flow)</h3>
                    <div class="flex items-center gap-6 mb-6">
                        <div class="flex-1 text-center">
                            <div class="text-[9px] uppercase opacity-40 mb-1">PROVIDER</div>
                            <div class="text-sm font-black">${result.emotional_labor.provider}</div>
                        </div>
                        <div class="w-10 h-10 rounded-full border-2 border-blue-400 flex items-center justify-center text-xs font-bold text-blue-400">
                            ${Math.abs(result.emotional_labor.energy_balance - 50)}
                        </div>
                        <div class="flex-1 text-center">
                            <div class="text-[9px] uppercase opacity-40 mb-1">CONSUMER</div>
                            <div class="text-sm font-black">${result.emotional_labor.consumer}</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <span class="text-[10px] uppercase font-bold text-blue-400">有效回应率 (RES. RATE): ${result.emotional_labor.response_rate}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Conflict & Chronobiology -->
        <section class="col-span-12 md:col-span-6 prof-card">
            <h2 class="text-sm font-black mb-8 uppercase tracking-[0.2em] text-gray-400">冲突降级与时间节律</h2>
            <div class="space-y-8">
                <div class="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                   <h3 class="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">冲突破冰 (Conflict Resolution)</h3>
                   <div class="mb-4">
                       <span class="text-[9px] font-bold text-gray-400 uppercase">破冰主导 (Breaker)</span>
                       <div class="text-sm font-black text-gray-800">${result.conflict_resolution.breaker}</div>
                   </div>
                   <p class="text-[11px] text-gray-600 mb-3 font-medium bg-white/50 p-3 rounded-xl border border-orange-200/50 underline decoration-orange-200 underline-offset-4">
                       "${result.conflict_resolution.repair_attempts}"
                   </p>
                   <p class="text-[11px] text-gray-400 italic">${result.conflict_resolution.style}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div class="text-[9px] font-bold text-gray-400 uppercase mb-1">深夜活跃度</div>
                        <div class="text-lg font-black text-gray-800">${result.chronobiology.late_night_ratio}</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div class="text-[9px] font-bold text-gray-400 uppercase mb-1">平均回覆时差</div>
                        <div class="text-lg font-black text-gray-800">${result.chronobiology.avg_response_time}</div>
                    </div>
                </div>

                <div class="pt-4">
                    <div class="text-[9px] font-bold text-gray-400 uppercase mb-3 text-center tracking-widest">24H 活跃共振图</div>
                    <div class="flex items-end justify-between h-16 gap-0.5">
                        ${result.chronobiology.peak_hours.map(p => `
                            <div class="flex-1 bg-blue-500 rounded-t-sm" style="height: ${p.intensity}%" title="${p.hour}h: ${p.intensity}%"></div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>

        <!-- Fun Facts -->
        <section class="col-span-12 prof-card bg-blue-600 text-white">
            <h2 class="text-sm font-black mb-8 uppercase tracking-[0.2em] text-blue-100/60 text-center">趣味发现 (Social Currency)</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="text-[10px] font-black opacity-60 uppercase mb-3">聊天记录折合名著</div>
                    <div class="text-xl font-black italic tracking-tighter cursor-default underline decoration-blue-400 decoration-4">“${result.fun_facts.book_equivalent}”</div>
                </div>
                <div class="text-center">
                    <div class="text-[10px] font-black opacity-60 uppercase mb-3">年度最高频连击记录</div>
                    <div class="text-xl font-black italic tracking-tighter">${result.fun_facts.max_combo}</div>
                </div>
                <div class="text-center">
                    <div class="text-[10px] font-black opacity-60 uppercase mb-3">薛定谔的早安与晚安</div>
                    <div class="text-lg font-black italic tracking-tighter leading-snug">${result.fun_facts.schrodinger_night}</div>
                </div>
            </div>
        </section>

        <!-- Notable Moments -->
        <section class="col-span-12 prof-card">
            <h2 class="text-sm font-black mb-8 uppercase tracking-[0.2em] text-gray-400">回顾与共鸣 (Echoes)</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 grid-flow-row-dense">
                ${result.notable_moments.slice(0, 12).map(m => `
                    <div class="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div class="flex justify-between text-[8px] font-black text-gray-300 uppercase mb-2">
                            <span>${m.time}</span>
                            <span>${m.speaker}</span>
                        </div>
                        <p class="text-xs font-bold italic mb-3 text-gray-700 leading-relaxed">“${m.content}”</p>
                        <p class="text-[10px] text-gray-400 leading-tight">${m.analysis}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Red Flags -->
        ${result.detected_issues.length > 0 ? `
            <section class="col-span-12 prof-card border-l-8 border-red-500 bg-red-50/50">
                <h2 class="text-sm font-black mb-6 uppercase tracking-[0.2em] text-red-600">红线预警 (Red Flags)</h2>
                <div class="space-y-4">
                    ${result.detected_issues.map(i => `
                        <div class="flex items-start gap-4">
                            <span class="text-red-500 font-bold">⚠️</span>
                            <div>
                                <strong class="text-sm text-gray-800">${i.issue}</strong>
                                <p class="text-xs text-gray-500 mt-1">${i.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        ` : ''}

        <!-- Constructive Prescriptions -->
        <section class="col-span-12 prof-card bg-prof-sidebar text-white">
            <h2 class="text-sm font-black mb-10 uppercase tracking-[0.2em] text-white/40 border-b border-white/10 pb-4">建设性处方 (Prescriptions)</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                ${result.user_prescriptions.map((up, i) => `
                    <div class="space-y-8">
                        <h4 class="text-lg font-black tracking-tight flex items-center gap-3">
                            <span class="w-1.5 h-6 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-orange-400'}"></span>
                            为 ${up.user} 提供策略
                        </h4>
                        <div class="space-y-6">
                            ${up.advice_list.map(item => `
                                <div class="bg-white/5 p-6 rounded-3xl border border-white/10">
                                    <div class="mb-4">
                                        <div class="text-[9px] font-black text-white/30 uppercase mb-1">针对场景</div>
                                        <div class="text-xs font-bold text-blue-200">${item.situation}</div>
                                    </div>
                                    <div class="mb-4">
                                        <div class="text-[9px] font-black text-white/30 uppercase mb-1">建议对策</div>
                                        <div class="text-[11px] text-white/70 leading-relaxed">${item.suggestion}</div>
                                    </div>
                                    <div class="pt-4 border-t border-white/10">
                                        <div class="text-[9px] font-black text-blue-400 uppercase mb-2">推荐话术 (Script)</div>
                                        <div class="bg-black/40 p-3 rounded-xl border border-white/5 text-xs font-mono italic text-blue-100">“${item.script}”</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    </main>

    <footer class="mt-20 border-t border-gray-200 pt-10 text-center space-y-4 pb-12">
        <div class="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-black">
            SyncPsyche Digital Twin Analysis Engine
        </div>
        <div class="text-[9px] text-gray-300 font-mono italic">
            Disclaimer: Analysis based on text patterns only. Not a medical diagnosis.
        </div>
    </footer>
    
    <div class="no-print fixed bottom-8 right-8">
        <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3 rounded-full shadow-2xl transition-all transform hover:scale-105 uppercase text-xs tracking-widest flex items-center gap-2">
            打印为 PDF / Print Report
        </button>
    </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SyncPsyche_Professional_Report_${new Date().toISOString().slice(0,10)}.html`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export HTML:', err);
      alert('导出 HTML 失败，请稍后重试。');
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-prof-accent selection:text-white">
      <Sidebar 
        activeReport={state === 'result' ? 'Analysis_Report.json' : undefined} 
        onExportJson={exportToJson}
        onExportHtml={exportToHtml}
      />
      
      <main className="flex-1 p-8 grid grid-cols-2 grid-rows-[auto_1fr_1fr] gap-5 items-start relative">
        <div className="col-span-full grid grid-cols-2 gap-5 items-start">
          <ProfessionalHeader 
            relationshipType={result?.relationship_type ? "深度演变扫描已完成" : undefined} 
            relationshipProb="时间跨度：12 周期采样" 
            metadata={metadata}
          />

          <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="col-span-full space-y-8"
            >
              <div className="prof-card p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="prof-card-title text-lg uppercase tracking-tight mb-0">数据录入 / Data Ingestion</div>
                    <p className="text-xs text-prof-muted mt-1">Upload your chat logs exported from WhatsApp, WeChat, or other platforms.</p>
                  </div>
                  <div className={`text-[10px] flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${serverStatus.alive ? (serverStatus.msg.includes('尚未') ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-green-50 text-green-600 border-green-200') : 'bg-red-50 text-red-600 border-red-200'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${serverStatus.alive ? (serverStatus.msg.includes('尚未') ? 'bg-orange-400' : 'bg-green-400') : 'bg-red-400'} ${serverStatus.alive ? 'animate-pulse' : ''}`} />
                    <span className="font-bold uppercase tracking-tighter">{serverStatus.msg}</span>
                  </div>
                </div>

                {/* Provider Selector */}
                <div className="mb-6 grid grid-cols-2 gap-3">
                  {[
                    { id: 'deepseek', name: 'DeepSeek V4 Flash', available: serverStatus.providers?.deepseek },
                    { id: 'zhipu', name: '智谱 GLM-4', available: serverStatus.providers?.zhipu },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProvider(p.id as any)}
                      disabled={!p.available}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        selectedProvider === p.id 
                          ? 'border-prof-accent bg-prof-accent/5 ring-1 ring-prof-accent' 
                          : 'border-prof-border bg-white hover:border-prof-accent/30 opacity-60'
                      } ${!p.available ? 'grayscale cursor-not-allowed border-dashed opacity-30' : ''}`}
                    >
                      <span className="text-xs font-bold">{p.name}</span>
                      <span className="text-[9px] mt-1 opacity-60 font-mono uppercase">
                        {p.available ? 'Ready' : 'Not Configured'}
                      </span>
                    </button>
                  ))}
                </div>
                
                <div 
                  className="mt-6 border-2 border-dashed border-prof-border rounded-xl p-10 flex flex-col items-center justify-center bg-black/[0.01] hover:bg-black/[0.03] transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-prof-muted/40 group-hover:text-prof-accent mb-4 transition-colors" />
                  <p className="text-sm font-medium">点击或拖拽 CSV 文件至此处</p>
                  <p className="text-[10px] text-prof-muted/60 font-mono mt-2 uppercase">SUPPORTED: .CSV, .TXT (UTF-8)</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    accept=".csv,.txt"
                    ref={fileInputRef}
                  />
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-prof-muted block">或者手动粘贴记录 / Or Paste Content</label>
                    <button 
                      onClick={loadSampleData}
                      className="text-[10px] font-mono uppercase text-prof-accent hover:underline transition-colors"
                    >
                      尝试示例数据 / Try Sample Data
                    </button>
                  </div>
                  <textarea 
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    placeholder="格式参考：时间, 发送者, 内容..."
                    className="w-full h-48 bg-white border border-prof-border rounded-lg p-4 font-mono text-xs focus:ring-1 focus:ring-prof-accent outline-none transition-shadow"
                  />
                </div>

                {error && (
                  <div className="mt-4 flex items-center gap-2 text-prof-warning bg-[#fff1f0] p-3 rounded-lg border border-red-100">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs font-medium">{error}</p>
                  </div>
                )}

                <button 
                  onClick={runAnalysis}
                  disabled={!csvContent.trim() || !serverStatus.alive}
                  className="mt-8 w-full bg-prof-sidebar text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-prof-sidebar/90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none uppercase tracking-widest"
                >
                  {serverStatus.alive ? '启动深度解析 / START ANALYSIS' : '等待引擎就绪... / WAITING FOR ENGINE'}
                  {serverStatus.alive && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {[
                  { icon: Search, title: "多维扫描", desc: "从语言学到心理学" },
                  { icon: ShieldAlert, title: "风险预警", desc: "识别潜在情绪毒性" },
                  { icon: Lightbulb, title: "赋能建议", desc: "实操的改善方案" },
                ].map((item, i) => (
                  <div key={i} className="prof-card p-6 !flex-row gap-4 items-center">
                    <item.icon className="w-6 h-6 text-prof-accent opacity-60" />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-tight">{item.title}</h3>
                      <p className="text-[10px] text-prof-muted mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {state === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full h-[60vh] flex flex-col items-center justify-center text-center"
            >
              <div className="relative">
                <RefreshCw className="w-16 h-16 text-prof-accent/10 animate-spin" />
                <Brain className="w-8 h-8 text-prof-sidebar absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h2 className="mt-8 text-xl font-bold font-sans uppercase tracking-tight">分析引擎运转中...</h2>
              <p className="mt-2 text-sm font-mono text-prof-muted animate-pulse uppercase">{progress}</p>
            </motion.div>
          )}

          {state === 'result' && result && (
            <>
              {/* Summary Card - TOP BANNER */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full prof-card !bg-prof-sidebar !text-white !flex-row gap-6 items-center"
              >
                <div className="p-4 bg-[#2b3595] rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#9fa8da] mb-1">Executive Summary</h3>
                  <p className="text-base font-medium italic leading-relaxed">“{result.summary}”</p>
                  <p className="text-[9px] mt-2 opacity-50 uppercase tracking-tighter">
                    *本报告基于临床心理学理论模型扫描。分析仅限文本证据，不作为医疗诊断。
                  </p>
                </div>
                <button onClick={reset} className="ml-auto text-[10px] font-mono border border-[#ffffff33] px-4 py-2 rounded hover:bg-white/10 transition-colors uppercase font-bold tracking-wider">
                  ↻ 重新分析
                </button>
              </motion.div>

              {/* Relationship Evolution Card */}
              <motion.section 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="col-span-full prof-card min-h-[120px] bg-gradient-to-br from-white to-blue-50/30"
              >
                <div className="prof-card-title flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-prof-accent" />
                    历史演变特征与现状视角 (Relationship Evolution & Perspective)
                  </div>
                  <span className="text-[10px] bg-prof-accent text-white px-2 py-0.5 rounded-full font-bold">
                    12 时段全景纵深
                  </span>
                </div>
                <div className="text-sm font-medium leading-relaxed text-prof-text bg-white/50 p-4 rounded-xl border border-blue-100/50">
                  {result.relationship_type}
                </div>
              </motion.section>

              {/* Detailed Timeline Sampling Accordion */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="col-span-full prof-card overflow-hidden !p-0 border-none"
              >
                <div className="prof-card-title px-6 py-4 flex items-center gap-3 bg-white border-b border-prof-border">
                  <Archive className="w-5 h-5 text-prof-accent" /> 
                  <span className="text-base font-black text-prof-text">12 阶段采样明细 (Timeline Sampling Details)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-prof-bg/20">
                  {result.sampled_segments.map((seg, i) => (
                    <details key={i} className="group bg-white border border-prof-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 open:shadow-xl h-fit">
                      <summary className="p-5 text-base font-black text-prof-text cursor-pointer flex justify-between items-center hover:bg-prof-bg/5 list-none">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 flex items-center justify-center bg-prof-accent text-white rounded-full text-xs shadow-md font-mono">{i + 1}</span>
                          <div className="flex flex-col">
                            <span className="tracking-tight uppercase">{seg.title || seg.period || `阶段 ${i + 1}`}</span>
                            {seg.score && (
                              <span className="text-[10px] font-mono text-prof-muted mt-0.5">
                                好感度评分：<span className={`font-bold ${seg.score >= 70 ? 'text-green-500' : seg.score >= 40 ? 'text-orange-500' : 'text-red-500'}`}>{seg.score}/100</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-prof-accent group-open:rotate-180 transition-transform text-sm font-bold">▼</span>
                      </summary>
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-sm text-prof-text/90 leading-relaxed group-open:line-clamp-none line-clamp-6 italic border-t pt-4 border-prof-border/50">
                          {seg.content}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </motion.section>

              {/* Turning Points Timeline */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="col-span-full prof-card bg-[#fbfcfd]"
              >
                <div className="prof-card-title flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-orange-400" /> 转折点探测 (Critical Turning Points)
                </div>
                <div className="relative pl-6 py-2 space-y-6 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-prof-border">
                  {result.turning_points.map((tp, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[24px] top-1 w-4 h-4 rounded-full bg-white border-2 border-orange-400 z-10"></div>
                      <div className="flex flex-col md:flex-row gap-2 md:items-center mb-1">
                        <span className="text-[10px] font-mono font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded whitespace-nowrap">
                          {tp.period}
                        </span>
                        <h4 className="text-sm font-bold text-prof-text">{tp.event}</h4>
                      </div>
                      <p className="text-xs text-prof-muted leading-relaxed">{tp.description}</p>
                      <div className="mt-2 text-[10px] bg-white border border-prof-border p-2 rounded italic text-prof-accent">
                        <strong>影响：</strong>{tp.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Subtext Analysis Section - CORE */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
                className="col-span-full prof-card bg-gradient-to-r from-blue-50 to-white border-l-4 border-l-prof-accent"
              >
                <div className="prof-card-title flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-prof-accent" />
                    深度情感与潜台词剖析 (Deep Emotional & Subtext Analysis)
                  </div>
                  <span className="text-[10px] bg-prof-accent/10 text-prof-accent px-2 py-0.5 rounded font-bold uppercase">专家级专栏</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-prof-text uppercase flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> 依恋模式推测
                    </h4>
                    <p className="text-xs text-prof-muted leading-relaxed bg-white/60 p-3 rounded-lg border border-prof-border/50 italic">
                      {result.subtext_analysis.attachment}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-prof-text uppercase flex items-center gap-1.5">
                      <Brain className="w-3 h-3" /> 情绪冰山模型
                    </h4>
                    <div className="space-y-2">
                      {result.subtext_analysis.iceberg.map((item, i) => (
                        <div key={i} className="text-[10px] flex items-start gap-2 bg-blue-100/30 p-2 rounded border-l-2 border-l-prof-accent">
                          <div className="w-1.5 h-1.5 rounded-full bg-prof-accent mt-1 shrink-0" />
                          <span className="text-prof-text font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-prof-text uppercase flex items-center gap-1.5">
                      <Search className="w-3 h-3" /> 情感隐喻与投射
                    </h4>
                    <p className="text-xs text-prof-muted leading-relaxed bg-white/60 p-3 rounded-lg border border-prof-border/50">
                      {result.subtext_analysis.metaphors}
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Personality Card */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="col-span-1 prof-card"
              >
                <div className="prof-card-title">性格画像 (Personality Profiles)</div>
                <div className="grid grid-cols-1 gap-6">
                  {result.personality_profiles.map((p, i) => (
                    <div key={i} className={`p-5 rounded-xl border-l-4 ${i === 0 ? 'border-l-[#2196f3] bg-[#2196f308]' : 'border-l-[#ff5722] bg-[#ff572208]'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-base text-prof-text">{p.user}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-prof-accent px-2 py-0.5 bg-prof-accent/10 rounded uppercase">{p.profile}</span>
                            <span className="text-[10px] font-black text-white px-2 py-0.5 bg-prof-sidebar rounded uppercase tracking-tighter">MBTI: {p.mbti}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.traits.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white border border-prof-border text-[10px] text-[#555] rounded-full">{t}</span>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div className="text-sm text-prof-muted leading-relaxed">
                          <strong className="text-prof-text">深度表达分析:</strong> {p.detailed_analysis}
                        </div>
                        <div className="text-sm text-prof-muted leading-relaxed border-t border-prof-border/50 pt-3 italic">
                          <strong className="text-prof-text">关系中的演变:</strong> {p.style_evolution}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Interaction Evolution Card */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                className="col-span-1 prof-card h-full"
              >
                <div className="prof-card-title flex items-center justify-between">
                  <span>相处模式纵深演变 (Interaction Evolution)</span>
                  <RefreshCw className="w-3 h-3 text-prof-accent" />
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin">
                  {result.interaction_evolution.map((evo, i) => (
                    <div key={i} className="relative pl-6 border-l border-prof-border pb-6 last:pb-0">
                      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-prof-accent border-2 border-white shadow-sm" />
                      <div className="text-xs font-bold text-prof-accent mb-1 uppercase tracking-tighter">{evo.period}</div>
                      <div className="text-sm font-bold text-prof-text bg-prof-bg p-2 rounded-md mb-2 border border-prof-border/50">模式：{evo.pattern}</div>
                      <p className="text-xs text-prof-muted leading-relaxed italic">{evo.dynamic_change}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Linguistic Sync & Emotional Labor (NEW) */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
                className="col-span-1 prof-card bg-gradient-to-br from-indigo-50/50 to-white"
              >
                <div className="prof-card-title flex justify-between items-center">
                  <div className="flex items-center gap-2"><Dna className="w-4 h-4 text-prof-accent" /> 语言同步与变色龙效应</div>
                  <span className="text-[10px] font-mono bg-prof-accent/20 text-prof-accent px-2 py-0.5 rounded">SYNC: {result.linguistic_sync.sync_score}%</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[11px] font-bold text-prof-text uppercase mb-3 flex items-center gap-1.5 opacity-70">
                      <MessageSquare className="w-3 h-3" /> 专属词典 (Private Slang)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {result.linguistic_sync.slang.map((s, i) => (
                         <span key={i} className="bg-white border border-prof-border px-3 py-1 rounded-lg text-xs font-medium text-prof-text shadow-sm hover:border-prof-accent transition-colors">
                           {s}
                         </span>
                       ))}
                    </div>
                    <p className="text-[11px] text-prof-muted mt-3 italic leading-relaxed">
                      {result.linguistic_sync.sync_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-prof-border/50">
                    <h4 className="text-[11px] font-bold text-prof-text uppercase mb-4 flex items-center gap-1.5 opacity-70">
                      <Zap className="w-3 h-3" /> 情绪劳动与能量流向
                    </h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 text-center">
                         <div className="text-[10px] text-prof-muted uppercase mb-1">情绪兜底 (Provider)</div>
                         <div className="text-sm font-bold text-prof-text">{result.emotional_labor.provider}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Scale className={`w-5 h-5 ${result.emotional_labor.energy_balance > 60 ? 'rotate-12' : result.emotional_labor.energy_balance < 40 ? '-rotate-12' : ''} transition-transform text-prof-accent`} />
                        <div className="w-1 h-4 bg-prof-border" />
                      </div>
                      <div className="flex-1 text-center">
                         <div className="text-[10px] text-prof-muted uppercase mb-1">情绪消耗 (Consumer)</div>
                         <div className="text-sm font-bold text-prof-text">{result.emotional_labor.consumer}</div>
                      </div>
                    </div>
                    <div className="bg-prof-bg p-3 rounded-xl border border-prof-border/50">
                      <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase">
                        <span>情绪接住率 (Response Rate)</span>
                        <span className="text-prof-accent">{result.emotional_labor.response_rate}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-prof-border/30">
                        <div className="h-full bg-prof-accent" style={{ width: result.emotional_labor.response_rate }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Chronobiology & Conflict Resolution (NEW) */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
                className="col-span-full prof-card grid grid-cols-1 md:grid-cols-2 gap-8 ring-2 ring-prof-accent/5"
              >
                <div className="space-y-6">
                  <div className="prof-card-title !px-0 !py-0 mb-4 border-none flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-prof-accent" /> 时间生物学与情感浓度
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-prof-bg p-4 rounded-2xl border border-prof-border/50 text-center">
                       <Moon className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
                       <div className="text-[10px] text-prof-muted uppercase">凌晨两点定律</div>
                       <div className="text-lg font-black text-prof-text">{result.chronobiology.late_night_ratio}</div>
                    </div>
                    <div className="bg-prof-bg p-4 rounded-2xl border border-prof-border/50 text-center">
                       <Clock className="w-5 h-5 mx-auto mb-2 text-prof-accent" />
                       <div className="text-[10px] text-prof-muted uppercase">平均心跳时差</div>
                       <div className="text-lg font-black text-prof-text">{result.chronobiology.avg_response_time}</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="text-[10px] font-bold text-prof-muted uppercase mb-3 text-center">24小时活动共振图</div>
                    <div className="flex items-end justify-between h-20 gap-1">
                       {result.chronobiology.peak_hours.map((p, i) => (
                         <div key={i} className="group relative flex-1">
                           <div 
                             className="w-full bg-prof-accent rounded-t-sm hover:opacity-80 transition-opacity" 
                             style={{ height: `${p.intensity}%` }}
                           />
                           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] opacity-0 group-hover:opacity-100 font-mono">
                             {p.hour}h
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-l border-prof-border pl-0 md:pl-8">
                  <div className="prof-card-title !px-0 !py-0 mb-4 border-none flex items-center gap-2">
                    <Sword className="w-4 h-4 text-prof-warning" /> 冲突降级与破冰图谱
                  </div>
                  <div className="bg-orange-50/50 p-5 rounded-3xl border border-orange-100 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-orange-100 p-3 rounded-2xl">
                        <Handshake className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">首席冷战打破者</div>
                        <div className="text-lg font-black text-prof-text">{result.conflict_resolution.breaker}</div>
                      </div>
                    </div>
                    <div className="space-y-4 flex-1">
                      <div>
                        <h5 className="text-[11px] font-bold text-prof-text uppercase flex items-center gap-2 mb-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> 惯用修复企图 (Repair)
                        </h5>
                        <p className="text-xs text-prof-muted leading-relaxed bg-white/50 p-3 rounded-xl border border-orange-200/30">
                          {result.conflict_resolution.repair_attempts}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-prof-text uppercase flex items-center gap-2 mb-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> 战后重建模式
                        </h5>
                        <p className="text-xs text-prof-muted leading-relaxed">
                          {result.conflict_resolution.style}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Interaction Patterns Card */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="prof-card min-h-[350px]"
              >
                <div className="prof-card-title">权力与沟通结构 (Power & Structure)</div>
                <div className="flex flex-col h-full space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-prof-accent uppercase mb-3 flex items-center gap-1.5">
                       <MessageSquare className="w-3 h-3" /> TA 沟通状态 (Parent-Adult-Child)
                    </h4>
                    <div className="text-sm bg-prof-bg p-3 rounded-lg border border-prof-border font-medium italic text-prof-text leading-relaxed">
                      {result.interaction_patterns.ta_state}
                    </div>
                  </div>

                  <div>
                     <h4 className="text-sm font-bold text-prof-accent uppercase mb-2">追逃模式 (Demand-Withdraw)</h4>
                     <p className="text-xs text-prof-muted mb-3">{result.interaction_patterns.demand_withdraw}</p>
                     <div className="text-xs font-bold text-prof-text mb-2 uppercase flex justify-between">
                        <span>主导权均衡度</span>
                        <span>{result.interaction_patterns.power_dynamic}</span>
                     </div>
                     <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-prof-border">
                        <div className="h-full bg-prof-accent" style={{ width: '65%' }}></div>
                     </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-prof-accent uppercase mb-2">专家关键发现</h4>
                    <ul className="space-y-2">
                      {result.interaction_patterns.key_findings.map((f, i) => (
                        <li key={i} className="text-xs text-prof-text flex items-start gap-2">
                          <span className="text-prof-accent font-bold">●</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Issues Card */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="prof-card"
              >
                <div className="prof-card-title">红线预警 (Detected Issues)</div>
                <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
                  {result.detected_issues.map((d, i) => (
                    <div key={i} className="issue-item">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>{d.issue}：</strong>
                        <span className="text-[#333333cc]">{d.description}</span>
                      </div>
                    </div>
                  ))}
                  {result.detected_issues.length === 0 && (
                    <p className="text-center py-8 text-prof-muted text-xs italic">未发现明显红线行为</p>
                  )}
                </div>
              </motion.section>

              {/* Fun Facts Module (NEW) */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                 <div className="bg-prof-sidebar p-6 rounded-[2rem] text-white flex flex-col justify-between group overflow-hidden relative">
                    <Book className="w-20 h-20 absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-[10px] font-mono text-prof-accent uppercase tracking-widest mb-2 italic">Chat as Literature</div>
                      <h4 className="text-sm font-bold opacity-80 mb-4 tracking-tight">如果我们的聊天记录是一本书</h4>
                    </div>
                    <div className="relative z-10 text-xl font-black italic tracking-tighter leading-tight">
                      “{result.fun_facts.book_equivalent}”
                    </div>
                 </div>

                 <div className="bg-prof-accent p-6 rounded-[2rem] text-white flex flex-col justify-between group overflow-hidden relative shadow-[0_20px_40px_rgba(33,150,243,0.3)]">
                    <Flame className="w-20 h-20 absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest mb-2 italic">Combo Streak</div>
                      <h4 className="text-sm font-bold text-white/90 mb-4 tracking-tight">本年度最高频连击记录</h4>
                    </div>
                    <div className="relative z-10 text-2xl font-black italic tracking-tighter leading-tight shadow-text">
                      {result.fun_facts.max_combo}
                    </div>
                 </div>

                 <div className="bg-[#1a1a1a] p-6 rounded-[2rem] text-white flex flex-col justify-between group overflow-hidden relative">
                    <Moon className="w-20 h-20 absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-[10px] font-mono text-[#9fa8da] uppercase tracking-widest mb-2 italic">Schrödinger's Goodnight</div>
                      <h4 className="text-sm font-bold opacity-80 mb-4 tracking-tight">薛定谔的早安/晚安</h4>
                    </div>
                    <div className="relative z-10 text-lg font-black italic tracking-tighter leading-snug">
                       {result.fun_facts.schrodinger_night}
                    </div>
                 </div>
              </motion.section>

              {/* Notable Moments Card */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="col-span-full prof-card bg-[#f8f9fa] border-dashed"
              >
                <div className="prof-card-title flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> 回顾与共鸣 (Echoes of Memory)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.notable_moments.map((m, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-prof-border relative overflow-hidden group">
                      <div className="text-[9px] font-mono text-prof-muted mb-2 flex justify-between uppercase">
                        <span>{m.time}</span>
                        <span>{m.speaker}</span>
                      </div>
                      <p className="text-xs font-medium leading-relaxed mb-3 border-l-2 border-[#2196f34d] pl-3 italic">
                        “{m.content}”
                      </p>
                      <div className="text-[10px] text-[#666666cc] leading-tight pt-2 border-t border-[#dcdfe680]">
                        {m.analysis}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Constructive Prescriptions */}
              <motion.section 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="col-span-full prof-card bg-prof-sidebar !text-white"
              >
                <div className="prof-card-title !text-white opacity-90 border-white/10">建设性处方 (Constructive Prescriptions)</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {result.user_prescriptions.map((up, i) => (
                    <div key={i} className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                        <div className={`w-1.5 h-6 rounded-full ${i === 0 ? 'bg-blue-400Shadow' : 'bg-orange-400Shadow'} bg-prof-accent shadow-[0_0_10px_rgba(33,150,243,0.5)]`} />
                        <h4 className="text-base font-bold tracking-tight text-white/90">为 {up.user} 提供专属策略</h4>
                      </div>
                      <div className="space-y-4">
                        {up.advice_list.map((item, idx) => (
                          <div key={idx} className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition-colors group">
                            <div className="mb-3">
                              <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">针对场景</span>
                              <p className="text-sm font-bold mt-1.5 text-blue-100">{item.situation}</p>
                            </div>
                            <div className="mb-4">
                              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">建议对策</span>
                              <p className="text-[13px] leading-relaxed mt-1 text-white/80">{item.suggestion}</p>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                              <div className="flex-1">
                                <span className="text-[10px] text-prof-accent font-bold uppercase tracking-wider">推荐话术 (Script)</span>
                                <div className="mt-1.5 bg-black/40 p-3 rounded-lg text-sm font-mono italic text-prof-accent border border-white/5">
                                  “{item.script}”
                                </div>
                              </div>
                              <Lightbulb className="w-6 h-6 text-white/20 group-hover:text-prof-accent transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            </>
          )}

          {state === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20 px-8 bg-red-50 border border-red-100 rounded-2xl"
            >
              <AlertCircle className="w-16 h-16 text-prof-warning mx-auto mb-6" />
              <h2 className="text-xl font-bold uppercase mb-4">解析引擎故障 / ENGINE ERROR</h2>
              <div className="text-sm text-red-600 font-medium mb-8 max-w-lg mx-auto leading-relaxed p-4 bg-white/50 rounded-lg border border-red-50">
                {error}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {showTruncateOption && (
                  <button 
                    onClick={handleTruncateAndRetry}
                    className="bg-prof-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-prof-accent/80 transition-all flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" /> 执行深层采样重试 / DEEP SAMPLING RETRY
                  </button>
                )}
                <button 
                  onClick={reset}
                  className="bg-prof-sidebar text-white px-8 py-3 rounded-xl font-bold hover:bg-prof-sidebar/80 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> REBOOT & RETRY
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
