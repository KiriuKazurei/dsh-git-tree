/**
 * Build the dsh-git-tree artifacts.
 *
 *   lib/index.js   host half (plain ESM, copied from src/index.js)
 *   lib/client.js  browser half (esbuild CJS bundle wrapped in the DSH
 *                  module-loader shim, same envelope the shipped client
 *                  plugins and dsh-pi-ui use)
 *
 * esbuild is resolved locally first; when the checkout has no installed
 * dependencies yet, the bundler already vendored by the sibling dsh-pi-ui
 * plugin is reused so a source-only checkout can still build.
 */
import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

async function loadEsbuild() {
  try {
    return await import('esbuild')
  } catch {
    // Fall through to the workspace-vendored toolchain.
  }
  const candidates = [
    resolve(root, '..', 'dsh-pi-ui', 'node_modules', 'esbuild', 'lib', 'main.js'),
    resolve(root, '..', 'dsh-pi-bridge', 'node_modules', 'esbuild', 'lib', 'main.js'),
  ]
  for (const candidate of candidates) {
    try {
      return await import(pathToFileURL(candidate).href)
    } catch {
      // Try the next candidate.
    }
  }
  throw new Error('esbuild is not installed: run `pnpm install` in this plugin (or build dsh-pi-ui first).')
}

const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const packageName = manifest.name
const esbuild = await loadEsbuild()

await mkdir(join(root, 'lib'), { recursive: true })
await copyFile(join(root, 'src', 'index.js'), join(root, 'lib', 'index.js'))

await esbuild.build({
  entryPoints: [join(root, 'src', 'client', 'index.jsx')],
  outfile: join(root, 'lib', 'client.js'),
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  sourcemap: false,
  legalComments: 'none',
  loader: { '.css': 'text' },
  external: [
    'react',
    'react-dom',
    '@deepseek-ai/cordis',
    '@deepseek-ai/dsh-client-store',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-primitives',
  ],
  define: { 'process.env.NODE_ENV': '"production"' },
  banner: {
    js: `window.__ModuleLoader__.load({id:${JSON.stringify(packageName)},factory:(require)=>{var module={exports:{}};var exports=module.exports;`,
  },
  footer: { js: 'return module.exports;}});' },
})

const bundle = await readFile(join(root, 'lib', 'client.js'), 'utf8')
if (!bundle.startsWith('window.__ModuleLoader__.load(') || !bundle.trimEnd().endsWith('}});')) {
  throw new Error('client bundle is missing the DSH module-loader shim')
}
console.log(`Built ${packageName} (lib/index.js, lib/client.js, ${bundle.length} bytes).`)
