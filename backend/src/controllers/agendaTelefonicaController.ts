import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import {CriarContatoRepository } from "../repositories/CriarContatoRepository"
import { CriarTelefoneRepository } from "../repositories/CriarTelefoneRepository"
import { BuscarTodosContatosRepository } from "../repositories/BuscarTodosContatosRepository"
import { PesquisarContatoRepository } from "../repositories/PesquisarContatoRepository"
import { AtualizarContatoRepository } from "../repositories/AtualizarContatoRepository"
import { DeletarContatoRepository } from "../repositories/DeletarContatoRepository"

export async function criarContato(request: FastifyRequest, reply: FastifyReply){
    const criarContatoSchema = z.object({
        nome: z.string(),
        idade: z.coerce.number(),
        telefones: z.array(z.string())
    })
    const result = criarContatoSchema.safeParse(request.body)
    if (!result.success) {
        return reply.status(400).send({ error: "Dados Invalidos" })
    }
    const { nome, idade, telefones } = result.data

    try {
        const criarContatoRepository = new CriarContatoRepository()
        const novoContato = await criarContatoRepository.CriarContato(nome, idade)

        const criarTelefoneRepository = new CriarTelefoneRepository()
        telefones.forEach(async (tel) => {
            await criarTelefoneRepository.CriarTelefone(novoContato.id , tel )
        })
    } catch (error) {
        if (error instanceof Error)
            return reply.status(500).send({ error: error.message })
    }
    reply.status(200).send({ sucess: 'Contato criado com sucesso' })
}
export async function buscarContatos (request: FastifyRequest, reply: FastifyReply){
    const criarContatoSchema = z.object({
        search: z.coerce.string().optional()
    })
    const result = criarContatoSchema.safeParse(request.query)
    if (!result.success) {
        return reply.status(400).send({ error: "Dados Invalidos" })
    }
    const { search } = result.data
    // Converta o termo de pesquisa para minúsculas
    if (search) {
        try {
            const pesquisarContatoRepository = new PesquisarContatoRepository()
            const contatos = await pesquisarContatoRepository.PesquisarContato(search)
            reply.status(200).send(contatos)
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({ error: error.message });
            }
        }
    }
    const buscarTodosContatosRepository = new BuscarTodosContatosRepository()
    const todosContatos =  await buscarTodosContatosRepository.BuscaTodosContatos();
    reply.send(todosContatos)

}
export async function atualizarContatos(request: FastifyRequest, reply: FastifyReply){
    const criarContatoSchema = z.object({
        id: z.number(),
        nome: z.string(),
        idade: z.coerce.number(),
        telefonesAntigos: z.array(z.object({
            id: z.number(),
            contatoId: z.number(),
            numero: z.string()
        }).optional()),
        telefonesNovos: z.array(z.string().optional()),
        telefonesDeletados: z.array(z.object({
            id: z.number(),
            contatoId: z.number(),
            numero: z.string()
        }).optional())
    });

    const result = criarContatoSchema.safeParse(request.body);
    if (!result.success) {
        return reply.status(400).send({ error: "Dados Inválidos" });
    }    

    try {
        const atualizarContatoRepository=new AtualizarContatoRepository()
        await atualizarContatoRepository.AtualizarContato(result)
        

        reply.status(200).send({ success: 'Contato Atualizado com Sucesso' });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(500).send({ error: error.message });
        }
    }
}
export async function deletarContato (request: FastifyRequest, reply: FastifyReply){
    const idContatoSchema = z.object({
        id: z.coerce.number(),

    })
    const result = idContatoSchema.safeParse(request.params)
    if (!result.success) {
        return reply.status(400).send({ error: "Contato inválido" })
    }
    const { id } = result.data


    try {
        // Exclui o contato e seus telefones relacionados em cascata
        const deletarContatoRepository = new DeletarContatoRepository()
        await deletarContatoRepository.DeletarContato(id)

        reply.status(200).send({ success: 'Contato excluído com sucesso' });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(500).send({ error: error.message });
        }
    }
}