# whocalleditright.com

公开的 Brier 校准计分网站, 自动 audit 19 位最被引用的对冲基金经理 + 市场评论员。数据来源: SEC EDGAR 13F 备案 + 可验证的公开声明。

**线上**: https://whocalleditright.com (部署后生效)
**数据 repo**: https://github.com/alex-jb/whocalleditright-data

[English version / 英文版](./README.md)

---

## 网站做什么

每天 audit 一次, 公开打分:
- 19 个最被频繁引用的对冲基金经理 + 市场评论员 (Druckenmiller / Tepper / Cathie Wood / Burry / Ackman / Buffett / Dalio / Howard Marks / 段永平 等)
- 每个 Q1 的 call → 用 Brier score 算校准度
- Twitter 上 "我早说过了" 的人, 在这里真实排名

## 为什么 build

Stanley Druckenmiller 2026 年 Q1 全卖 GOOGL + AMZN, 5/15 备案 13F。3 周后 6/5 NASDAQ 暴跌 4.2%, 14 个月最大单日跌幅。

他**先知了**。

但 Twitter 上每天都有大佬喊单, 没人系统 track 谁真说对了。这是 missing market。

这个网站填空白:
- ✅ 自动 update
- ✅ 完全免费 + 无 paywall
- ✅ 源码开源 (MIT)
- ✅ Brier score = 诚实机制 (不能 selective 记忆)

## 视觉风格

1970 年代 Time 杂志封面 + brutalist editorial:
- 米白底 `#F5F4EE` + 墨黑字 `#0E0E0C` + 单一橙色 accent `#E45A2A`
- Inter Tight 黑体 displays + JetBrains Mono 股票代码
- 大头像 + 编辑式 multi-column body

## 技术栈

- Next.js 16 + React 19 + Tailwind 4 (Server Components only)
- ISR `revalidate=1800` (30 分钟自动刷新)
- 数据从 `github.com/alex-jb/whocalleditright-data` 拉, raw GitHub + ISR cache
- 19 张 AI 生成 stylized portraits (procedural placeholders + 真实 `gpt-image-1` 选项)
- Brier score 算法: `lib/brier/compute.ts`

## 本地预览

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 部署

部署到 Vercel, 域名指向 `whocalleditright.com` (Namecheap DNS → Vercel A record)。详见 `LAUNCH_PLAN.md`。

## 相关项目

- 量化栈源码: https://github.com/alex-jb/orallexa-ai-trading-agent
- Solo Founder OS (11-agent 开源栈): https://github.com/alex-jb/solo-founder-os
- VibeXForge 公开预测面板: https://vibexforge.com/predictions

## 协议

MIT
