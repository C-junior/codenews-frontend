# Documento de Requisitos - Sistema CodeNews

## Introdução

O Sistema CodeNews é uma aplicação web responsiva desenvolvida como MVP frontend para gestão de atendimento hospitalar. O sistema consome dados de um backend já existente, seguindo exatamente as entidades e relacionamentos definidos no modelo de dados. A aplicação gerencia autenticação de usuários, filas de senhas, procedimentos médicos e dados clínicos, proporcionando uma interface intuitiva e acessível para profissionais de saúde.

## Glossário

- **Sistema_CodeNews**: Aplicação web completa de gestão de atendimento hospitalar
- **Usuario**: Entidade de autenticação com username, password, profissional vinculado, permissao e status
- **Profissional**: Pessoa com campos adicionais matricula, cargo, funcao e postoTrabalho
- **Paciente**: Pessoa com campos cpf e nome (herança de Pessoa)
- **Pessoa**: Entidade base com campos cpf e nome
- **Senha**: Entidade de fila com codigoSequencial, dataHoraEmissao, dataHoraEncerramento, tipoPrioridade, tipoProcedimento e status
- **Procedimento**: Entidade médica vinculada a Senha e Paciente, com tipoProcedimento, dataHoraInicio, dataHoraFim, dadosClinicos, classificacaoDeRisco e status
- **DadosClinicos**: Dados médicos com temperaturaCorporal, pressaoArterial, flagPacienteSenteDor, diagnostico e desfecho
- **PressaoArterial**: Dados de pressão com valores sistolica e diastolica

## Requisitos

### Requisito 1

**História de Usuário:** Como usuário do sistema, eu quero fazer login com minhas credenciais (username e password), para que eu possa acessar as funcionalidades do sistema de forma segura.

#### Critérios de Aceitação

1. QUANDO um Usuario insere username e password válidos, O Sistema_CodeNews DEVE autenticar o usuário e estabelecer uma sessão
2. QUANDO um Usuario insere credenciais inválidas, O Sistema_CodeNews DEVE exibir mensagem de erro e impedir o acesso
3. O Sistema_CodeNews DEVE validar que os campos username e password não estão vazios antes de tentar autenticação
4. QUANDO a sessão do Usuario expira, O Sistema_CodeNews DEVE redirecionar para a tela de login
5. O Sistema_CodeNews DEVE vincular o Usuario autenticado ao seu Profissional correspondente através do relacionamento definido

### Requisito 2

**História de Usuário:** Como profissional de saúde, eu quero visualizar e gerenciar o painel de senhas, para que eu possa controlar a fila de atendimento de forma eficiente.

#### Critérios de Aceitação

1. O Sistema_CodeNews DEVE exibir a Senha atual sendo chamada com destaque no painel principal
2. O Sistema_CodeNews DEVE mostrar as próximas senhas na fila ordenadas por codigoSequencial e tipoPrioridade
3. QUANDO um Profissional clica em chamar próxima senha, O Sistema_CodeNews DEVE atualizar o status da Senha e avançar na fila
4. O Sistema_CodeNews DEVE exibir histórico das últimas senhas chamadas com dataHoraEncerramento preenchida
5. O Sistema_CodeNews DEVE filtrar senhas por tipoProcedimento (acolhimento, triagem, atendimento) conforme o perfil do profissional###
 Requisito 3

**História de Usuário:** Como profissional de saúde, eu quero visualizar e gerenciar a lista de pacientes, para que eu possa acessar informações dos pacientes cadastrados.

#### Critérios de Aceitação

1. O Sistema_CodeNews DEVE exibir lista de todos os Paciente com campos cpf e nome
2. QUANDO um Profissional digita no campo de busca, O Sistema_CodeNews DEVE filtrar pacientes por nome ou cpf em tempo real
3. O Sistema_CodeNews DEVE ordenar a lista de pacientes alfabeticamente por nome por padrão
4. QUANDO um Profissional clica em um paciente, O Sistema_CodeNews DEVE exibir detalhes e procedimentos vinculados
5. QUANDO não há pacientes cadastrados, O Sistema_CodeNews DEVE exibir mensagem apropriada

### Requisito 4

**História de Usuário:** Como profissional de saúde, eu quero visualizar a lista de profissionais, para que eu possa ver informações dos colegas e coordenar o atendimento.

#### Critérios de Aceitação

1. O Sistema_CodeNews DEVE exibir lista de Profissional com campos matricula, cargo, funcao e postoTrabalho
2. O Sistema_CodeNews DEVE mostrar dados herdados de Pessoa (cpf e nome) para cada profissional
3. O Sistema_CodeNews DEVE permitir filtro simples por cargo ou funcao
4. O Sistema_CodeNews DEVE exibir status do Usuario vinculado ao profissional quando disponível
5. QUANDO não há profissionais cadastrados, O Sistema_CodeNews DEVE exibir mensagem apropriada

### Requisito 5

**História de Usuário:** Como profissional de saúde, eu quero visualizar e gerenciar procedimentos, para que eu possa acompanhar o atendimento dos pacientes.

#### Critérios de Aceitação

1. O Sistema_CodeNews DEVE exibir lista de Procedimento com campos tipoProcedimento, dataHoraInicio, dataHoraFim, classificacaoDeRisco e status
2. O Sistema_CodeNews DEVE mostrar relacionamento entre Procedimento, Senha e Paciente
3. QUANDO um Profissional clica em um procedimento, O Sistema_CodeNews DEVE exibir detalhes completos incluindo DadosClinicos
4. O Sistema_CodeNews DEVE permitir filtrar procedimentos por tipoProcedimento e status
5. QUANDO um Profissional finaliza um procedimento, O Sistema_CodeNews DEVE atualizar o status e dataHoraFim

### Requisito 6

**História de Usuário:** Como profissional de saúde, eu quero visualizar e editar dados clínicos de procedimentos, para que eu possa documentar informações médicas dos pacientes.

#### Critérios de Aceitação

1. O Sistema_CodeNews DEVE exibir DadosClinicos com campos temperaturaCorporal, pressaoArterial, flagPacienteSenteDor, diagnostico e desfecho
2. O Sistema_CodeNews DEVE permitir edição dos campos de PressaoArterial (sistolica e diastolica) como números inteiros
3. QUANDO um Profissional edita temperaturaCorporal, O Sistema_CodeNews DEVE aceitar valores decimais (double)
4. O Sistema_CodeNews DEVE validar que flagPacienteSenteDor é um valor booleano (true/false)
5. QUANDO dados clínicos são salvos, O Sistema_CodeNews DEVE validar todos os campos obrigatórios antes de persistir

### Requisito 7

**História de Usuário:** Como usuário do sistema, eu quero uma interface responsiva e acessível, para que eu possa usar o sistema em diferentes dispositivos com facilidade.

#### Critérios de Aceitação

1. O Sistema_CodeNews DEVE ser responsivo em telas de 320px a 1920px de largura
2. O Sistema_CodeNews DEVE manter contraste mínimo de 7.0:1 entre cores de fundo e texto
3. O Sistema_CodeNews DEVE usar a paleta de cores especificada: Azul Profundo (#234A7A), Verde Medicina (#8ABF5C), Cinza Claro (#F3F7FA), Branco (#FFFFFF), Cinza Neutro (#707B83)
4. O Sistema_CodeNews DEVE implementar tipografia com Montserrat para títulos, Nunito Sans para textos e Lato Bold para destaques
5. O Sistema_CodeNews DEVE ter fontes com tamanho mínimo de 16px para acessibilidade

### Requisito 8

**História de Usuário:** Como usuário do sistema, eu quero receber feedback visual das minhas ações, para que eu possa entender o resultado das operações realizadas.

#### Critérios de Aceitação

1. QUANDO uma operação é bem-sucedida, O Sistema_CodeNews DEVE exibir mensagem de sucesso usando cor Verde Medicina
2. QUANDO ocorre um erro, O Sistema_CodeNews DEVE exibir mensagem de erro com estilização apropriada
3. ENQUANTO o sistema processa uma requisição, O Sistema_CodeNews DEVE exibir indicador de carregamento
4. O Sistema_CodeNews DEVE dispensar automaticamente mensagens de sucesso após 3 segundos
5. O Sistema_CodeNews DEVE exigir dispensação manual de mensagens de erro para garantir que sejam lidas

### Requisito 9

**História de Usuário:** Como profissional de saúde, eu quero navegar entre as telas obrigatórias do sistema, para que eu possa acessar todas as funcionalidades necessárias.

#### Critérios de Aceitação

1. O Sistema_CodeNews DEVE fornecer tela de Login para autenticação de Usuario
2. O Sistema_CodeNews DEVE fornecer Dashboard principal com painel de senhas e informações do usuário logado
3. O Sistema_CodeNews DEVE fornecer tela de Lista de Pacientes com funcionalidades de busca e filtro
4. O Sistema_CodeNews DEVE fornecer tela de Lista de Profissionais com informações detalhadas
5. O Sistema_CodeNews DEVE fornecer telas de detalhes para Procedimento, Paciente, controle de painel de senhas e histórico