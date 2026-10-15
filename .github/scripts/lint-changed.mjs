import { execFileSync } from 'node:child_process';

import { ESLint } from 'eslint';

const baseSha = process.env.BASE_SHA;

if (!baseSha) {
    throw new Error('BASE_SHA is required.');
}

const files = execFileSync(
    'git',
    [
        'diff',
        '--name-only',
        '--diff-filter=ACMRT',
        baseSha,
        'HEAD',
        '--',
        'resources/**/*.js',
        'resources/**/*.jsx',
        'resources/**/*.ts',
        'resources/**/*.tsx',
    ],
    { encoding: 'utf8' },
)
    .split(/\r?\n/u)
    .filter(Boolean);

if (files.length === 0) {
    console.log('No changed frontend files to lint.');
    process.exit(0);
}

console.log(`Linting ${files.length} changed frontend files.`);

const eslint = new ESLint();
const results = await eslint.lintFiles(files);
const formatter = await eslint.loadFormatter('stylish');
const output = formatter.format(results);

if (output) {
    console.log(output);
}

for (const result of results) {
    for (const message of result.messages) {
        if (message.severity !== 2) {
            continue;
        }

        const annotation = message.message
            .replaceAll('%', '%25')
            .replaceAll('\r', '%0D')
            .replaceAll('\n', '%0A');
        const relativePath = result.filePath
            .replace(`${process.cwd()}\\`, '')
            .replaceAll('\\', '/');

        console.log(
            `::error file=${relativePath},line=${message.line ?? 1},col=${message.column ?? 1}::${annotation} (${message.ruleId ?? 'unknown'})`,
        );
    }
}

const errorCount = results.reduce(
    (total, result) => total + result.errorCount,
    0,
);

process.exit(errorCount > 0 ? 1 : 0);
