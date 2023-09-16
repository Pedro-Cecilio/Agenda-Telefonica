import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../database/database'
import { z } from 'zod'

export async function agendaTelefonica(app: FastifyInstance) {
    app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
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
            const novoContato = await prisma.contato.create({
                data: {
                    nome: nome,
                    idade: idade
                }
            })
            telefones.forEach(async (tel) => {
                await prisma.telefone.create({
                    data: {
                        contatoId: novoContato.id,
                        numero: tel
                    }
                })
            })
        } catch (error) {
            if (error instanceof Error)
                return reply.status(500).send({ error: error.message })
        }
        reply.status(200).send({ sucess: 'Contato criado com sucesso' })
    })
    app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
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
                const contatos = await prisma.contato.findMany({
                    where: {
                        OR: [
                            {
                                nome: {
                                    contains: search, // Verifique se o nome do contato contém o valor da consulta
                                    // Ignora diferenças entre maiúsculas e minúsculas
                                },
                            },
                            {
                                telefones: {
                                    some: {
                                        numero: {
                                            contains: search, // Verifique se o número do telefone contém o valor da consulta
                                        },
                                    },
                                },
                            },
                        ],
                    },
                    include: {
                        telefones: true, // Certifique-se de incluir os telefones
                    },
                });
                reply.status(200).send(contatos)
            } catch (error) {
                if (error instanceof Error) {
                    return reply.status(500).send({ error: error.message });
                }
            }
        }

        const contatosComTelefones = await prisma.contato.findMany({
            include: {
                telefones: true,
            },
        });
        reply.send(contatosComTelefones)

    })
    app.put('/', async (request: FastifyRequest, reply: FastifyReply) => {
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

        const { id, nome, idade, telefonesAntigos, telefonesNovos, telefonesDeletados } = result.data;

        try {
            await prisma.$transaction(async (tx) => {
                // Deleta os telefones marcados como deletados
                if (telefonesDeletados.length) {
                    for (const tel of telefonesDeletados) {
                        await tx.telefone.delete({
                            where: {
                                id: tel?.id,
                            },
                        });
                    }
                }

                // Atualiza os telefones antigos se existirem
                if (telefonesAntigos.length) {
                    for (const tel of telefonesAntigos) {
                        await tx.telefone.update({
                            where: {
                                id: tel?.id,
                            },
                            data: {
                                numero: tel?.numero,
                            },
                        });
                    }
                }

                // Cadastra os novos telefones
                if (telefonesNovos.length) {
                    for (const tel of telefonesNovos) {
                        await tx.telefone.create({
                            data: {
                                contatoId: id,
                                numero: String(tel),
                            },
                        });
                    }
                }

                // Atualiza os dados de contato (nome e idade)
                await tx.contato.update({
                    where: {
                        id: id,
                    },
                    data: {
                        nome,
                        idade,
                    },
                });
            });

            reply.status(200).send({ success: 'Contato Atualizado com Sucesso' });
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({ error: error.message });
            }
        }
    });
    app.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
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
            await prisma.contato.delete({
                where: {
                    id: id,
                },
            });

            reply.status(200).send({ success: 'Contato excluído com sucesso' });
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({ error: error.message });
            }
        }
    });
    app.get('/busca', async (request: FastifyRequest, reply: FastifyReply) => {



    })
}

