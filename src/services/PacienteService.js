import api from './api.js';

class PacienteService {
  // Mock data para desenvolvimento
  static mockPacientes = [
    {
      id: 1,
      cpf: '123.456.789-01',
      nome: 'Ana Silva Santos'
    },
    {
      id: 2,
      cpf: '987.654.321-02',
      nome: 'Carlos Eduardo Oliveira'
    },
    {
      id: 3,
      cpf: '456.789.123-03',
      nome: 'Maria José da Costa'
    },
    {
      id: 4,
      cpf: '789.123.456-04',
      nome: 'João Pedro Almeida'
    },
    {
      id: 5,
      cpf: '321.654.987-05',
      nome: 'Beatriz Ferreira Lima'
    },
    {
      id: 6,
      cpf: '654.321.789-06',
      nome: 'Roberto Carlos Souza'
    },
    {
      id: 7,
      cpf: '147.258.369-07',
      nome: 'Fernanda Rodrigues'
    },
    {
      id: 8,
      cpf: '258.369.147-08',
      nome: 'Antonio José Silva'
    }
  ];

  static mockProcedimentos = [
    {
      id: 1,
      pacienteId: 1,
      tipoProcedimento: 'acolhimento',
      dataHoraInicio: '2024-01-15T08:30:00',
      dataHoraFim: '2024-01-15T09:00:00',
      classificacaoDeRisco: 'verde',
      status: 'finalizado',
      senha: {
        codigoSequencial: 'A001',
        tipoPrioridade: 'normal'
      }
    },
    {
      id: 2,
      pacienteId: 1,
      tipoProcedimento: 'triagem',
      dataHoraInicio: '2024-01-15T09:15:00',
      dataHoraFim: null,
      classificacaoDeRisco: 'amarelo',
      status: 'em_andamento',
      senha: {
        codigoSequencial: 'T002',
        tipoPrioridade: 'urgente'
      }
    },
    {
      id: 3,
      pacienteId: 2,
      tipoProcedimento: 'acolhimento',
      dataHoraInicio: '2024-01-15T10:00:00',
      dataHoraFim: '2024-01-15T10:30:00',
      classificacaoDeRisco: 'verde',
      status: 'finalizado',
      senha: {
        codigoSequencial: 'A003',
        tipoPrioridade: 'normal'
      }
    },
    {
      id: 4,
      pacienteId: 3,
      tipoProcedimento: 'atendimento',
      dataHoraInicio: '2024-01-15T11:00:00',
      dataHoraFim: null,
      classificacaoDeRisco: 'vermelho',
      status: 'em_andamento',
      senha: {
        codigoSequencial: 'M001',
        tipoPrioridade: 'emergencia'
      }
    }
  ];

  /**
   * Busca pacientes com filtro de busca
   * @param {string} searchTerm - Termo de busca (nome ou CPF)
   * @returns {Promise<Array>} Lista de pacientes
   */
  async getPacientes(searchTerm = '') {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simula erro de servidor ocasional (3% de chance)
      if (Math.random() < 0.03) {
        const error = new Error('Erro interno do servidor ao buscar pacientes')
        error.status = 500
        throw error
      }
      
      // Simula erro de validação para termos muito curtos
      if (searchTerm && searchTerm.trim().length === 1) {
        const error = new Error('Termo de busca deve ter pelo menos 2 caracteres')
        error.status = 400
        throw error
      }
      
      let pacientes = [...PacienteService.mockPacientes];
      
      // Aplica filtro de busca se fornecido
      if (searchTerm.trim()) {
        const termo = searchTerm.toLowerCase().trim();
        pacientes = pacientes.filter(paciente => 
          paciente.nome.toLowerCase().includes(termo) ||
          paciente.cpf.replace(/\D/g, '').includes(termo.replace(/\D/g, ''))
        );
      }
      
      // Ordena alfabeticamente por nome
      pacientes.sort((a, b) => a.nome.localeCompare(b.nome));
      
      return pacientes;
    } catch (error) {
      // Re-throw erros com status para serem tratados pelo interceptor
      if (error.status) {
        throw error
      }
      
      console.error('Erro ao buscar pacientes:', error);
      throw new Error('Erro ao carregar lista de pacientes');
    }
  }

  /**
   * Busca paciente por ID
   * @param {number} id - ID do paciente
   * @returns {Promise<Object>} Dados do paciente
   */
  async getPacienteById(id) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Validação de ID
      if (!id || isNaN(parseInt(id))) {
        const error = new Error('ID do paciente inválido')
        error.status = 400
        throw error
      }
      
      // Simula erro de servidor ocasional (2% de chance)
      if (Math.random() < 0.02) {
        const error = new Error('Erro interno do servidor ao buscar paciente')
        error.status = 500
        throw error
      }
      
      const paciente = PacienteService.mockPacientes.find(p => p.id === parseInt(id));
      
      if (!paciente) {
        const error = new Error('Paciente não encontrado')
        error.status = 404
        throw error
      }
      
      return paciente;
    } catch (error) {
      // Re-throw erros com status para serem tratados pelo interceptor
      if (error.status) {
        throw error
      }
      
      console.error('Erro ao buscar paciente:', error);
      throw error;
    }
  }

  /**
   * Busca procedimentos vinculados ao paciente
   * @param {number} pacienteId - ID do paciente
   * @returns {Promise<Array>} Lista de procedimentos do paciente
   */
  async getProcedimentosByPaciente(pacienteId) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const procedimentos = PacienteService.mockProcedimentos.filter(
        proc => proc.pacienteId === parseInt(pacienteId)
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

export default PacienteService;