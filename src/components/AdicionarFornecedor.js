import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import modalStyles from './modalStyles';
import config from '../assets/config.json'; 
import '../pages/fornecedores.css'


function AdicionarFornecedor({ atualiza }) {
    const [novoFornecedor, setNovoFornecedor] = useState({
        id: '',
        nome: '',
        descricao: '',
        categoria: 'Serviço',
    });

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const formData = new FormData();

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const adicionarFornecedor = (e) => {
        e.preventDefault();

        // Verifique se todos os campos foram preenchidos
        if (!novoFornecedor.nome || !novoFornecedor.descricao || !novoFornecedor.categoria) {
            console.log('categoria: ', novoFornecedor.categoria)
            alert('Por favor, preencha todos os campos.');
            return;
        }

        formData.append('nome', novoFornecedor.nome);
        formData.append('descricao', novoFornecedor.descricao);
        formData.append('categoria', novoFornecedor.categoria);

        // console.log('NOVO FORNECEDOR: ',novoFornecedor)        

        axios
            .post(`${config.serverUrl}/fornecedor`, formData)
            .then((response) => {
                if (response.status === 201 || response.status === 200) {
                    alert('Fornecedor adicionado com sucesso.');
                    setNovoFornecedor({ nome: '', descricao: '', categoria: '' });
                    const idFornecedor = response.data.id;
                     
                    novoFornecedor.id = idFornecedor
                     
                    atualiza(idFornecedor, novoFornecedor)
                    closeModal(); // Feche o modal após adicionar com sucesso
                } else {
                    alert(`Falha ao adicionar o fornecedor. ${response.status}`);
                }
            })
            .catch((error) => {
                console.error(error);
                console.log(novoFornecedor);
                alert('Erro ao adicionar o fornecedor.');
            });
    };

    return (
        <div>
            <button className="ver-button" onClick={openModal}>
                Adicionar Fornecedor
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Adicionar Fornecedor"
                style={modalStyles}
            >
                <div className="adicionar-fornecedor">

                    <span className="text">Adicionar Novo Fornecedor</span>

                    <form onSubmit={adicionarFornecedor}>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="nome">Nome</label>
                                <input
                                    type="text"
                                    id="nome"
                                    className="input-estilizado-nome "
                                    value={novoFornecedor.nome}
                                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, nome: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <label htmlFor="descricao">Descrição</label>
                                <input
                                    type="text"
                                    className="input-estilizado-descricao"
                                    id="descricao"
                                    value={novoFornecedor.descricao}
                                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, descricao: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <label className="Label-Modal" htmlFor="categoria">Categoria</label>
                                <select 
                                    value={novoFornecedor.categoria}
                                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, categoria: e.target.value })}
                                    className="dropdown">
                                    <option value="Serviços">Serviços</option>
                                    <option value="Consultoria">Consultoria</option>
                                    <option value="Fabricante">Fabricante</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="editar-button">
                                Adicionar
                            </button>
                            <button
                                type="button"
                                className="excluir-button"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                        </div>

                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default AdicionarFornecedor;
