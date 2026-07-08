import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const port = Number(process.env.PORT ?? 8080);

const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml']
]);

export function resolvePublicPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0]);
  if (decodedPath.split('/').includes('..')) return null;
  const cleanPath = normalize(decodedPath).replace(/^\/+/, '');
  const requested = cleanPath === '' ? 'index.html' : cleanPath;
  const fullPath = join(root, requested);
  if (!fullPath.startsWith(root)) return null;
  return existsSync(fullPath) ? fullPath : join(root, 'index.html');
}

export const server = createServer((req, res) => {
  if (req.url === '/healthz' || req.url === '/readyz') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ ok: true, service: 'nebula-drift' }));
    return;
  }

  const fullPath = resolvePublicPath(req.url ?? '/');
  if (!fullPath) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('forbidden');
    return;
  }

  const contentType = types.get(extname(fullPath)) ?? 'application/octet-stream';
  res.writeHead(200, {
    'content-type': contentType,
    'cache-control': contentType.includes('html') ? 'no-cache' : 'public, max-age=31536000, immutable'
  });
  createReadStream(fullPath).pipe(res);
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen({ host: '0.0.0.0', port }, () => {
    console.log(`nebula-drift listening on :${port}`);
  });
}
