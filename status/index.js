const cp = require('child_process');
const fetch = require('node-fetch');
const { mainModule } = require('process');

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
  return fetch(`https://api.github.com/repos/ajimae/reminder/actions/runs/${process.env.RUN_ID}`, {
    method: 'GET',
    // body: JSON.stringify({
    //   state,
    //   description,
    //   context,
    // }),
    headers: {
      // Authorization: `Bearer ${process.env.GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
}

function getCompletionStatus(data) {
  console.log(data.status, ">>>");
  if (data.status === "completed") {
    return true;
  }
  return false;
}

let i = 0;
async function main() {
  console.log(`starting status checks for commit ${sha}`);

  // run checks
  // const response = await callback();
  // const response = await getStatus();
  try {
    const response = await getStatus();
    const data = await response.json();
    const status = getCompletionStatus(data);

    console.log(status, ">>>");
    // if (!status) {
    //   ++i;
    //   main();
    // }

    console.log(i, "<><>", data);
  } catch (error) {
    // const message = error ? error.message : "something went wrong";
    // await getStatus();
    console.log(error);
  }

  console.log("status check completed");
};

main();
