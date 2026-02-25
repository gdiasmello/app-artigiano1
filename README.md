# 🐙 MANUAL DE SEGURANÇA E HOSPEDAGEM: Instalação e Uso do GitHub

O GitHub é a plataforma onde guardamos o código-fonte do PiZZA Master. Ele funciona como uma "Máquina do Tempo": cada vez que melhoramos o aplicativo (como passar da Versão 2.19.0 para a 2.20.0), ele guarda uma fotografia exata de como o código estava. Se algo der errado no futuro, podemos "voltar no tempo" com um clique.

## 🛠️ 1. O QUE INSTALAR (O Caminho Mais Fácil)
Para quem gere a operação, não precisamos complicar com "telas pretas" e códigos de terminal. Vamos usar a ferramenta visual oficial.

- **A Conta na Nuvem:** Acesse [github.com](https://github.com) e crie uma conta gratuita.
- **O Programa no Computador:** Baixe e instale o GitHub Desktop ([desktop.github.com](https://desktop.github.com)). Este programa é a ponte que liga a pasta do PiZZA Master no seu computador diretamente à nuvem do GitHub.
- **O Login:** Abra o GitHub Desktop, faça o login com a conta que acabou de criar e pronto! O seu computador já está conectado ao cofre.

## 📦 2. CRIANDO O SEU COFRE (O Repositório)
O "Repositório" é o nome técnico para a pasta oficial do projeto na nuvem.

1. No GitHub Desktop, clique em **File > New Repository** (Novo Repositório).
2. Dê o nome de `pizza-master`.
3. Escolha uma pasta no seu computador onde ele vai ficar guardado (Ex: Documentos/pizza-master).
4. Clique em **Create Repository**.

**Ação Importante:** Mova todos os ficheiros que nós criamos (`index.html`, `main.js` e a pasta `modulos`) para dentro desta nova pasta que o GitHub acabou de criar no seu computador.

## 🔄 3. O FLUXO DE TRABALHO (Como salvar as atualizações)
Sempre que você alterar algo no código (como adicionar um novo botão ou atualizar para uma nova versão), o GitHub Desktop vai detetar essa mudança automaticamente. O processo de salvar tem dois passos simples:

### Passo 1: O COMMIT (Bater a Fotografia)
No lado esquerdo do GitHub Desktop, você verá os ficheiros que foram alterados. Embaixo, há uma caixa chamada **Summary** (Resumo). Escreva o que você fez.
Exemplo: `Atualização para a Versão 2.20.0 - Escudo Anti-Falhas`.
Depois, clique no botão azul **Commit to main**. (Isso salva a alteração no seu computador de forma segura).

### Passo 2: O PUSH (Enviar para a Nuvem)
Lá em cima, vai aparecer um botão chamado **Push origin**. Ao clicar nele, você está a dizer: "Pegue nesta fotografia que acabei de tirar e mande uma cópia para o cofre na internet".
Pronto! O seu código está blindado.

## 🌐 4. HOSPEDANDO O APLICATIVO DE GRAÇA (GitHub Pages)
Esta é a maior vantagem para a sua operação. O GitHub permite transformar o seu cofre de código num site real, sem pagar alojamento.

1. Entre no site do github.com e vá até ao seu repositório `pizza-master`.
2. Clique na aba **Settings** (Configurações) no menu superior.
3. No menu lateral esquerdo, desça e clique em **Pages** (Páginas).
4. Onde diz **Source** (Fonte) ou **Branch**, mude de `None` para `main` e clique em **Save**.

**A Mágica:** Em poucos minutos, o GitHub vai gerar um link oficial (ex: `https://seu-usuario.github.io/pizza-master`).

Pronto! É este link que você vai enviar no grupo de WhatsApp da pizzaria. Quando os funcionários clicarem, o PiZZA Master vai abrir, e eles poderão adicionar o aplicativo à tela inicial do telemóvel (PWA) para usar na operação diária.
