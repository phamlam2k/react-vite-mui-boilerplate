import { execSync } from "node:child_process";

const file = process.argv[2];

if (!file) {
  console.error("❌ No file provided");
  process.exit(1);
}

execSync(`npx @mui/codemod v5.0.0/optimal-imports "${file}"`, {
  stdio: "inherit",
});
