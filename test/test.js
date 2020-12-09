
const CommentIfOutsideOf = require('../src/find.js')

const fs = require('fs');
const payload = fs.readFileSync(0, 'utf-8');

const dummy = {
  pulls: {
    listFiles: () => {
      return {
        data: [
          { filename: 'src/hello.js' },
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
  except: 'Cartfile',
})
app.execute()
