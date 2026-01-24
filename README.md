# 原價屋新聞 RSS 爬蟲

自動從原價屋網站抓取最新文章，產生 RSS Feed 供訂閱使用。

## 📡 RSS 訂閱網址

[https://jimmyliao11.github.io/CoolpcNewsRss/coolpc-news.xml](https://jimmyliao11.github.io/CoolpcNewsRss/coolpc-news.xml)

## 功能說明

- 🔄 每 30 分鐘自動更新
- 📰 抓取原價屋最新優惠與產品資訊
- 📋 包含文章標題、摘要、發布日期

## 技術架構

- **執行環境**: Node.js v24
- **套件相依**: axios, rss
- **自動化**: GitHub Actions
- **部署**: GitHub Pages (gh-pages 分支)

## 本地開發

```bash
# 安裝相依套件
npm install

# 執行 RSS 產生器
npm start

# 產生的檔案位於 dist/coolpc-news.xml
```

## 專案結構

```
CoolpcNewsRss/
├── src/
│   ├── index.js          # 主程式入口
│   ├── scraper.js        # 網頁爬蟲模組
│   ├── rss-generator.js  # RSS 產生器模組
│   └── utils.js          # 工具函式
├── dist/                  # RSS 輸出目錄
├── .github/workflows/     # GitHub Actions 設定
├── package.json
└── README.md
```

## 授權

MIT License
