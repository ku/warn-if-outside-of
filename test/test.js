
const CommentIfOutsideOf = require('../src/warn.js')

const fs = require('fs');
const payload = fs.readFileSync(0, 'utf-8');

const dummy = {
  issues: {
    createComment: (params) => {
      console.log(params.body)

    }
  },
  pulls: {
    listFiles: () => {
      return {
        data: [
          { filename: 'src/index.js' },
          { filename: 'newfile' },
          { filename: 'Cartfile' },
        ]
      }
    }
  }
}
const app = new CommentIfOutsideOf(dummy, JSON.parse(payload), {
  ifContains: 'src/',
  warns: '!src/',
  except: 'Cartfile, README.md',
})
app.execute( (file) => `- [ ] ${file}\n` )
