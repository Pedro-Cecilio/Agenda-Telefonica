import fastify from "fastify";
import cors from '@fastify/cors'
import { agendaTelefonica } from "./routes/agendaTelefonica";

export const app = fastify()

app.register(cors)
app.register(agendaTelefonica)


