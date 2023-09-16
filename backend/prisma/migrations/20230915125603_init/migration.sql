-- CreateTable
CREATE TABLE "Contato" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Telefone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contatoId" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    CONSTRAINT "Telefone_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "Contato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
