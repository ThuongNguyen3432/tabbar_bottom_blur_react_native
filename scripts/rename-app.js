#!/usr/bin/env node
/**
 * Renames this template: display name, project name, and bundle identifier
 * across both platforms.
 *
 *   node scripts/rename-app.js "My App" com.acme.myapp
 *   node scripts/rename-app.js "My App" com.acme.myapp --dry-run
 *
 * Renaming an app touches more than a search-and-replace can reach: the Android
 * package lives in the directory path, and the iOS project and scheme are named
 * files. Both are moved here, and `git mv` is used when the tree is a clean
 * repository so history follows.
 *
 * Run it on a fresh clone, before the first build. Afterwards delete
 * ios/Pods, ios/build and android/.gradle, then reinstall pods.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// ---------------------------------------------------------------- arguments

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const [displayName, bundleId] = args.filter(arg => !arg.startsWith('--'));

if (!displayName || !bundleId) {
  console.error(
    'Usage: node scripts/rename-app.js "<Display Name>" <bundle.id> [--dry-run]\n' +
      '  e.g. node scripts/rename-app.js "My App" com.acme.myapp',
  );
  process.exit(1);
}

/** Xcode targets and the Android rootProject cannot contain spaces. */
const projectName = displayName.replace(/[^A-Za-z0-9]/g, '');

if (!projectName) {
  console.error(`"${displayName}" has no letters or digits to build a project name from.`);
  process.exit(1);
}
if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(bundleId)) {
  console.error(
    `"${bundleId}" is not a valid bundle id.\n` +
      'Expected lowercase segments separated by dots, e.g. com.acme.myapp',
  );
  process.exit(1);
}

// ------------------------------------------------------------ current names

function readCurrent() {
  const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  const gradle = fs.readFileSync(path.join(ROOT, 'android/app/build.gradle'), 'utf8');
  const namespace = gradle.match(/namespace\s+"([^"]+)"/);

  if (!namespace) {
    throw new Error('Could not find `namespace` in android/app/build.gradle');
  }
  return { name: appJson.name, bundleId: namespace[1] };
}

const current = readCurrent();

if (current.name === projectName && current.bundleId === bundleId) {
  console.log('Already named that. Nothing to do.');
  process.exit(0);
}

// ------------------------------------------------------------------- helpers

const changes = [];

/**
 * Destination -> source for every move, so a dry run can still find files that
 * live inside a directory it has not actually moved yet. Without this the dry
 * run silently omits everything under a renamed folder.
 */
const pendingMoves = new Map();

/** Where a path lives *right now*, which differs from its final path mid-run. */
function resolve(file) {
  const absolute = path.join(ROOT, file);
  if (fs.existsSync(absolute) || !dryRun) {
    return absolute;
  }
  for (const [to, from] of pendingMoves) {
    if (file === to || file.startsWith(to + '/')) {
      return path.join(ROOT, from + file.slice(to.length));
    }
  }
  return absolute;
}

function isCleanGitRepo() {
  try {
    const status = execFileSync('git', ['status', '--porcelain'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return status.trim() === '';
  } catch {
    return false;
  }
}

const useGitMv = isCleanGitRepo();

function move(from, to) {
  const absoluteFrom = resolve(from);
  const absoluteTo = path.join(ROOT, to);

  if (!fs.existsSync(absoluteFrom)) {
    return;
  }
  changes.push(`move  ${from} -> ${to}`);
  if (dryRun) {
    pendingMoves.set(to, from);
    return;
  }

  fs.mkdirSync(path.dirname(absoluteTo), { recursive: true });
  if (useGitMv) {
    execFileSync('git', ['mv', from, to], { cwd: ROOT, stdio: 'ignore' });
  } else {
    fs.renameSync(absoluteFrom, absoluteTo);
  }
}

/** Applies `replacements` to a file, in order. Missing files are skipped. */
function edit(file, replacements) {
  const absolute = resolve(file);
  if (!fs.existsSync(absolute)) {
    return;
  }

  const before = fs.readFileSync(absolute, 'utf8');
  const after = replacements.reduce(
    (text, [pattern, value]) => text.replace(pattern, value),
    before,
  );

  if (before === after) {
    return;
  }
  changes.push(`edit  ${file}`);
  if (!dryRun) {
    fs.writeFileSync(absolute, after);
  }
}

const oldPackagePath = current.bundleId.split('.').join('/');
const newPackagePath = bundleId.split('.').join('/');

const everywhere = [
  [new RegExp(current.name, 'g'), projectName],
  [new RegExp(current.bundleId.replace(/\./g, '\\.'), 'g'), bundleId],
];

// -------------------------------------------------------------- shared files

edit('app.json', [
  [/"name":\s*".*?"/, `"name": ${JSON.stringify(projectName)}`],
  [/"displayName":\s*".*?"/, `"displayName": ${JSON.stringify(displayName)}`],
]);
edit('package.json', [[/"name":\s*".*?"/, `"name": ${JSON.stringify(projectName)}`]]);

// ------------------------------------------------------------------- android

// The Kotlin sources sit in a directory that mirrors the package, so the
// directory moves before its contents are rewritten.
if (oldPackagePath !== newPackagePath) {
  move(
    `android/app/src/main/java/${oldPackagePath}`,
    `android/app/src/main/java/${newPackagePath}`,
  );
}

edit(`android/app/src/main/java/${newPackagePath}/MainActivity.kt`, everywhere);
edit(`android/app/src/main/java/${newPackagePath}/MainApplication.kt`, everywhere);
edit('android/app/build.gradle', everywhere);
edit('android/settings.gradle', everywhere);
edit('android/app/src/main/res/values/strings.xml', [
  [/<string name="app_name">.*?<\/string>/, `<string name="app_name">${displayName}</string>`],
]);

// ----------------------------------------------------------------------- ios

move(`ios/${current.name}.xcodeproj`, `ios/${projectName}.xcodeproj`);
move(`ios/${current.name}.xcworkspace`, `ios/${projectName}.xcworkspace`);
move(`ios/${current.name}`, `ios/${projectName}`);
move(
  `ios/${projectName}.xcodeproj/xcshareddata/xcschemes/${current.name}.xcscheme`,
  `ios/${projectName}.xcodeproj/xcshareddata/xcschemes/${projectName}.xcscheme`,
);

edit(`ios/${projectName}.xcodeproj/project.pbxproj`, everywhere);
edit(`ios/${projectName}.xcodeproj/xcshareddata/xcschemes/${projectName}.xcscheme`, everywhere);
edit(`ios/${projectName}.xcworkspace/contents.xcworkspacedata`, everywhere);
edit(`ios/${projectName}/AppDelegate.swift`, everywhere);
edit('ios/Podfile', everywhere);

// The bundle id is derived from PRODUCT_NAME in the stock template, which would
// silently keep the old organisation prefix. Pin it instead.
edit(`ios/${projectName}.xcodeproj/project.pbxproj`, [
  [
    /PRODUCT_BUNDLE_IDENTIFIER = "[^"]*"/g,
    `PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}"`,
  ],
  [
    /PRODUCT_BUNDLE_IDENTIFIER = [^";\n]+;/g,
    `PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";`,
  ],
]);

edit(`ios/${projectName}/Info.plist`, [
  [
    /(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${displayName}$2`,
  ],
]);

// ------------------------------------------------------------------- report

if (changes.length === 0) {
  console.log('Nothing matched — is this template already renamed?');
  process.exit(0);
}

console.log(
  `${dryRun ? 'Would rename' : 'Renamed'} ${current.name} (${current.bundleId})\n` +
    `             -> ${projectName} (${bundleId}), display name "${displayName}"\n`,
);
changes.forEach(line => console.log('  ' + line));

if (dryRun) {
  console.log('\nDry run: nothing was written.');
} else {
  console.log(
    '\nNext:\n' +
      '  rm -rf ios/Pods ios/build ios/Podfile.lock android/.gradle android/app/build\n' +
      '  npm install\n' +
      '  (cd ios && pod install)\n' +
      '  npm start -- --reset-cache',
  );
}
