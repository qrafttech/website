/**
 * Copy that needs inline emphasis is stored as segments instead of markup, so a
 * dictionary stays a plain data file and stays translatable.
 */
export interface RichSegment {
  text: string;
  strong?: boolean;
  accent?: boolean;
  underline?: boolean;
  href?: string;
}

export type RichText = readonly RichSegment[];
