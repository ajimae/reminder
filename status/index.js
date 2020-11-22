const cp = require('child_process');
const fetch = require('node-fetch');

const [owner, repo] = process.env.GH_REPO.split("/");

function getCurrentCommitSha() {
  return cp
    .execSync(`git rev-parse HEAD`)
    .toString()
    .trim();
}

// async function callback() {
  
// }

const sha = getCurrentCommitSha();

async function getStatus() {
  // return fetch(`https://api.github.com/repos/${owner}/${repo}/statuses/${sha}`, {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}/status`, {
    method: 'GET',
    // body: JSON.stringify({
    //   state,
    //   description,
    //   context,
    // }),
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
}

(async () => {
  console.log(`starting status checks for commit ${sha}`);

  // run checks
  // const response = await callback();
  // const response = await getStatus();
  try {
    const response = await getStatus();
    console.log(response);
  } catch (error) {
    // const message = error ? error.message : "something went wrong";
    // await getStatus();
    console.log(error);
  }

  console.log("status check completed");
})();
