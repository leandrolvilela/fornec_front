import { useEffect, useState } from "react";
import banner from '../assets/banner.png';
import axios from 'axios';
import Modal from 'react-modal';
// import { useFornecedor } from "../components/FornecedorContext";

import React from "react";

import AdicionarFornecedor from "../components/AdicionarFornecedor"
import EnderecosFornecedor from "../components/EnderecosFornecedor";
import ListaEnderecos from "../components/ListaEnderecos";


import '../pages/fornecedores.css'

Modal.setAppElement('#root');

export default function Fornecedores() {
    const [fornecedorList, setFornecedor] = useState([])
    const [fornecedorEditado, setFornecedorEditado] = useState(null);
    const [editando, setEditando] = useState(false);
    // const { selecionarFornecedor } = useFornecedor();

    //const [modalAberto, setModalAberto] = useState(false);

    const iniciarEdicaoFornecedor = (fornecedor) => {
        setFornecedorEditado({ ...fornecedor }); // Inicializa o estado de edição com os dados do fornecedor
        setEditando(true); // Ativa o modo de edição
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/fornecedores')
            .then(res => setFornecedor(res.data.fornecedores))
            .catch(error => console.log(error))
    }, [])

    const atualizarFornecedor = (fornecedorId, dadosAtualizados) => {
        // Encontre o índice do fornecedor que deseja atualizar
        const indiceFornecedor = fornecedorList.findIndex(fornecedor => fornecedor.id === fornecedorId);

        if (indiceFornecedor !== -1) {
            // copia a lista existente
            const novaListaFornecedores = [...fornecedorList];

            // Atualizar o fornecedor na cópia da lista
            novaListaFornecedores[indiceFornecedor] = {
                ...novaListaFornecedores[indiceFornecedor],
                ...dadosAtualizados
            };

            // Definir o estado fornecedorList como a cópia atualizada
            setFornecedor(novaListaFornecedores);
        } else {
            if (fornecedorList.length > 0) {
                const indiceFornecedorNovo = fornecedorList.length + 1;

                // copia a lista existente
                const novaListaFornecedores = [...fornecedorList];

                // Atualizar o fornecedor na cópia da lista
                novaListaFornecedores[indiceFornecedorNovo] = {
                    ...novaListaFornecedores[indiceFornecedorNovo],
                    ...dadosAtualizados
                };

                // Definir o estado fornecedorList como a cópia atualizada
                setFornecedor(novaListaFornecedores);
            }
        }
    }

    const salvarEdicaoFornecedor = (fornecedorId) => {
        const dadosAtualizado = {
            id: fornecedorId,
            nome: fornecedorEditado.nome,
            descricao: fornecedorEditado.descricao,
            categoria: fornecedorEditado.categoria
        }

        axios
            .put(`http://127.0.0.1:5000/fornecedor?id=${fornecedorId}`, dadosAtualizado, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then((response) => {
                if (response.status === 200) {
                    alert(`Fornecedor com ID ${fornecedorId} foi atualizado com sucesso.`);

                    setFornecedorEditado(null);
                    setEditando(false);
                    // buscaFornecedor(fornecedorId)
                    atualizarFornecedor(fornecedorId, dadosAtualizado)
                } else {
                    alert(`Falha ao atualizar o fornecedor com ID ${fornecedorId}.`);
                }
            })
            .catch((error) => {
                console.error(error);
                alert(`Erro ao atualizar o fornecedor com ID ${fornecedorId}.`);
            });
    };

    const cancelarEdicaoFornecedor = (fornecedorId) => {
        setFornecedorEditado(null);
        setEditando(false);
    };

    const excluirFornecedor = (fornecedorId) => {
        axios
            .delete(`http://127.0.0.1:5000/fornecedor?id=${fornecedorId}`)
            .then((response) => {
                if (response.status === 200) {
                    alert(`Fornecedor com ID ${fornecedorId} foi excluído com sucesso.`);
                    // Atualize a lista de fornecedores após a exclusão
                    setFornecedor(fornecedorList.filter((fornecedor) => fornecedor.id !== fornecedorId));
                } else {
                    alert(`Falha ao excluir o fornecedor com ID ${fornecedorId}.`);
                }
            })
            .catch((error) => {
                console.error(error);
                alert(`Erro ao excluir o fornecedor com ID ${fornecedorId}.`);
            });
    }

    return (
        <div className="content-product">
            <header>
                <div className="user">
                    <span>Usuário</span>
                </div>
            </header>

            <section className="banner">
                <img src={banner} alt="Banner" />
            </section>

            <section className="fornecedores-section">
                <h1>Lista de Fornecedores</h1>
                <table className="table-container">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fornecedorList.map((fornecedor) => (
                            <tr key={fornecedor.id}>
                                <td>{fornecedor.id}</td>
                                <td>
                                    {editando && fornecedor.id === fornecedorEditado?.id ? (
                                        <input type="text"
                                            className="input-estilizado"
                                            value={fornecedorEditado.nome}
                                            onChange={(e) => setFornecedorEditado({ ...fornecedorEditado, nome: e.target.value })}
                                        />
                                    ) : (
                                        fornecedor.nome
                                    )}
                                </td>
                                <td>
                                    {editando && fornecedor.id === fornecedorEditado?.id ? (
                                        <input type="text"
                                            className="input-estilizado"
                                            value={fornecedorEditado.descricao}
                                            onChange={(e) => setFornecedorEditado({ ...fornecedorEditado, descricao: e.target.value })}
                                        />
                                    ) : (
                                        fornecedor.descricao
                                    )}
                                </td>
                                <td>
                                    {editando && fornecedor.id === fornecedorEditado?.id ? (
                                        <select
                                            value={fornecedorEditado.categoria}
                                            onChange={(e) => setFornecedorEditado({ ...fornecedorEditado, categoria: e.target.value })}
                                            className="dropdown">
                                            <option value="Serviços">Serviços</option>
                                            <option value="Consultoria">Consultoria</option>
                                            <option value="Fabricante">Fabricante</option>
                                        </select>
                                    ) : (
                                        fornecedor.categoria
                                    )}
                                </td>
                                <td>
                                    {editando && fornecedor.id === fornecedorEditado?.id ? (
                                        <>
                                            <button className="salvar-button" onClick={() => salvarEdicaoFornecedor(fornecedor.id)}>
                                                Salvar
                                            </button>
                                            <button className="cancelar-button" onClick={() => cancelarEdicaoFornecedor(fornecedor.id)}>
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <>                                            
                                            <button className="editar-button" onClick={() => iniciarEdicaoFornecedor(fornecedor)}>
                                                Editar
                                            </button>
                                            <button className="excluir-button" onClick={() => excluirFornecedor(fornecedor.id)}>
                                                Excluir
                                            </button>
                                            <EnderecosFornecedor id={fornecedor.id} nome={fornecedor.nome}/>
                                            <ListaEnderecos fornecedor_id={fornecedor.id} nome={fornecedor.nome}/>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </section>

            <div>
                <AdicionarFornecedor atualiza={atualizarFornecedor} />
            </div>

            <footer></footer>
        </div>
    )
}
