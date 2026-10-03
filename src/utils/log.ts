export interface LogEntry {
  time: string;
  tag: string;
  msg: string;
  data?: unknown;
}

const MAX_ENTRIES = 200;
const entries: LogEntry[] = [];

function enabled(): boolean {
  return (
    import.meta.env.DEV ||
    new URLSearchParams(window.location.search).has('debug')
  );
}

export function logEvent(tag: string, msg: string, data?: unknown): void {
  if (!enabled()) return;
  entries.push({ time: new Date().toISOString(), tag, msg, data });
  if (entries.length > MAX_ENTRIES) entries.shift();
  if (data === undefined) console.log(`[chow:${tag}] ${msg}`);
  else console.log(`[chow:${tag}] ${msg}`, data);
}

export function getLogs(): LogEntry[] {
  return [...entries];
}
