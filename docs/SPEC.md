# AI Future Visualizer — Mini Spec

## 目标
输入任何产品名/网站/概念，AI 创意推演生成 10 年后这个东西的样子。面向全球好奇心旺盛的用户。

## 核心功能
- **输入**：用户输入产品名（如 "iPhone"）、网站（如 "Twitter"）或概念（如 "远程办公"）
- **AI 推演**：调用 LLM 进行创意性推演，预测 10 年后的演变
- **输出**：生成详细的未来描述（技术演进、用户体验变化、社会影响等）
- **i18n**：支持 7 种语言（en/zh/ja/de/fr/ko/es）

## 技术方案
- 前端：React + Vite (TypeScript)
- 后端：Python FastAPI
- AI 调用：通过 llm-proxy.densematrix.ai
- 部署：Docker → langsheng
- 域名：future-visualizer.demo.densematrix.ai

## 美学方向
**Retro-Futuristic / Cyberpunk** — 80年代对未来的想象
- 霓虹色调（cyan/magenta/yellow）
- CRT 扫描线效果
- 科幻终端界面感
- 使用特色字体（VT323 for terminal, Orbitron for headings）

## 端口分配
- Frontend: 3060
- Backend: 8080

## 完成标准
- [ ] 核心功能可用（输入 → AI 推演 → 输出未来描述）
- [ ] 支持 7 种语言
- [ ] 支付集成（免费试用 1 次 + 付费包）
- [ ] 部署到 https://future-visualizer.demo.densematrix.ai
- [ ] Health check 通过
- [ ] 视觉风格符合 Retro-Futuristic 美学
