
const core = require('@actions/core')
const github = require('@actions/github')
const Octokit = require('@octokit/rest')

class CommentIfOutsideOf {

  constructor(payload) {

  }

}

try {
  const payload = JSON.stringify(github.context.payload, null, '  ')
  console.log(`The event payload: ${payload}`);

  const env = JSON.stringify(process.env, null, '  ')
  console.log(env)

  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
  })

  core.setOutput("assignee", 'x');
} catch (error) {
  core.setFailed(error.message);
}

