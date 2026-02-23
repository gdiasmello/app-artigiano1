// INÍCIO DO ARQUIVO modulos/sacolao.js - v1.1.5
Vue.component('tela-sacolao', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00C853;"><i class="fas fa-carrot"></i> Sacolão</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="padding: 15px; margin-bottom: 20px; border-left: 4px solid #00C853; background: rgba(0,200,83,0.05);">
            <p style="margin:0; color:#EEE; font-size:0.85rem; line-height:1.4;"><i class="fas fa-robot"></i> <b>IA Artigiano:</b> Insira o estoque atual. Eu calcularei a falta baseada na meta da semana.</p>
        </div>

        <div v-for="p in produtosSacolao" :key="p.id" class="card" style="padding: 15px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <strong style="color: white; font-size: 1rem; display: block;">{{ p.nome }}</strong>
                    <span style="color: #888; font-size: 0.75rem;">Meta: {{ p.estoqueIdeal }} {{ p.undContagem }}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="number" inputmode="numeric" v-model.number="estoquesLoja[p.id]" @blur="salvarNuvem" placeholder="0" style="width: 70px; padding: 10px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; text-align: center; font-weight: bold;">
                    <span style="color: #AAA; font-size: 0.8rem; width: 35px;">{{ p.undContagem }}</span>
                </div>
            </div>
            <div v-if="precisaPedir(p)" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #333; color: #00E676; font-size: 0.85rem; font-weight: bold;">
                <i class="fas fa-shopping-basket"></i> Pedir: {{ calcFalta(p) }} {{ p.undCompra }}
            </div>
        </div>

        <div style="position: fixed; bottom: 20px; left: 0; right: 0; padding: 0 20px; max-width: 600px; margin: 0 auto;">
            <button @click="gerarPedido" class="btn" style="background: #00C853; color: white; font-weight: bold; box-shadow: 0 4px 15px rgba(0,200,83,0.4); height: 55px;">
                <i class="fab fa-whatsapp"></i> ENVIAR PEDIDO SACOLÃO
            </button>
        </div>
    </div>
    `,
    data() {
        return { estoquesLoja: {} };
    },
    computed: {
        produtosSacolao() { 
            return this.$root.bancoProdutos.filter(p => p.categoria === 'sacolao').sort((a,b) => a.nome.localeCompare(b.nome)); 
        }
    },
    methods: {
        precisaPedir(p) {
            let atual = this.estoquesLoja[p.id] || 0;
            return atual < p.estoqueIdeal;
        },
        calcFalta(p) {
            let atual = this.estoquesLoja[p.id] || 0;
            let falta = p.estoqueIdeal - atual;
            return p.fator > 1 ? Math.ceil(falta / p.fator) : falta;
        },
        salvarNuvem() {
            db.collection("operacao").doc("contagemSacolao").set({ 
                estoques: this.estoquesLoja, 
                user: this.$root.usuario.nome, 
                ts: Date.now() 
            }, { merge: true });
            this.$root.salvarMemoriaLocal();
        },
        gerarPedido() {
            this.$root.vibrar(30);
            let txt = '';
            this.produtosSacolao.forEach(p => {
                if (this.precisaPedir(p)) {
                    txt += `- ${this.calcFalta(p)} ${p.undCompra} de ${p.nome}\n`;
                }
            });
            if (!txt) {
                Swal.fire({ icon: 'info', title: 'Estoque Cheio', text: 'Nada para pedir hoje!', background: '#1E1E1E', color: '#FFF' });
                return;
            }
            this.$root.registrarHistorico('Sacolão', 'Pedido', 'Enviou lista para WhatsApp');
            this.$root.enviarWhatsApp(txt);
        }
    },
    mounted() {
        db.collection("operacao").doc("contagemSacolao").onSnapshot((doc) => {
            if (doc.exists) this.estoquesLoja = { ...doc.data().estoques };
        });
    }
});
// FIM DO ARQUIVO modulos/sacolao.js
