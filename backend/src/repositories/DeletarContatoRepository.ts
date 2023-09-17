import { prisma } from "../database/database";
import { registraLogContatoDeletado } from "../utils/registraLogContatoDeletado";

export class DeletarContatoRepository{
    async DeletarContato(id: number){
        await prisma.contato.delete({
            where: {
                id: id,
            },
        });
        registraLogContatoDeletado(id)
    }
}