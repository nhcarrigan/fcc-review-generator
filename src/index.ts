/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { mdToPdf } from "md-to-pdf";
import order from "../data/order.json" assert { type: "json" };
import { options } from "./config/options.js";
import { starterText } from "./config/text.js";

const flattenedOrder: Array<string> = order.chapters.flatMap((chapter) => {
  return chapter.modules.flatMap((module) => {
    return module.blocks;
  });
});

const readDirectoryRecursively = async(
  directory: string,
): Promise<Array<string>> => {
  const dirents = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async(dirent) => {
      const result = join(directory, dirent.name);
      return dirent.isDirectory()
        ? await readDirectoryRecursively(result)
        : result;
    }),
  );
  return files.flat();
};

const sortFiles = (a: string, b: string): number => {
  const aDashedName = a.split("/").at(1);
  const bDashedName = b.split("/").at(1);
  const aIndex = flattenedOrder.indexOf(aDashedName ?? "");
  const bIndex = flattenedOrder.indexOf(bDashedName ?? "");
  return aIndex - bIndex;
};

interface FileEntry {
  body:  string;
  title: string;
}

const slugify = (text: string): string => {
  return text.
    toLowerCase().
    replaceAll(/[^\w\s-]/gu, "").
    replaceAll(/\s+/gu, "-");
};

const processFile = async(file: string): Promise<FileEntry> => {
  const content = await readFile(file, "utf8");
  const titleMatch = /^title: (?<title>.*)/mu.exec(content);
  const title = titleMatch?.groups?.title ?? "Unknown";
  const body = content.
    replace(/^---\n[\S\s]*?\n---\n/u, "").
    trim().
    replace(/^#+ --.*--/u, "").
    trim().
    replaceAll(/^:::.*$/gmu, "").
    trim();
  return { body, title };
};

const rollupFiles = async(
  inputDirectory: string,
  outputFile: string,
): Promise<void> => {
  try {
    console.log("Process started...");
    console.log("Reading content directory...");
    const unsortedFiles = await readDirectoryRecursively(inputDirectory);
    const files = unsortedFiles.toSorted(sortFiles);
    console.log("Files found, processing...");
    const mdFiles = files.filter((file) => {
      return file.endsWith(".md");
    });
    const entries = await Promise.all(
      mdFiles.map(async(file) => {
        return await processFile(file);
      }),
    );
    const tocLines = entries.map(({ title }) => {
      return `- [${title}](#${slugify(title)})`;
    });
    const toc = `## Table of Contents\n\n${tocLines.join("\n")}\n\n---`;
    const sections = entries.map(({ body, title }) => {
      return `---\n\n# ${title}\n\n${body}\n\n`;
    });

    await writeFile(outputFile, `${starterText}\n${toc}\n\n${sections.join("")}`);
    console.log(`Successfully rolled up files into ${outputFile}`);
  } catch (error) {
    console.error("Error rolling up files:", error);
  }
};

const createPdf = async(inputPath: string): Promise<void> => {
  console.log("Creating PDF...");
  const pdf = await mdToPdf({ path: inputPath }, options);
  console.log("PDF created!");
  await writeFile("./fcc-review-pages.pdf", pdf.content);
  console.log("PDF written to disk!");
};

const inputDirectory = "./content";
const outputFilePath = "./review.md";

await rollupFiles(inputDirectory, outputFilePath);
await createPdf(outputFilePath);
await unlink(outputFilePath);
