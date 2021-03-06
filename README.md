# 🗻Granite SSG
 4kb Mini static site generator in Node.
 
 ## Write content in markdown, display it how you like with templates, then deploy to your host!

  ##### Demo of what is generated with this repo: https://granite.vercel.app/

## How to use this?
1) #### Populate your granite.config.js file.
Example: "granite.config.js"

  ```js
  module.exports = {
    root: null,
    template: 'templates',
    pages: 'pages',
    dist: 'dist',
    index: {
      title: 'My Home Page',
      content: 'Checkout my projects below! I will be updating this daily!',
    }
  }
  ```


2) #### Setup your templates

  Currently, there are 3 files to configure: 


  1) head.html: (for header tag configuration)

  ```html
  <head>
  <title><%= title %></title>
  </head>
  ```


  2) index.html: main page content
  Example: "index.html"


  ```html
  <html>
  <%- include(head, {title: title}) %>
  <body>
  <content>
  <h1><%= title %></h1>
  <h3><%= description %></h3>
  <div class="page-body">
  <h5>List of site pages:</h5>
  <ul>
  <% pages.forEach(page => { %>
  <li><a href="<%= page.fileHtmlName %>"><%= page.title %></a></li>
  <% }); %>
  </ul>
  </div>
  </content>
  </body>
  </html>
  ```

  This index.html template has access to:


  ```js
  {
    title: "" // string: page h1 and/or header title
    description "" // string: descriptor
    config:{},
    pages:[],
    head:"" // string: path to header template for runtime consumption
  }
  ```

  3) page.html: template for markdown pages
  Example: "page.html"


  ```html
  <html>
  <%- include(head, {title: page.title}) %>
  <body>
  <content>
  <h1><%= page.title %></h1>
  <h3><%= page.description %></h3>
  <p><i><%= page.date %></i></p>
  <p>
  <strong>Tags:</strong> <% page.tags.forEach(tag => { %>
  <u>#<%- tag %></u>
  <% }); %>
  </p>
  <hr />
  <div class="page-body"><%- page.body %></div>
  <hr />
  <caption>
  See
  <a href="index.html">HOME</a>
  for a listing of <%= pages.length.toString() %> pages
  </caption>
  </content>
  </body>
  </html>
  ```
    
  This page.html template has access to:

  ```js
  {
    config:{},
    pages:[],
    page:{
      fileHtmlName: "",
      fileBaseName: "",
      body: "",
      +fileData:{}

    },
    head:"" // string: path to header template for runtime consumption
  }
  ```


  3) #### Setup your markdown
  Example page markdown:


  ```md
  ---
  title: My first project
  description: Project 1
  tags: 
    - projects
    - tech
  date: February 8, 2022
  author:
    name: Fred
    url: https://localhost
  ---

  This content is generated from Granite SSG
  ```


  4) #### Run granite 


  ```sh
  npm run build
  ```


---------

#### TODO
  - Package to npm for easier consumption
  - Add more nav bar / footer support
  - Search?
  - Link graphing?
  - Add ordering/sorting when listing posts on index (optionally, the user could add this javascript to the index template)


