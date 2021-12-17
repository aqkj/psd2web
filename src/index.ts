// 入口

import http from 'http'
import PSDRead from '../psd2html'
http.createServer(async (req, res) => {
  console.log(req.url)
  if (req.url === '/home') {
    const { html, css } = await PSDRead('./test1.psd')
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    // res.setDefaultEncoding('utf-8')
    res.end(
      `<html>
        <head>
          <title>标题</title>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>`
    )
  } else res.end('<div>404</div>')
}).listen(8889, () => {
  console.log('端口监听 8889')
})