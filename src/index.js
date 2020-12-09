
const core = require('@actions/core')
const github = require('@actions/github')
const { Octokit } = require("@octokit/rest")

const WarnIfOutsideOf = require('./warn.js')

try {
  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
  })
  const payload = github.context.payload
  const app = new WarnIfOutsideOf(octokit, payload, {
    ifContains: core.getInput('if_contains'),
    warns: core.getInput('warns'),
    except: core.getInput('except'),
  })
  app.execute( (files) => {
    const preamble = `⚠️  unexpected changes outside of \`${ core.getInput('if_contains')  }\` are detected. Please make sure followings changes don't affect on existing behaviors.\n`
    return preamble + files.map( file => `- [ ] ${file}\n` )
  })
} catch (error) {
  core.setFailed(error.message);
}

