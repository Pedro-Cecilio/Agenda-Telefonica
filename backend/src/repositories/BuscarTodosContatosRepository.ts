import { prisma } from "../database/database";

export class BuscarTodosContatosRepository{
    async BuscaTodosContatos(){
        const todosContatos = await prisma.contato.findMany({
            include: {
                telefones: true,
            },
        });
        return todosContatos
    }
}