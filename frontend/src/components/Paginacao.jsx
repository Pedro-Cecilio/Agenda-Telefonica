import React from "react";

function Paginacao({ paginaAtual, totalPaginas, onPageChange }) {
  const paginaAnterior = () => {
    if (paginaAtual > 1) {
      onPageChange(paginaAtual - 1);
    }
  };

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      onPageChange(paginaAtual + 1);
    }
  };

  return (
    totalPaginas > 1 ? (
      <div className="flex justify-center my-4 items-center">
        {paginaAtual > 1 && (
          <button
            onClick={paginaAnterior}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
          >
            Anterior
          </button>
        )}
        {paginaAtual < totalPaginas && (
          <button
            onClick={proximaPagina}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
          >
            Próxima
          </button>
        )}
      </div>
    ) : null
  );
}

export default Paginacao;
