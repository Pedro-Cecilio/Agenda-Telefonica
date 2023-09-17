import { prisma } from "../database/database";

export class CriarTelefoneRepository{
    async CriarTelefone(contatoId: number, numero: string){
        await prisma.telefone.create({
            data: {
                contatoId: contatoId,
                numero: numero
            }
        })
    }
}