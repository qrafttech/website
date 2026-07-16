export interface RichSegment {
  text: string;
  strong?: boolean;
  accent?: boolean;
  underline?: boolean;
  href?: string;
}

export type RichText = readonly RichSegment[];

export interface StreamRow {
  ix: string;
  text: string;
  status: string;
  sub?: string;
}

export interface StreamSession {
  number: number;
  rows: readonly StreamRow[];
}
