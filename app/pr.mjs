#!/usr/bin/env zx

const { _ } = argv;

const branch = _[0];

await $`git pull`;
await $`git checkout ${branch}`;
await $`git pull`;
// await $`yarn install`;
// await $`yarn dev`;
