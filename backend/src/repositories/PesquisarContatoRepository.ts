import { prisma } from "../database/database";

export class PesquisarContatoRepository{
    async PesquisarContato(search: string){
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
        return contatos
    }
}