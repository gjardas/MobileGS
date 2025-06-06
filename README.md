# MobileGS - Aplicativo de Gerenciamento e Simulação de Desastres Naturais

## Autores

- Guilherme Ferreira Jardim - RM556814
- Fernando Fontes - RM555317

## Descrição do Projeto

O MobileGS é um aplicativo móvel desenvolvido em React Native com Expo, projetado para auxiliar no gerenciamento e na simulação de respostas a desastres naturais. Ele se integra a uma API backend Java (GlobalSight API) para fornecer funcionalidades robustas, incluindo:

- **Autenticação de Usuários:** Sistema seguro de registro e login com persistência de sessão usando tokens JWT.
- **Visualização de Histórico de Desastres:** Permite aos usuários consultar um banco de dados de eventos de desastres naturais que ocorreram anteriormente, visualizando detalhes como tipo, local, data e magnitude.
- **Criação de Simulações de Desastres:** Usuários podem criar cenários de simulação de desastres, inserindo diversos parâmetros como tipo de desastre, localização geográfica (latitude/longitude), datas, magnitude, entre outros.
- **Monitoramento de Simulações:** As simulações criadas pelos usuários são listadas, permitindo o acompanhamento de seu status (ex: status de processamento por IA).
- **Simulação de Despacho de Drones:** Para uma simulação selecionada, o sistema pode simular o despacho de drones, fornecendo informações como número de drones enviados, área de cobertura estimada e notas da missão. Esta funcionalidade depende do processamento prévio da simulação por um serviço de IA (através da API Java).
- **Interface de Usuário Moderna:** O aplicativo possui uma interface de usuário estilizada, inspirada em designs modernos, visando a clareza e facilidade de uso.

O objetivo do MobileGS é fornecer uma ferramenta intuitiva para planejamento, análise e resposta a situações de emergência, facilitando o acesso a informações cruciais e a simulação de cenários de desastre.

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
    *   **API Java (GlobalSight API) em execução:** O backend Java correspondente a este projeto mobile precisa estar rodando e acessível na URL configurada no aplicativo (atualmente `http://localhost:8081` em `services/api.js`). A API Java também deve estar conectada ao seu próprio banco de dados.

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

[ASSISTIR VÍDEO AQUI - Adicionar o link do YouTube]

---

*Este README foi gerado e adicionado por Jules, um agente de engenharia de software.*
