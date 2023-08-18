#!/usr/bin/env zx

const repo = 'affiliatets-com/aff';
// const baseBranch = 'main';
// const headBranch = 'feature/issue-126';

const { _, baseBranch, headBranch, prTitle } = argv;

const prDesc = `This PR was created by a script. from ${headBranch} to ${baseBranch}.`;
const defaultTitle = `Auto merge ${headBranch} to ${baseBranch}`;

// Step 1: Open a PR
const prCreateOutput = await $`gh pr create --title ${prTitle || defaultTitle} --body ${prDesc} --base ${baseBranch} --head ${headBranch} --repo ${repo}`;
console.log(prCreateOutput.stdout);

// Step 2: Get the PR number
const prNumber = prCreateOutput.stdout.match(/\/pull\/(\d+)/)[1];

// Step 3: Merge the PR
await $`gh pr merge ${prNumber} --repo ${repo} --merge`;
