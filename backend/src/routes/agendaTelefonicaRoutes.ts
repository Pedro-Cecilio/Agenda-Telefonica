import { FastifyInstance} from 'fastify'

import { atualizarContatos, buscarContatos, criarContato, deletarContato } from '../controllers/agendaTelefonicaController'

export async function agendaTelefonica(app: FastifyInstance) {
    app.post('/', criarContato)
    app.get('/', buscarContatos)
    app.put('/', atualizarContatos);
    app.delete('/:id', deletarContato); 
}

