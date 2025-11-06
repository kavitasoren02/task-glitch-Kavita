import { Task } from '@/types';

export function toCSV(tasks: ReadonlyArray<Task>): string {
  // Stable header order to avoid drifting column order across runs
  const headers = ['id', 'title', 'revenue', 'timeTaken', 'priority', 'status', 'notes'];
  const rows = tasks.map(t => [
    escapeCsv(t.id),
    escapeCsv(t.title),
    escapeCsv(String(t.revenue)),
    escapeCsv(String(t.timeTaken)),
    escapeCsv(t.priority),
    escapeCsv(t.status),
    escapeCsv(t.notes ?? ''),
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function escapeCsv(v: string | null | undefined): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  // Escape double quotes by doubling them
  const escaped = s.replace(/"/g, '""');
  // Quote the field if it contains a quote, comma, CR or newline
  if (/[",\n\r]/.test(s)) {
    return `"${escaped}"`;
  }
  return escaped;
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


