const config = require('./granite.config.js')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const marked = require('marked')
const frontMatter = require('front-matter')
const getFiles = require('./getfiles.js')

/* Gameplan::
 * Have a config JSON pointing to dist/src/template locations
 * Run the main process of:
 * building the index file (from template) + markdown
 * add links of all other pages to index file
 * building the page files (from template) + markdown
 * output all HTML to DIST folder\
 * Extra: include header for custom page titles & css
 */

const INDEX_KEYWORD = 'index'
const MARKDOWN_FILES = ['.md', '.mkdn', '.markdown', '.mdown', '.mkd']
const Granite = async (config) => {
  const rootDir = config?.root ?? __dirname
  const templatesFolder = config?.templates ?? 'templates'
  const pagesFolder = config?.pages ?? 'pages'
  const distFolder = config?.dist ?? 'dist'
  marked.setOptions(config?.marked ?? {})

  const pagesPath = path.join(rootDir, pagesFolder)
  const distPath = path.join(rootDir, distFolder)
  const templatesPath = path.join(rootDir, templatesFolder)
  const pageTemplate = fs.readFileSync(
    path.join(templatesPath, 'page.html'),
    'utf8'
  )
  const indexTemplate = fs.readFileSync(
    path.join(templatesPath, 'index.html'),
    'utf8'
  )
  const headTemplatePath = path.join(templatesPath, 'head.html')

  //============Page generation===========
  let pages = new Array()
  let pageFiles = getFiles(pagesPath, MARKDOWN_FILES)
  pageFiles.forEach((page) => {
    const pageExtension = path.extname(page)
    const mdPath = path.join(pagesPath, page)
    const fileData = frontMatter(fs.readFileSync(mdPath, 'utf8'))
    const pageBaseName = path.basename(page, pageExtension)
    const pageHtmlName = `${pageBaseName}.html`

    const pageObj = {
      fileBasename: pageBaseName,
      fileHtmlName: pageHtmlName,
      body: marked.parse(fileData.body),
      ...fileData.attributes,
    }

    pages.push(pageObj)
  })

  pages.forEach((page) => {
    fs.writeFileSync(
      path.join(distPath, page.fileHtmlName),
      ejs.render(pageTemplate, {
        config,
        page,
        pages,
        head: headTemplatePath,
      })
    )
  })

  //============Index generation===========
  fs.writeFileSync(
    path.join(distPath, 'index.html'),
    ejs.render(indexTemplate, {
      config,
      title: config?.index?.title ?? 'My Home Page',
      description: config?.index?.description ?? 'Check out my project below!',
      head: headTemplatePath,
      pages,
      date: new Date().toLocaleString(),
    })
  )

  console.log(`\x1b[32mGranite\x1b[0m Output to dir ${distPath}`)
}

Granite(config)
