import React from 'react';

function AlertDeExcluir({ onConfirm, onCancel, nomeDoContato }) {
  return (
    <div className="fixed bg-blue-500/30 inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="text-gray-800 text-lg mb-4 text-center">Tem certeza de que deseja excluir o contato do(a) {nomeDoContato}?</p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md mr-2"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2 rounded-md"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertDeExcluir;
