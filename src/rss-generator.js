/**
 * RSS 產生器模組
 * 負責將文章資料轉換為 RSS 2.0 格式的 XML
 */

import RSS from 'rss';
import { log } from './utils.js';

// ============================================================
// 常數定義
// ============================================================

/** RSS Feed 基本設定 */
const FEED_CONFIG = {
    title: '原價屋最新消息',
    description: '原價屋 CoolPC 最新優惠與產品資訊',
    feed_url: 'https://jimmyliao11.github.io/CoolpcNewsRss/coolpc-news.xml',
    site_url: 'https://www.coolpc.com.tw/tw/',
    language: 'zh-TW',
    ttl: 30 // 建議更新間隔（分鐘）
};

// ============================================================
// 日期轉換函式
// ============================================================

/**
 * 將原價屋日期格式轉換為 JavaScript Date 物件
 * @param {string} dateStr - 日期字串，格式: YYYY/MM/DD
 * @returns {Date} JavaScript Date 物件
 */
function parseDate(dateStr) {
    if (!dateStr) {
        return new Date();
    }

    // 原價屋日期格式: 2026/01/23
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JavaScript 月份從 0 開始
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }

    return new Date();
}

// ============================================================
// 主要產生器函式
// ============================================================

/**
 * 從文章列表產生 RSS XML 字串
 * @param {Array<Object>} articles - 文章物件陣列，每個物件包含 title, link, date, description
 * @returns {string} RSS 2.0 格式的 XML 字串
 */
export function generateRss(articles) {
    log('開始產生 RSS Feed...');

    // 建立 RSS Feed 物件
    const feed = new RSS(FEED_CONFIG);

    // 將每篇文章加入 Feed
    articles.forEach((article, index) => {
        feed.item({
            title: article.title,
            url: article.link,
            description: article.description,
            date: parseDate(article.date),
            guid: article.link // 使用連結作為唯一識別碼
        });
    });

    log(`已加入 ${articles.length} 篇文章到 RSS Feed`);

    // 產生 XML 字串
    const xml = feed.xml({ indent: true });
    log(`RSS XML 產生完成，長度: ${xml.length} 字元`);

    return xml;
}
