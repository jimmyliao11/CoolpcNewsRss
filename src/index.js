/**
 * 主程式入口
 * 執行網頁爬蟲並產生 RSS XML 檔案
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scrapeNews } from './scraper.js';
import { generateRss } from './rss-generator.js';
import { log, logError } from './utils.js';

// ============================================================
// 常數定義
// ============================================================

// ES Module 取得 __dirname 的方式
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** 輸出目錄路徑 */
const OUTPUT_DIR = path.join(__dirname, '..', 'dist');

/** RSS XML 輸出檔案名稱 */
const OUTPUT_FILE = 'coolpc-news.xml';

// ============================================================
// 主程式
// ============================================================

/**
 * 主程式函式
 * 執行完整的爬蟲與 RSS 產生流程
 */
async function main() {
    log('========================================');
    log('原價屋新聞 RSS 產生器 啟動');
    log('========================================');

    try {
        // 步驟 1: 執行網頁爬蟲
        log('[步驟 1/3] 執行網頁爬蟲...');
        const articles = await scrapeNews();

        if (articles.length === 0) {
            logError('未取得任何文章，程式終止');
            process.exit(1);
        }

        // 步驟 2: 產生 RSS XML
        log('[步驟 2/3] 產生 RSS XML...');
        const rssXml = generateRss(articles);

        // 步驟 3: 寫入檔案
        log('[步驟 3/3] 寫入檔案...');

        // 確保輸出目錄存在
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
            log(`已建立輸出目錄: ${OUTPUT_DIR}`);
        }

        // 寫入 RSS XML 檔案
        const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
        fs.writeFileSync(outputPath, rssXml, 'utf-8');
        log(`RSS 檔案已成功寫入: ${outputPath}`);

        log('========================================');
        log('RSS 產生器執行完成');
        log('========================================');

    } catch (error) {
        logError(`程式執行失敗: ${error.message}`);
        logError(error.stack);
        process.exit(1);
    }
}

// 執行主程式
main();
