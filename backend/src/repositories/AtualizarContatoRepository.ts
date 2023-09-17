import { prisma } from "../database/database";

export class AtualizarContatoRepository {
    async AtualizarContato(result: any) {
        const { id, nome, idade, telefonesAntigos, telefonesNovos, telefonesDeletados } = result.data;
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
    }
}