/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  readFile,
  appendFile,
  writeFile,
  readdir,
  unlink,
} from "node:fs/promises";
import { join } from "node:path";
import { mdToPdf } from "md-to-pdf";
import { options } from "./config/options.js";
import { starterText } from "./config/text.js";

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

const rollupFiles = async(
  inputDirectory: string,
  outputFile: string,
): Promise<void> => {
  try {
    console.log("Process started...");
    await writeFile(outputFile, `${starterText}\n`);
    console.log("Reading content directory...");
    const files = await readDirectoryRecursively(inputDirectory);
    for (const file of files) {
      if (file === ".gitkeep") {
        continue;
      }
      if (file.endsWith(".md")) {
        const content = await readFile(file, "utf8");
        const strippedFrontmatter = content.
          replace(/^---\n[\S\s]*?\n---\n/, "").
          trim();
        // Title is in front matter
        const title = /^title: (?<title>.*)/m.exec(content)?.groups?.title;
        const strippedFccHeadings = strippedFrontmatter.
          replace(/^#+ --.*--/, "").
          trim();
        await appendFile(
          outputFile,
          `---\n\n# ${title ?? "Unknown"}\n${strippedFccHeadings}\n\n`,
        );
      }
    }
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
