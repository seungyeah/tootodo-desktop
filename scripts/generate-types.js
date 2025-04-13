import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current file directory with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to project root
const PROTO_DIR = path.join(__dirname, '../src-tauri/proto');
const OUTPUT_DIR = path.join(__dirname, '../src/lib/schema');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process only specific proto files that we know work correctly
// This is a temporary workaround until all proto files are fixed
const specificProtoFiles = ['task.proto', 'chat.proto', 'habit.proto', 'memo.proto', 'weekly.proto'];
// Get requested proto files
const protoFiles = specificProtoFiles
    .map(file => path.join(PROTO_DIR, file))
    .filter(file => fs.existsSync(file));

if (protoFiles.length === 0) {
    console.error('No valid proto files found');
    process.exit(1);
}

// Build the command
const command = `npx protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=${OUTPUT_DIR} \
  --ts_proto_opt=esModuleInterop=true \
  --ts_proto_opt=outputJsonMethods=false \
  --ts_proto_opt=outputClientImpl=false \
  --ts_proto_opt=snakeToCamel=true \
  --proto_path=${PROTO_DIR} \
  ${protoFiles.join(' ')}`;

console.log(`Executing command: ${command}`);

// Execute the command
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }

    if (stdout) {
        console.log(`Output: ${stdout}`);
    }

    if (stderr) {
        console.warn(`Stderr (might be warnings): ${stderr}`);
        // Continue processing since protoc sometimes outputs non-fatal warnings to stderr
    }

    console.log(`Generated TypeScript types in ${OUTPUT_DIR} for files: ${specificProtoFiles.join(', ')}`);

    // Create an index file in the generated directory
    const indexContent = specificProtoFiles
        .map(file => {
            const baseName = path.basename(file, '.proto');
            return `export * from './${baseName}';`;
        })
        .join('\n');

    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);
    console.log('Created index.ts in the generated directory');
});
