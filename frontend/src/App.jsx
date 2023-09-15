import React from 'react';
import ListaTelefonica from './components/listaTelefonica';

function App() {
  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-r from-blue-500 to-blue-700 text-white flex flex-col justify-center items-center gap-2">
      <h1 className="text-2xl font-bold">Lista Telefônica</h1>

      <div className="w-full sm:w-[80%] max-sm:w-full bg-gray-100 rounded-lg p-4">
        <ListaTelefonica />
      </div>
    </div>
  );
}

export default App;
