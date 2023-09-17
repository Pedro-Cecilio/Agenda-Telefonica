import React, { useState } from 'react';
import MensagemDeErro from './MensagemDeErro';
import MensagemDeSucesso from './MensagemDeSucesso';

function CadastroContato({ closeModal }) {
  // Defina o estado inicial para abrir o modal
  const [error, setError] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [quantTel, setQuantTel] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [valoresTelefones, setValoresTelefones] = useState(Array(quantTel).fill(""));
  const quantidades = [1, 2, 3, 4, 5];

  const handleInputTelChange = (index, value) => {
    const novosValores = [...valoresTelefones];
    novosValores[index] = value;
    setValoresTelefones(novosValores);
  };


  function pegarQuantidadeTelefones(e) {
    setQuantTel(e.target.value)
  }
  const handleCloseModal = () => {
    closeModal(); // Chame a função de fechar modal passada como prop
  };
  function observaInputNome(e) {
    setName(e.target.value)
  }
  function observaInputIdade(e) {
    setAge(e.target.value)
  }
  function validarFormatoTelefones(telefones) {
    let validos = true
    const regex = /^[0-9]{2}[9][0-9]{8}$/
    for (let tel of telefones) {
      const telValido = regex.test(tel)
      if (!telValido) {
        validos = false
        break
      }
    }
    return validos
  }
  async function criarContato() {
    const telefonesValidos = valoresTelefones.slice(0, quantTel)
    const formatoValido = validarFormatoTelefones(telefonesValidos)

    if (!name || !age || !telefonesValidos.length) {
      setError('Campos não preenchidos')
      setTimeout(() => {
        setError(null)
      }, 5000);
      return
    }
    if (!formatoValido) {
      setError('Telefone com formato inválido')
      setTimeout(() => {
        setError(null)
      }, 5000);
      return
    }
    const data = { nome: name, idade: age, telefones: telefonesValidos }

    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Define o tipo de conteúdo
        // Outros cabeçalhos, se necessário
      },
      body: JSON.stringify(data)
    })
    const res = await response.json()
    if (res.error) {
      setError(`Erro ao cadastrar ${res.error}`)
      setTimeout(() => {
        setError(null)
      }, 5000);
    }
    if (res.sucess) {
      setSucesso(res.sucess)
      setTimeout(() => {
        setSucesso(null)
      }, 5000);
    }
  }

  const inputsTelefone = [];
  for (let i = 0; i < quantTel; i++) {
    inputsTelefone.push(
      <div key={i} className="mb-4">
        <label htmlFor={`telefone-${i}`} className="block text-blue-600 font-semibold">Telefone {i + 1}:</label>
        <input
          type="text"
          id={`telefone-${i}`}
          className="w-full border rounded-md py-2 px-3 text-blue-600 focus:outline-none focus:border-blue-500"
          placeholder={`Exemplo: 31985965572`}
          value={valoresTelefones[i]}
          onChange={(e) => handleInputTelChange(i, e.target.value)}
          required
        />
      </div>
    );
  }

  return (

    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-y-0 left-0 w-full min-w-screen-sm mx-auto p-6  bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Cadastrar Contato</h2>
        <div className='w-[80%]'>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-blue-600 font-semibold">Nome:</label>
            <input
              onChange={observaInputNome}
              type="text"
              id="nome"
              className="w-full border rounded-md py-2 px-3 text-blue-600 focus:outline-none focus:border-blue-500"
              placeholder="Digite o nome do contato"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="idade" className="block text-blue-600 font-semibold">Idade:</label>
            <input
              onChange={observaInputIdade}
              type="number"
              id="idade"
              className="w-full border rounded-md py-2 px-3 text-blue-600 focus:outline-none focus:border-blue-500"
              placeholder="Digite a idade do contato"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantidadeNumeros" className="block text-blue-600 font-semibold">Quantidade de Telefones:</label>
            <select
              onChange={pegarQuantidadeTelefones}
              className="w-full border rounded-md py-2 px-3 text-blue-600 focus:outline-none focus:border-blue-500"
              name="quantidadeNumeros"
              id="quantidadeNumeros"
              required>
              <option disabled selected value={0}>-</option>
              {quantidades.map((i) => {

                return <option value={i} key={i}>{i}</option>
              })}
            </select>
          </div>
          {inputsTelefone}

          { }
          <div className="flex justify-end">
            <button
              onClick={criarContato}
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Cadastrar
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-2">
          <button
            type="button"
            onClick={handleCloseModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 m-2 rounded-md "
          >
            X
          </button>
        </div>

      </div>
      {error && <MensagemDeErro message={error} />}
      {sucesso && <MensagemDeSucesso message={sucesso} />}

    </div>

  );
}

export default CadastroContato;
