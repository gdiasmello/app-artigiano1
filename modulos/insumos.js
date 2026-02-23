// INÍCIO DO ARQUIVO modulos/insumos.js - v0.0.90
Vue.component('tela-insumos', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #D50000;">📦 Insumos</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div v-for="rota in rotas" :key="rota" style="margin-bottom: 20px;">
            <h3 style="color: #FF5252; border-bottom: 1px solid #333; padding-bottom: 5px;">📍 {{ rota }}</h3>
            
            <div v-for="p in produtosPorRota(rota)" :key="p.id" class="card" style="padding: 15px; margin-bottom: 15px; border-left: 4px solid #D50000;">
                
                <div style="margin-bottom: 10px;">
                    <strong style="color: white; font-size: 1.1rem; display: block;">{{ p.nome }}</strong>
                    <span style="color: #888; font-size: 0.8rem;">Estoque Ideal: {{ p.estoqueIdeal }} {{ p.undContagem }}</span>
                </div>

                <label style="color: #CCC; font-size: 0.85rem; display: block; margin-bottom: 5px;">Quantos temos na loja AGORA?</label>
                <input type="number" 
                       inputmode="numeric" 
                       v-model.number="estoquesLoja[p.id]" 
                       @blur="salvarNuvem" 
                       placeholder="Ex: 5" 
                       class="input-nativo" />

                <div v-if="precisaPedir(p)" style="background: rgba(213,0,0,0.1); border: 1px dashed #D50000; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                    <span style="color: #FF5252; font-size: 0.85rem; font-weight: bold;">
                        <i class="fas fa-robot"></i> IA SUGERE PEDIR:
                    </span>
                    <div style="color: white; font-size: 1.1rem; margin-top: 5px; font-weight: bold;">
                        {{ calcPedirFinal(p) }} 
                        <span v-if="!p.apenasNome">{{ p.undCompra }}</span>
                    </div>
                </div>

                <div v-if="obsItens[p.id]" style="background: rgba(255,171,0,0.1); padding: 10px; border-radius: 8px; color: #FFAB00; font-size: 0.85rem; margin-bottom: 10px;">
                    <i class="fas fa-comment-dots"></i> Obs: {{ obsItens[p.id] }}
                </div>

                <button @click="addObs(p.id)" style="width: 100%; background: #222; color: #D50000; border: 1px dashed #D50000; padding: 12px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: bold;">
                    <i class="fas fa-edit"></i> ADICIONAR OBSERVAÇÃO
                </button>

            </div>
        </div>

        <div v-if="temAlgoParaPedir" class="animate__animated animate__fadeInUp" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 560px; z-index: 100;">
            <button @click="fecharPedido" class="btn" style="background: #25D366; color: white; box-shadow: 0 5px 15px rgba(37,211,102,0.4); font-size: 1.1rem; height: 55px;">
                <i class="fab fa-whatsapp" style="font-size: 1.3rem; margin-right: 8px;"></i> ENVIAR LISTA DA IA
            </button>
        </div>

        <div v-if="produtosFiltrados.length === 0" style="text-align: center; color: #666; margin-top: 50px;">
            Nenhum produto cadastrado nos Insumos.
        </div>
    </div>
    `,
    data() {
        return {
            estoquesLoja: {},
            obsItens: {}
        };
    },
    computed: {
        produtosFiltrados() { 
            return this.$root.bancoProdutos.filter(p => p.categoria === 'insumos'); 
        },
        rotas() { 
            return [...new Set(this.produtosFiltrados.map(p => p.local))].sort(); 
        },
        temAlgoParaPedir() {
            return this.produtosFiltrados.some(p => this.precisaPedir(p));
        }
    },
    methods: {
        produtosPorRota(r) { 
            return this.produtosFiltrados.filter(p => p.local === r).sort((a,b) => a.nome.localeCompare(b.nome)); 
        },
        precisaPedir(p) {
            let atual = this.estoquesLoja[p.id];
            if (atual === '' || atual === undefined || atual === null) return false;
            return atual < p.estoqueIdeal;
        },
        calcPedirFinal(p) {
            let atual = this.estoquesLoja[p.id];
            let falta = p.estoqueIdeal - atual;
            
            if (p.apenasNome) {
                return falta; 
            } else {
                return Math.ceil(falta / p.fator);
            }
        },
        async addObs(id) {
            this.$root.vibrar(20);
            const { value: text } = await Swal.fire({ 
                title: 'Observação no item', 
                input: 'text', 
                inputValue: this.obsItens[id] || '', 
                placeholder: 'Ex: Urgente, marca X...', 
                background: '#1E1E1E', 
                color: '#FFF', 
                showCancelButton: true, 
                confirmButtonColor: '#D50000' 
            });
            
            if (text !== undefined) { 
                this.$set(this.obsItens, id, text);
                this.salvarNuvem(); 
            }
        },
        salvarNuvem() { 
            db.collection("operacao").doc("contagemInsumos").set({ 
                estoques: this.estoquesLoja, 
                observacoes: this.obsItens,
                user: this.$root.usuario.nome, 
                ts: Date.now() 
            }, { merge: true });
        },
        fecharPedido() {
            this.$root.vibrar(30); 
            let txt = '';
            
            this.produtosFiltrados.forEach(p => {
                if (this.precisaPedir(p)) {
                    let qtd = this.calcPedirFinal(p);
                    let obs = this.obsItens[p.id] ? ` (Obs: ${this.obsItens[p.id]})` : '';
                    
                    if (p.apenasNome) { 
                        txt += `- ${qtd}x ${p.nome}${obs}\n`; 
                    } else { 
                        txt += `- ${qtd} ${p.undCompra} de ${p.nome}${obs}\n`; 
                    }
                }
            });
            
            if (!txt) return;
            
            this.$root.registrarHistorico('Pedido', 'Insumos', 'Gerou lista de Insumos da IA.');
            this.$root.enviarWhatsApp(txt); 
            
            Swal.fire({ 
                title: 'Limpar Contagem?', 
                text: 'Deseja zerar os campos agora que enviou o pedido?', 
                showCancelButton: true, 
                confirmButtonColor: '#FF5252', 
                confirmButtonText: 'Sim, limpar', 
                cancelButtonColor: '#444',
                cancelButtonText: 'Manter',
                background: '#1E1E1E', 
                color: '#FFF'
            }).then((r) => {
                if (r.isConfirmed) { 
                    this.estoquesLoja = {};
                    this.obsItens = {};
                    this.salvarNuvem(); 
                }
            });
        }
    },
    mounted() {
        db.collection("operacao").doc("contagemInsumos").onSnapshot((doc) => {
            if (doc.exists) { 
                let data = doc.data();
                this.estoquesLoja = { ...data.estoques };
                this.obsItens = { ...data.observacoes };
            }
        });
        
        if (!document.getElementById('css-ins-fix')) {
            const s = document.createElement('style'); 
            s.id = 'css-ins-fix';
            s.innerHTML = `
                .input-nativo { width: 100%; border-radius: 8px; border: 1px solid #444; background: #2C2C2C; box-sizing: border-box; outline: none; }
                .input-nativo:focus { border-color: #D50000; }
            `;
            document.head.appendChild(s);
        }
    }
});
// FIM DO ARQUIVO modulos/insumos.js
