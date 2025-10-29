import api from './api.js';

class SenhaService {
  // Mock data para desenvolvimento
  static mockSenhas = [
    {
      id: 1,
      codigoSequencial: 'A001',
      dataHoraEmissao: new Date('2024-10-28T08:00:00'),
      dataHoraEncerramento: null,
      tipoPrioridade: 'normal',
      tipoProcedimento: 'acolhimento',
      status: 'chamando'
    },
    {
      id: 2,
      codigoSequencial: 'A002',
      dataHoraEmissao: new Date('2024-10-28T08:05:00'),
      dataHoraEncerramento: null,
      tipoPrioridade: 'normal',
      tipoProcedimento: 'triagem',
      status: 'aguardando'
    },
    {
      id: 3,
      codigoSequencial: 'P001',
      dataHoraEmissao: new Date('2024-10-28T08:10:00'),
      dataHoraEncerramento: null,
      tipoPrioridade: 'prioritario',
      tipoProcedimento: 'atendimento',
      status: 'aguardando'
    },
    {
      id: 4,
      codigoSequencial: 'A003',
      dataHoraEmissao: new Date('2024-10-28T08:15:00'),
      dataHoraEncerramento: null,
      tipoPrioridade: 'normal',
      tipoProcedimento: 'acolhimento',
      status: 'aguardando'
    },
    {
      id: 5,
      codigoSequencial: 'U001',
      dataHoraEmissao: new Date('2024-10-28T07:30:00'),
      dataHoraEncerramento: new Date('2024-10-28T07:45:00'),
      tipoPrioridade: 'urgente',
      tipoProcedimento: 'atendimento',
      status: 'finalizado'
    },
    {
      id: 6,
      codigoSequencial: 'A000',
      dataHoraEmissao: new Date('2024-10-28T07:00:00'),
      dataHoraEncerramento: new Date('2024-10-28T07:20:00'),
      tipoPrioridade: 'normal',
      tipoProcedimento: 'triagem',
      status: 'finalizado'
    }
  ];

  static currentSenhaIndex = 0;

  /**
   * Obtém a senha atual sendo chamada
   * @returns {Promise<Object|null>} Senha atual ou null se não houver
   */
  async getSenhaAtual() {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const senhaAtual = SenhaService.mockSenhas.find(senha => senha.status === 'chamando');
      return senhaAtual || null;
    } catch (error) {
      console.error('Erro ao buscar senha atual:', error);
      throw new Error('Erro ao buscar senha atual');
    }
  }

  /**
   * Obtém as próximas senhas na fila
   * @returns {Promise<Array>} Array de senhas aguardando
   */
  async getProximasSenhas() {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const proximasSenhas = SenhaService.mockSenhas
        .filter(senha => senha.status === 'aguardando')
        .sort((a, b) => {
          // Ordena por prioridade primeiro (urgente > prioritario > normal)
          const prioridadeOrder = { 'urgente': 3, 'prioritario': 2, 'normal': 1 };
          const prioridadeDiff = prioridadeOrder[b.tipoPrioridade] - prioridadeOrder[a.tipoPrioridade];
          
          if (prioridadeDiff !== 0) return prioridadeDiff;
          
          // Se mesma prioridade, ordena por código sequencial
          return a.codigoSequencial.localeCompare(b.codigoSequencial);
        });
      
      return proximasSenhas;
    } catch (error) {
      console.error('Erro ao buscar próximas senhas:', error);
      throw new Error('Erro ao buscar próximas senhas');
    }
  }

  /**
   * Chama a próxima senha da fila
   * @returns {Promise<Object|null>} Nova senha atual ou null se não houver mais senhas
   */
  async chamarProximaSenha() {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Finaliza a senha atual se existir
      const senhaAtual = SenhaService.mockSenhas.find(senha => senha.status === 'chamando');
      if (senhaAtual) {
        senhaAtual.status = 'finalizado';
        senhaAtual.dataHoraEncerramento = new Date();
      }
      
      // Busca a próxima senha na fila
      const proximasSenhas = await this.getProximasSenhas();
      
      if (proximasSenhas.length > 0) {
        const proximaSenha = proximasSenhas[0];
        proximaSenha.status = 'chamando';
        return proximaSenha;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao chamar próxima senha:', error);
      throw new Error('Erro ao chamar próxima senha');
    }
  }

  /**
   * Obtém o histórico de senhas finalizadas
   * @param {Object} filtros - Filtros opcionais (data, tipoProcedimento)
   * @returns {Promise<Array>} Array de senhas finalizadas
   */
  async getHistoricoSenhas(filtros = {}) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let historico = SenhaService.mockSenhas
        .filter(senha => senha.status === 'finalizado' && senha.dataHoraEncerramento)
        .sort((a, b) => new Date(b.dataHoraEncerramento) - new Date(a.dataHoraEncerramento));
      
      // Aplica filtros se fornecidos
      if (filtros.tipoProcedimento) {
        historico = historico.filter(senha => senha.tipoProcedimento === filtros.tipoProcedimento);
      }
      
      if (filtros.dataInicio) {
        const dataInicio = new Date(filtros.dataInicio);
        historico = historico.filter(senha => new Date(senha.dataHoraEncerramento) >= dataInicio);
      }
      
      if (filtros.dataFim) {
        const dataFim = new Date(filtros.dataFim);
        dataFim.setHours(23, 59, 59, 999); // Inclui o dia inteiro
        historico = historico.filter(senha => new Date(senha.dataHoraEncerramento) <= dataFim);
      }
      
      return historico;
    } catch (error) {
      console.error('Erro ao buscar histórico de senhas:', error);
      throw new Error('Erro ao buscar histórico de senhas');
    }
  }

  /**
   * Filtra senhas por tipo de procedimento baseado no perfil do profissional
   * @param {Array} senhas - Array de senhas
   * @param {string} perfilProfissional - Perfil do profissional (cargo/funcao)
   * @returns {Array} Senhas filtradas
   */
  filtrarPorPerfilProfissional(senhas, perfilProfissional) {
    if (!perfilProfissional) return senhas;
    
    // Mapeia perfis para tipos de procedimento permitidos
    const perfilProcedimentos = {
      'recepcionista': ['acolhimento'],
      'enfermeiro': ['triagem', 'acolhimento'],
      'medico': ['atendimento', 'triagem'],
      'tecnico_enfermagem': ['triagem'],
      'administrativo': ['acolhimento']
    };
    
    const procedimentosPermitidos = perfilProcedimentos[perfilProfissional.toLowerCase()] || [];
    
    if (procedimentosPermitidos.length === 0) return senhas;
    
    return senhas.filter(senha => procedimentosPermitidos.includes(senha.tipoProcedimento));
  }

  /**
   * Adiciona uma nova senha à fila (para testes)
   * @param {Object} dadosSenha - Dados da nova senha
   * @returns {Promise<Object>} Senha criada
   */
  async adicionarSenha(dadosSenha) {
    try {
      const novaSenha = {
        id: Math.max(...SenhaService.mockSenhas.map(s => s.id)) + 1,
        codigoSequencial: dadosSenha.codigoSequencial,
        dataHoraEmissao: new Date(),
        dataHoraEncerramento: null,
        tipoPrioridade: dadosSenha.tipoPrioridade || 'normal',
        tipoProcedimento: dadosSenha.tipoProcedimento,
        status: 'aguardando'
      };
      
      SenhaService.mockSenhas.push(novaSenha);
      return novaSenha;
    } catch (error) {
      console.error('Erro ao adicionar senha:', error);
      throw new Error('Erro ao adicionar senha');
    }
  }
}

export default SenhaService;