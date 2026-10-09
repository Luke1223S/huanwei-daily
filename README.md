# 环卫采购信息日报看板

数据来源：中国政府采购网（ccgp.gov.cn）公开采购公告，按地区分组汇总。

## 目录结构

```
index.html      看板模板（样式与结构）
data.js         每日数据（自动化任务每天覆盖此文件）
build.js        构建脚本：合并模板+数据 → docs/index.html
docs/index.html 构建产物 —— GitHub Pages 发布的就是这个
standalone.html 同一产物的副本，方便本地单文件分享
```

## 日常更新流程

每天只需两步：

```bash
# 1. 更新数据后重新构建
node build.js

# 2. 提交并推送（推送后链接自动更新，约 1 分钟生效）
git add -A
git commit -m "update: 2026-10-09 日报"
git push
```

## 首次配置（已完成部分）

- [x] git 仓库初始化（main 分支）
- [x] 构建脚本，产物输出到 `docs/`
- [ ] 在 GitHub 新建公开仓库
- [ ] 推送代码：`git remote add origin <你的仓库地址>` 然后 `git push -u origin main`
- [ ] 仓库 Settings → Pages → Source 选 `main` 分支、`/docs` 目录，保存

## 线上地址

推送并开启 Pages 后为：

```
https://<你的用户名>.github.io/<仓库名>/
```

此链接长期不变，每天 push 后内容自动更新。

## 说明

- `docs/.nojekyll` 是空文件，用于阻止 GitHub Pages 用 Jekyll 处理，确保页面原样输出。
- 产物为完全自包含单文件（数据已内联），不依赖任何外部资源，可单独拷贝分享。
