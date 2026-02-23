// INÍCIO DO ARQUIVO modulos/ajustes_ajuda.js - v1.1.3
Vue.component('tela-ajustes-ajuda', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00B0FF;">📖 Ajuda e Suporte</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <p style="color: #CCC; font-size: 0.95rem; margin-bottom: 25px; line-height: 1.5;">
            Bem-vindo ao manual do <b>PiZZA Master</b>. Selecione uma das categorias abaixo para entender como tirar o máximo proveito do aplicativo.
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div v-for="(item, index) in faqs" :key="index" class="card" style="border: 1px solid #333; overflow: hidden; transition: 0.3s;" :style="perguntaAberta === index ? 'border-color: #00B0FF;' : ''">
                
                <button @click="toggleFaq(index)" style="width: 100%; background: #1A1A1A; border: none; padding: 15px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; text-align: left;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <i :class="item.icone" :style="{ color: item.cor, fontSize: '1.2rem', width: '25px', textAlign: 'center' }"></i>
                        <strong style="color: white; font-size: 0.95rem;">{{ item.pergunta }}</strong>
                    </div>
                    <i :class="perguntaAberta === index ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" style="color: #888;"></i>
                </button>

                <div v-show="perguntaAberta === index" class="animate__animated animate__fadeIn" style="background: #222; padding: 15px; border-top: 1px solid #333;">
                    <div style="color: #AAA; font-size: 0.9rem; line-height: 1.6;" v-html="item.resposta"></div>
                </div>

            </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
            <p style="color: #888; font-size: 0.85rem; margin-bottom: 15px;">Ainda tem dúvidas ou encontrou um erro?</p>
            <button @click="$root.mudarTela('tela-ajustes-sugestoes')" class="btn" style="background: #2C2C2C; color: #FFD600; border: 1px dashed #FFD600; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; height: 55px;">
                <i class="fas fa-headset"></i> FALAR COM O DESENVOLVEDOR
            </button>
        </div>

    </div>
    `,
    data() {
        return {
            perguntaAberta: null,
            faqs: [
                {
                    icone: 'fas fa-robot',
                    cor: '#D50000',
                    pergunta: 'Como a IA calcula os pedidos (Insumos/Sacolão)?',
                    resposta: 'O aplicativo sabe qual é a <b>Meta (Estoque Ideal)</b> de cada produto. Quando você insere a quantidade que temos <i>agora</i> na geladeira, a IA faz a matemática automaticamente.<br><br>Se o produto vier em caixas (Fator), a IA já divide a quantidade faltante e arredonda para cima para você pedir caixas fechadas ao fornecedor.'
                },
                {
                    icone: 'fas fa-plus-circle',
                    cor: '#FFAB00',
                    pergunta: 'O que é a lista "Algo Mais" (Extra)?',
                    resposta: 'Durante a semana, pode faltar algo que não está cadastrado no sistema (uma lâmpada, pilhas, fita adesiva).<br><br>Você pode digitar esses itens na caixa "Algo Mais". Eles ficarão <b>salvos na nuvem a semana inteira</b> e serão incluídos automaticamente no final da sua lista do WhatsApp na hora de fechar o pedido!'
                },
                {
                    icone: 'fas fa-bullhorn',
                    cor: '#FF5252',
                    pergunta: 'Como funciona o Mural de Avisos?',
                    resposta: 'Os Gerentes e Administradores podem postar avisos no Dashboard. Ao criar um aviso, é possível escolher:<br><br>- <b>Público:</b> Se todos veem ou apenas um cargo específico.<br>- <b>Duração:</b> O aviso some sozinho após algumas horas, dias ou numa data específica do calendário.<br>- <b>Urgente:</b> Destaca o aviso a vermelho e a piscar na tela inicial.'
                },
                {
                    icone: 'fas fa-sign-in-alt',
                    cor: '#00E676',
                    pergunta: 'Como funciona o Primeiro Acesso (Senha 1234)?',
                    resposta: 'Quando o Gerente cadastra um funcionário novo, a senha padrão gerada é sempre <b>1234</b>.<br><br>Ao fazer login pela primeira vez, o próprio funcionário é obrigado a digitar o seu Nome Completo, assinar o <b>Termo de Responsabilidade</b> digital e criar o seu próprio PIN de 4 dígitos definitivo.'
                },
                {
                    icone: 'fas fa-lock',
                    cor: '#00B0FF',
                    pergunta: 'Esqueci a minha senha. O que faço?',
                    resposta: 'Na tela de Login, clique em <i>"Esqueci a minha senha"</i>. Isso enviará um pedido ao Gerente.<br><br>O Gerente pode ir a Ajustes > Gestão de Equipe, clicar no seu perfil e redefinir a sua senha novamente para <b>1234</b> para você poder criar uma nova.'
                },
                {
                    icone: 'fas fa-pizza-slice',
                    cor: '#9C27B0',
                    pergunta: 'Como criar um Ingrediente Sazonal (Temporário)?',
                    resposta: 'No Gestor de ERP (Produtos), ao adicionar um produto, marque a caixinha <b>"É Sazonal?"</b>.<br><br>Você poderá escrever o nome da Pizza temporária e definir o <b>Dia de Encerramento</b>. O sistema vai avisar a todos no momento em que a pizza sair do cardápio para que os insumos sejam descartados ou reaproveitados.'
                },
                {
                    icone: 'fas fa-cloud-upload-alt',
                    cor: '#E0E0E0',
                    pergunta: 'O aplicativo precisa de Internet para funcionar?',
                    resposta: 'O aplicativo foi desenhado para ser rápido e pode abrir mesmo com a internet instável (modo offline).<br><br>Porém, para garantir que as suas contagens sejam salvas na <b>Nuvem</b>, para que os outros membros da equipa vejam as suas alterações, e para gerar o envio pelo WhatsApp, <b>é obrigatório estar conectado à internet.</b>'
                }
            ]
        };
    },
    methods: {
        toggleFaq(index) {
            this.$root.vibrar(15);
            // Se clicar na mesma que já está aberta, ela fecha. Se for noutra, abre a nova.
            if (this.perguntaAberta === index) {
                this.perguntaAberta = null;
            } else {
                this.perguntaAberta = index;
            }
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_ajuda.js
