// Inicialização do banco de dados local
let database = {
    pacientesCadastrados: [],
    agendamentos: []
  };

  // Carregar dados do localStorage, se disponíveis
  if (localStorage.getItem('clinicDatabase')) {
    database = JSON.parse(localStorage.getItem('clinicDatabase'));
  }

  function salvarNoLocalStorage() {
    localStorage.setItem('clinicDatabase', JSON.stringify(database));
  }

  function cadastrarPaciente() {
    let nome = prompt("Digite o nome do paciente:");
    let telefone = prompt("Digite o telefone do paciente:");

    // Verifica se o paciente já está cadastrado
    if (database.pacientesCadastrados.some(paciente => paciente.telefone === telefone)) {
      alert("Paciente já cadastrado!");
    } else {
      database.pacientesCadastrados.push({ nome, telefone });
      alert("Paciente cadastrado com sucesso!");
      atualizarListaPacientes();
      salvarNoLocalStorage();
    }
  }

  function listarPacientes() {
    console.log("Lista de Pacientes Cadastrados:");
    database.pacientesCadastrados.forEach((paciente, index) => {
      console.log(`${index + 1}. Nome: ${paciente.nome}, Telefone: ${paciente.telefone}`);
    });
  }

  function marcarConsulta() {
    if (database.pacientesCadastrados.length === 0) {
      alert("Não há pacientes cadastrados. Cadastre um paciente primeiro.");
      return;
    }

    listarPacientes();

    let escolhaPaciente = parseInt(prompt("Escolha o número correspondente ao paciente para marcar a consulta:")) - 1;

    if (isNaN(escolhaPaciente) || escolhaPaciente < 0 || escolhaPaciente >= database.pacientesCadastrados.length) {
      alert("Escolha inválida.");
      return;
    }

    let pacienteSelecionado = database.pacientesCadastrados[escolhaPaciente];

    let dataConsulta = prompt("Digite a data da consulta (DD/MM/YYYY):");
    let horaConsulta = prompt("Digite a hora da consulta (HH:MM):");
    let especialidadeConsulta = prompt("Digite a especialidade da consulta:");

    // Verifica se a data e hora da consulta já estão ocupadas
    if (database.agendamentos.some(agenda => agenda.data === dataConsulta && agenda.hora === horaConsulta)) {
      alert("Horário já ocupado. Escolha outra data e hora.");
    } else {
      // Verifica se a data da consulta é futura
      let dataAtual = new Date();
      let dataConsultaObj = new Date(dataConsulta + " " + horaConsulta);
      if (dataConsultaObj <= dataAtual) {
        alert("Não é possível agendar consultas retroativas.");
        return;
      }

      database.agendamentos.push({ paciente: pacienteSelecionado.nome, data: dataConsulta, hora: horaConsulta, especialidade: especialidadeConsulta });
      alert("Consulta marcada com sucesso!");
      salvarNoLocalStorage();
    }
  }

  function listarAgendamentos() {
    console.log("Lista de Agendamentos:");
    database.agendamentos.forEach((agendamento, index) => {
      console.log(`${index + 1}. Paciente: ${agendamento.paciente}, Data: ${agendamento.data}, Hora: ${agendamento.hora}, Especialidade: ${agendamento.especialidade}`);
    });
  }

  function cancelarConsulta() {
    if (database.agendamentos.length === 0) {
      alert("Não há consultas agendadas.");
      return;
    }

    listarAgendamentos();

    let escolhaConsulta = parseInt(prompt("Escolha o número correspondente à consulta para cancelar:")) - 1;

    if (isNaN(escolhaConsulta) || escolhaConsulta < 0 || escolhaConsulta >= database.agendamentos.length) {
      alert("Escolha inválida.");
      return;
    }

    let consultaCancelada = database.agendamentos.splice(escolhaConsulta, 1)[0];
    console.log(`Consulta cancelada: Paciente ${consultaCancelada.paciente}, Data ${consultaCancelada.data}, Hora ${consultaCancelada.hora}, Especialidade ${consultaCancelada.especialidade}`);
    alert("Consulta cancelada com sucesso!");
    salvarNoLocalStorage();
  }

  function menuPrincipal() {
    while (true) {
      let escolha = prompt(
        "Menu Principal\n" +
        "1. Cadastrar Paciente\n" +
        "2. Marcar Consulta\n" +
        "3. Cancelar Consulta\n" +
        "4. Sair"
      );

      switch (escolha) {
        case "1":
          cadastrarPaciente();
          break;
        case "2":
          marcarConsulta();
          break;
        case "3":
          cancelarConsulta();
          break;
        case "4":
          alert("Programa encerrado.");
          return;
        default:
          alert("Escolha inválida. Tente novamente.");
      }
    }
  }

  // Função para atualizar a lista de pacientes na tabela
  function atualizarListaPacientes() {
    let pacientesTableBody = document.getElementById('pacientesTableBody');
    pacientesTableBody.innerHTML = ''; // Limpar conteúdo anterior

    database.pacientesCadastrados.forEach((paciente, index) => {
      let row = pacientesTableBody.insertRow();
      let cellNumero = row.insertCell(0);
      let cellNome = row.insertCell(1);
      let cellTelefone = row.insertCell(2);

      cellNumero.textContent = index + 1;
      cellNome.textContent = paciente.nome;
      cellTelefone.textContent = paciente.telefone;
    });
  }

  // Chamar a função para atualizar a lista de pacientes
  atualizarListaPacientes();