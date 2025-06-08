# SAR-Drone - Aplicativo de Gerenciamento e Simulação de Desastres Naturais

## Integrantes

- Guilherme Ferreira Jardim - RM556814
- Fernando Fontes - RM555317

## Descrição do Projeto

SAR-Drone: Conectividade Aérea para Salvar Vidas em Desastres
O SAR-Drone é uma solução integrada e inovadora que visa revolucionar a resposta a desastres naturais no Brasil. Ele atua como a primeira linha de apoio em emergências, combatendo a lacuna crítica de comunicação em áreas isoladas ou já afetadas.

O sistema funciona em três fases:

- Previsão Inteligente e Acionamento: Usamos um modelo preditivo que analisa dados históricos e geográficos para estimar o número de mortes em caso de desastre. Com base nesse risco, um drone SAR-Drone é automaticamente enviado ao local.
- Estabelecimento de Conectividade Local: Chegando à área, o SAR-Drone se torna um hub de comunicação aérea, oferecendo Wi-Fi gratuito de emergência. Isso permite que as pessoas se conectem, peçam ajuda e avisem suas famílias.
- Disseminação de Informações Críticas: O drone também transmite via rádio informações vitais, como notícias oficiais, alertas e localização de abrigos/rotas de fuga, garantindo que todos, mesmo sem smartphones, recebam as orientações necessárias.
O aplicativo móvel SAR-Drone complementa a operação, funcionando como uma plataforma de gerenciamento e simulação para agências de resposta. Ele permite autenticação, visualização de históricos de desastres, criação e monitoramento de simulações, e simulação de despacho de drones, tudo integrado a uma API Java.

## Funcionalidades Implementadas

- Navegação completa entre telas.
- Registro e Login de usuários com armazenamento de token.
- Tela Home com dashboard e acesso às funcionalidades.
- Tela para listar e visualizar detalhes do Histórico de Desastres.
- Tela para listar e visualizar Simulações de Desastres criadas pelo usuário.
- Tela com formulário detalhado para criação de novas Simulações de Desastres.
- Tela para visualização dos resultados da simulação de despacho de drones para um cenário específico.
- Tratamento de erros e feedback ao usuário, incluindo o deslogue automático em caso de sessão expirada.
- Estilização consistente em todo o aplicativo.

## Como Executar o Projeto

1.  **Pré-requisitos:**
    *   Node.js e npm/yarn instalados.
    *   Expo CLI instalado globalmente (`npm install -g expo-cli`).
    *   Um emulador Android/iOS configurado ou um dispositivo físico com o app Expo Go.
    *   **API Java (GlobalSight API) em execução:** O backend Java correspondente a este projeto mobile precisa estar rodando e acessível na URL configurada no aplicativo (atualmente `http://localhost:8080` em `services/api.js`). A API Java também deve estar conectada ao seu próprio banco de dados.

2.  **Instalação de Dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Executando o Aplicativo:**
    ```bash
    npm start
    # ou
    yarn start
    ```
    Isso iniciará o Metro Bundler. Siga as instruções no terminal para abrir o aplicativo em um emulador/dispositivo.

## Vídeo de Demonstração no YouTube

https://www.youtube.com/watch?v=D_wb2PFosZc
