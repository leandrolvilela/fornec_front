import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import modalStyles from './modalStyles';
import config from '../assets/config.json'; 
import '../pages/fornecedores.css';


const EnderecosFornecedor = fornecedor => {
  const [novoEndereco, setNovoEndereco] = useState({
    cep: '',
    cidade: '',
    endereco: '',
    fornecedorEndereco_id: fornecedor.id,
    tipo_endereco: 'Faturamento',
    uf: 'SP',
  });

  // console.log("FORNECEDOR ID:", fornecedor.id)

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [endereco, setEndereco] = useState('');
  const formData = new FormData();

  const buscarEnderecoPorCep = (e) => {
    e.preventDefault();
    axios
      .get(`https://viacep.com.br/ws/${novoEndereco.cep}/json/`)
      .then((response) => {
        if (response.data.erro) {
          alert('CEP não encontrado');
        } else {
          const { logradouro, localidade, uf, bairro } = response.data;
          const enderecoCompleto = `${logradouro}, ${bairro}`
          setEndereco(`Logradouro: ${logradouro}, Bairro: ${bairro}, Cidade: ${localidade}, UF: ${uf}`);
          setNovoEndereco({
            cep: novoEndereco.cep,
            cidade: localidade,
            endereco: enderecoCompleto,
            fornecedorEndereco_id: fornecedor.id,
            tipo_endereco: novoEndereco.tipo_endereco,
            uf: uf,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Ocorreu um erro ao buscar o endereço.');
      });
  };

  const adicionarEndereco = (e) => {
    e.preventDefault();

    // Verifique se todos os campos foram preenchidos
    if (
      !novoEndereco.cep ||
      !novoEndereco.cidade ||
      !novoEndereco.endereco ||
      !novoEndereco.tipo_endereco ||
      !novoEndereco.uf
    ) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    formData.append('cep', novoEndereco.cep);
    formData.append('cidade', novoEndereco.cidade);
    formData.append('endereco', novoEndereco.endereco);
    formData.append('uf', novoEndereco.uf);
    formData.append('tipo_endereco', novoEndereco.tipo_endereco);
    formData.append('fornecedorEndereco_id', fornecedor.id);

    axios
      .post(`${config.serverUrl}/fornecedor_endereco`, formData)
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          alert('Endereço adicionado com sucesso.');
          setNovoEndereco({
            cep: '',
            cidade: '',
            endereco: '',
            fornecedorEndereco_id: 0,
            tipo_endereco: 'Faturamento',
            uf: 'SP',
          });
          closeModal();
        } else {
          alert(`Falha ao adicionar o endereço. ${response.status}`);
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Erro ao adicionar o endereço.');
      });
  };

  return (
    <div>

      <button className="ver-button" onClick={openModal}>
        Adicionar Endereço
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Adicionar Endereço"
        style={modalStyles}
      >
        <div className="adicionar-endereco">
          <span className="text">Adicionar Novo Fornecedor</span>
          <h3>Fornecedor: {fornecedor.id} - {fornecedor.nome}</h3>
          <form onSubmit={adicionarEndereco}>
            <div className="form-group">

              <div className="form-row">
                <label className='selecione-personalizado' htmlFor="tipo_endereco">Tipo de Endereço</label>
                <select
                  value={novoEndereco.tipo_endereco}
                  onChange={(e) =>
                    setNovoEndereco({ ...novoEndereco, tipo_endereco: e.target.value })
                  }
                  className="dropdown"
                >
                  <option value="Faturamento">Faturamento</option>
                  <option value="Entrega">Entrega</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  className="input-estilizado-cep"
                  placeholder="Digite o CEP"
                  value={novoEndereco.cep}
                  onChange={(e) =>
                    setNovoEndereco({ ...novoEndereco, cep: e.target.value })
                  }
                />
              </div>
               
              <button onClick={buscarEnderecoPorCep}>Buscar Endereço</button>
              <div>
                {endereco && <p>{endereco}</p>}
              </div>
               
              <div className="form-row">
                <label htmlFor="cidade">Cidade</label>
                <input
                  type="text"
                  id="cidade"
                  className="input-estilizado-cidade"
                  value={novoEndereco.cidade}
                  onChange={(e) =>
                    setNovoEndereco({ ...novoEndereco, cidade: e.target.value })
                  }
                />
              </div>
               
              <div className="form-row">
                <label htmlFor="endereco">Endereço</label>
                <input
                  type="text"
                  id="endereco"
                  className="input-estilizado-endereco"
                  value={novoEndereco.endereco}
                  onChange={(e) =>
                    setNovoEndereco({ ...novoEndereco, endereco: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <label htmlFor="uf">UF</label>
                <input
                  type="text"
                  id="uf"
                  className="input-estilizado-uf"
                  value={novoEndereco.uf}
                  onChange={(e) =>
                    setNovoEndereco({ ...novoEndereco, uf: e.target.value })
                  }
                />
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

export default EnderecosFornecedor;
