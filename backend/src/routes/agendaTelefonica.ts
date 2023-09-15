import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

export async function agendaTelefonica(app: FastifyInstance){
    app.post('/', (request: FastifyRequest, reply: FastifyReply )=>{
        const seila = request.body
        reply.send(seila)
    })
}

