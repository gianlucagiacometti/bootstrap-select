/**
 * Minifies repository JavaScript and CSS assets in place.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");
const terser = require("terser");

const ROOT = process.cwd();

const EXCLUDED_DIRECTORIES = new Set([
    ".git",
    ".github",
    "node_modules",
    "vendor",
    "scripts",
    "tests",
    "test",
    "docs",
    "coverage"
]);

const EXCLUDED_FILE_PATTERNS = [
    /\.min\.js$/i,
    /\.min\.css$/i,
    /\.config\.js$/i
];

function normalisePath(filePath) {
    return filePath.split(path.sep).join("/");
}

function shouldSkipFile(filePath) {
    const normalised = normalisePath(path.relative(ROOT, filePath));

    if (normalised.startsWith(".")) {
        return true;
    }

    return EXCLUDED_FILE_PATTERNS.some((pattern) => pattern.test(normalised));
}

function collectFiles(directory) {
    const collected = [];
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    entries.forEach((entry) => {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (EXCLUDED_DIRECTORIES.has(entry.name)) {
                return;
            }

            collected.push(...collectFiles(entryPath));
            return;
        }

        if (!entry.isFile() || shouldSkipFile(entryPath)) {
            return;
        }

        if (/\.js$/i.test(entry.name) || /\.css$/i.test(entry.name)) {
            collected.push(entryPath);
        }
    });

    return collected;
}

function outputPathFor(filePath) {
    if (/\.js$/i.test(filePath)) {
        return filePath.replace(/\.js$/i, ".min.js");
    }

    return filePath.replace(/\.css$/i, ".min.css");
}

function writeIfChanged(filePath, content) {
    const oldContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;

    if (oldContent === content) {
        return false;
    }

    fs.writeFileSync(filePath, content, "utf8");
    return true;
}

function minifyCss(filePath) {
    const source = fs.readFileSync(filePath, "utf8");
    const result = new CleanCSS({
        level: 2,
        returnPromise: false
    }).minify(source);

    if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors.join("\n"));
    }

    if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach((warning) => {
            console.warn(`CSS warning in ${normalisePath(path.relative(ROOT, filePath))}: ${warning}`);
        });
    }

    return result.styles + "\n";
}

async function minifyJs(filePath) {
    const source = fs.readFileSync(filePath, "utf8");
    const result = await terser.minify(source, {
        compress: true,
        mangle: true,
        format: {
            comments: /^!/
        }
    });

    if (result.error) {
        throw result.error;
    }

    return result.code + "\n";
}

async function minifyFile(filePath) {
    const outputPath = outputPathFor(filePath);
    const relativeInput = normalisePath(path.relative(ROOT, filePath));
    const relativeOutput = normalisePath(path.relative(ROOT, outputPath));
    const minified = /\.js$/i.test(filePath) ? await minifyJs(filePath) : minifyCss(filePath);
    const changed = writeIfChanged(outputPath, minified);
    const status = changed ? "updated" : "unchanged";

    console.log(`${status}: ${relativeInput} -> ${relativeOutput}`);
}

async function main() {
    const files = collectFiles(ROOT).sort();

    if (files.length === 0) {
        console.log("No JavaScript or CSS assets found to minify.");
        return;
    }

    for (const filePath of files) {
        await minifyFile(filePath);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// END OF FILE
