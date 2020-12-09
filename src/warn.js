
module.exports = class WarnIfOutsideOf {
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

  async execute(formatter) {
    const response = await this.listFiles()
    const filenames = response.data.map( (f) => f.filename )
    const names = this.findFilesShouldNotBeContained(filenames)

    if (names.length > 0) {
      const body = formatter(names)
      this.octokit.issues.createComment({
        owner: this.payload.repository.owner.login,
        repo: this.payload.repository.name,
        issue_number: this.payload.pull_request.number,
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
    const patterns = patternString.split(',')

    this.rules = patterns.map( pattern => {
      let negate = false
      if (pattern[0] === '!') {
        pattern = patternString.substring(1)
        negate = true
      }

      return {
        re: new RegExp(pattern.trim()),
        negate
      }
    })
  }

  test(subject) {
    return this.rules.some( rule => {
      const matched = rule.re.test(subject)
      if (rule.negate) {
        return !matched
      } else {
        return matched
      }
    })
  }
}

