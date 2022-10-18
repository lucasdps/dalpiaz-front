import React, { useState, useEffect } from "react";
//import 'App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const ParticipacaoLucro = () => {
  //--------------Para ModalCalculo-------

  var montanteValor = "0";

  const baseUrlCalculo = "http://dalpiazpromocao-001-site1.ftempurl.com/calculofuncionario";
  const [dataCalculo, setDataCalculo] = useState([]);
  const [updateDataCalculo, setUpdateDataCalculo] = useState(true);
  const pedidoGetCalculo = async () => {
    await axios
      .get(baseUrlCalculo + "/" + montanteValor)
      .then((response) => {
        setDataCalculo(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (updateDataCalculo) {
      pedidoGetCalculo();
      setUpdateDataCalculo(false);
    }
  }, [updateDataCalculo]);

  function handleChange(event) {
    montanteValor = event.target.value;
    console.log(montanteValor);
  }

  function calcular() {
    pedidoGetCalculo();
  }

  return (
    <div className="scrolY">
      <label>Montante da PL:</label>
      <input
        className="form-control"
        type="number"
        name="montante"
        onChange={handleChange}
      />
      <br />
      <button className="btn btn-primary form-control" onClick={calcular}>
        Calcular
      </button>
      <br />
      <hr />
      <div className="scrolX">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Total Funcionarios</th>
              <th>Total Disponibilizado</th>
              <th>Total Distribuido</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{dataCalculo.totalFuncionarios}</td>
              <td>{dataCalculo.totalDisponibilizado}</td>
              <td>{dataCalculo.totalDistribuido}</td>
              <td>{dataCalculo.Saldo}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Salário Bruto</th>
            <th>Total recebido PL</th>
          </tr>
        </thead>
        <tbody>
          {dataCalculo.funcionariosDtos
            ? dataCalculo.funcionariosDtos.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>

                  <td>{f.nome}</td>

                  <td>{f.salarioBruto}</td>

                  <td>{f.totalPL}</td>
                </tr>
              ))
            : "Carregando"}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipacaoLucro;
