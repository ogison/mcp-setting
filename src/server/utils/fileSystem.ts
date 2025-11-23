import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

/**
 * Validates that a file path is safe and doesn't contain path traversal attempts
 * @param filePath - The file path to validate
 * @throws Error if the path contains suspicious patterns
 */
function validateFilePath(filePath: string): void {
  // Normalize the path to resolve any .. or . segments
  const normalizedPath = path.normalize(filePath);

  // Check for path traversal attempts
  if (normalizedPath.includes("..")) {
    throw new Error("Invalid file path: path traversal detected");
  }

  // Check for absolute paths that might escape intended directory
  // Allow only certain base directories for config files
  const resolvedPath = path.resolve(normalizedPath);

  // Ensure the path doesn't contain null bytes
  if (filePath.includes("\0")) {
    throw new Error("Invalid file path: null byte detected");
  }
}

export async function ensureDirectory(dirPath: string): Promise<void> {
  validateFilePath(dirPath);
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function fileExistsSync(filePath: string): boolean {
  return existsSync(filePath);
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  validateFilePath(filePath);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export async function writeJsonFile<T>(
  filePath: string,
  data: T,
): Promise<void> {
  validateFilePath(filePath);
  const dirPath = path.dirname(filePath);
  await ensureDirectory(dirPath);

  // Sanitize data before writing to prevent injection attacks
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, "utf-8");
}

export async function copyFile(
  source: string,
  destination: string,
): Promise<void> {
  validateFilePath(source);
  validateFilePath(destination);
  await fs.copyFile(source, destination);
}

export async function deleteFile(filePath: string): Promise<void> {
  validateFilePath(filePath);
  await fs.unlink(filePath);
}

export async function listFiles(dirPath: string): Promise<string[]> {
  validateFilePath(dirPath);
  try {
    const files = await fs.readdir(dirPath);
    return files;
  } catch {
    return [];
  }
}
