import { useState } from "react";
import CadastroContato from "./CadastroContato";

function ListaTelefonica() {
    const array = [1, 2, 3, 4, 5]
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Função para abrir o modal
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    // Função para fechar o modal
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    return (
      <div>
        <div className="flex justify-between mb-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            onClick={openModal}
          >
            Adicionar Contato
          </button>
          <input
            type="text"
            placeholder="Buscar Contato"
            className="border border-gray-300 rounded-md py-2 px-4"
          />
        </div>

            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="py-3 px-6 text-left">Nome</th>
                        <th className="py-3 px-6 text-left">Idade</th>
                        <th className="py-3 px-6 text-left">Telefone</th>
                        <th className="py-3 px-6 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {array.map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 px-6 border-b border-gray-200">Pedro Samuel</td>
                            <td className="py-2 px-6 border-b border-gray-200">22</td>
                            <td className="py-2 px-6 border-b border-gray-200">319775642958</td>
                            <td className="py-2 px-6 border-b border-gray-200 text-center">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md mr-2 max-md:m-2">Editar</button>
                                <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md">Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && <CadastroContato closeModal={closeModal} />}

        </div>
    )
}


export default ListaTelefonica