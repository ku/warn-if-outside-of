
const core = require('@actions/core')
const github = require('@actions/github')
const Octokit = require('@octokit/rest')

class CommentIfOutsideOf {

  constructor(payload) {

  }

}

try {
  const env = JSON.stringify(process.env.GITHUB_TOKEN, null, '  ')
  console.log(`token ${process.env.GITHUB_TOKEN}`)

  const payload = JSON.stringify(github.context.payload, null, '  ')
  console.log(`The event payload: ${payload}`);

  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
  })

  core.setOutput("assignee", 'x');
} catch (error) {
  core.setFailed(error.message);
}

