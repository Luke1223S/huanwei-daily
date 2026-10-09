// 环卫日报看板 · 构建 + 发布脚本
// 用途：把 index.html + data.js 合并为自包含单文件，输出到 docs/index.html 供 GitHub Pages 发布
//
// 目录约定：
//   index.html          看板模板（勿手改内容，改样式和结构改这里）
//   data.js             每日数据（自动化任务每天覆盖这个文件）
//   docs/index.html     构建产物 —— GitHub Pages 实际发布的页面
//   docs/.nojekyll      告诉 GitHub Pages 不要用 Jekyll 处理，保留原样
//
// 用法：node build.js

const fs = require('fs');
const path = require('path');

const dir = __dirname;
const p = (f) => path.join(dir, f);

// ---- 1. 读取模板与数据 ----
const html = fs.readFileSync(p('index.html'), 'utf8');
const dataJs = fs.readFileSync(p('data.js'), 'utf8');

// ---- 2. 提取 DASHBOARD_DATA 整段 ----
const m = dataJs.match(/window\.DASHBOARD_DATA\s*=\s*\{[\s\S]*?\}\s*;/);
if (!m) {
  console.error('✗ 未在 data.js 中匹配到 window.DASHBOARD_DATA');
  process.exit(1);
}
const inlineData = '<script>\n' + m[0] + '\n</script>';

// ---- 3. 校验模板里有外链占位 ----
const PLACEHOLDER = '<script src="data.js"></script>';
if (!html.includes(PLACEHOLDER)) {
  console.error('✗ 未找到占位标签 ' + PLACEHOLDER);
  console.error('  index.html 必须保留这一行，数据才会被内联进来。');
  process.exit(1);
}

// ---- 4. 合并 ----
let out = html.replace(PLACEHOLDER, inlineData);

// ---- 5. 同步标题日期（避免标题与数据日期不一致） ----
const dateMatch = dataJs.match(/date:\s*["'](\d{4}-\d{2}-\d{2})["']/);
if (dateMatch) {
  const d = dateMatch[1];
  out = out.replace(/<title>[^<]*<\/title>/, `<title>环卫采购信息日报看板 · ${d}</title>`);
  fs.writeFileSync(p('standalone.html'), out, 'utf8');
  console.log(`✓ 数据日期：${d}`);
} else {
  fs.writeFileSync(p('standalone.html'), out, 'utf8');
  console.log('! 未从 data.js 读到 date 字段，标题日期未同步');
}

// ---- 6. 校验产物自包含 ----
if (out.includes(PLACEHOLDER)) {
  console.error('✗ 产物仍存在外部 data.js 引用，不是自包含文件');
  process.exit(1);
}
if (/<script[^>]+src=/i.test(out)) {
  console.warn('! 产物中仍有其他外部脚本引用，请确认是否为预期');
}

// ---- 7. 输出到 docs/ ----
fs.mkdirSync(p('docs'), { recursive: true });
fs.writeFileSync(p('docs/index.html'), out, 'utf8');
fs.writeFileSync(p('docs/.nojekyll'), '', 'utf8');

const kb = (out.length / 1024).toFixed(1);
console.log(`✓ 构建完成：docs/index.html（${kb} KB，自包含）`);
console.log('  下一步：git add -A && git commit -m "update dashboard" && git push');
