// 合并 index.html + data.js 为单文件，内联数据，供 htmlcode.fun 发布
const fs = require('fs');
const dir = 'E:/WorkBuddy-submission/2026-08-18-12-53-27/dashboard/';
const html = fs.readFileSync(dir + 'index.html', 'utf8');
const dataJs = fs.readFileSync(dir + 'data.js', 'utf8');

// 提取 window.DASHBOARD_DATA = {...}; 整段
const m = dataJs.match(/window\.DASHBOARD_DATA\s*=\s*\{[\s\S]*?\}\s*;/);
if (!m) { console.error('未匹配到 DASHBOARD_DATA'); process.exit(1); }
const inline = '<script>\n' + m[0] + '\n</script>';

if (!html.includes('<script src="data.js"></script>')) {
  console.error('未找到 <script src="data.js"></script> 占位'); process.exit(1);
}
const out = html.replace('<script src="data.js"></script>', inline);

fs.writeFileSync(dir + 'standalone.html', out, 'utf8');
console.log('生成 standalone.html，大小', out.length, '字符');
