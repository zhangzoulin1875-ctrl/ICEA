import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const rootDir = resolve(process.cwd(), "docs");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function resolvePath(urlPath) {
  const safePath = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const relativePath = safePath === "/" ? "/index.html" : safePath;
  return join(rootDir, relativePath);
}

const server = createServer((request, response) => {
  const filePath = resolvePath(request.url || "/");
  const fallbackPath = join(rootDir, "index.html");
  const targetPath = existsSync(filePath) ? filePath : fallbackPath;
  const extension = extname(targetPath);
  const contentType = mimeTypes[extension] || "application/octet-stream";

  try {
    const content = readFileSync(targetPath);
    response.writeHead(targetPath === filePath ? 200 : 404, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });
    response.end(content);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Preview server error: ${error instanceof Error ? error.message : "unknown error"}`);
  }
});

server.listen(port, () => {
  console.log(`ICEA preview server running at http://localhost:${port}`);
});
