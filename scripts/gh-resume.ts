/**
 * Local-only helper: generates a curated resume JSON from the `gh` CLI.
 * IMPORTANT: this script must be run locally by the repository owner. It
 * will NOT be executed in CI and must not be used to publish private data.
 */
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

try {
  const out = execSync('gh repo list --limit 100 --json name,description,language,stargazerCount', {
    encoding: 'utf8',
  });
  // The owner should inspect and curate the output before committing.
  writeFileSync('frontend/src/data/gh-repos.json', out, { encoding: 'utf8' });
  // eslint-disable-next-line no-console
  console.log('Wrote frontend/src/data/gh-repos.json - inspect before publishing');
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('gh CLI is required to run this script. Run locally after authenticating gh.');
  process.exit(1);
}
