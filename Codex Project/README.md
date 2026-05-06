# ICEA Website Project

ICEA 國際總會網站已整理成單一來源的靜態專案。

## Structure

- `site/`: 唯一維護中的網站來源
- `docs/`: GitHub Pages 發佈輸出
- `scripts/build.mjs`: 從 `site/` 建置到 `docs/`
- `scripts/preview.mjs`: 本機預覽伺服器

## Local workflow

1. 編輯 `site/`
2. 執行 `npm run build`
3. 執行 `npm run preview`
4. 確認後推送到 GitHub

## GitHub Pages

Pages source 請設為 `Deploy from a branch`，分支選你的主分支，資料夾選 `/docs`。

每次更新網站時，先在本機執行 `npm run build`，再把變更推到 GitHub。
