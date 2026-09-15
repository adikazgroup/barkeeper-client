import { CustomFile } from "./types";

export function generateFileId() {
  return crypto.randomUUID();
}

export function formatBytes(bytes: number) {
  if (!bytes) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function revokeFileUrl(file: CustomFile) {
  if (!file.isServerFile && file.url && file.url.startsWith("blob:")) {
    URL.revokeObjectURL(file.url);
  }
}
