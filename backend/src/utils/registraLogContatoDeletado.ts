import fs from 'fs';
import path from 'path';

export function registraLogContatoDeletado(contatoId: number) {
    // Obtenha o diretório atual do módulo
    const rotaRaiz = path.resolve(__dirname, '..', '..')
    const logPath = path.join(rotaRaiz, 'logs'); // Diretório onde os logs serão armazenados
    const logFile = path.join(logPath, 'ContatosDeletados.txt'); // Nome do arquivo de log

    // Verifique se o diretório de logs existe, crie-o se não existir
    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
    }

    // Registra a data e hora atual
    const timestamp = new Date().toLocaleString();
    const logEntry = `${timestamp}: Contato com ID ${contatoId} foi excluído.\n`;

    // Escreva o log no arquivo
    fs.appendFile(logFile, logEntry, (err) => {
        if (err) {
            console.error('Erro ao escrever no arquivo de log:', err);
        }
    });
}
