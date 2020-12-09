
const core = require('@actions/core')
const github = require('@actions/github')
const { Octokit } = require("@octokit/rest")

class CommentIfOutsideOf {

  constructor(payload, options) {
    this.payload = (payload)
    this.options = options
    this.octokit = new Octokit({
      auth: `token ${process.env.GITHUB_TOKEN}`
    })
  }

  async listFiles() {
    return this.octokit.pulls.listFiles({
      owner: this.payload.repository.owner.login,
      repo: this.payload.repository.name,
      pull_number: this.payload.pull_request.number,
    });
  }

  async main() {
    const response = await this.listFiles()
    const filenames = response.data.map( (f) => f.filename )
    const names = this.findFilesShouldNotBeContained(filenames)

    console.log(JSON.stringify(names, null, '  '))
  }

  findFilesShouldNotBeContained(filenames) {
    let detectedFiles = []

    if (this.ifContains(filenames)) {
      const patternShouldNotBeContained = new RegExp(this.options.warns)
      const patternException = new RegExp(this.options.except)

      for (name of filenames) {
        if (patternShouldNotBeContained.test(name)) {
          if (!patternException.test(name)) {
            detectedFiles.push(name)
          }
        }
      }
    }

    return detectedFiles
  }

  ifContains(filenames) {
    const re = new RegExp(this.options.ifContains)
    return filenames.some( name => re.test(name) )
  }
}

try {
    console.log(JSON.stringify(github.context, null, '  '))

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


  const app = new CommentIfOutsideOf(payload, {
    ifContians: core.getInput('if_contains'),
    warns: core.getInput('warns'),
    except: core.getInput('except'),
  })
  app.main()

  core.setOutput("assignee", 'x');
} catch (error) {
  core.setFailed(error.message);
}

