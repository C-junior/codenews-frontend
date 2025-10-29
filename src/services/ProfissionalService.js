import api from './api.js';

class ProfissionalService {
  // Dados mockados para desenvolvimento
  static mockProfissionais = [
    {
      id: 1,
      cpf: '123.456.789-01',
      nome: 'Dr. João Silva',
      matricula: 'MED001',
      cargo: 'Médico',
      funcao: 'Clínico Geral',
      postoTrabalho: 'Consultório 1',
      usuario: {
        id: 1,
        username: 'joao.silva',
        status: 'ATIVO',
        permissao: 'MEDICO'
      }
    },
    {
      id: 2,
      cpf: '234.567.890-12',
      nome: 'Enfª Maria Santos',
      matricula: 'ENF001',
      cargo: 'Enfermeiro',
      funcao: 'Triagem',
      postoTrabalho: 'Sala de Triagem',
      usuario: {
        id: 2,
        username: 'maria.santos',
        status: 'ATIVO',
        permissao: 'ENFERMEIRO'
      }
    },
    {
      id: 3,
      cpf: '345.678.901-23',
      nome: 'Dr. Pedro Costa',
      matricula: 'MED002',
      cargo: 'Médico',
      funcao: 'Cardiologista',
      postoTrabalho: 'Consultório 2',
      usuario: {
        id: 3,
        username: 'pedro.costa',
        status: 'ATIVO',
        permissao: 'MEDICO'
      }
    },
    {
      id: 4,
      cpf: '456.789.012-34',
      nome: 'Ana Oliveira',
      matricula: 'REC001',
      cargo: 'Recepcionista',
      funcao: 'Acolhimento',
      postoTrabalho: 'Recepção',
      usuario: {
        id: 4,
        username: 'ana.oliveira',
        status: 'ATIVO',
        permissao: 'RECEPCIONISTA'
      }
    },
    {
      id: 5,
      cpf: '567.890.123-45',
      nome: 'Carlos Ferreira',
      matricula: 'TEC001',
      cargo: 'Técnico em Enfermagem',
      funcao: 'Atendimento',
      postoTrabalho: 'Sala de Procedimentos',
      usuario: null // Profissional sem usuário vinculado
    },
    {
      id: 6,
      cpf: '678.901.234-56',
      nome: 'Dra. Lucia Mendes',
      matricula: 'MED003',
      cargo: 'Médico',
      funcao: 'Pediatra',
      postoTrabalho: 'Consultório 3',
      usuario: {
        id: 6,
        username: 'lucia.mendes',
        status: 'INATIVO',
        permissao: 'MEDICO'
      }
    }
  ];

  /**
   * Busca todos os profissionais com filtro opcional
   * @param {string} filter - Filtro por cargo ou funcao
   * @returns {Promise<Array>} Lista de profissionais
   */
  async getProfissionais(filter = '') {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let profissionais = [...ProfissionalService.mockProfissionais];
      
      // Aplica filtro se fornecido
      if (filter && filter.trim() !== '') {
        const filterLower = filter.toLowerCase().trim();
        profissionais = profissionais.filter(prof => 
          prof.cargo.toLowerCase().includes(filterLower) ||
          prof.funcao.toLowerCase().includes(filterLower)
        );
      }
      
      return profissionais;
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      throw new Error('Erro ao carregar lista de profissionais');
    }
  }

  /**
   * Busca profissional por ID
   * @param {number} id - ID do profissional
   * @returns {Promise<Object>} Dados do profissional
   */
  async getProfissionalById(id) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const profissional = ProfissionalService.mockProfissionais.find(p => p.id === parseInt(id));
      
      if (!profissional) {
        throw new Error('Profissional não encontrado');
      }
      
      return profissional;
    } catch (error) {
      console.error('Erro ao buscar profissional:', error);
      throw error;
    }
  }

  /**
   * Busca profissionais por cargo ou função específica
   * @param {string} cargoOuFuncao - Cargo ou função para filtrar
   * @returns {Promise<Array>} Lista de profissionais filtrados
   */
  async getProfissionaisByCargoOrFuncao(cargoOuFuncao) {
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const filterLower = cargoOuFuncao.toLowerCase().trim();
      const profissionais = ProfissionalService.mockProfissionais.filter(prof => 
        prof.cargo.toLowerCase() === filterLower ||
        prof.funcao.toLowerCase() === filterLower
      );
      
      return profissionais;
    } catch (error) {
      console.error('Erro ao buscar profissionais por cargo/função:', error);
      throw new Error('Erro ao filtrar profissionais');
    }
  }

  // Métodos para integração futura com API real
  async _getProfissionaisFromAPI(filter = '') {
    const response = await api.get('/profissionais', {
      params: filter ? { filter } : {}
    });
    return response.data;
  }

  async _getProfissionalByIdFromAPI(id) {
    const response = await api.get(`/profissionais/${id}`);
    return response.data;
  }
}

export default new ProfissionalService();