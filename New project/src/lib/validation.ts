import { MAX_JAVA_FILE_BYTES } from "@/lib/constants";

const EXECUTABLE_EXTENSIONS = [
  ".exe",
  ".dll",
  ".bat",
  ".cmd",
  ".sh",
  ".jar",
  ".class",
  ".msi",
  ".com",
];

export function validateJavaFilename(filename: string) {
  const normalized = filename.trim().toLowerCase();

  if (!normalized.endsWith(".java")) {
    return "Only .java source files are supported.";
  }

  if (EXECUTABLE_EXTENSIONS.some((extension) => normalized.endsWith(extension))) {
    return "Executable or compiled files are not allowed.";
  }

  return null;
}

export function validateJavaSource(filename: string, code: string) {
  const filenameError = validateJavaFilename(filename);

  if (filenameError) {
    return filenameError;
  }

  if (!code.trim()) {
    return "The Java file is empty.";
  }

  const size = new TextEncoder().encode(code).byteLength;

  if (size > MAX_JAVA_FILE_BYTES) {
    return "The Java file must be 5MB or smaller.";
  }

  if (containsBinaryBytes(code)) {
    return "Binary files are not supported. Upload readable Java source code.";
  }

  return null;
}

export function containsBinaryBytes(value: string) {
  return /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value);
}
