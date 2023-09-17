import React, { useState, useEffect } from "react";
import CadastroContato from "./CadastroContato";
import EditarContato from "./EditarContato";
import AlertDeExcluir from "./AlertDeExcluir";
import MensagemDeErro from './MensagemDeErro';
import MensagemDeSucesso from './MensagemDeSucesso';
import Pagination from "./Paginacao";
import Paginacao from "./Paginacao";

function Telefones({ contato }) {
  const [indexNumeroAtual, setIndexNumeroAtual] = useState(0);

  const numeroAnterior = () => {
    if (indexNumeroAtual > 0) {
      setIndexNumeroAtual(indexNumeroAtual - 1);
    }
  };

  const proximoNumero = () => {
    if (indexNumeroAtual < contato.telefones.length - 1) {
      setIndexNumeroAtual(indexNumeroAtual + 1);
    }
  };

  return (
    <td className="flex items-center pb-8 pt-11  border-b border-gray-200">
      {indexNumeroAtual > 0 && (
        <svg
          onClick={numeroAnterior}
          className="w-2 h-4 text-white dark:text-gray-800 cursor-pointer"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 1 1 5l4 4"
          />
        </svg>
      )}
      <span id="contentNumber" className="px-2">
        {contato.telefones[indexNumeroAtual].numero}
      </span>
      {indexNumeroAtual < contato.telefones.length - 1 && (
        <svg
          onClick={proximoNumero}
          className="w-2 h-4 text-white dark:text-gray-800 cursor-pointer"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
      )}
    </td>
  );
}

function ListaTelefonica() {
  const [modalCadastroOpen, setModalCadastroOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [contatos, setContatos] = useState([]);
  const [contatoDeletar, setContatoDeletar] = useState(null);
  const [contatoEditar, setContatoEditar] = useState(null);
  const [alertDeExcluir, setAlertDeExcluir] = useState(false);
  const [error, setError] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [search, setSearch] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
  const contatosPorPagina = 5; // Número de contatos por página


  // Função para abrir o modal
  const abrirModalCadastro = () => {
    setModalCadastroOpen(true);
  };

  // Função para fechar o modal
  const fecharModalCadastro = () => {
    setModalCadastroOpen(false);
    window.location.reload()
  };

  // Função para abrir o modal
  const abrirModalEditar = (contato) => {
    setContatoEditar(contato)
    setModalEditarOpen(true);
  };

  // Função para fechar o modal
  const fecharModalEditar = () => {
    setContatoEditar(null)
    setModalEditarOpen(false)
    window.location.reload()
  };

  async function buscarTodosContatos() {
    const response = await fetch("http://localhost:3000/", {
      method: "GET",
    });
    const arrayContatos = await response.json();
    setContatos(arrayContatos);
  }
  function deletarContato(contato) {
    setContatoDeletar(contato)
    setAlertDeExcluir(true)
  }
  async function handleConfirmarExclusao(contato) {
    const result = await fetch(`http://localhost:3000/${contato.id}`, {
      method: "DELETE",
    });
    const response = await result.json();
    setAlertDeExcluir(false)
    if (response.error) {
      setError(`Erro ao Excluir ${response.error}`)
      setTimeout(() => {
        setError(null)
      }, 5000);
    }
    if (response.success) {
      setSucesso(response.success)
      setTimeout(() => {
        setSucesso(null)
        window.location.reload()
      }, 2000);
    }

  }
  function handleCancelarExclusao() {
    setContatoDeletar(null)
    setAlertDeExcluir(false)
  }
  function onChangeSearch(e) {
    setSearch(e.target.value)
  }
  async function buscarContato() {
    const result = await fetch(`http://localhost:3000/?search=${search}`, {
      method: "GET",
    });
    const response = await result.json();
    console.log(response)
    if (response.error) {
      setError(`Erro ao atualizar ${response.error}`)
      setTimeout(() => {
        setError(null)
      }, 5000);
    }
    setContatos(response);
  }

  useEffect(() => {
    buscarTodosContatos();
  }, []);

  const indiceInicial = (paginaAtual - 1) * contatosPorPagina;
  const indiceFinal = paginaAtual * contatosPorPagina;
  const contatosDaPagina = contatos.slice(indiceInicial, indiceFinal);


  return (
    <>
      <div>
        <div className="flex justify-between mb-4">
          <div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
              onClick={(abrirModalCadastro)}
            >
              Adicionar Contato
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 mx-2 text-white py-2 px-4 rounded-md"
              onClick={() => window.location.reload()}
            >
              Atualizar Lista
            </button>
          </div>
          <div className="flex items-center">
            <input
              onChange={onChangeSearch}
              value={search}
              type="text"
              placeholder="Buscar Contato"
              className="border-2 border-blue-600 focus:border-blue-900 focus:outline-none rounded-md py-2 px-4 text-black font-semibold"
            />
            <svg
              onClick={buscarContato}
              className="cursor-pointer rounded-xl hover:bg-blue-100" xmlns="http://www.w3.org/2000/svg" fill="blue" height="32" viewBox="0 -960 960 960" width="32"><path d="M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z" /></svg>
          </div>

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
            {contatosDaPagina.map((contato) => (
              <tr key={contato.id} className="relative">
                <td className="py-2 px-6 border-b border-gray-200">{contato.nome}</td>
                <td className="py-2 px-6 border-b border-gray-200">{contato.idade}</td>
                <Telefones contato={contato} />
                <td className="py-2 px-6 border-b border-gray-200 text-center">
                  <button onClick={() => abrirModalEditar(contato)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md mr-2 max-md:m-2">Editar</button>
                  <button onClick={() => deletarContato(contato)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md">Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={Math.ceil(contatos.length / contatosPorPagina)}
          onPageChange={setPaginaAtual}
        />
        {modalCadastroOpen && <CadastroContato closeModal={fecharModalCadastro} />}
        {modalEditarOpen && <EditarContato closeModal={fecharModalEditar} contato={contatoEditar} />}
        {alertDeExcluir && <AlertDeExcluir
          onConfirm={() => handleConfirmarExclusao(contatoDeletar)}
          onCancel={handleCancelarExclusao}
          nomeDoContato={contatoDeletar.nome}
        />}

      </div>
      {error && <MensagemDeErro message={error} />}
      {sucesso && <MensagemDeSucesso message={sucesso} />}
    </>
  );
}


export default ListaTelefonica;
