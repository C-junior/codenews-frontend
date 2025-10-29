import api from './api.js';

class ProcedimentoService {
  // Mock data para desenvolvimento
  static mockProcedimentos = [
    {
      id: 1,
      tipoProcedimento: 'acolhimento',
      dataHoraInicio: '2024-01-15T08:30:00',
      dataHoraFim: '2024-01-15T09:00:00',
      classificacaoDeRisco: 'verde',
      status: 'finalizado',
      senha: {
        id: 1,
        codigoSequencial: 'A001',
        dataHoraEmissao: '2024-01-15T08:25:00',
        dataHoraEncerramento: '2024-01-15T09:00:00',
        tipoPrioridade: 'normal',
        tipoProcedimento: 'acolhimento',
        status: 'finalizada'
      },
      paciente: {
        id: 1,
        cpf: '123.456.789-01',
        nome: 'Ana Silva Santos'
      },
      dadosClinicos: {
        id: 1,
        temperaturaCorporal: 36.5,
        pressaoArterial: {
          sistolica: 120,
          diastolica: 80
        },
        flagPacienteSenteDor: false,
        diagnostico: 'Paciente estável, sem queixas específicas',
        desfecho: 'Liberado para casa com orientações gerais'
      }
    },
    {
      id: 2,
      tipoProcedimento: 'triagem',
      dataHoraInicio: '2024-01-15T09:15:00',
      dataHoraFim: null,
      classificacaoDeRisco: 'amarelo',
      status: 'em_andamento',
      senha: {
        id: 2,
        codigoSequencial: 'T002',
        dataHoraEmissao: '2024-01-15T09:10:00',
        dataHoraEncerramento: null,
        tipoPrioridade: 'urgente',
        tipoProcedimento: 'triagem',
        status: 'chamada'
      },
      paciente: {
        id: 1,
        cpf: '123.456.789-01',
        nome: 'Ana Silva Santos'
      },
      dadosClinicos: {
        id: 2,
        temperaturaCorporal: 37.2,
        pressaoArterial: {
          sistolica: 140,
          diastolica: 90
        },
        flagPacienteSenteDor: true,
        diagnostico: 'Hipertensão leve, dor abdominal',
        desfecho: null
      }
    },
    {
      id: 3,
      tipoProcedimento: 'atendimento',
      dataHoraInicio: '2024-01-15T10:00:00',
      dataHoraFim: null,
      classificacaoDeRisco: 'vermelho',
      status: 'em_andamento',
      senha: {
        id: 3,
        codigoSequencial: 'M001',
        dataHoraEmissao: '2024-01-15T09:45:00',
        dataHoraEncerramento: null,
        tipoPrioridade: 'emergencia',
        tipoProcedimento: 'atendimento',
        status: 'chamada'
      },
      paciente: {
        id: 2,
        cpf: '987.654.321-02',
        nome: 'Carlos Eduardo Oliveira'
      },
      dadosClinicos: {
        id: 3,
        temperaturaCorporal: 38.5,
        pressaoArterial: {
          sistolica: 160,
          diastolica: 100
        },
        flagPacienteSenteDor: true,
        diagnostico: 'Febre alta, possível infecção',
        desfecho: null
      }
    },
    {
      id: 4,
      tipoProcedimento: 'acolhimento',
      dataHoraInicio: '2024-01-15T11:30:00',
      dataHoraFim: '2024-01-15T12:00:00',
      classificacaoDeRisco: 'azul',
      status: 'finalizado',
      senha: {
        id: 4,
        codigoSequencial: 'A004',
        dataHoraEmissao: '2024-01-15T11:25:00',
        dataHoraEncerramento: '2024-01-15T12:00:00',
        tipoPrioridade: 'normal',
        tipoProcedimento: 'acolhimento',
        status: 'finalizada'
      },
      paciente: {
        id: 3,
        cpf: '456.789.123-03',
        nome: 'Maria José da Costa'
      },
      dadosClinicos: {
        id: 4,
        temperaturaCorporal: 36.0,
        pressaoArterial: {
          sistolica: 110,
          diastolica: 70
        },
        flagPacienteSenteDor: false,
        diagnostico: 'Consulta de rotina, sem alterações',
        desfecho: 'Orientações preventivas, retorno em 6 meses'
      }
    },
    {
      id: 5,
      tipoProcedimento: 'triagem',
      dataHoraInicio: '2024-01-15T14:00:00',
      dataHoraFim: '2024-01-15T14:30:00',
      classificacaoDeRisco: 'verde',
      status: 'finalizado',
      senha: {
        id: 5,
        codigoSequencial: 'T005',
        dataHoraEmissao: '2024-01-15T13:55:00',
        dataHoraEncerramento: '2024-01-15T14:30:00',
        tipoPrioridade: 'normal',
        tipoProcedimento: 'triagem',
        status: 'finalizada'
      },
      paciente: {
        id: 4,
        cpf: '789.123.456-04',
        nome: 'João Pedro Almeida'
      },
      dadosClinicos: {
        id: 5,
        temperaturaCorporal: 36.8,
        pressaoArterial: {
          sistolica: 125,
          diastolica: 85
        },
        flagPacienteSenteDor: false,
        diagnostico: 'Pressão arterial limítrofe',
        desfecho: 'Orientações dietéticas e acompanhamento'
      }
    }
  ];

  /**
   * Busca procedimentos com filtros
   * @param {Object} filters - Filtros de busca
   * @param {string} filters.tipoProcedimento - Tipo do procedimento
   * @param {string} filters.status - Status do procedimento
   * @param {string} filters.classificacaoDeRisco - Classificação de risco
   * @returns {Promise<Array>} Lista de procedimentos
   */
  async getProcedimentos(filters = {}) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let procedimentos = [...ProcedimentoService.mockProcedimentos];
      
      // Aplica filtros se fornecidos
      if (filters.tipoProcedimento) {
        procedimentos = procedimentos.filter(proc => 
          proc.tipoProcedimento === filters.tipoProcedimento
        );
      }
      
      if (filters.status) {
        procedimentos = procedimentos.filter(proc => 
          proc.status === filters.status
        );
      }
      
      if (filters.classificacaoDeRisco) {
        procedimentos = procedimentos.filter(proc => 
          proc.classificacaoDeRisco === filters.classificacaoDeRisco
        );
      }
      
      // Ordena por data de início (mais recente primeiro)
      procedimentos.sort((a, b) => new Date(b.dataHoraInicio) - new Date(a.dataHoraInicio));
      
      return procedimentos;
    } catch (error) {
      console.error('Erro ao buscar procedimentos:', error);
      throw new Error('Erro ao carregar lista de procedimentos');
    }
  }

  /**
   * Busca procedimento por ID com dados clínicos
   * @param {number} id - ID do procedimento
   * @returns {Promise<Object>} Dados completos do procedimento
   */
  async getProcedimentoById(id) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const procedimento = ProcedimentoService.mockProcedimentos.find(
        proc => proc.id === parseInt(id)
      );
      
      if (!procedimento) {
        throw new Error('Procedimento não encontrado');
      }
      
      return procedimento;
    } catch (error) {
      console.error('Erro ao buscar procedimento:', error);
      throw error;
    }
  }

  /**
   * Atualiza dados clínicos de um procedimento
   * @param {number} procedimentoId - ID do procedimento
   * @param {Object} dadosClinicos - Dados clínicos a serem atualizados
   * @returns {Promise<Object>} Dados clínicos atualizados
   */
  async updateDadosClinicos(procedimentoId, dadosClinicos) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Validação de ID
      if (!procedimentoId || isNaN(parseInt(procedimentoId))) {
        const error = new Error('ID do procedimento inválido')
        error.status = 400
        throw error
      }
      
      // Validação de dados clínicos
      if (!dadosClinicos || typeof dadosClinicos !== 'object') {
        const error = new Error('Dados clínicos inválidos')
        error.status = 400
        throw error
      }
      
      // Validação de temperatura corporal
      if (dadosClinicos.temperaturaCorporal !== undefined) {
        const temp = parseFloat(dadosClinicos.temperaturaCorporal)
        if (isNaN(temp) || temp < 30 || temp > 45) {
          const error = new Error('Temperatura corporal deve estar entre 30°C e 45°C')
          error.status = 400
          throw error
        }
      }
      
      // Validação de pressão arterial
      if (dadosClinicos.pressaoArterial) {
        const { sistolica, diastolica } = dadosClinicos.pressaoArterial
        if (sistolica !== undefined && diastolica !== undefined) {
          const sys = parseInt(sistolica)
          const dia = parseInt(diastolica)
          if (isNaN(sys) || isNaN(dia) || sys <= dia || sys <= 0 || dia <= 0 || sys > 300 || dia > 200) {
            const error = new Error('Pressão arterial inválida. Sistólica deve ser maior que diastólica.')
            error.status = 400
            throw error
          }
        }
      }
      
      // Simula erro de servidor ocasional (2% de chance)
      if (Math.random() < 0.02) {
        const error = new Error('Erro interno do servidor ao atualizar dados clínicos')
        error.status = 500
        throw error
      }
      
      const procedimentoIndex = ProcedimentoService.mockProcedimentos.findIndex(
        proc => proc.id === parseInt(procedimentoId)
      );
      
      if (procedimentoIndex === -1) {
        const error = new Error('Procedimento não encontrado')
        error.status = 404
        throw error
      }
      
      const procedimento = ProcedimentoService.mockProcedimentos[procedimentoIndex]
      
      // Verifica se o procedimento pode ser editado
      if (procedimento.status === 'finalizado') {
        const error = new Error('Não é possível editar dados clínicos de um procedimento finalizado')
        error.status = 403
        throw error
      }
      
      // Atualiza os dados clínicos
      ProcedimentoService.mockProcedimentos[procedimentoIndex].dadosClinicos = {
        ...ProcedimentoService.mockProcedimentos[procedimentoIndex].dadosClinicos,
        ...dadosClinicos
      };
      
      return ProcedimentoService.mockProcedimentos[procedimentoIndex].dadosClinicos;
    } catch (error) {
      // Re-throw erros com status para serem tratados pelo interceptor
      if (error.status) {
        throw error
      }
      
      console.error('Erro ao atualizar dados clínicos:', error);
      throw error;
    }
  }

  /**
   * Finaliza um procedimento
   * @param {number} procedimentoId - ID do procedimento
   * @returns {Promise<Object>} Procedimento atualizado
   */
  async finalizarProcedimento(procedimentoId) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Validação de ID
      if (!procedimentoId || isNaN(parseInt(procedimentoId))) {
        const error = new Error('ID do procedimento inválido')
        error.status = 400
        throw error
      }
      
      // Simula erro de servidor ocasional (1% de chance)
      if (Math.random() < 0.01) {
        const error = new Error('Erro interno do servidor ao finalizar procedimento')
        error.status = 500
        throw error
      }
      
      const procedimentoIndex = ProcedimentoService.mockProcedimentos.findIndex(
        proc => proc.id === parseInt(procedimentoId)
      );
      
      if (procedimentoIndex === -1) {
        const error = new Error('Procedimento não encontrado')
        error.status = 404
        throw error
      }
      
      const procedimento = ProcedimentoService.mockProcedimentos[procedimentoIndex];
      
      // Verifica se o procedimento pode ser finalizado
      if (procedimento.status === 'finalizado') {
        const error = new Error('Procedimento já foi finalizado')
        error.status = 409 // Conflict
        throw error
      }
      
      // Verifica se dados clínicos obrigatórios estão preenchidos
      const dadosClinicos = procedimento.dadosClinicos
      if (!dadosClinicos || !dadosClinicos.diagnostico || !dadosClinicos.desfecho) {
        const error = new Error('Diagnóstico e desfecho são obrigatórios para finalizar o procedimento')
        error.status = 400
        throw error
      }
      
      // Atualiza o status e data de fim
      ProcedimentoService.mockProcedimentos[procedimentoIndex] = {
        ...procedimento,
        status: 'finalizado',
        dataHoraFim: new Date().toISOString()
      };
      
      // Atualiza também a senha vinculada
      if (procedimento.senha) {
        ProcedimentoService.mockProcedimentos[procedimentoIndex].senha = {
          ...procedimento.senha,
          status: 'finalizada',
          dataHoraEncerramento: new Date().toISOString()
        };
      }
      
      return ProcedimentoService.mockProcedimentos[procedimentoIndex];
    } catch (error) {
      // Re-throw erros com status para serem tratados pelo interceptor
      if (error.status) {
        throw error
      }
      
      console.error('Erro ao finalizar procedimento:', error);
      throw error;
    }
  }

  /**
   * Busca procedimentos por paciente
   * @param {number} pacienteId - ID do paciente
   * @returns {Promise<Array>} Lista de procedimentos do paciente
   */
  async getProcedimentosByPaciente(pacienteId) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const procedimentos = ProcedimentoService.mockProcedimentos.filter(
        proc => proc.paciente.id === parseInt(pacienteId)
      );
      
      // Ordena por data de início (mais recente primeiro)
      procedimentos.sort((a, b) => new Date(b.dataHoraInicio) - new Date(a.dataHoraInicio));
      
      return procedimentos;
    } catch (error) {
      console.error('Erro ao buscar procedimentos do paciente:', error);
      throw new Error('Erro ao carregar procedimentos do paciente');
    }
  }
}

export default ProcedimentoService;