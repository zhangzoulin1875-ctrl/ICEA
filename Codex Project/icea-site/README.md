# ICEA 國際總會網站

這是一個純靜態網站，可直接開啟 `index.html` 使用。

## 檔案

- `index.html`: 網站頁面結構
- `styles.css`: 視覺樣式
- `app.js`: 搜尋、篩選、統計與資料渲染
- `assets/data.js`: 由 `國際總會資料庫.xlsx` 轉出的會員資料
- `assets/icea-flag.jpg`: ICEA 旗幟素材

## 本機使用

直接用瀏覽器開啟：

```text
C:\Users\admin\OneDrive\เอกสาร\Codex Project\icea-site\index.html
```

## GitHub Pages

建議使用 repository 內的 GitHub Actions workflow 發佈 `docs/` 目錄。到 `Settings -> Pages`，把 `Source` 設成 `GitHub Actions`，再推送到 `main` 即可。
