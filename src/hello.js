
const core = require('@actions/core')
const github = require('@actions/github')
const { Octokit } = require("@octokit/rest")

class CommentIfOutsideOf {

  constructor(payload) {
    this.context = JSON.stringify(payload)
    this.octokit = new Octokit({
      auth: `token ${process.env.GITHUB_TOKEN}`
    })
  }

  async main() {

    const r = await this.octokit.pulls.get({
      owner: this.context.repository.owner.login,
      repo: this.context.repository.name,
      pull_number: this.context.pull_request.number,
    });
    this.context = JSON.parse(payload)
    this.octokit = new Octokit({
      auth: `token ${process.env.GITHUB_TOKEN}`
    })
  }

  async listFiles() {
    return this.octokit.pulls.listFiles({
      owner: this.context.repository.owner.login,
      repo: this.context.repository.name,
      pull_number: this.context.pull_request.number,
    });
  }

  async main() {
    const response = await this.listFiles()
    const filenames = response.data.map( (f) => f.filename )
    console.log(JSON.stringify(filenames, null, '  '))
  }
}

try {
  console.log(JSON.stringify( github, null, '  ' ))

  const env = JSON.stringify(process.env.GITHUB_TOKEN, null, '  ')
  console.log(`token ${process.env.GITHUB_TOKEN}`)

  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
  })

  let payload
  if(process.env.USER === 'ku') {
    const fs = require('fs');
    payload = fs.readFileSync(0, 'utf-8');
  } else {
    payload = github.context.payload
  }


  const app = new CommentIfOutsideOf(payload)
  app.main()

  core.setOutput("assignee", 'x');
} catch (error) {
  core.setFailed(error.message);
}

