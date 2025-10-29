import { defineStore } from 'pinia';
import SenhaService from '@/services/SenhaService.js';
import { useAuthStore } from './auth.js';

export const useSenhaStore = defineStore('senha', {
  state: () => ({
    senhaAtual: null,
    proximasSenhas: [],
    historicoSenhas: [],
    loading: false,
    error: null,
    lastUpdate: null
  }),

  getters: {
    /**
     * Verifica se há senha sendo chamada atualmente
     */
    hasSenhaAtual: (state) => !!state.senhaAtual,

    /**
     * Conta o número de senhas na fila
     */
    totalSenhasNaFila: (state) => state.proximasSenhas.length,

    /**
     * Obtém senhas filtradas por perfil do profissional logado
     */
    senhasFiltradas: (state) => {
      const authStore = useAuthStore();
      const perfilProfissional = authStore.currentProfissional?.funcao || authStore.currentProfissional?.cargo;
      
      if (!perfilProfissional) return state.proximasSenhas;
      
      const senhaService = new SenhaService();
      return senhaService.filtrarPorPerfilProfissional(state.proximasSenhas, perfilProfissional);
    },

    /**
     * Obtém próximas 3 senhas para exibição no painel
     */
    proximasTresSenhas: (state) => {
      const authStore = useAuthStore();
      const perfilProfissional = authStore.currentProfissional?.funcao || authStore.currentProfissional?.cargo;
      
      let senhas = state.proximasSenhas;
      
      if (perfilProfissional) {
        const senhaService = new SenhaService();
        senhas = senhaService.filtrarPorPerfilProfissional(senhas, perfilProfissional);
      }
      
      return senhas.slice(0, 3);
    },

    /**
     * Estatísticas do dia
     */
    estatisticasDia: (state) => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const senhasHoje = state.historicoSenhas.filter(senha => {
        const dataEncerramento = new Date(senha.dataHoraEncerramento);
        dataEncerramento.setHours(0, 0, 0, 0);
        return dataEncerramento.getTime() === hoje.getTime();
      });

      return {
        totalAtendidas: senhasHoje.length,
        emAndamento: state.senhaAtual ? 1 : 0,
        naFila: state.proximasSenhas.length,
        porTipo: senhasHoje.reduce((acc, senha) => {
          acc[senha.tipoProcedimento] = (acc[senha.tipoProcedimento] || 0) + 1;
          return acc;
        }, {})
      };
    }
  },

  actions: {
    /**
     * Busca a senha atual sendo chamada
     */
    async fetchSenhaAtual() {
      this.loading = true;
      this.error = null;
      
      try {
        const senhaService = new SenhaService();
        this.senhaAtual = await senhaService.getSenhaAtual();
        this.lastUpdate = new Date();
      } catch (error) {
        this.error = error.message;
        console.error('Erro ao buscar senha atual:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Busca as próximas senhas na fila
     */
    async fetchProximasSenhas() {
      try {
        const senhaService = new SenhaService();
        this.proximasSenhas = await senhaService.getProximasSenhas();
        this.lastUpdate = new Date();
      } catch (error) {
        this.error = error.message;
        console.error('Erro ao buscar próximas senhas:', error);
      }
    },

    /**
     * Chama a próxima senha da fila
     */
    async chamarProximaSenha() {
      this.loading = true;
      this.error = null;
      
      try {
        const senhaService = new SenhaService();
        const novaSenhaAtual = await senhaService.chamarProximaSenha();
        
        // Atualiza o estado local
        this.senhaAtual = novaSenhaAtual;
        
        // Atualiza a fila removendo a senha chamada
        if (novaSenhaAtual) {
          this.proximasSenhas = this.proximasSenhas.filter(
            senha => senha.id !== novaSenhaAtual.id
          );
        }
        
        // Atualiza o histórico se necessário
        await this.fetchHistoricoSenhas();
        
        this.lastUpdate = new Date();
        
        return novaSenhaAtual;
      } catch (error) {
        this.error = error.message;
        console.error('Erro ao chamar próxima senha:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Busca o histórico de senhas finalizadas
     */
    async fetchHistoricoSenhas(filtros = {}) {
      try {
        const senhaService = new SenhaService();
        this.historicoSenhas = await senhaService.getHistoricoSenhas(filtros);
        this.lastUpdate = new Date();
      } catch (error) {
        this.error = error.message;
        console.error('Erro ao buscar histórico de senhas:', error);
      }
    },

    /**
     * Atualiza todos os dados de senhas
     */
    async atualizarTodosDados() {
      this.loading = true;
      this.error = null;
      
      try {
        await Promise.all([
          this.fetchSenhaAtual(),
          this.fetchProximasSenhas(),
          this.fetchHistoricoSenhas()
        ]);
      } catch (error) {
        this.error = 'Erro ao atualizar dados das senhas';
        console.error('Erro ao atualizar dados:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Finaliza a senha atual (marca como finalizada)
     */
    async finalizarSenhaAtual() {
      if (!this.senhaAtual) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        // Simula finalização da senha atual
        const senhaFinalizada = { ...this.senhaAtual };
        senhaFinalizada.status = 'finalizado';
        senhaFinalizada.dataHoraEncerramento = new Date();
        
        // Adiciona ao histórico
        this.historicoSenhas.unshift(senhaFinalizada);
        
        // Remove da senha atual
        this.senhaAtual = null;
        
        this.lastUpdate = new Date();
      } catch (error) {
        this.error = error.message;
        console.error('Erro ao finalizar senha:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Adiciona uma nova senha à fila (para testes)
     */
    async adicionarSenha(dadosSenha) {
      try {
        const senhaService = new SenhaService();
        const novaSenha = await senhaService.adicionarSenha(dadosSenha);
        
        // Atualiza a lista de próximas senhas
        await this.fetchProximasSenhas();
        
        return novaSenha;
      } catch (error) {
        this.error = error.message;
        console.error('Erro ao adicionar senha:', error);
        throw error;
      }
    },

    /**
     * Limpa erros
     */
    clearError() {
      this.error = null;
    },

    /**
     * Reseta o estado da store
     */
    resetState() {
      this.senhaAtual = null;
      this.proximasSenhas = [];
      this.historicoSenhas = [];
      this.loading = false;
      this.error = null;
      this.lastUpdate = null;
    }
  }
});