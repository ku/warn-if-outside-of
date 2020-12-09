
const core = require('@actions/core');
const github = require('@actions/github');

try {
  const payload = JSON.stringify(github.context.payload, null, 2)
  console.log(`The event payload: ${payload}`);
  core.setOutput("assignee", 'x');
} catch (error) {
  core.setFailed(error.message);
}
