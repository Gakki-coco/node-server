import * as http from 'http'
import {IncomingMessage, ServerResponse} from 'http'

const server = http.createServer()

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    console.log(request.httpVersion)
    console.log(request.url)
    const array = []

    request.on('data', (chunk)=> {
        array.push(chunk)
    })
    request.on('end', ()=> {
        const body = Buffer.concat(array).toString()
        console.log('这是消息体')
        console.log(body)
        response.statusCode = 200
        response.setHeader('X-Powered', 'Node.js')
        response.end('hi')
    })
})

server.listen(8888, () => {
    console.log(server.address())
})