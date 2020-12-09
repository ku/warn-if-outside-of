
const core = require('@actions/core')
const github = require('@actions/github')
const { Octokit } = require("@octokit/rest")

class CommentIfOutsideOf {

  constructor(payload) {
    this.context = JSON.stringify(payload)



  }

  async main() {

    const r = await octokit.pulls.get({
      this.context.repository.owner.login,
      this.context.repository.name,
      this.context.pull_request.number,
    });

    console.log(JSON.stringify(r, null, '  '))
  }

}

try {
  const env = JSON.stringify(process.env.GITHUB_TOKEN, null, '  ')
  console.log(`token ${process.env.GITHUB_TOKEN}`)


  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
  })

//  const payload = JSON.stringify(github.context.payload, null, '  ')
//  console.log(`The event payload: ${payload}`);
  const app = new CommentIfOutsideOf(github.context.payload)
  app.main()

  core.setOutput("assignee", 'x');
} catch (error) {
  core.setFailed(error.message);
}

