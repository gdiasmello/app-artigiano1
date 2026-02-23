// INÍCIO DO ARQUIVO modulos/ajustes_ajuda.js - v2.0.5
Vue.component('tela-ajustes-ajuda', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00B0FF;"><i class="fas fa-question-circle"></i> Ajuda e Suporte</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <p style="color: #CCC; font-size: 0.95rem; margin-bottom: 25px; line-height: 1.5;">
            Bem-vindo ao manual do <b>PiZZA Master</b>. Selecione uma dúvida abaixo.
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

        <div style="margin-top: 35px; padding-top: 20px; border-top: 1px dashed #444; text-align: center;">
            <p style="color: #888; font-size: 0.85rem; margin-bottom: 15px;">Encontrou um erro ou tem uma sugestão?</p>
            <button @click="$root.mudarTela('tela-ajustes-sugestoes')" class="btn" style="background: #2C2C2C; color: #FFD600; border: 1px dashed #FFD600; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; height: 55px;">
                <i class="fas fa-comment-dots"></i> ENVIAR FEEDBACK / SUGESTÃO
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
                    pergunta: 'Como a IA calcula os pedidos?', 
                    resposta: 'A IA subtrai o estoque atual da Meta definida pelo gerente. Se o produto vier em caixas (Fator), a IA já divide a quantidade e arredonda para você pedir caixas fechadas.' 
                },
                { 
                    icone: 'fas fa-bullhorn', 
                    cor: '#FF5252', 
                    pergunta: 'Como funciona o Mural de Avisos?', 
                    resposta: 'Você escolhe Público, Duração (sumindo sozinho depois) e Urgência (faz piscar a vermelho no Dashboard).' 
                },
                { 
                    icone: 'fas fa-sign-in-alt', 
                    cor: '#00E676', 
                    pergunta: 'Como funciona a Senha 1234?', 
                    resposta: 'É a senha padrão para novos funcionários. Ao entrar a primeira vez, eles são obrigados a mudar o PIN e assinar o termo digital.' 
                }
            ]
        };
    },
    methods: {
        toggleFaq(index) {
            this.$root.vibrar(15);
            if (this.perguntaAberta === index) {
                this.perguntaAberta = null;
            } else {
                this.perguntaAberta = index;
            }
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_ajuda.js
