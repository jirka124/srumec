import http from "http";
import fs from "fs";
import path from "path";

const htmlPath = path.join(process.cwd(), "src/docs/ws-docs.html");

export function startDocsServer(port = 4001) {
  const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.url !== "/ws/docs" && req.url !== "/ws/docs/") {
      res.writeHead(404);
      return res.end("Not found");
    }

    try {
      const html = fs.readFileSync(htmlPath, "utf8");
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(html);
    } catch (e) {
      res.writeHead(500);
      return res.end("Docs file not found");
    }
  });

  server.listen(port, () =>
    console.log(`Static WS docs running → http://localhost:${port}/ws/docs`)
  );
}
