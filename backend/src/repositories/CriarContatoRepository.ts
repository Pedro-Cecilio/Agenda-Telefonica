import { prisma } from "../database/database";

export class CriarContatoRepository{
    async CriarContato(nome: string, idade: number){
        const novoContato = await prisma.contato.create({
            data: {
                nome: nome,
                idade: idade
            }
        })
        return novoContato
    }
}