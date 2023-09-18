import React, { createContext, useContext, useState } from 'react';

const FornecedorContext = createContext();

export const FornecedorProvider = ({ children }) => {
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);

  const selecionarFornecedor = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
  };

  return (
    <FornecedorContext.Provider
      value={{
        fornecedorSelecionado,
        selecionarFornecedor,
      }}
    >
      {children}
    </FornecedorContext.Provider>
  );
};

export const useFornecedor = () => {
  return useContext(FornecedorContext);
};
