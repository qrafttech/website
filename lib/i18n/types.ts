export interface RichSegment {
  text: string;
  strong?: boolean;
  accent?: boolean;
  underline?: boolean;
  href?: string;
}

export type RichText = readonly RichSegment[];
