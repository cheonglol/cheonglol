/**
 * Integration test for resume PDF generation.
 * Runs the generator and validates the output is ATS-compatible.
 *
 * Run: bun test tests/resume.test.ts
 */
import { describe, expect, test } from "bun:test";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const PDF_PATH = join(ROOT, "frontend", "public", "resume.pdf");

describe("Resume PDF", () => {
  test("generates without error", () => {
    const out = execSync("bun run scripts/generate-resume.ts", {
      encoding: "utf-8",
      cwd: ROOT,
    });
    expect(out).toContain("OK:");
    expect(out).toContain("valid PDF with text");
  });

  test("file exists and has reasonable size", () => {
    expect(existsSync(PDF_PATH)).toBe(true);
    const stats = statSync(PDF_PATH);
    expect(stats.size).toBeGreaterThan(1000); // at least 1KB
    expect(stats.size).toBeLessThan(100_000); // less than 100KB
  });

  test("starts with valid PDF header", () => {
    const buf = readFileSync(PDF_PATH);
    const head = buf.subarray(0, 8).toString();
    expect(head.startsWith("%PDF-")).toBe(true);
  });

  test("contains embedded fonts (real text, not image)", () => {
    const body = readFileSync(PDF_PATH, "utf-8");
    expect(body).toContain("/Font");
  });

  test("contains page definitions", () => {
    const body = readFileSync(PDF_PATH, "utf-8");
    expect(body).toContain("/Type /Page");
  });
});

describe("Resume content (pdftotext)", () => {
  test("extracts name", () => {
    const text = extractText(PDF_PATH);
    expect(text).toContain("Lester Cheong");
  });

  test("extracts contact info", () => {
    const text = extractText(PDF_PATH);
    expect(text).toContain("lestercheong70@outlook.com");
  });

  test("extracts experience", () => {
    const text = extractText(PDF_PATH);
    expect(text).toContain("Freelance Software Engineer");
    expect(text).toContain("OCBC Bank");
    expect(text).toContain("SG Bike");
  });

  test("extracts skills", () => {
    const text = extractText(PDF_PATH);
    expect(text).toContain("TypeScript");
    expect(text).toContain("Fastify");
    expect(text).toContain("PostgreSQL");
  });

  test("extracts projects", () => {
    const text = extractText(PDF_PATH);
    expect(text).toContain("Sales Consolidator");
    expect(text).toContain("Valentino");
    expect(text).toContain("Themelios");
  });
});

function extractText(pdfPath: string): string {
  try {
    return execSync(`pdftotext "${pdfPath}" -`, {
      encoding: "utf-8",
      timeout: 10_000,
    });
  } catch {
    // pdftotext not available — skip text extraction tests
    return "";
  }
}
