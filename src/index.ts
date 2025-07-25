#!/usr/bin/env bun

import { format } from 'prettier';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, extname } from 'path';

const config = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    useTabs: false,
    printWidth: 120,
    trailingComma: 'all',
    bracketSpacing: true,
    arrowParens: 'always',
    htmlWhitespaceSensitivity: 'css',
    endOfLine: 'lf',
    bracketSameLine: false,
    singleAttributePerLine: true,
    quoteProps: 'consistent',
    jsxSingleQuote: true,
};

const parserMap: Record<string, string> = {
    '.js': 'babel',
    '.jsx': 'babel',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.html': 'html',
    '.htm': 'html',
    '.json': 'json',
};

function getParser(filePath: string): string | undefined {
    const ext = extname(filePath).toLowerCase();
    return parserMap[ext];
}


async function formatFile(filePath: string): Promise<boolean> {
    try {
        const fullPath = resolve(filePath);
        const parser = getParser(fullPath);

        if (!parser) {
            return true; // Skip unsupported files silently
        }

        const content = readFileSync(fullPath, 'utf8');
        const formatted = await format(content, {
            ...config,
            parser,
            filepath: fullPath,
        });

        if (content !== formatted) {
            writeFileSync(fullPath, formatted);
            console.log(`Formatted: ${filePath}`);
        }

        return true;
    } catch (error) {
        console.error(`Error formatting ${filePath}: ${error}`);
        return false;
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        process.exit(1);
    }

    const inputPath = args[0];

    try {
        if (existsSync(inputPath) && !inputPath.includes('*')) {
            await formatFile(inputPath);
            return;
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
}

main(); 