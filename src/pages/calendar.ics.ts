import type { APIRoute } from 'astro';
import workshop from '../data/workshop.json';

const MONTHS: Record<string, string> = {
  January: '01', February: '02', March: '03', April: '04',
  May: '05', June: '06', July: '07', August: '08',
  September: '09', October: '10', November: '11', December: '12',
};

function parseDateISO(dateStr: string): string {
  const m = dateStr.match(/(\d+)\w*\s+(\w+)\s+(\d{4})/);
  if (!m) throw new Error(`Cannot parse date: ${dateStr}`);
  const month = MONTHS[m[2]];
  if (!month) throw new Error(`Unknown month: ${m[2]}`);
  return `${m[3]}-${month}-${m[1].padStart(2, '0')}`;
}

function parseMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToHHMM(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function toICSDateTime(isoDate: string, time: string): string {
  return isoDate.replace(/-/g, '') + 'T' + time.replace(':', '') + '00Z';
}

function escapeText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [line.slice(0, 75)];
  let i = 75;
  while (i < line.length) {
    chunks.push(' ' + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join('\r\n');
}

function prop(name: string, value: string): string {
  return foldLine(`${name}:${value}`) + '\r\n';
}

function generateICS(): string {
  const isoDate = parseDateISO(workshop.date);
  const schedule = workshop.schedule;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const vevents = schedule.map((item, i) => {
    const endTime = i + 1 < schedule.length
      ? schedule[i + 1].time
      : minutesToHHMM(parseMinutes(item.time) + 60);

    const parts: string[] = [];
    if ('abstract' in item && item.abstract) {
      parts.push(item.abstract);
    }
    if ('speaker' in item && item.speaker && item.speaker !== 'TBC') {
      parts.push(`Speaker: ${item.speaker}`);
    }
    const description = parts.map(escapeText).join('\\n\\n');

    let lines = 'BEGIN:VEVENT\r\n';
    lines += prop('UID', `nsai-workshop-2026-event-${i}@spike.imperial.ac.uk`);
    lines += prop('DTSTAMP', now);
    lines += prop('DTSTART', toICSDateTime(isoDate, item.time));
    lines += prop('DTEND', toICSDateTime(isoDate, endTime));
    lines += prop('SUMMARY', escapeText(item.title));
    lines += prop('LOCATION', escapeText(workshop.location));
    if (description) {
      lines += prop('DESCRIPTION', description);
    }
    lines += 'END:VEVENT\r\n';
    return lines;
  });

  const vtimezone = [
    'BEGIN:VTIMEZONE',
    'TZID:Europe/London',
    'BEGIN:STANDARD',
    'DTSTART:19701025T020000',
    'RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0000',
    'TZNAME:GMT',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:19700329T010000',
    'RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3',
    'TZOFFSETFROM:+0000',
    'TZOFFSETTO:+0100',
    'TZNAME:BST',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
  ].join('\r\n') + '\r\n';

  let cal = 'BEGIN:VCALENDAR\r\n';
  cal += 'VERSION:2.0\r\n';
  cal += 'PRODID:-//SPIKE Imperial College London//NSAI Workshop 2026//EN\r\n';
  cal += 'CALSCALE:GREGORIAN\r\n';
  cal += 'METHOD:PUBLISH\r\n';
  cal += prop('X-WR-CALNAME', 'Neuro-symbolic AI Workshop 2026');
  cal += prop('X-WR-CALDESC', escapeText('SPIKE Research Group Workshop, Imperial College London'));
  cal += 'X-WR-TIMEZONE:Europe/London\r\n';
  cal += vtimezone;
  cal += vevents.join('');
  cal += 'END:VCALENDAR\r\n';

  return cal;
}

export const GET: APIRoute = () => {
  return new Response(generateICS(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
    },
  });
};
