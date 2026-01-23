/**
 * 工具函式模組
 * 提供日誌輸出和時間格式化等共用功能
 */

// ============================================================
// 時間格式化函式
// ============================================================

/**
 * 取得 ISO 8601 格式的時間戳記（含時區）
 * 格式範例: 2004-05-03T17:30:08+08:00
 * @returns {string} 格式化的時間字串
 */
export function getTimestamp() {
    const now = new Date();
    const offset = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
    const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    const offsetSign = offset >= 0 ? '+' : '-';

    // 組合 ISO 8601 格式字串
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
}

// ============================================================
// 日誌輸出函式
// ============================================================

/**
 * 印出帶有時間戳記的日誌訊息
 * @param {string} message - 要輸出的訊息
 */
export function log(message) {
    console.log(`${getTimestamp()} ${message}`);
}

/**
 * 印出帶有時間戳記的錯誤訊息
 * @param {string} message - 要輸出的錯誤訊息
 */
export function logError(message) {
    console.error(`${getTimestamp()} [ERROR] ${message}`);
}
