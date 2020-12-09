
class CommentIfOutsideOf {

  constructor(octokit, payload, options) {
    this.payload = (payload)
    this.options = options
    this.octokit = octokit
  }

  async listFiles() {
    return this.octokit.pulls.listFiles({
      owner: this.payload.repository.owner.login,
      repo: this.payload.repository.name,
      pull_number: this.payload.pull_request.number,
    });
  }

  async execute() {
    const response = await this.listFiles()
    const filenames = response.data.map( (f) => f.filename )
    const names = this.findFilesShouldNotBeContained(filenames)

    if (names.length > 0) {
      console.log(JSON.stringify(names, null, '  '))
      const body = 'hello ' + JSON.stringify(names, null, '  ')

      this.octokit.issues.createComment({
        owner: this.payload.repository.owner.login,
        repo: this.payload.repository.name,
        pull_number: this.payload.pull_request.number,
        body,
      });
    }
  }

  findFilesShouldNotBeContained(filenames) {
    let detectedFiles = []

    if (this.ifContains(filenames)) {
      const patternShouldNotBeContained = new PatternMatcher(this.options.warns)
      const patternException = new PatternMatcher(this.options.except)

      for (const name of filenames) {
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
    const re = new PatternMatcher(this.options.ifContains)
    return filenames.some( name => re.test(name) )
  }
}

class PatternMatcher {
  constructor(patternString) {
    if (patternString[0] === '!') {
      patternString = patternString.substring(1)
      this.negate = true
    } else {
      this.negate = false
    }
    this.re = new RegExp(patternString)
  }

  test(subject) {
    const m = this.re.test(subject)
    if (this.negate) {
      return !m
    } else {
      return m
    }
  }
}

module.exports = CommentIfOutsideOf
