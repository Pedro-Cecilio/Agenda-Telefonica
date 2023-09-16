-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Telefone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contatoId" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    CONSTRAINT "Telefone_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "Contato" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Telefone" ("contatoId", "id", "numero") SELECT "contatoId", "id", "numero" FROM "Telefone";
DROP TABLE "Telefone";
ALTER TABLE "new_Telefone" RENAME TO "Telefone";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
