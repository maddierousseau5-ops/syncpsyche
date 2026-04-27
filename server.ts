import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Persistent Analytics (JSON file) ---
const ANALYTICS_FILE = path.join(__dirname, 'analytics.json');

interface AnalyticsData {
  startTime: string;
  pageViews: number;
  analysisAttempts: number;
  analysisSuccess: number;
  analysisFailed: number;
  totalCharsProcessed: number;
  providers: Record<string, number>;
  dailyStats: Record<string, { views: number; analyses: number }>;
}

function loadAnalytics(): AnalyticsData {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const raw = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load analytics file, starting fresh:', e);
  }
  return {
    startTime: new Date().toISOString(),
    pageViews: 0,
    analysisAttempts: 0,
    analysisSuccess: 0,
    analysisFailed: 0,
    totalCharsProcessed: 0,
    providers: {},
    dailyStats: {},
  };
}

function saveAnalytics() {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2), 'utf-8');
    // 异步推送到 Git，确保 Render 重启后数据不丢失
    gitCommitAnalytics().catch(() => {});
  } catch (e) {
    console.error('Failed to save analytics:', e);
  }
}

async function gitCommitAnalytics() {
  try {
    const repoDir = path.join(__dirname);
    // 只在有 .git 目录时才执行（避免本地开发报错）
    if (!fs.existsSync(path.join(repoDir, '.git'))) return;
    
    const { execSync } = await import('child_process');
    execSync(`cd "${repoDir}" && git add analytics.json && git commit -m "chore: auto-update analytics [skip ci]" --no-gpg-sign 2>&1 || true`, { timeout: 10000 });
    execSync(`cd "${repoDir}" && git push origin main 2>&1 || true`, { timeout: 15000 });
  } catch (e) {
    // 静默失败，不影响主流程
  }
}

// 启动时从 Git 拉取最新的 analytics.json（Render 重启后恢复数据）
async function pullAnalyticsFromGit() {
  try {
    const repoDir = path.join(__dirname);
    if (!fs.existsSync(path.join(repoDir, '.git'))) return;
    const { execSync } = await import('child_process');
    execSync(`cd "${repoDir}" && git pull origin main 2>&1 || true`, { timeout: 15000 });
  } catch (e) {
    // 静默失败
  }
}

// 异步拉取，不阻塞启动
pullAnalyticsFromGit().catch(() => {});

const analytics = loadAnalytics();

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function trackPageView() {
  analytics.pageViews++;
  const today = getTodayKey();
  if (!analytics.dailyStats[today]) analytics.dailyStats[today] = { views: 0, analyses: 0 };
  analytics.dailyStats[today].views++;
  saveAnalytics();
}

function trackAnalysis(provider: string, success: boolean, chars: number) {
  analytics.analysisAttempts++;
  if (success) analytics.analysisSuccess++;
  else analytics.analysisFailed++;
  analytics.totalCharsProcessed += chars;
  analytics.providers[provider] = (analytics.providers[provider] || 0) + 1;
  const today = getTodayKey();
  if (!analytics.dailyStats[today]) analytics.dailyStats[today] = { views: 0, analyses: 0 };
  analytics.dailyStats[today].analyses++;
  saveAnalytics();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  console.log(`Starting server with PORT=${PORT}, NODE_ENV=${process.env.NODE_ENV}`);

  // Basic diagnostic logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'N/A'}`);
    if (req.method === 'GET' && req.url === '/') trackPageView();
    next();
  });

  // More explicit CORS for iframe safety
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Root logger for diagnostic
  app.get("/", (req, res, next) => {
    console.log(`[${new Date().toISOString()}] Root Page Request intercepted by Express`);
    next();
  });

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      env: process.env.NODE_ENV,
      availableProviders: {
        deepseek: !!process.env.DEEPSEEK_API_KEY,
        zhipu: !!process.env.ZHIPU_API_KEY,
      },
      port: PORT
    });
  });

  // Analytics Stats - HTML Dashboard (中文)
  app.get("/api/stats", (req, res) => {
    const today = getTodayKey();
    const todayStats = analytics.dailyStats[today] || { views: 0, analyses: 0 };
    const uptime = Math.floor((Date.now() - new Date(analytics.startTime).getTime()) / 1000);
    const uptimeStr = `${Math.floor(uptime / 3600)}小时${Math.floor((uptime % 3600) / 60)}分`;
    
    const days = Object.keys(analytics.dailyStats).sort().reverse();
    const dailyRows = days.map(d => {
      const s = analytics.dailyStats[d];
      return `<tr><td>${d}</td><td>${s.views}</td><td>${s.analyses}</td></tr>`;
    }).join('');

    const providerRows = Object.entries(analytics.providers)
      .map(([k, v]) => `<tr><td>${k === 'deepseek' ? 'DeepSeek' : '智谱 GLM-4'}</td><td>${v} 次</td></tr>`)
      .join('');

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>SyncPsyche 统计面板</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; background: #f0f2f5; color: #333; padding: 40px 20px; }
  .container { max-width: 800px; margin: 0 auto; }
  h1 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
  .subtitle { color: #888; font-size: 13px; margin-bottom: 30px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 30px; }
  .card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); text-align: center; }
  .card .num { font-size: 32px; font-weight: 800; color: #1a73e8; }
  .card .label { font-size: 12px; color: #999; margin-top: 4px; }
  .card.green .num { color: #34a853; }
  .card.red .num { color: #ea4335; }
  .card.orange .num { color: #fbbc04; }
  h2 { font-size: 16px; font-weight: 700; margin: 24px 0 12px; }
  table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-collapse: collapse; }
  th { background: #f8f9fa; font-size: 12px; color: #666; padding: 12px 16px; text-align: left; font-weight: 600; }
  td { font-size: 13px; padding: 10px 16px; border-top: 1px solid #f0f0f0; }
  .footer { margin-top: 30px; font-size: 12px; color: #bbb; text-align: center; }
</style></head>
<body>
<div class="container">
  <h1>📊 SyncPsyche 统计面板</h1>
  <p class="subtitle">服务器启动时间：${analytics.startTime} ｜ 已运行：${uptimeStr}</p>

  <div class="grid">
    <div class="card"><div class="num">${analytics.pageViews}</div><div class="label">总访问次数</div></div>
    <div class="card green"><div class="num">${analytics.analysisSuccess}</div><div class="label">分析成功</div></div>
    <div class="card red"><div class="num">${analytics.analysisFailed}</div><div class="label">分析失败</div></div>
    <div class="card orange"><div class="num">${todayStats.views}</div><div class="label">今日访问</div></div>
  </div>

  <div class="grid">
    <div class="card"><div class="num">${analytics.analysisAttempts}</div><div class="label">总分析次数</div></div>
    <div class="card"><div class="num">${(analytics.totalCharsProcessed / 10000).toFixed(1)}万</div><div class="label">处理字符总量</div></div>
    <div class="card green"><div class="num">${todayStats.analyses}</div><div class="label">今日分析</div></div>
    <div class="card"><div class="num">${analytics.analysisAttempts ? Math.round(analytics.analysisSuccess / analytics.analysisAttempts * 100) : 0}%</div><div class="label">成功率</div></div>
  </div>

  <h2>🔧 各引擎使用情况</h2>
  <table>${providerRows ? `<tr><th>引擎</th><th>使用次数</th></tr>${providerRows}` : '<tr><td style="text-align:center;padding:20px;color:#999">暂无数据</td></tr>'}</table>

  <h2>📅 每日统计</h2>
  <table>${dailyRows ? `<tr><th>日期</th><th>访问</th><th>分析</th></tr>${dailyRows}` : '<tr><td style="text-align:center;padding:20px;color:#999">暂无数据</td></tr>'}</table>

  <div class="footer">SyncPsyche Analytics ｜ 数据持久化存储</div>
</div>
</body></html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    const { content, systemInstruction, provider = 'deepseek', apiKey: userApiKey } = req.body;
    console.log(`[${new Date().toISOString()}] Analysis Request (${provider}) received. Content size: ${JSON.stringify(content || '').length} chars`);

    const apiKeyMode = process.env.API_KEY_MODE || 'provide_free';
    let apiKey = '';
    let apiUrl = '';
    let modelName = '';

    if (apiKeyMode === 'require_own') {
      // 强制要求用户输入自己的 API Key
      apiKey = userApiKey || '';
      if (!apiKey) {
        return res.status(401).json({
          stage: "API Key 验证",
          error: `当前模式要求使用你自己的 API Key。请在弹窗中输入有效的 ${provider} API Key。`
        });
      }
    } else {
      // provide_free 模式：优先用用户传入的，没有则用环境变量
      apiKey = userApiKey || '';
    }

    if (provider === 'zhipu') {
      apiKey = apiKey || process.env.ZHIPU_API_KEY || '';
      apiUrl = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
      modelName = "glm-4-plus"; 
    } else {
      apiKey = apiKey || process.env.DEEPSEEK_API_KEY || '';
      apiUrl = "https://api.deepseek.com/chat/completions";
      modelName = "deepseek-v4-flash";
    }

    if (!apiKey) {
      console.error(`CRITICAL: API Key for ${provider} is missing from environment.`);
      return res.status(401).json({ 
        stage: "后端配置",
        error: `${provider} API Key 缺失。请在 Secrets 面板配置对应的环境变量。` 
      });
    }

    // Set a controller for the outgoing request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout for large Chinese AI models

    try {
      console.log(`Dispatching request to ${provider} API (${modelName})...`);
      
      // Ensure we tell the client the connection should stay open
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Content-Type', 'application/json');

      const aiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: `Here is the chat record to analyze:\n\n${content}` }
          ],
          max_tokens: 16384,
          response_format: {
            type: "json_object"
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error(`${provider} API Error: ${aiResponse.status} - ${errorText}`);
        
        let customError = errorText;
        try {
          const errJson = JSON.parse(errorText);
          customError = errJson.error?.message || errorText;
        } catch(e) {}

        const chars = JSON.stringify(content || '').length;
        trackAnalysis(provider, false, chars);
        return res.status(aiResponse.status).json({ 
          stage: `后端服务器 -> ${provider} API`,
          error: `${provider} 返回了错误 (${aiResponse.status}): ${customError || aiResponse.statusText}` 
        });
      }

      const data = await aiResponse.json();
      const messageContent = data.choices?.[0]?.message?.content;
      
      if (!messageContent) {
        throw new Error(`${provider} 响应结构异常: 未找到消息内容 (No message content found)。`);
      }

      const chars = JSON.stringify(content || '').length;
      trackAnalysis(provider, true, chars);
      console.log(`Analysis successful via ${provider}. Sending response to client.`);
      res.json({ result: messageContent });
    } catch (error: any) {
      clearTimeout(timeoutId);
      const chars = JSON.stringify(content || '').length;
      trackAnalysis(provider, false, chars);
      if (error.name === 'AbortError') {
        console.error(`${provider} request timed out after 3 minutes`);
        return res.status(504).json({ 
          stage: `后端服务器 -> ${provider} API`,
          error: `${provider} API 响应超时。该模型此时可能负载过高或处理数据量过大。请尝试使用其他引擎或削减内容容量。` 
        });
      }
      console.error("Analysis Pipeline Exception:", error);
      res.status(500).json({ 
        stage: "后端管道处理",
        error: error.message || "服务器内部错误" 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
