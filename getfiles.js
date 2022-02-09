const path = require('path')
const fs = require('fs')
module.exports = (folder, filter = null) => {
  files = fs.readdirSync(folder) || []
  return filter
    ? files.filter((file) => {
        return filter.indexOf(path.extname(file)) != -1
      })
    : files
}
