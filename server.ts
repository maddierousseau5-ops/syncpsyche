import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic diagnostic logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'N/A'}`);
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

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    const { content, systemInstruction, provider = 'deepseek' } = req.body;
    console.log(`[${new Date().toISOString()}] Analysis Request (${provider}) received. Content size: ${JSON.stringify(content || '').length} chars`);

    let apiKey = '';
    let apiUrl = '';
    let modelName = '';

    if (provider === 'zhipu') {
      apiKey = process.env.ZHIPU_API_KEY || '';
      apiUrl = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
      modelName = "glm-4-plus"; 
    } else {
      apiKey = process.env.DEEPSEEK_API_KEY || '';
      apiUrl = "https://api.deepseek.com/beta/chat/completions"; // V4 Flash is often in beta/compatible endpoints
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
          max_tokens: 8192,
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

      console.log(`Analysis successful via ${provider}. Sending response to client.`);
      res.json({ result: messageContent });
    } catch (error: any) {
      clearTimeout(timeoutId);
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
