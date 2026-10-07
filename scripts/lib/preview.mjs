import { spawn } from 'node:child_process';

const PORT = 4173;

/**
 * Serves dist/ with `vite preview` unless BASE_URL is set. Resolves with { url, stop } once the server
 * answers; `stop()` is idempotent and also runs on process exit so a failed run never orphans the port.
 */
export async function startPreview() {
  const base = process.env.BASE_URL;
  if (base) return { url: base, stop: () => {} };
  const child = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
  const stop = () => { if (!child.killed) child.kill(); };
  process.on('exit', stop);
  const url = `http://localhost:${PORT}/`;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(url)).ok) return { url, stop }; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  stop();
  throw new Error(`vite preview did not answer on ${url}`);
}
