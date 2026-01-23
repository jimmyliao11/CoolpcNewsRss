/**
 * 網頁爬蟲模組
 * 負責從原價屋網站抓取最新文章資訊
 */

import axios from 'axios';
import { log, logError } from './utils.js';

// ============================================================
// 常數定義
// ============================================================

/** 原價屋 API 端點 */
const API_URL = 'https://www.coolpc.com.tw/tw/wp-admin/admin-ajax.php';

/** 網站基礎 URL，用於組合完整文章連結 */
const BASE_URL = 'https://www.coolpc.com.tw';

/** POST 請求的表單資料 */
const REQUEST_BODY = 'query_params%5Bpost_types%5D=post%2Cproduct&query_params%5Bi_attachment%5D=&query_params%5Btaxonomies%5D=product_cat&query_params%5Bmulti_post_types%5D=post%2Cproduct&query_params%5Bmulti_taxonomies%5D=&query_params%5Bquery_types%5D=0&query_params%5Bi_taxonomies%5D=&query_params%5Be_taxonomies%5D=&query_params%5Bi_ids%5D=&query_params%5Bcq_operator%5D=0&query_params%5Be_ids%5D=&query_params%5Bquery_author%5D=&query_params%5Bquery_offset%5D=&query_params%5Bquery_include_children%5D=1&query_params%5Btoday_post%5D=0&query_params%5Bdatetime_meta%5D=&query_params%5Bwoo_query%5D=0&query_params%5Bpost_count%5D=300&query_params%5Bposts_per_page%5D=15&query_params%5Bd_i_filter%5D=&filter=&order=DESC&orderby=date&sub_opt_query%5Bmeta_key_query%5D=&sub_opt_query%5Bpaged%5D=1&sub_opt_query%5Bfirst_query%5D=off&sub_opt_query%5Btotal_pages%5D=20&sub_opt_query%5Bitems_last_page%5D=0&sub_opt_query%5Bquery_operator%5D=0&sub_opt_query%5Bquery_relation%5D=0&options%5Blayout_style%5D=4&options%5Bbutton_gallery_name%5D=Gallery&options%5Bgrid_style%5D=0&options%5Blist_style%5D=0&options%5Bcarousel_t_style%5D=0&options%5Bcarousel_f_style%5D=0&options%5Bcreative_style%5D=0&options%5Btimeline_style%5D=0&options%5Bblock_content_style%5D=0&options%5Bsync_slider_style%5D=0&options%5Bgrid_masonry%5D=0&options%5Bshow_arrows%5D=1&options%5Barrows_outside%5D=0&options%5Bshow_dots%5D=1&options%5Binfinite%5D=1&options%5Bautoplay%5D=1&options%5Bautoplayspeed%5D=5000&options%5Bscrollperpage%5D=1&options%5Bspeed%5D=500&options%5Bcentermode%5D=0&options%5Bsync_slider_height_d%5D=&options%5Bsync_slider_height_t%5D=&options%5Bsync_slider_height_m%5D=&options%5Bsync_slider_width_d%5D=&options%5Bsync_slider_width_t%5D=&options%5Bsync_slider_width_m%5D=&options%5Bshow_elements%5D=0&options%5Bav_content%5D=0&options%5Bcc_mobile%5D=0&options%5Bcc_portrait_tablet%5D=0&options%5Bcc_landscape_tablet%5D=0&options%5Bcc_small_desktop%5D=0&options%5Bcc_medium_desktop%5D=0&options%5Bcc_large_desktop%5D=0&options%5Bcc_extra_large_desktop%5D=0&options%5Bimage_size%5D=full&options%5Bimage_size_s%5D=thumbnail&options%5Bs_image%5D=1&options%5Bs_image_link%5D=1&options%5Bs_image_link_target%5D=0&options%5Bs_icon_lightbox_video%5D=0&options%5Bvideo_url_meta%5D=0&options%5Bvideo_url_meta_key%5D=&options%5Bs_icon_lightbox_image%5D=0&options%5Bs_icon_link%5D=0&options%5Bs_icon_link_target%5D=0&options%5Bs_image_hover_effect%5D=0&options%5Bs_overlay_hover_effect%5D=&options%5Bs_overlay_settings%5D=0&options%5Bs_overlay_color%5D=&options%5Bs_image_post_format%5D=0&options%5Bs_image_post_format_pos%5D=ul-bottom-right&options%5Bs_image_avatar%5D=0&options%5Bs_title%5D=1&options%5Bs_title_limit%5D=0&options%5Bs_title_link%5D=1&options%5Bs_title_link_target%5D=0&options%5Bs_excerpt%5D=1&options%5Bs_excerpt_rbtn%5D=1&options%5Bs_excerpt_f%5D=get_the_excerpt&options%5Bs_excerpt_sc%5D=1&options%5Bs_excerpt_sh%5D=1&options%5Bs_excerpt_length%5D=250&options%5Bs_categories%5D=0&options%5Bs_s_categories%5D=0&options%5Bs_s_categories_parent%5D=0&options%5Bex_items_taxonomies%5D=&options%5Bs_c_categories%5D=0&options%5Bs_ct_categories%5D=&options%5Bs_cb_categories%5D=&options%5Bs_categories_target%5D=0&options%5Bs_metas_o%5D=1&options%5Bs_metas_o_author%5D=1&options%5Bs_metas_o_author_avatar%5D=0&options%5Bs_metas_o_time%5D=1&options%5Btime_format%5D=Y%2Fm%2Fd&options%5Bs_metas_o_comment%5D=0&options%5Bs_metas_o_like%5D=0&options%5Bs_metas_o_share%5D=0&options%5Bcustom_meta_o%5D=&options%5Bs_metas_t%5D=0&options%5Bs_metas_t_author%5D=0&options%5Bs_metas_t_author_avatar%5D=0&options%5Bs_metas_t_time%5D=0&options%5Btime_format_t%5D=F+j%2C+Y&options%5Bs_metas_t_comment%5D=0&options%5Bs_metas_t_like%5D=1&options%5Bs_metas_t_share%5D=1&options%5Bcustom_meta_t%5D=&options%5Bs_metas_t_readmore%5D=1&options%5Bs_metas_t_readmore_link_target%5D=0&options%5Bshare_text%5D=%E5%88%86%E4%BA%AB&options%5Bread_more_text%5D=%E7%B9%BC%E7%BA%8C%E7%9C%8B%E4%B8%8B%E5%8E%BB&options%5Bbefore_author_text%5D=&options%5Bpagination%5D=1&options%5Bloadmore_text%5D=&options%5Bprev_text%5D=&options%5Bnext_text%5D=&options%5Banimate%5D=default&options%5Blazyload%5D=0&options%5Blazyload_p%5D=&options%5Bgeodirectory_rating%5D=0&options%5Bquick_view%5D=0&options%5Bquick_view_mode%5D=0&options%5Bextra_class%5D=&options%5Brnd_id%5D=ul84712&options%5Bs_title_small%5D=1&options%5Bs_title_limit_small%5D=0&options%5Bs_title_link_small%5D=1&options%5Bs_title_link_target_small%5D=0&options%5Bs_categories_small%5D=1&options%5Bs_s_categories_small%5D=0&options%5Bs_s_categories_parent_small%5D=0&options%5Bex_items_taxonomies_small%5D=&options%5Bs_c_categories_small%5D=0&options%5Bs_ct_categories_small%5D=&options%5Bs_cb_categories_small%5D=&options%5Bs_categories_target_small%5D=0&options%5Bs_metas_o_small%5D=1&options%5Bs_metas_o_author_small%5D=1&options%5Bs_metas_o_author_avatar_small%5D=0&options%5Bs_metas_o_time_small%5D=1&options%5Btime_format_small%5D=F+j%2C+Y&options%5Bs_metas_o_comment_small%5D=1&options%5Bs_metas_o_like_small%5D=0&options%5Bs_metas_o_share_small%5D=0&options%5Bcustom_meta_o_small%5D=&options%5Bwoo_show_price%5D=0&options%5Bwoo_show_rating%5D=0&options%5Bwoo_show_cart%5D=0&options%5Bqv_s_title%5D=1&options%5Bqv_s_categories%5D=1&options%5Bqv_s_s_categories%5D=0&options%5Bqv_s_s_categories_parent%5D=0&options%5Bqv_ex_items_taxonomies%5D=&options%5Bqv_s_c_categories%5D=0&options%5Bqv_s_ct_categories%5D=&options%5Bqv_s_cb_categories%5D=&options%5Bqv_s_categories_target%5D=0&options%5Bqv_s_metas_o%5D=1&options%5Bqv_s_metas_o_author%5D=1&options%5Bqv_s_metas_o_author_avatar%5D=0&options%5Bqv_s_metas_o_time%5D=1&options%5Bqv_time_format%5D=F+j%2C+Y&options%5Bqv_s_metas_o_comment%5D=1&options%5Bqv_s_metas_o_like%5D=1&options%5Bqv_custom_meta_o%5D=&options%5Bqv_show_content%5D=1&options%5Bqv_content_stripsc%5D=0&options%5Bqv_show_share%5D=1&options%5Bqv_woo_show_rating%5D=1&options%5Bqv_s_featured_image%5D=1&options%5Bgoo_ads_client%5D=&options%5Bgoo_ads_id%5D=&options%5Bgoo_ads_offset%5D=1&options%5Bcss_class%5D=&random_id=ul84712&action=ultimatelayoutsajaxaction';

/** HTTP 請求標頭 */
const REQUEST_HEADERS = {
    'accept': 'text/html, */*; q=0.01',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-requested-with': 'XMLHttpRequest',
    'Referer': 'https://www.coolpc.com.tw/tw/'
};

// ============================================================
// HTML 解析函式
// ============================================================

/**
 * 解碼 HTML 實體字元
 * @param {string} text - 包含 HTML 實體的文字
 * @returns {string} 解碼後的純文字
 */
function decodeHtmlEntities(text) {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#8230;/g, '...')
        .replace(/&#8211;/g, '-')
        .replace(/&nbsp;/g, ' ')
        .trim();
}

/**
 * 從 HTML 中擷取所有文章資料
 * 使用正則表達式解析，避免引入額外的 HTML 解析套件
 * @param {string} html - 原始 HTML 字串
 * @returns {Array<Object>} 文章物件陣列
 */
function parseArticles(html) {
    const articles = [];

    // 正則表達式：匹配每個 <article> 區塊
    const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/gi;
    let articleMatch;

    while ((articleMatch = articleRegex.exec(html)) !== null) {
        const articleHtml = articleMatch[1];

        try {
            // 擷取標題和連結
            // 格式: <a ... href="/tw/shop/..." title="完整標題" class="ultimate-layouts-title-link">顯示標題</a>
            const titleLinkRegex = /<a[^>]*class="ultimate-layouts-title-link"[^>]*href="([^"]+)"[^>]*title="([^"]+)"[^>]*>/i;
            const titleLinkMatch = articleHtml.match(titleLinkRegex);

            // 備用格式：href 和 title 順序可能不同
            const titleLinkRegexAlt = /<a[^>]*href="([^"]+)"[^>]*title="([^"]+)"[^>]*class="ultimate-layouts-title-link"[^>]*>/i;
            const titleLinkMatchAlt = articleHtml.match(titleLinkRegexAlt);

            const linkMatch = titleLinkMatch || titleLinkMatchAlt;

            // 擷取日期
            // 格式: <div data-class="ul-time-metas">...<span>2026/01/23</span></div>
            const dateRegex = /<div[^>]*data-class="ul-time-metas"[^>]*>[\s\S]*?<span>([^<]+)<\/span>/i;
            const dateMatch = articleHtml.match(dateRegex);

            // 擷取摘要
            // 格式: <div class="ultimate-layouts-excerpt">摘要文字...<a href=...>繼續看下去</a></div>
            const excerptRegex = /<div[^>]*class="ultimate-layouts-excerpt[^"]*"[^>]*>([\s\S]*?)<a[^>]*class="ultimate-layouts-readmore-excerpt"/i;
            const excerptMatch = articleHtml.match(excerptRegex);

            // 組合文章資料
            if (linkMatch) {
                const link = linkMatch[1];
                const title = decodeHtmlEntities(linkMatch[2]);
                const date = dateMatch ? dateMatch[1].trim() : '';
                const description = excerptMatch
                    ? decodeHtmlEntities(excerptMatch[1].replace(/<[^>]+>/g, ''))
                    : '';

                articles.push({
                    title,
                    // 將相對路徑轉換為完整 URL
                    link: link.startsWith('http') ? link : `${BASE_URL}${link}`,
                    date,
                    description
                });
            }
        } catch (error) {
            // 單篇文章解析失敗，記錄錯誤但繼續處理下一篇
            logError(`解析文章時發生錯誤: ${error.message}`);
        }
    }

    return articles;
}

// ============================================================
// 主要爬蟲函式
// ============================================================

/**
 * 執行網頁爬蟲，從原價屋 API 取得最新文章列表
 * @returns {Promise<Array<Object>>} 文章物件陣列，每個物件包含 title, link, date, description
 */
export async function scrapeNews() {
    log('開始爬取原價屋最新文章...');

    try {
        // 發送 POST 請求到原價屋 API
        log('正在發送 HTTP 請求...');
        const response = await axios.post(API_URL, REQUEST_BODY, {
            headers: REQUEST_HEADERS,
            timeout: 30000 // 30 秒逾時
        });

        log(`HTTP 請求成功，狀態碼: ${response.status}`);

        // 解析回傳的 HTML
        const html = response.data;
        log(`收到回應資料，長度: ${html.length} 字元`);

        // 從 HTML 中擷取文章資訊
        const articles = parseArticles(html);
        log(`成功解析 ${articles.length} 篇文章`);

        return articles;

    } catch (error) {
        logError(`爬取文章時發生錯誤: ${error.message}`);
        throw error;
    }
}
