import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

const ref = await octokit.rest.git.getRef({
  owner: "e-jigsaw",
  repo: "api-sandbox",
  ref: "heads/main",
});
const parent = await octokit.rest.git.getCommit({
  owner: "e-jigsaw",
  repo: "api-sandbox",
  commit_sha: ref.data.object.sha,
});
const blob = await octokit.rest.git.createBlob({
  owner: "e-jigsaw",
  repo: "api-sandbox",
  content: "test",
});
const tree = await octokit.rest.git.createTree({
  owner: "e-jigsaw",
  repo: "api-sandbox",
  base_tree: parent.data.tree.sha,
  tree: [
    {
      path: "test4",
      mode: "100644",
      type: "blob",
      sha: blob.data.sha,
    },
  ],
});
const commit = await octokit.rest.git.createCommit({
  owner: "e-jigsaw",
  repo: "api-sandbox",
  message: "test",
  tree: tree.data.sha,
  parents: [parent.data.sha],
  author: {
    name: "test",
    email: "m@jgs.me",
  },
});
const nextRef = await octokit.rest.git.updateRef({
  owner: "e-jigsaw",
  repo: "api-sandbox",
  ref: "heads/main",
  sha: commit.data.sha,
});
console.log(nextRef);
