# Automated npm release flow on develop → master merges

When a pull request from `develop` to `master` is merged, the repository automatically bumps the package patch version and publishes to npm.

## Overview
- `.github/workflows/release-on-merge.yml` runs **only when a PR from `develop` into `master` is merged**.
- The workflow runs `npm version patch`, updates `package.json` and `package-lock.json`, creates a `vX.Y.Z` tag, and pushes it.
- Pushing the tag triggers the existing `.github/workflows/publish.yml`, which runs tests, builds, publishes to npm, and creates a GitHub Release.

## Prerequisites
- The repository secret `NPM_TOKEN` is configured (used by the publish workflow).
- GitHub Actions has permission to push to `master` (`contents: write`).
- The project builds and tests successfully on Node.js 22.

## Trigger and behavior details
1. **On PR close (merged only)**
   - Trigger: `pull_request` event with type `closed`.
   - Runs only when the PR base is `master` and the head is `develop`.
2. **Version bump and tagging**
   - Install dependencies with `npm ci --legacy-peer-deps`.
   - Run `npm version patch -m "chore: release v%s [skip ci]"` to bump the patch version and create tag `vX.Y.Z`.
   - Push the changes and tag to the `master` branch (`--follow-tags`).
3. **npm publish**
   - Tag push triggers the `Publish to NPM` workflow.
   - The workflow runs tests, builds, executes `npm publish --provenance --access public`, and creates a GitHub Release.

## Operational notes
- The automation always increments the **patch version**. If you need a minor or major bump, run `npm version minor|major` on `develop` before opening the PR.
- Completion of the `Publish to NPM` workflow indicates npm publication succeeded. If it fails, check the Actions logs and, if needed, re-push the tag manually.
- The commit message includes `[skip ci]`, so any other CI may be skipped.
