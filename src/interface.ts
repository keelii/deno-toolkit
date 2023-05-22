export interface Result<T> {
  data: T;
  error: string;
}

export interface HashResult {
  name: string;
  md5: string;
  crc16: [string, string];
  crc32: [string, string];
  sha1: [string, string];
  sha256: [string, string];
  sha512: [string, string];
  sha384: [string, string];
}
export type FormatExt = "ts" | "tsx" | "js" | "jsx" | "json" | "md";
export interface FormatOptions {
  useTabs: boolean;
  useSemi: boolean;
  singleQuote: boolean;
  content: string;
  ext: FormatExt;
}
export type StoredFormatOptions = Omit<FormatOptions, "content">;
export type DiffType = "chars" | "lines" | "json";
export interface DifferOptions {
  left: string;
  right: string;
  type: DiffType;
}
