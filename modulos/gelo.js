/**
 * Gelo v0.0.91
 * Gestão de estoque de gelo com IA preditiva de clima.
 */
Vue.component('tela-gelo', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="margin: 0; color: var(--cor-secundaria);"><i class="fas fa-snowflake"></i> Estoque de Gelo</h2>
        </div>

        <div class="card" style="padding: 25px; text-align: center; border-top: 5px solid var(--cor-secundaria);">
            <label style="color: #AAA; font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 15px;">QUANTOS PACOTES TEMOS NA ARCA?</label>
            <input type="number" v-model.number="estoqueAtual" placeholder="Ex: 5" class="input-dark" style="text-align: center; font-size: 2.5rem; font-weight: 900; color: var(--cor-secundaria);">

            <div v-if="estoqueAtual !== ''" class="animate__animated animate__fadeIn" style="margin-top: 30px;">
                
                <div v-if="precisaPedir" class="alerta-gelo">
                    <div style="color: var(--cor-secundaria); font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                        <i class="fas fa-robot"></i> Inteligência Preditiva
                    </div>
                    <p style="color: white; font-size: 0.95rem; margin-bottom: 15px; line-height: 1.4;">
                        O mínimo para hoje é <b>{{ analiseIA.minimo }} pacotes</b>.<br>
                        <small style="color: #888;">Motivo: {{ analiseIA.motivo }}</small>
                    </p>
                    <div style="font-size: 1.2rem; font-weight: bold; color: white;">
                        👉 Pedir: <span style="color: var(--cor-secundaria); font-size: 1.8rem;">{{ analiseIA.pedir }}</span> pacotes
                    </div>
                    <button @click="fazerPedido" class="btn" style="background: #25D366; color: white; margin-top: 20px;">
                        <i class="fab fa-whatsapp"></i> PEDIR GELO AGORA
                    </button>
                </div>

                <div v-else style="background: rgba(0, 230, 118, 0.05); border: 1px dashed var(--cor-sucesso); padding: 20px; border-radius: 12px;">
                    <i class="fas fa-check-circle" style="color: var(--cor-sucesso); font-size: 2rem; margin-bottom: 10px;"></i>
                    <h4 style="color: white; margin: 0;">Estoque Seguro!</h4>
                    <p style="color: #AAA; font-size: 0.85rem; margin-top: 5px;">Temos o suficiente para a demanda prevista.</p>
                </div>
            </div>
        </div>
    </div>
    `,
    data() { return { estoqueAtual: '' }; },
    computed: {
        analiseIA() {
            const hoje = new Date();
            const diaSemana = hoje.getDay();
            const temp = parseFloat(this.$root.clima.temperatura) || 20;
            
            let minimo = 4;
            let motivo = "Movimento normal";

            if (diaSemana === 5 || diaSemana === 6 || diaSemana === 0) {
                minimo = 7;
                motivo = "Fim de semana (Alta demanda)";
            }

            if (temp >= 27) {
                minimo *= 2; // Dobra o mínimo atual conforme o manual
                motivo = `Calor detectado (${temp}°C) + ${motivo}`;
            }

            let pedir = 0;
            if (this.estoqueAtual < minimo) {
                pedir = 10 - this.estoqueAtual; // Sempre completa a arca (10un)
            }

            return { minimo, motivo, pedir };
        },
        precisaPedir() {
            return this.estoqueAtual !== '' && this.estoqueAtual < this.analiseIA.minimo;
        }
    },
    methods: {
        fazerPedido() {
            const txt = `*PEDIDO DE GELO*\n\n- ${this.analiseIA.pedir} pacotes de Gelo 🧊`;
            this.$root.enviarWhatsApp(txt);
            this.$root.registrarHistorico('Pedido', 'Gelo', `Pediu ${this.analiseIA.pedir} pacotes. Estoque: ${this.estoqueAtual}`);
            this.$root.mudarTela('tela-dashboard');
        }
    },
    mounted() {
        if (!document.getElementById('css-gelo')) {
            const style = document.createElement('style');
            style.id = 'css-gelo';
            style.innerHTML = `
                .alerta-gelo { background: rgba(0, 176, 255, 0.05); border: 1px dashed var(--cor-secundaria); padding: 20px; border-radius: 12px; text-align: left; }
            `;
            document.head.appendChild(style);
        }
    }
});
