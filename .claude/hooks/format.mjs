// PostToolUse hook: prettier --write the edited file if it lives under admin/.
// Node instead of jq so it runs on any dev box; silently no-ops until `npm ci` in admin/.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

let input = ''
for await (const chunk of process.stdin) input += chunk
const file = JSON.parse(input).tool_input?.file_path
const admin = path.join(process.env.CLAUDE_PROJECT_DIR ?? process.cwd(), 'admin')
const prettier = path.join(admin, 'node_modules', 'prettier', 'bin', 'prettier.cjs')

if (file && path.resolve(file).startsWith(admin + path.sep) && existsSync(prettier)) {
  try {
    execFileSync(process.execPath, [prettier, '--write', '--ignore-unknown', file], { cwd: admin, stdio: 'ignore' })
  } catch {} // unparseable file mid-edit: leave it as-is
}
