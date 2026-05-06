# ICEA 國際總會網站

這個 `docs/` 目錄是 GitHub Pages 發佈版本。

## GitHub Pages 設定

1. 把整個專案推到 GitHub。
2. 到 repository 的 `Settings -> Pages`。
3. `Build and deployment` 的 `Source` 選 `GitHub Actions`。
4. 推送到 `main` 後，`.github/workflows/pages.yml` 會部署 `docs/`。
5. 等待 `Deploy ICEA site to GitHub Pages` workflow 完成。

## 目錄內容

- `index.html`: 頁面入口
- `styles.css`: 樣式
- `app.js`: 前端互動
- `assets/data.js`: 會員資料
- `assets/icea-flag.jpg`: 旗幟圖片
- `.nojekyll`: 停用 Jekyll 處理，避免靜態資源被干擾
