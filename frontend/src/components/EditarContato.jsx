import React, { useDebugValue, useEffect, useState } from 'react';
import MensagemDeErro from './MensagemDeErro';
import MensagemDeSucesso from './MensagemDeSucesso';

function EditarContato({ closeModal, contato }) {
    // Defina o estado inicial para abrir o modal
    const [isOpen, setIsOpen] = useState(true);
    const [error, setError] = useState(null);
    const [sucesso, setSucesso] = useState(null);
    const [name, setName] = useState(contato.nome);
    const [age, setAge] = useState(contato.idade);
    const [quantidades, setQuantidades] = useState([1, 2, 3, 4, 5]);
    const [quantTel, setQuantTel] = useState(0);
    const [novosTelefones, setNovosTelefones] = useState(Array(quantTel).fill(""));
    const [telefonesCadastrados, setTelefonesCadastrados] = useState([...contato.telefones]);
    const [telefonesDeletados, setTelefonesDeletados] = useState([]);



    const InputNewTelChange = (index, value) => {
        const novosValores = [...novosTelefones];
        novosValores[index] = value;
        setNovosTelefones(novosValores);
    };
    const InputOldTelChange = (element, index, newNumber) => {
        element.numero = newNumber
        const telefones = [...telefonesCadastrados];
        telefones[index] = element;
        setTelefonesCadastrados(telefones);
    };
    const onDelete = (element, index) => {
        let naoVazios = 0
        const telefones = [...telefonesCadastrados];
        const deletado = telefones.splice(index, 1)

        const telDeletados = [...telefonesDeletados]
        telDeletados.push(element)
        setTelefonesDeletados(telDeletados)
        setTelefonesCadastrados(telefones);
    };



    const handleCloseModal = () => {
        setIsOpen(false);
        closeModal(); // Chame a função de fechar modal passada como prop
        window.location.reload()
    };
    function onChangeName(e) {
        setName(e.target.value)
    }
    function onchangeAge(e) {
        setAge(e.target.value)
    }
    function pegarQuantidadeTelefones(e) {
        if (e.target.value == 0) {
            setQuantTel(0)
            return
        }
        setQuantTel(e.target.value)
    }
    function validarFormatoTelefones(telefones) {
        let validos = true
        const regex = /^[0-9]{2}[9][0-9]{8}$/

        if (Array.isArray(telefones) && telefones.every(item => typeof item === 'string')) {
            // É um array de strings
            for (let tel of telefones) {
                const telValido = regex.test(tel)
                if (!telValido) {

                    validos = false

                    break
                }

            }

            return validos
        }

        if (Array.isArray(telefones) && telefones.every(item => typeof item === 'object')) {
            // É um array de objetos
            for (let tel of telefones) {
                const telValido = regex.test(tel.numero)
                if (!telValido) {
                    validos = false
                    break
                }
            }
        }

        return validos
    }
    async function criarContato() {
        const novosTelefonesEnviados = novosTelefones.slice(0, quantTel)
        const novosNumerosValidos = validarFormatoTelefones(novosTelefonesEnviados)
        const numerosAtualizadosValidos = validarFormatoTelefones(telefonesCadastrados)
        if (!novosTelefonesEnviados.length && !telefonesCadastrados.length) {
            setError('É obrigatório cadastrar um número')
            setTimeout(() => {
                setError(null)
            }, 5000);
            return
        }
        if (!name || !age) {

            setError('Campos não preenchidos')
            setTimeout(() => {
                setError(null)
            }, 5000);
            return
        }
        if (!novosNumerosValidos || !numerosAtualizadosValidos) {
            setError('Telefone com formato inválido')
            setTimeout(() => {
                setError(null)
            }, 5000);
            return
        }
        const data = { id: contato.id, nome: name, idade: age, telefonesAntigos: telefonesCadastrados, telefonesNovos: novosTelefonesEnviados, telefonesDeletados: telefonesDeletados }

        const response = await fetch('http://localhost:3000', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Define o tipo de conteúdo
                // Outros cabeçalhos, se necessário
            },
            body: JSON.stringify(data)
        })
        const res = await response.json()
        if (res.error) {
            setError(`Erro ao atualizar ${res.error}`)
            setTimeout(() => {
                setError(null)
            }, 5000);
        }
        if (res.success) {
            setSucesso(res.success)
            setTimeout(() => {
                setSucesso(null)
            }, 5000);
        }
    }

    const inputsTelefone = [];
    for (let i = 0; i < quantTel; i++) {
        inputsTelefone.push(
            <div key={quantidades[i]} className="mb-4 relative">
                <label htmlFor={`telefone-${i}`} className="block text-blue-600 font-semibold">Novo Telefone {quantidades[i]}:</label>
                <input
                    type="text"
                    id={`telefone-${quantidades[i]}`}
                    className="w-full border rounded-md py-2 px-3 text-blue-600 focus:outline-none focus:border-blue-500"
                    placeholder={`Exemplo: 31985965572`}
                    onChange={(e) => InputNewTelChange(i, e.target.value)}
                    value={novosTelefones[i]}
                    required
                />
            </div>
        );
    }


    useEffect(() => {
        // const copia = [...quantidades]
        // copia.splice(0, telefonesCadastrados.length)
        // setQuantidades(copia)
    }, [])
    return (
        isOpen && (
            <>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-y-0 left-0 w-full min-w-screen-sm mx-auto p-6  bg-white flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Editar Contato</h2>
                        <div className='w-[80%]'>
                            <div className="mb-4">
                                <label htmlFor="nome" className="block text-blue-600 font-semibold">Nome:</label>
                                <input
                                    onChange={onChangeName}
                                    type="text"
                                    id="nome"
                                    className="w-full border rounded-md py-2 px-3 text-blue-600 focus:outline-none focus:border-blue-500"
                                    placeholder="Digite o nome do contato"
                                    value={name}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="idade" className="block text-blue-600 font-semibold">Idade:</label>
                                <input
                                    onChange={onchangeAge}
                                    type="number"
                                    id="idade"
                                    className="w-full border rounded-md py-2 px-3 text-blue-600 focus:outline-none focus:border-blue-500"
                                    placeholder="Digite a idade do contato"
                                    value={age}
                                    required
                                />
                            </div>

                            {telefonesCadastrados.map((element, i) => {
                                return (
                                    <div key={element.id} className="mb-4 relative">
                                        <label htmlFor={`telefone-${i}`} className="block text-blue-600 font-semibold">Telefone {i + 1}:</label>
                                        <input
                                            type="text"
                                            id={`telefone-${i}`}
                                            className="w-full border rounded-md py-2 px-3 text-blue-600 focus:outline-none focus:border-blue-500"
                                            placeholder={`Exemplo: 31985965572`}
                                            onChange={(e) => InputOldTelChange(element, i, e.target.value)}
                                            value={telefonesCadastrados[i].numero}
                                            required
                                        />
                                        <div
                                            onClick={() => onDelete(element, i)}
                                            className='bg-red-600 w-fit p-1 rounded absolute -right-10 top-7 cursor-pointer hover:bg-red-700'>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="28" fill="white " viewBox="0 -960 960 960" width="28"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z" /></svg>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="mb-4">
                                <label htmlFor="quantidadeNumeros" className="block text-blue-600 font-semibold">Quantidade de Novos Telefones:</label>
                                <select
                                    className="w-full border rounded-md py-2 px-3 text-blue-600 focus:outline-none focus:border-blue-500"
                                    name="quantidadeNumeros"
                                    id="quantidadeNumeros"
                                    required
                                    onChange={pegarQuantidadeTelefones}
                                >

                                    <option selected value={0}>-</option>

                                    {quantidades.map((i) => {
                                        const qt = quantidades.length - telefonesCadastrados.length
                                        if (i <= qt) {
                                            return <option value={i} key={i}>{i}</option>

                                        }
                                    })}
                                </select>
                            </div>
                            {inputsTelefone}


                            <div className="flex justify-end">
                                <button
                                    onClick={criarContato}
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                                >
                                    Atualizar
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
                    

                </div >

            </>
        )
    );
}

export default EditarContato;
