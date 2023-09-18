import { useEffect, useState } from "react";
import axios from 'axios';
import Modal from 'react-modal';
import modalStyles from './modalStyles';

import React from "react";
import '../pages/fornecedores.css'

Modal.setAppElement('#root');

const ListaEnderecos = props => {
    //export default function ListaEnderecos() {
    const [enderecoList, setEndereco] = useState([])
    const [enderecoEditado, setEnderecoEditado] = useState(null);
    const [editando, setEditando] = useState(false);

    const [fornecedor_id, setFornecedorID] = useState(null)
    const [fornecedor_nome, setFornecedorNome] = useState(null)

    const [modalIsOpenLista, setModalIsOpenLista] = useState(false);

    const openModalLista = () => {
        setFornecedorID(props.fornecedor_id);
        setFornecedorNome(props.nome);
        setModalIsOpenLista(true);
    };

    const closeModal = () => {
        setFornecedorID(null)
        setFornecedorNome(null);
        setModalIsOpenLista(false);
    };

    const iniciarEdicaoEndereco = (fornecedor) => {
        setEnderecoEditado({ ...fornecedor }); // Inicializa o estado de edição com os dados do fornecedor
        setEditando(true); // Ativa o modo de edição
    };

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/fornecedor_endereco?fornecedor_id=${fornecedor_id}`)
            .then(res => {
                setEndereco(res.data.enderecos_fornecedores);
            })
            .catch(error => console.log('Fornecedor: ',props.fornecedor_id,' erro: ',error))
        }, [fornecedor_id, enderecoList]
    );

    const atualizarEndereco = (fornecedorId, dadosAtualizados) => {
        // Encontre o índice do fornecedor que deseja atualizar
        const indiceEndereco = enderecoList.findIndex(fornecedor => fornecedor.id === fornecedorId);

        if (indiceEndereco !== -1) {
            // copia a lista existente
            const novaListaEnderecos = [...enderecoList];

            // Atualizar o fornecedor na cópia da lista
            novaListaEnderecos[indiceEndereco] = {
                ...novaListaEnderecos[indiceEndereco],
                ...dadosAtualizados
            };

            // Definir o estado fornecedorList como a cópia atualizada
            setEndereco(novaListaEnderecos);
        } else {
            if (enderecoList.length > 0) {
                const indiceEnderecoNovo = enderecoList.length + 1;
      
                // copia a lista existente
                const novaListaEnderecos = [...enderecoList];

                // Atualizar o fornecedor na cópia da lista
                novaListaEnderecos[indiceEnderecoNovo] = {
                    ...novaListaEnderecos[indiceEnderecoNovo],
                    ...dadosAtualizados
                };

                // Definir o estado fornecedorList como a cópia atualizada
                setEndereco(novaListaEnderecos);
            }
        }
    }

    const salvarEdicaoEndereco = (fornecedorId, enderecoId) => {
        const dadosAtualizado = {
            id:            enderecoId,
            fornecedor_id: fornecedorId,
            cep:           enderecoEditado.cep,
            cidade:        enderecoEditado.cidade,
            endereco:      enderecoEditado.endereco,
            tipo_endereco: enderecoEditado.tipo_endereco,
            uf:            enderecoEditado.uf,
        }
        
        axios
            .put(`http://127.0.0.1:5000/fornecedor_endereco?fornecedor_id=${fornecedorId}&id=${enderecoId}`, dadosAtualizado, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then((response) => {
                if (response.status === 200) {
                    alert(`Fornecedor com ID ${fornecedorId} foi atualizado com sucesso.`);

                    setEnderecoEditado(null);
                    setEditando(false);
                    // buscaFornecedor(fornecedorId)
                    atualizarEndereco(fornecedorId, dadosAtualizado)
                } else {
                    alert(`Falha ao atualizar o endereço do fornecedor com ID ${fornecedorId}.`);
                }
            })
            .catch((error) => {
                console.error(error);
                alert(`Erro ao atualizar o endereço do fornecedor com ID ${fornecedorId}.`);
            });
    };

    const cancelarEdicaoEndereco = (fornecedorId) => {
        setEnderecoEditado(null);
        setEditando(false);
    };

    const excluirEndereco = (enderecoId, fornecedorId) => {
        axios
            .delete(`http://127.0.0.1:5000/fornecedor_endereco?id_end=${enderecoId}&fornecedor_id=${fornecedorId}`)
            .then((response) => {
                if (response.status === 200) {
                    alert(`Endereço ${enderecoId} do fornecedor ID ${fornecedorId} foi excluído com sucesso.`);
                    // Atualize a lista de endereço do fornecedor após a exclusão
                    setEndereco(enderecoList.filter((endereco) => endereco.id !== enderecoId));
                } else {
                    alert(`Falha ao excluir o endereço com ID ${enderecoId}.`);
                }
            })
            .catch((error) => {
                console.error(error);
                alert(`Erro ao excluir o endereço com ID ${enderecoId}.`);
            });
    }

    return (
        <div >
            <button className="ver-button" onClick={openModalLista}>
                Ver Endereços
            </button>
            <Modal
                isOpen={modalIsOpenLista}
                onRequestClose={closeModal}
                contentLabel="Lista Endereço"
                style={modalStyles}
            >
                <div className="content-fornecedor">
                    <section className="fornecedores-section">

                        <span className="text">Lista de Endereços</span>
                        <h3>Fornecedor: {fornecedor_id} - {fornecedor_nome}</h3>

                        <table className="table-container">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo endereço</th>
                                    <th>CEP</th>
                                    <th>Endereço</th>
                                    <th>Cidade</th>
                                    <th>UF</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enderecoList.map((endereco) => (
                                    <tr key={endereco.id}>
                                        <td>{endereco.id}</td>
                                        <td>
                                            {editando && endereco.id === enderecoEditado?.id && endereco.fornecedor_id === enderecoEditado?.fornecedor_id ? (
                                                <select
                                                    value={enderecoEditado.tipo_endereco}
                                                    onChange={(e) => setEnderecoEditado({ ...enderecoEditado, tipo_endereco: e.target.value })}
                                                    className="dropdown">
                                                    <option value="Faturamento">Faturamento</option>
                                                    <option value="Entrega">Entrega</option>
                                                    <option value="Outros">Outros</option>
                                                </select>
                                            ) : (
                                                endereco.tipo_endereco
                                            )}
                                        </td>
                                        <td>
                                            {editando && endereco.id === enderecoEditado?.id && endereco.fornecedor_id === enderecoEditado?.fornecedor_id ? (
                                                <input type="text"
                                                    className="input-estilizado"
                                                    value={enderecoEditado.cep}
                                                    onChange={(e) => setEnderecoEditado({ ...enderecoEditado, cep: e.target.value })}
                                                />
                                            ) : (
                                                endereco.cep
                                            )}
                                        </td>
                                        <td>
                                            {editando && endereco.id === enderecoEditado?.id && endereco.fornecedor_id === enderecoEditado?.fornecedor_id ? (
                                                <input type="text"
                                                    className="input-estilizado"
                                                    value={enderecoEditado.endereco}
                                                    onChange={(e) => setEnderecoEditado({ ...enderecoEditado, endereco: e.target.value })}
                                                />
                                            ) : (
                                                endereco.endereco
                                            )}
                                        </td>
                                        <td>
                                            {editando && endereco.id === enderecoEditado?.id && endereco.fornecedor_id === enderecoEditado?.fornecedor_id ? (
                                                <input type="text"
                                                    className="input-estilizado"
                                                    value={enderecoEditado.cidade}
                                                    onChange={(e) => setEnderecoEditado({ ...enderecoEditado, cidade: e.target.value })}
                                                />
                                            ) : (
                                                endereco.cidade
                                            )}
                                        </td>
                                        <td>
                                            {editando && endereco.id === enderecoEditado?.id && endereco.fornecedor_id === enderecoEditado?.fornecedor_id ? (
                                                <input type="text"
                                                    className="input-estilizado"
                                                    value={enderecoEditado.uf}
                                                    onChange={(e) => setEnderecoEditado({ ...enderecoEditado, uf: e.target.value })}
                                                />
                                            ) : (
                                                endereco.uf
                                            )}
                                        </td>
                                        <td>
                                            {editando && endereco.id === enderecoEditado?.id && endereco.fornecedor_id === enderecoEditado?.fornecedor_id ? (
                                                <>
                                                    <button className="salvar-button" onClick={() => salvarEdicaoEndereco(endereco.fornecedor_id, endereco.id)}>
                                                        Salvar
                                                    </button>
                                                    <button className="cancelar-button" onClick={() => cancelarEdicaoEndereco(endereco.fornecedor_id, endereco.id)}>
                                                        Cancelar
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="editar-button" onClick={() => iniciarEdicaoEndereco(endereco)}>
                                                        Editar
                                                    </button>
                                                    <button className="excluir-button" onClick={() => excluirEndereco(endereco.id, endereco.fornecedor_id)}>
                                                        Excluir
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>


                        <div className="form-buttons">
                            <button
                                type="button"
                                className="excluir-button"
                                onClick={closeModal}
                            >
                                Fechar
                            </button>
                        </div>
                    </section>
                </div>
            </Modal>

        </div>
    )
}


export default ListaEnderecos;