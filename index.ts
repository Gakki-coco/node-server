import * as http from 'http'
import {IncomingMessage, ServerResponse} from 'http'
import * as fs from 'fs'
import * as p from 'path'
import * as url from 'url'

const server = http.createServer()
const publicDir = p.resolve(__dirname, 'public')
let cacheAge = 3600 * 24 * 365

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const {method, url: path, headers} = request
    const {pathname, search} = url.parse(path)

    if (method !== 'GET') {
        response.statusCode = 405
        response.end()
        return
    }


    let filename = pathname.slice(1)
    if (filename === '') {
        filename = 'index.html'
    }

    // response.setHeader('Contend-Type', 'text/html; charset=utf-8')
    fs.readFile(p.resolve(publicDir, filename), (error, data) => {
        if (error) {
            if (error.errno === -2) {
                response.statusCode = 404
                fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
                    response.end(data)
                })
            } else {
                response.statusCode = 500
                response.end('服务器内部错误')
            }
        } else {
            response.setHeader('Cache-Control', `public, max-age=${cacheAge}`)
            response.end(data)
        }
    })


})

server.listen(8888)