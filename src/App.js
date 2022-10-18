import React, {useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import logoCadastro from './assets/cadastro.png';
import ParticipacaoLucro from './componentes/ParticipacaoLucro';

const optionsAreaAtuacao = [
  {
    label: "Diretoria",
    value: "1",
  },
  {
    label: "Contabilidade, Financeiro , Tecnologia",
    value: "2",
  },
  {
    label: "Serviços Gerais",
    value: "3",
  },
  {
    label: "Relacionamento com o cliente",
    value: "4",
  },
];

const optionsCargo= [
  {
    label: "Estagiario",
    value: "1",
  },
  {
    label: "Funcionario",
    value: "2",
  }
];


function App() {
 
  

  const baseUrl="http://dalpiazpromocao-001-site1.ftempurl.com/funcionario";

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const pedidoGet = async()=>{
    await axios.get(baseUrl)
    .then(response =>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }
  
  useEffect(()=>{
    if(updateData){
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData]);


  //--------------------------------------
  const pedidoPost = async()=>{
    funcionarioSelecionado.id =0  ;
    funcionarioSelecionado.areaAtuacao=parseInt(funcionarioSelecionado.areaAtuacao);
    funcionarioSelecionado.cargo=parseInt(funcionarioSelecionado.cargo);
    try{
      let salarioBruto = parseFloat(funcionarioSelecionado.salarioBruto);
      if(salarioBruto > 3000){
        if(funcionarioSelecionado.cargo==1){
          alert("Salários maiores que R$ 3000,00 são para funcionários!");
          return;
        }
      }

    }catch{
      alert("Coloque um valor válido para o salário");  
      return;
    }
    await axios.post(baseUrl, funcionarioSelecionado)
    .then(response =>{
      setData(response.data);
      setUpdateData(true);
      abrirFecharModalModalIncluir();
    }).catch(error=>{
      console.log(error);
    })

    
  }


  const pedidoPut = async()=>{
    
    funcionarioSelecionado.areaAtuacao=parseInt(funcionarioSelecionado.areaAtuacao);
    funcionarioSelecionado.cargo=parseInt(funcionarioSelecionado.cargo);
    try{
      let salarioBruto = parseFloat(funcionarioSelecionado.salarioBruto);
      if(salarioBruto > 3000){
        if(funcionarioSelecionado.cargo==1){
          alert("Salários maiores que R$ 3000,00 são para funcionários!");
          return;
        }
      }

    }catch{
      alert("Coloque um valor válido para o salário");  
      return;
    }
    await axios.put(baseUrl,funcionarioSelecionado)
    .then(response =>{
      var resposta  = response.data;
      var dadosAuxiliar=data;
      dadosAuxiliar.map(funcionario=>{
        if(funcionario.id===funcionarioSelecionado.id){
          funcionario.nome = resposta.nome;
          funcionario.matricula = resposta.matricula;
          funcionario.areaAtuacao = resposta.areaAtuacao;
          funcionario.cargo = resposta.cargo;
          funcionario.salarioBruto = resposta.salarioBruto;
          funcionario.dataAdmissao = resposta.dataAdmissao;
          abrirFecharModalModalEditar();
          setUpdateData(true);
          
        }
        
      });
     
    }).catch(error=>{
      console.log(error);
    })
  }

  const pedidoDelete = async()=>{
    await axios.delete(baseUrl+"/"+funcionarioSelecionado.id)
    .then(response =>{
      setData(data.filter(func=>func.id !== response.data.id));
      setUpdateData(true);
      abrirFecharModalModalExcluir();
    }).catch(error=>{
      console.log(error);
    })
  }

  


  const [funcionarioSelecionado, setFuncionarioSelecionado]=useState({
    id: '0',
    nome: '',
    matricula: '',
    areaAtuacao: 4,
    cargo: 1,
    salarioBruto: '',
    dataAdmissao: '',
    totalPL: ''
  });

  const handleChange = e=>{
    const {name,value} = e.target;
    setFuncionarioSelecionado({
      ...funcionarioSelecionado, [name]:value
    });
    console.log(funcionarioSelecionado);
  }


  const [modalIncluir, setModalIncluir]=useState(false);
  const abrirFecharModalModalIncluir=()=>{
    setModalIncluir(!modalIncluir);
  }


  const [modalEditar, setModalEditar]=useState(false);
  const abrirFecharModalModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const [modalExcluir, setModalExcluir]=useState(false);
  const abrirFecharModalModalExcluir=()=>{
    setModalExcluir(!modalExcluir);
  }

  const [modalCalculo, setModalCalculo]=useState(false);
  const abrirFecharModalModalCalculo=()=>{
    setModalCalculo(!modalCalculo);
  }


  const selecionarFuncionario=(funcionario,opcao)=>{
    setFuncionarioSelecionado(funcionario);
      (opcao==="Editar") ? abrirFecharModalModalEditar() : abrirFecharModalModalExcluir();
  }

  return (
    <div className="funcionario-container">
      <br />
      <h3>Cadastro Funcionários</h3>
      <header>
        <img src={logoCadastro} alt="cadastro" />
        <button className="btn btn-success" onClick={()=>abrirFecharModalModalIncluir()}>Incluir novo</button>
        <button className="btn btn-primary" onClick={()=>abrirFecharModalModalCalculo()}>Gerenciar Part. Lucros</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Matricula</th>
            <th>Área de atuação</th>
            <th>Cargo</th>
            <th>Salário bruto</th>
            <th>Data Admissão</th>
          </tr>
        </thead>
        <tbody>
            { data.find(x=>x.id>0) ? data.map(funcionario=>(
              <tr key={funcionario.id}>
                  <td>{funcionario.id}</td>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.matricula}</td>
                  <td>{ funcionario.areaAtuacao ? optionsAreaAtuacao.find(x=>x.value == funcionario.areaAtuacao).label : ""}</td>
                  <td>{ funcionario.cargo ? optionsCargo.find(x=>x.value == funcionario.cargo).label : ""}</td>
                  <td>{funcionario.salarioBruto}</td>
                  <td>{funcionario.dataAdmissao}</td>
                  <td>
                    <button className="btn btn-primary" onClick={()=>selecionarFuncionario(funcionario,"Editar")} >Editar</button> {"  "}
                    <button className="btn btn-danger"  onClick={()=>selecionarFuncionario(funcionario,"Excluir")} >Deletar</button>
                  </td>
              </tr>
            )): "Carregando"}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Funcionários</ModalHeader>
              
        <ModalBody>
              <div className="form-group">
                <label>Nome:</label>
                <br />
                <input type="text" className="form-control" name="nome" onChange={handleChange} />

                <label>Matrícula:</label>
                <br />
                <input type="text" className="form-control" name="matricula" onChange={handleChange}/>

                <label>Área de atuação:</label>
                <br />
                <select className="form-control" name="areaAtuacao" onChange={handleChange}>
                  
                  {optionsAreaAtuacao.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>

                <label>Cargo:</label>
                <br />
                <select className="form-control" name="cargo" onChange={handleChange}>
                  {optionsCargo.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>

                <label>Salário Bruto:</label>
                <br />
                <input type="number" className="form-control" name="salarioBruto" onChange={handleChange} />

                <label>Data de Admissão:</label>
                <br />
                <input type="date" className="form-control" name="dataAdmissao" onChange={handleChange} />

              </div>
        </ModalBody>

        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>pedidoPost()}>Incluir</button> {" "}
          <button className="btn btn-warning" onClick={()=>abrirFecharModalModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>



      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Funcionários</ModalHeader>
              
        <ModalBody>
              <div className="form-group">
                <label>Id:</label>
                <br /> 
               <input type="text" className="form-control" readOnly="readOnly" value={funcionarioSelecionado && funcionarioSelecionado.id} />

                <label>Nome:</label>
                <br />
                <input type="text" className="form-control" name="nome" onChange={handleChange} 
                value={funcionarioSelecionado && funcionarioSelecionado.nome}/>

                <label>Matrícula:</label>
                <br />
                <input type="text" className="form-control" name="matricula" onChange={handleChange}
                value={funcionarioSelecionado && funcionarioSelecionado.matricula}/>

                <label>Área de atuação:</label>
                <br />
                <select className="form-control" name="areaAtuacao" onChange={handleChange}
                value={funcionarioSelecionado && funcionarioSelecionado.areaAtuacao}>
                  
                  {optionsAreaAtuacao.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>

                <label>Cargo:</label>
                <br />
                <select className="form-control" name="cargo" onChange={handleChange}
                value={funcionarioSelecionado && funcionarioSelecionado.cargo}>
                  {optionsCargo.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>

                <label>Salário Bruto:</label>
                <br />
                <input type="number" className="form-control" name="salarioBruto" onChange={handleChange} 
                value={funcionarioSelecionado && funcionarioSelecionado.salarioBruto}/>

                <label>Data de Admissão:</label>
                <br />
                <input type="date" className="form-control" name="dataAdmissao" onChange={handleChange} 
                value={funcionarioSelecionado && funcionarioSelecionado.dataAdmissao}/>

              </div>
        </ModalBody>

        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>pedidoPut()} >Editar</button> {" "}
          <button className="btn btn-warning" onClick={()=>abrirFecharModalModalEditar()} >Cancelar</button>
        </ModalFooter>
      </Modal>    


      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão de {funcionarioSelecionado && funcionarioSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>pedidoDelete()}>Sim</button>
          <button className="btn btn-secondary" onClick={()=>abrirFecharModalModalExcluir()}>Não</button>
        </ModalFooter>
      </Modal>







       <Modal isOpen={modalCalculo}>
        <ModalBody>
          <ParticipacaoLucro />   
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-warning" onClick={()=>abrirFecharModalModalCalculo()}>Fechar</button>
        </ModalFooter>
      </Modal>             





    </div>
  );
}

export default App;
