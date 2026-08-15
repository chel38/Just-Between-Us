import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import JSZip from 'jszip';

const root = process.cwd();
const dist = join(root, 'dist');
const outputDir = join(root, 'release');
const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const version = String(packageJson.version);
if (!/^[0-9A-Za-z.-]+$/.test(version)) throw new Error(`Invalid package version for release path: ${version}`);
const outputFile = join(outputDir, `just-between-us-v${version}-yandex.zip`);
const zip = new JSZip();

async function addDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) await addDirectory(fullPath);
    else {
      const archivePath = relative(dist, fullPath).replaceAll('\\', '/');
      if (/[^\x20-\x7E]/.test(archivePath) || archivePath.includes(' ')) {
        throw new Error(`Release path must be ASCII without spaces: ${archivePath}`);
      }
      zip.file(archivePath, await readFile(fullPath));
    }
  }
}

await addDirectory(dist);
if (!zip.file('index.html')) throw new Error('index.html must be in the archive root.');
await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } }));
console.log(`Created ${outputFile}`);
