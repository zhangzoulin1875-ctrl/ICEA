import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const rootDir = resolve(process.cwd());
const sourceDir = join(rootDir, "site");
const outputDir = join(rootDir, "docs");

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function cleanDir(path) {
  if (!existsSync(path)) {
    return;
  }

  for (const entry of readdirSync(path, { withFileTypes: true })) {
    rmSync(join(path, entry.name), { recursive: true, force: true });
  }
}

function writeRootRedirect() {
  const redirect = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=docs/">
    <title>ICEA 國際總會</title>
    <link rel="canonical" href="docs/">
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        color: #10192f;
        background: #f6f8fb;
        font-family: "Microsoft JhengHei", sans-serif;
      }

      a {
        color: #13244c;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <main>
      <p>正在前往 ICEA 國際總會網站。若沒有自動跳轉，請開啟 <a href="docs/">docs/</a>。</p>
    </main>
  </body>
</html>
`;

  writeFileSync(join(rootDir, "index.html"), redirect, "utf8");
}

ensureDir(outputDir);
cleanDir(outputDir);
cpSync(sourceDir, outputDir, { recursive: true });
writeFileSync(join(outputDir, ".nojekyll"), "", "utf8");
writeRootRedirect();

console.log(`Built site from ${sourceDir} to ${outputDir}`);
