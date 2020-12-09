
const core = require('@actions/core')
const github = require('@actions/github')
const { Octokit } = require("@octokit/rest")

const CommentIfOutsideOf = require('./find.js')

try {
  const env = JSON.stringify(process.env.GITHUB_TOKEN, null, '  ')
  console.log(`token ${process.env.GITHUB_TOKEN}`)

  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
  })

  const payload = github.context.payload
  const app = new CommentIfOutsideOf(octokit, payload, {
    ifContains: core.getInput('if_contains'),
    warns: core.getInput('warns'),
    except: core.getInput('except'),
  })
  app.execute( (files) => {
    const body = `⚠️  unexpected changes outside of \`${ core.getInput('if_contains')  }\` are detected. Please make sure followings changes don't affect on existing behaviors.\n`

    files.forEach( (file) => {
      body += `- [ ] ${file}\n`
    })

    return body
  })
} catch (error) {
  core.setFailed(error.message);
}

