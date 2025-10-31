# Plano de Implementação - Sistema CodeNews MVP

- [x] 1. Configurar estrutura base do projeto

  - Criar projeto Vite + Vue.js 3 com Composition API
  - Instalar e configurar Tailwind CSS v3.4.17 com paleta de cores personalizada
  - Configurar Axios para comunicação com API
  - Configurar Vue Router 4 para navegação
  - Configurar Pinia para gerenciamento de estado (opcional)
  - _Requisitos: 1.1, 7.3, 7.4, 7.5_

- [x] 2. Implementar sistema de autenticação

  - [x] 2.1 Criar serviço de autenticação (AuthService)

    - Implementar métodos login, logout e getCurrentUser com dados mockados
    - Simular autenticação com usuários pré-definidos
    - _Requisitos: 1.1, 1.2, 1.4_

  - [x] 2.2 Criar store de autenticação (AuthStore)

    - Implementar estado para Usuario com Profissional vinculado
    - Gerenciar token e sessão no localStorage
    - _Requisitos: 1.1, 1.5_

  - [x] 2.3 Implementar tela de Login.vue

    - Criar formulário com campos username e password
    - Implementar validação de campos obrigatórios
    - Adicionar feedback visual para erros e loading
    - _Requisitos: 1.1, 1.2, 1.3, 8.1, 8.2, 8.3_

  - [x] 2.4 Configurar guard de autenticação no router

    - Implementar proteção de rotas que requerem autenticação
    - Redirecionar para login quando não autenticado
    - _Requisitos: 1.4_

- [x] 3. Criar componentes base reutilizáveis

  - [x] 3.1 Implementar BaseButton.vue

    - Criar variações primary, secondary com cores da paleta
    - Implementar estados loading e disabled
    - Garantir acessibilidade com foco visível
    - _Requisitos: 7.4, 8.1, 8.2, 8.3_

  - [x] 3.2 Implementar BaseInput.vue

    - Criar input com validação visual
    - Implementar tipos text, password, number
    - Adicionar suporte a máscaras para CPF
    - _Requisitos: 7.5, 8.2_

  - [x] 3.3 Implementar BaseModal.vue

    - Criar modal responsivo e acessível
    - Implementar trap de foco e fechamento por ESC
    - _Requisitos: 7.1, 7.5_

  - [x] 3.4 Implementar LoadingSpinner.vue e NotificationToast.vue

    - Criar indicador de carregamento
    - Implementar sistema de notificações com cores da paleta
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 4. Implementar gestão de senhas e painel principal

  - [x] 4.1 Criar SenhaService

    - Implementar métodos com dados mockados para senha atual, próximas senhas e histórico
    - Simular método para chamar próxima senha com atualização local
    - _Requisitos: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.2 Criar SenhaStore

    - Implementar estado para senhaAtual, proximasSenhas e historicoSenhas
    - Implementar ações para gerenciar fila de atendimento
    - _Requisitos: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.3 Implementar Dashboard.vue

    - Criar layout principal com navegação
    - Exibir informações do usuário logado (Usuario.profissional)
    - Integrar painel de senhas em destaque
    - _Requisitos: 9.2_

  - [x] 4.4 Implementar PainelSenhas.vue

    - Exibir senha atual em destaque
    - Mostrar próximas senhas ordenadas por codigoSequencial e tipoPrioridade
    - Implementar botão "Chamar Próxima Senha"
    - Filtrar por tipoProcedimento baseado no perfil do profissional
    - _Requisitos: 2.1, 2.2, 2.3, 2.5_-

- [x] 5.  Implementar gestão de pacientes

  - [x] 5.1 Criar PacienteService

  - Implementar métodos com dados mockados para buscar pacientes com filtro de busca
  - Simular busca de paciente por ID e procedimentos vinculados
  - _Requisitos: 3.1, 3.2, 3.4_

- [x] 5.2 Implementar ListaPacientes.vue

  - Criar tabela responsiva com campos cpf e nome
  - Implementar campo de busca com filtro em tempo real
  - Implementar ordenação alfabética por nome
  - Adicionar navegação para DetalhePaciente
  - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 9.3_

- [x] 5.3 Implementar DetalhePaciente.vue

  - Exibir dados completos do Paciente (cpf, nome)
  - Listar Procedimento vinculados ao paciente
  - Implementar navegação de volta para lista
  - _Requisitos: 3.4, 9.5_

- [x] 6. Implementar gestão de profissionais

  - [x] 6.1 Criar ProfissionalService

    - Implementar método com dados mockados para buscar todos os profissionais
    - Simular filtro por cargo ou funcao
    - _Requisitos: 4.1, 4.3_

  - [x] 6.2 Implementar ListaProfissionais.vue

    - Criar tabela com campos cpf, nome, matricula, cargo, funcao, postoTrabalho
    - Implementar filtro simples por cargo ou funcao
    - Exibir status do Usuario vinculado quando disponível
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5, 9.4_

- [-] 7. Implementar gestão de procedimentos e dados clínicos

  - [x] 7.1 Criar ProcedimentoService

    - Implementar métodos com dados mockados para buscar procedimentos com filtros
    - Simular busca de procedimento por ID com DadosClinicos
    - Simular atualização de dados clínicos e finalização de procedimento
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 7.2 Implementar DetalheProcedimento.vue

    - Exibir dados do Procedimento (tipoProcedimento, dataHoraInicio, dataHoraFim, classificacaoDeRisco, status)
    - Mostrar relacionamento com Senha e Paciente
    - Criar formulário editável para DadosClinicos
    - Implementar botão para finalizar procedimento
    - _Requisitos: 5.1, 5.2, 5.3, 5.5, 9.5_

  - [x] 7.3 Implementar formulário de dados clínicos

    - Criar campos para temperaturaCorporal (double), PressaoArterial (sistolica/diastolica int)
    - Implementar checkbox para flagPacienteSenteDor (boolean)
    - Adicionar campos para diagnostico e desfecho (String)
    - Implementar validação de tipos de dados
    - _Requisitos: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 8. Implementar histórico e navegação

  - [x] 8.1 Implementar HistoricoSenhas.vue

    - Exibir lista de senhas com dataHoraEncerramento preenchida
    - Implementar filtros por data e tipoProcedimento
    - Mostrar informações do procedimento associado
    - _Requisitos: 2.4, 9.5_

  - [x] 8.2 Implementar navegação completa entre telas

    - Configurar todas as rotas das 8 telas obrigatórias
    - Implementar menu de navegação no Dashboard
    - Adicionar breadcrumbs para navegação contextual
    - _Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 9. Implementar validações e tratamento de erros

  - [x] 9.1 Criar composable de validação (useValidation)

    - Implementar validação de CPF
    - Implementar validação de temperatura corporal (30-45°C)
    - Implementar validação de pressão arterial
    - Implementar validação de campos obrigatórios
    - _Requisitos: 6.2, 6.3, 6.4, 6.5_

  - [x] 9.2 Implementar tratamento de erros para dados mockados

    - Simular cenários de erro (dados não encontrados, validação)
    - Integrar com sistema de notificações
    - _Requisitos: 8.2, 8.5_

  - [x] 9.3 Implementar sistema de notificações

    - Criar store para gerenciar notificações
    - Implementar notificações de sucesso (Verde Medicina)
    - Implementar notificações de erro com dispensação manual
    - _Requisitos: 8.1, 8.2, 8.4, 8.5_

- [x] 10. Implementar responsividade e acessibilidade

  - [x] 10.1 Configurar responsividade mobile-first

    - Implementar breakpoints de 320px a 1920px
    - Otimizar layout para dispositivos móveis
    - Testar em diferentes tamanhos de tela
    - _Requisitos: 7.1, 7.3_

  - [x] 10.2 Implementar acessibilidade WCAG 2.1 AA

    - Garantir contraste 7:1 entre cores de fundo e texto
    - Implementar navegação por teclado
    - Adicionar labels acessíveis e ARIA attributes
    - Implementar trap de foco em modais
    - _Requisitos: 7.2, 7.5_

  - [x] 10.3 Criar composable de acessibilidade (useAccessibility)

    - Implementar anúncios para screen readers
    - Implementar trap de foco para modais
    - _Requisitos: 7.2, 7.5_

- [x] 11. Configurar build e otimizações


  - [x] 11.1 Configurar Vite para produção

    - Implementar lazy loading de rotas
    - Configurar code splitting para otimização de bundle
    - Configurar build para ambiente de desenvolvimento
    - _Requisitos: Performance geral_

- [ ] 12. Integração final e ajustes

  - [ ] 12.1 Integrar todas as telas no fluxo principal

    - Testar navegação entre todas as 8 telas obrigatórias
    - Verificar consistência visual da paleta de cores
    - Validar tipografia (Montserrat, Nunito Sans, Lato Bold)
    - _Requisitos: 7.4, 7.5, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 12.2 Implementar dados mockados para desenvolvimento
    - Criar mock data para todas as entidades (Usuario, Profissional, Paciente, Senha, Procedimento, DadosClinicos)
    - Simular respostas de API nos serviços
    - Implementar localStorage para persistência temporária de dados
    - _Requisitos: Todos os requisitos funcionais com dados simulados_
