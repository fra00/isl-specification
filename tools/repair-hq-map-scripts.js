const fs = require("fs");
const path = require("path");

const DEFAULT_TARGET_DIR = path.resolve(
  __dirname,
  "..",
  "example",
  "hq",
  "bin",
  "public",
  "jsonData",
  "map",
);

const GRID_WIDTH = 27;
const GRID_HEIGHT = 20;
const GRID_FIELD_COUNT = 20;
const HEADER_FIELD_COUNT = 13;
const HERO_START_COUNT = 4;
const HERO_START_FIELD_COUNT = 3;
const DOOR_FIELD_COUNT = 3;
const SCRIPT_FIELD_COUNT = 7;

function parseWriteFields(content) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const fields = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (line === "" && index === lines.length - 1) {
      continue;
    }

    if (!line.startsWith('"')) {
      fields.push(line);
      continue;
    }

    let value = line.slice(1);
    while (!value.endsWith('"')) {
      index += 1;
      if (index >= lines.length) {
        throw new Error(
          "Unexpected end of file while reading quoted VB6 field",
        );
      }
      value += "\n" + lines[index];
    }

    fields.push(value.slice(0, -1).replace(/""/g, '"'));
  }

  return fields;
}

function parseBoolean(value) {
  if (value === "#TRUE#") {
    return true;
  }
  if (value === "#FALSE#") {
    return false;
  }
  return Boolean(value);
}

function parseInteger(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function extractOriginalScripts(mmpContent) {
  const fields = parseWriteFields(mmpContent);
  const npr = parseInteger(fields[9]);
  const nscript = parseInteger(fields[12]);

  let pointer = HEADER_FIELD_COUNT;
  pointer += GRID_WIDTH * GRID_HEIGHT * GRID_FIELD_COUNT;
  pointer += HERO_START_COUNT * HERO_START_FIELD_COUNT;
  pointer += (npr + 1) * DOOR_FIELD_COUNT;

  const scripts = [];
  for (let index = 0; index <= nscript; index += 1) {
    scripts.push({
      x: parseInteger(fields[pointer++]),
      y: parseInteger(fields[pointer++]),
      text: fields[pointer++] ?? "",
      evento: parseInteger(fields[pointer++]),
      unavolta: parseBoolean(fields[pointer++]),
      morto: parseBoolean(fields[pointer++]),
      idmosc: parseInteger(fields[pointer++]),
    });
  }

  return { nscript, scripts };
}

function repairMapScripts(sourceDir, targetDir) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  const repaired = [];

  for (const entry of entries) {
    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".mmp") {
      continue;
    }

    const sourceFile = path.join(sourceDir, entry.name);
    const targetFile = path.join(
      targetDir,
      entry.name.replace(/\.mmp$/i, ".json"),
    );

    if (!fs.existsSync(targetFile)) {
      continue;
    }

    const { nscript, scripts } = extractOriginalScripts(
      fs.readFileSync(sourceFile, "utf8"),
    );
    const currentJson = JSON.parse(fs.readFileSync(targetFile, "utf8"));

    currentJson.header = {
      ...(currentJson.header || {}),
      nscript,
    };
    currentJson.scripts = scripts;

    fs.writeFileSync(targetFile, `${JSON.stringify(currentJson, null, 2)}\n`);
    repaired.push(path.basename(targetFile));
  }

  return repaired;
}

function main() {
  const sourceDir = process.argv[2];
  const targetDir = process.argv[3] || DEFAULT_TARGET_DIR;

  if (!sourceDir) {
    console.error(
      "Usage: node tools/repair-hq-map-scripts.js <original-mmp-dir> [target-json-dir]",
    );
    process.exitCode = 1;
    return;
  }

  const repaired = repairMapScripts(
    path.resolve(sourceDir),
    path.resolve(targetDir),
  );
  console.log(`Repaired ${repaired.length} map files.`);
  repaired.forEach((fileName) => console.log(`- ${fileName}`));
}

main();
