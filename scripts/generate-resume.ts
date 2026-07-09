/**
 * PDF resume generator.
 * Reads resume-data.ts, produces ATS-compatible PDF at frontend/public/resume.pdf.
 * Run: bun run scripts/generate-resume.ts
 */
import PDFDocument from "pdfkit";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { resume, type Resume } from "./resume-data";

const OUTPUT = join(
  import.meta.dirname,
  "..",
  "frontend",
  "public",
  "resume.pdf",
);

async function generate(resumeData: Resume): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 40, left: 50, right: 50 },
      info: {
        Title: `${resumeData.basics.name} - Resume`,
        Author: resumeData.basics.name,
        Subject: "Resume",
      },
    });

    // Ensure output dir exists
    const outDir = dirname(OUTPUT);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => {
      writeFileSync(OUTPUT, Buffer.concat(chunks));
      console.log(`Wrote ${OUTPUT}`);
      resolve();
    });
    doc.on("error", reject);

    const { basics, work, skills, projects } = resumeData;
  const FONT = "Helvetica";
  const FONT_BOLD = "Helvetica-Bold";
  const FONT_SIZE_NAME = 22;
  const FONT_SIZE_SECTION = 12;
  const FONT_SIZE_BODY = 9;
  const FONT_SIZE_SUBTLE = 8;
  const LINE_GAP = 4;
  const SECTION_GAP = 14;

  let y = doc.y;

  // Name + label
  doc.font(FONT_BOLD).fontSize(FONT_SIZE_NAME).text(basics.name, 50, y, {
    continued: false,
  });
  y = doc.y + 2;
  doc
    .font(FONT)
    .fontSize(FONT_SIZE_BODY)
    .fillColor("#444444")
    .text(basics.label, { continued: false });
  y = doc.y;

  // Contact line
  const contactParts: string[] = [];
  if (basics.location?.city) contactParts.push(basics.location.city);
  if (basics.location?.countryCode) contactParts.push(basics.location.countryCode);
  contactParts.push(basics.email);
  if (basics.url) contactParts.push(basics.url);
  doc
    .font(FONT)
    .fontSize(FONT_SIZE_SUBTLE)
    .fillColor("#666666")
    .text(contactParts.join(" · "));
  y = doc.y + 4;

  // Summary
  if (basics.summary) {
    y = drawSectionHeader(doc, "Summary", y, FONT_BOLD, FONT_SIZE_SECTION, SECTION_GAP);
    y = drawBody(doc, basics.summary, y, FONT, FONT_SIZE_BODY, LINE_GAP);
    y += SECTION_GAP;
  }

  // Experience
  if (work && work.length > 0) {
    y = drawSectionHeader(doc, "Experience", y, FONT_BOLD, FONT_SIZE_SECTION, SECTION_GAP);
    for (const job of work) {
      // Company + position + dates
      doc.font(FONT_BOLD).fontSize(FONT_SIZE_BODY).fillColor("#000000");
      doc.text(job.position, 50, y);
      y = doc.y;
      doc
        .font(FONT)
        .fontSize(FONT_SIZE_SUBTLE)
        .fillColor("#444444")
        .text(`${job.name}  |  ${formatDate(job.startDate)} – ${formatDate(job.endDate) ?? "Present"}`);
      y = doc.y + 2;

      if (job.highlights && job.highlights.length > 0) {
        for (const h of job.highlights) {
          y = drawBullet(doc, h, y, FONT, FONT_SIZE_BODY, LINE_GAP);
        }
      }
      y += LINE_GAP;
    }
    y += SECTION_GAP - LINE_GAP;
  }

  // Skills
  if (skills && skills.length > 0) {
    y = drawSectionHeader(doc, "Skills", y, FONT_BOLD, FONT_SIZE_SECTION, SECTION_GAP);
    for (const skill of skills) {
      const keywords = skill.keywords?.join(", ") ?? "";
      doc.font(FONT_BOLD).fontSize(FONT_SIZE_BODY).fillColor("#000000");
      doc.text(skill.name + ": ", 50, y, { continued: true });
      doc.font(FONT).fillColor("#444444").text(keywords);
      y = doc.y + 2;
    }
    y += SECTION_GAP - LINE_GAP;
  }

  // Projects
  if (projects && projects.length > 0) {
    y = drawSectionHeader(doc, "Projects", y, FONT_BOLD, FONT_SIZE_SECTION, SECTION_GAP);
    for (const proj of projects) {
      doc.font(FONT_BOLD).fontSize(FONT_SIZE_BODY).fillColor("#000000");
      doc.text(proj.name, 50, y);
      y = doc.y + 1;
      doc.font(FONT).fontSize(FONT_SIZE_BODY).fillColor("#444444");
      doc.text(proj.description, { continued: false });
      y = doc.y + 2;

      if (proj.highlights && proj.highlights.length > 0) {
        for (const h of proj.highlights) {
          y = drawBullet(doc, h, y, FONT, FONT_SIZE_BODY, LINE_GAP);
        }
      }
      y += 2;
    }
  }

    doc.end();
  });
}

function drawSectionHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  y: number,
  fontBold: string,
  fontSize: number,
  gap: number,
): number {
  doc.font(fontBold).fontSize(fontSize).fillColor("#000000");
  doc.text(title, 50, y + 4);
  // Underline
  const lineY = doc.y + 2;
  doc
    .moveTo(50, lineY)
    .lineTo(545, lineY)
    .strokeColor("#cccccc")
    .lineWidth(0.5)
    .stroke();
  return lineY + gap;
}

function drawBody(
  doc: PDFKit.PDFDocument,
  text: string,
  y: number,
  font: string,
  fontSize: number,
  lineGap: number,
): number {
  doc.font(font).fontSize(fontSize).fillColor("#444444");
  doc.text(text, 50, y + 2, { lineGap });
  return doc.y;
}

function drawBullet(
  doc: PDFKit.PDFDocument,
  text: string,
  y: number,
  font: string,
  fontSize: number,
  lineGap: number,
): number {
  doc.font(font).fontSize(fontSize).fillColor("#444444");
  doc.text(`  - ${text}`, 50, y + 1, { lineGap, indent: 0 });
  return doc.y;
}

function formatDate(date?: string): string | undefined {
  if (!date) return undefined;
  const parts = date.split("-");
  if (parts.length === 0) return date;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const month = months[monthIndex] ?? parts[1];
  return `${month} ${parts[0]}`;
}

function validate(path: string): void {
  const buf = readFileSync(path);
  const size = buf.length;

  if (size < 500) {
    console.error(`FAIL: PDF too small (${size} bytes)`);
    process.exit(1);
  }

  const head = buf.subarray(0, 8).toString();
  if (!head.startsWith("%PDF-")) {
    console.error(`FAIL: invalid PDF header: ${head}`);
    process.exit(1);
  }

  const body = buf.toString("utf-8");
  if (!body.includes("/Font")) {
    console.error("FAIL: PDF contains no fonts — likely empty");
    process.exit(1);
  }

  console.log(`OK: ${path} (${size} bytes, valid PDF with text)`);
}

await generate(resume);
validate(OUTPUT);
