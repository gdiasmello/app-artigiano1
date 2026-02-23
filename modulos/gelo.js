// INÍCIO DO ARQUIVO modulos/gelo.js - v0.0.91
Vue.component('tela-gelo', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00B0FF;">🧊 Estoque de Gelo</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="border-top: 4px solid #00B0FF; padding: 20px;">
            
            <label style="color: #CCC; font-size: 0.9rem; display: block; margin-bottom: 10px; text-align: center;">
                Quantos pacotes de gelo temos na arca <b>AGORA</b>?
            </label>
            
            <input type="number" 
                   inputmode="numeric" 
                   v-model.number="estoqueAtual" 
                   @blur="salvarNuvem" 
                   placeholder="Ex: 3" 
                   class="input-nativo-gelo" />

            <div v-if="estoqueAtual !== '' && estoqueAtual !== null" class="animate__animated animate__fadeIn" style="margin-top: 20px;">
                
                <div v-if="precisaPedir" style="background: rgba(0, 176, 255, 0.1); border: 1px dashed #00B0FF; padding: 15px; border-radius: 8px;">
                    <span style="color: #00B0FF; font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 8px;">
                        <i class="fas fa-robot"></i> IA SUGERE PEDIR:
                    </span>
                    
                    <p style="margin: 0; color: #FFF; font-size: 0.95rem; margin-bottom: 10px; line-height: 1.4;">
                        <b>Motivo:</b> {{ analiseIA.motivo }}.<br>
                        O mínimo para operar hoje é <b>{{ analiseIA.minimo }}</b>.
                    </p>
                    
                    <div style="color: white; font-size: 1.1rem; font-weight: bold; border-top: 1px solid rgba(0, 176, 255, 0.3); padding-top: 10px;">
                        👉 Pedir: <span style="color: #00B0FF; font-size: 1.5rem;">{{ analiseIA.pedir }}</span> pacotes
                    </div>
                    
                    <small style="color: #888; display: block; margin-top: 5px;">
                        *Quantidade para atingir a capacidade máxima (10).
                    </small>
                </div>
                
                <div v-else style="background: rgba(0, 200, 83, 0.1); border: 1px dashed #00C853; padding: 15px; border-radius: 8px; text-align: center;">
                    <p style="color: #00C853; margin: 0; font-size: 1.1rem; font-weight: bold;">
                        <i class="fas fa-thumbs-up"></i> Estoque Seguro!
                    </p>
                    <small style="color: #AAA; display: block; margin-top: 5px;">
                        O mínimo exigido hoje é {{ analiseIA.minimo }}. Temos {{ estoqueAtual }}. Não é preciso pedir gelo!
                    </small>
                </div>

            </div>
        </div>

        <div v-if="precisaPedir && estoqueAtual !== ''" class="animate__animated animate__fadeInUp" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 560px; z-index: 100;">
            <button @click="fecharPedido" class="btn" style="background: #25D366; color: white; box-shadow: 0 5px 15px rgba(37,211,102,0.4); font-size: 1.1rem; height: 55px;">
                <i class="fab fa-whatsapp" style="font-size: 1.3rem; margin-right: 8px;"></i> PEDIR GELO ({{ analiseIA.pedir }})
            </button>
        </div>

    </div>
    `,
    data() {
        return {
            estoqueAtual: ''
        };
    },
    computed: {
        analiseIA() {
            const hoje = new Date();
            const diaSemana = hoje.getDay(); // 0 = Dom, 1 = Seg, 2 = Ter...
            const hojeStr = hoje.toISOString().split('T')[0];
            
            // Descobre o dia de amanhã para calcular véspera
            const amanha = new Date(hoje);
            amanha.setDate(amanha.getDate() + 1);
            const amanhaStr = amanha.toISOString().split('T')[0];

            let minimo = 4;
            let motivo = "Dia de movimento normal";

            // REGRA 1: Sexta (5), Sábado (6) e Domingo (0)
            if (diaSemana === 0 || diaSemana === 5 || diaSemana === 6) {
                minimo = 7;
                motivo = "Fim de semana (Sexta a Domingo)";
            }

            // REGRA 2: Feriados e Vésperas (Sobrepõe os dias normais)
            const isFeriadoHoje = this.$root.feriados.find(f => (f.data || f) === hojeStr);
            const isVespera = this.$root.feriados.find(f => (f.data || f) === amanhaStr);

            if (isFeriadoHoje) {
                minimo = 7;
                motivo = `Feriado ou Dia Especial (${isFeriadoHoje.nome || 'Evento'})`;
            } else if (isVespera) {
                minimo = 7;
                motivo = `Véspera de Feriado (${isVespera.nome || 'Evento'})`;
            }

            // CÁLCULO DE PEDIDO (Sempre preencher até 10)
            let atual = Number(this.estoqueAtual);
            let pedir = 0;
            if (atual < minimo) {
                pedir = 10 - atual;
            }

            return { minimo, motivo, pedir };
        },
        precisaPedir() {
            if (this.estoqueAtual === '' || this.estoqueAtual === null) return false;
            return Number(this.estoqueAtual) < this.analiseIA.minimo;
        }
    },
    methods: {
        salvarNuvem() {
            // Salva em tempo real no Firebase
            if (this.estoqueAtual !== '' && this.estoqueAtual !== null) {
                db.collection("operacao").doc("contagemGelo").set({
                    estoqueAtual: Number(this.estoqueAtual),
                    user: this.$root.usuario.nome,
                    ts: Date.now()
                }, { merge: true });
            }
        },
        fecharPedido() {
            this.$root.vibrar(30);
            
            // Monta o texto para o WhatsApp
            let txt = `- ${this.analiseIA.pedir} pacotes de Gelo 🧊`;
            
            this.$root.registrarHistorico('Pedido', 'Gelo', `Pediu ${this.analiseIA.pedir} pacotes de Gelo. Estoque na loja: ${this.estoqueAtual}`);
            
            // Chama a função global do App que já injeta Saudação e Despedida
            this.$root.enviarWhatsApp(txt);
            
            // Pergunta se quer limpar a tela
            Swal.fire({ 
                title: 'Pedido Gerado!', 
                text: 'Deseja limpar a contagem ou manter o número na tela?', 
                icon: 'success',
                showCancelButton: true, 
                confirmButtonColor: '#00B0FF', 
                confirmButtonText: 'Limpar', 
                cancelButtonColor: '#444',
                cancelButtonText: 'Manter',
                background: '#1E1E1E', color: '#FFF'
            }).then((r) => {
                if (r.isConfirmed) { 
                    this.estoqueAtual = '';
                    this.salvarNuvem(); 
                }
            });
        }
    },
    mounted() {
        // Escuta as alterações feitas em outros telemóveis
        db.collection("operacao").doc("contagemGelo").onSnapshot((doc) => {
            if (doc.exists) { 
                let data = doc.data();
                if (data.estoqueAtual !== undefined && data.estoqueAtual !== null) {
                    this.estoqueAtual = data.estoqueAtual;
                }
            }
        });
        
        if (!document.getElementById('css-gelo-fix')) {
            const style = document.createElement('style'); 
            style.id = 'css-gelo-fix';
            style.innerHTML = `
                .input-nativo-gelo { 
                    width: 100%; 
                    padding: 20px; 
                    font-size: 2rem; 
                    font-weight: 900; 
                    color: white; 
                    border-radius: 12px; 
                    border: 2px solid #444; 
                    background: #2C2C2C; 
                    box-sizing: border-box; 
                    outline: none; 
                    text-align: center; 
                    transition: 0.2s;
                }
                .input-nativo-gelo:focus { 
                    border-color: #00B0FF; 
                    background: #1A1A1A;
                }
            `;
            document.head.appendChild(style);
        }
    }
});
// FIM DO ARQUIVO modulos/gelo.js
