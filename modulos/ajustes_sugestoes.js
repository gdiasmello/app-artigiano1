// INÍCIO DO ARQUIVO modulos/ajustes_sugestoes.js - v1.0.2
Vue.component('tela-ajustes-sugestoes', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #FFD600;">💡 Sugestões e Erros</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="border-top: 4px solid #FFD600; padding: 20px;">
            <p style="color: #CCC; font-size: 0.95rem; margin-top: 0; margin-bottom: 20px; line-height: 1.5;">
                Encontrou um erro no sistema ou tem alguma ideia para melhorar o PiZZA Master? <br><br>
                Descreva abaixo o que aconteceu. A sua mensagem será enviada diretamente para o WhatsApp do <b>Desenvolvedor (Gabriel)</b>.
            </p>

            <label style="color: #AAA; font-size: 0.8rem; font-weight: bold; display: block; margin-bottom: 8px;">
                DESCREVA O PROBLEMA OU IDEIA:
            </label>
            
            <textarea v-model="mensagem" 
                      rows="6" 
                      placeholder="Ex: A tela de Limpeza não está a carregar... ou Poderíamos adicionar uma função para..." 
                      style="width: 100%; padding: 15px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; outline: none; resize: none; margin-bottom: 20px;"></textarea>

            <button @click="enviarParaDev" class="btn" style="background: #25D366; color: white; height: 55px; font-size: 1.05rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 15px rgba(37,211,102,0.3);">
                <i class="fab fa-whatsapp" style="font-size: 1.4rem;"></i> ENVIAR PARA O DESENVOLVEDOR
            </button>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <i class="fas fa-code" style="color: #444; font-size: 2rem;"></i>
            <p style="color: #666; font-size: 0.8rem; margin-top: 10px;">
                PiZZA Master v{{ $root.versaoApp }}<br>
                Reporte bugs para melhorar o ecossistema.
            </p>
        </div>

    </div>
    `,
    data() {
        return {
            mensagem: ''
        };
    },
    methods: {
        enviarParaDev() {
            if (!this.mensagem.trim()) {
                Swal.fire({ 
                    icon: 'warning', 
                    title: 'Atenção', 
                    text: 'Escreva alguma coisa antes de enviar.', 
                    background: '#1E1E1E', 
                    color: '#FFF' 
                });
                return;
            }

            this.$root.vibrar(30);

            // Regista na Nuvem também para ficar no histórico do sistema
            db.collection("operacao").doc("feedbacks").collection("lista").add({
                usuario: this.$root.usuario.nome,
                mensagem: this.mensagem,
                data: new Date().toLocaleString('pt-BR')
            });

            // Formata a mensagem para o seu WhatsApp (Gabriel - 43 98454-4686)
            const textoWhatsApp = `*PIZZA MASTER BUG/SUGESTÃO* 🚨\n\n*De:* ${this.$root.usuario.nome}\n*Versão:* v${this.$root.versaoApp}\n\n*Mensagem:*\n${this.mensagem}`;
            
            const link = `https://api.whatsapp.com/send?phone=5543984544686&text=${encodeURIComponent(textoWhatsApp)}`;
            window.open(link, '_blank');

            // Limpa o campo após o envio
            Swal.fire({ 
                icon: 'success', 
                title: 'Obrigado!', 
                text: 'Mensagem enviada com sucesso.', 
                background: '#1E1E1E', 
                color: '#FFF' 
            }).then(() => {
                this.mensagem = '';
                this.$root.mudarTela('tela-ajustes');
            });
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_sugestoes.js
