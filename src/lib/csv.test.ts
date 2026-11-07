import { describe, expect, it } from 'vitest';
import { csvCell, toCsv } from './csv';

describe('csvCell', () => {
  it('quotes commas, quotes and newlines', () => {
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell('line1\nline2')).toBe('"line1\nline2"');
  });
  it('renders null/undefined as empty and dates as ISO', () => {
    expect(csvCell(null)).toBe('');
    expect(csvCell(undefined)).toBe('');
    expect(csvCell(new Date('2026-01-02T03:04:05Z'))).toBe('2026-01-02T03:04:05.000Z');
  });
  it.each(['=1+1', '+SUM(A1)', '-2+3', '@cmd', '=HYPERLINK("http://evil","x")'])(
    'neutralises formula injection: %s',
    (v) => {
      expect(csvCell(v).replace(/^"/, '').startsWith("'")).toBe(true);
    },
  );
  it('leaves normal text and numbers alone', () => {
    expect(csvCell('Rahul')).toBe('Rahul');
    expect(csvCell(495)).toBe('495');
  });
});

describe('toCsv', () => {
  it('joins with CRLF and a trailing newline', () => {
    expect(toCsv(['a', 'b'], [[1, 'x,y']])).toBe('a,b\r\n1,"x,y"\r\n');
  });
});
