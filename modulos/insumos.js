// INÍCIO DO ARQUIVO modulos/insumos.js - v1.0.2
Vue.component('tela-insumos', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #D50000;">📦 Insumos</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
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

        <div class="card" style="border-top: 4px solid #FFAB00; padding: 15px; margin-bottom: 30px;">
            <label style="color: #FFAB00; font-size: 0.9rem; font-weight: bold; margin-bottom: 10px; display: block;">
                <i class="fas fa-plus-circle"></i> Faltou algum Insumo Extra?
            </label>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <input type="text" v-model="novoAlgoMais" @keyup.enter="addAlgoMaisInsumo" placeholder="Ex: Rolo de Bobina, Faca..." style="flex: 1; padding: 12px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; outline: none;">
                <button @click="addAlgoMaisInsumo" class="btn" style="background: #FFAB00; color: #121212; width: 55px; padding: 0; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-plus" style="font-size: 1.2rem;"></i>
                </button>
            </div>

            <div v-if="listaAlgoMaisInsumos.length === 0" style="color: #666; font-size: 0.85rem; text-align: center; margin-top: 10px;">
                Nenhum extra adicionado.
            </div>

            <div v-for="item in listaAlgoMaisInsumos" :key="item.id" class="animate__animated animate__fadeIn" style="display: flex; justify-content: space-between; align-items: center; background: #222; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #333;">
                <span style="color: #FFF; font-size: 1rem;">{{ item.texto }}</span>
                <button @click="rmAlgoMaisInsumo(item.id)" style="background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>

        <div v-if="temAlgoParaPedir || limpezaSelecionados.length > 0 || listaAlgoMaisInsumos.length > 0 || limpezaAlgoMaisList.length > 0" class="animate__animated animate__fadeInUp" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 560px; z-index: 100;">
            <button @click="fecharPedido" class="btn" style="background: #25D366; color: white; box-shadow: 0 5px 15px rgba(37,211,102,0.4); font-size: 1rem; height: 55px; white-space: nowrap;">
                <i class="fab fa-whatsapp" style="font-size: 1.3rem; margin-right: 8px;"></i> ENVIAR LISTA ÚNICA
            </button>
        </div>

    </div>
    `,
    data() {
        return {
            estoquesLoja: {},
            obsItens: {},
            listaAlgoMaisInsumos: [],
            novoAlgoMais: '',
            
            // Variáveis que vêm da Limpeza via Firebase
            limpezaSelecionados: [],
            limpezaAlgoMaisList: []
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
                title: 'Observação', 
                input: 'text', 
                inputValue: this.obsItens[id] || '', 
                placeholder: 'Ex: Urgente...', 
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
        addAlgoMaisInsumo() {
            if (!this.novoAlgoMais.trim()) return;
            this.$root.vibrar(20);
            this.listaAlgoMaisInsumos.push({ id: Date.now(), texto: this.novoAlgoMais.trim() });
            this.novoAlgoMais = '';
            this.salvarNuvem();
        },
        rmAlgoMaisInsumo(id) {
            this.$root.vibrar(20);
            this.listaAlgoMaisInsumos = this.listaAlgoMaisInsumos.filter(x => x.id !== id);
            this.salvarNuvem();
        },
        salvarNuvem() { 
            db.collection("operacao").doc("contagemInsumos").set({ 
                estoques: this.estoquesLoja, 
                observacoes: this.obsItens,
                listaAlgoMais: this.listaAlgoMaisInsumos,
                user: this.$root.usuario.nome, 
                ts: Date.now() 
            }, { merge: true });
        },
        fecharPedido() {
            this.$root.vibrar(30); 
            
            // AGORA É TUDO UMA LISTA ÚNICA, SEM CATEGORIAS OU TÍTULOS
            let txt = '';
            
            // 1. Insumos da IA
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

            // 2. Limpeza (Quadradinhos marcados)
            this.limpezaSelecionados.forEach(id => {
                const p = this.$root.bancoProdutos.find(x => x.id === id);
                if (p) {
                    txt += `- ${p.nome}\n`;
                }
            });

            // 3. Algo Mais (Insumos + Limpeza misturados)
            this.listaAlgoMaisInsumos.forEach(i => {
                txt += `- ${i.texto}\n`;
            });
            
            this.limpezaAlgoMaisList.forEach(i => {
                txt += `- ${i.texto}\n`;
            });

            if (!txt) {
                Swal.fire({ icon: 'info', title: 'Lista Vazia', text: 'Não há nada para pedir.', background: '#1E1E1E', color: '#FFF' });
                return;
            }
            
            this.$root.registrarHistorico('Pedido', 'Lista Única', 'Enviou a lista unificada para o WhatsApp.');
            this.$root.enviarWhatsApp(txt); 
            
            Swal.fire({ 
                title: 'Limpar Contagens?', 
                text: 'Deseja zerar Insumos e Limpeza agora que enviou o pedido?', 
                showCancelButton: true, 
                confirmButtonColor: '#FF5252', 
                confirmButtonText: 'Sim, limpar tudo', 
                cancelButtonColor: '#444', 
                cancelButtonText: 'Manter', 
                background: '#1E1E1E', 
                color: '#FFF'
            }).then((r) => {
                if (r.isConfirmed) { 
                    this.estoquesLoja = {}; 
                    this.obsItens = {}; 
                    this.listaAlgoMaisInsumos = []; 
                    this.salvarNuvem(); 
                    
                    db.collection("operacao").doc("carrinhoLimpeza").set({ 
                        selecionados: [], 
                        listaAlgoMais: [] 
                    });
                }
            });
        }
    },
    mounted() {
        // Escuta Insumos da Nuvem
        db.collection("operacao").doc("contagemInsumos").onSnapshot((doc) => {
            if (doc.exists) { 
                let data = doc.data();
                this.estoquesLoja = { ...data.estoques };
                this.obsItens = { ...data.observacoes };
                this.listaAlgoMaisInsumos = data.listaAlgoMais || [];
            }
        });

        // Escuta Limpeza da Nuvem
        db.collection("operacao").doc("carrinhoLimpeza").onSnapshot((doc) => {
            if (doc.exists) {
                let data = doc.data();
                this.limpezaSelecionados = data.selecionados || [];
                this.limpezaAlgoMaisList = data.listaAlgoMais || [];
            }
        });
        
        if (!document.getElementById('css-ins-v102')) {
            const style = document.createElement('style'); 
            style.id = 'css-ins-v102';
            style.innerHTML = `
                .input-nativo { 
                    width: 100%; 
                    padding: 12px; 
                    font-size: 1.2rem; 
                    font-weight: bold; 
                    color: white; 
                    border-radius: 8px; 
                    border: 1px solid #444; 
                    background: #2C2C2C; 
                    box-sizing: border-box; 
                    outline: none; 
                    text-align: center; 
                } 
                .input-nativo:focus { 
                    border-color: #D50000; 
                }
            `;
            document.head.appendChild(style);
        }
    }
});
// FIM DO ARQUIVO modulos/insumos.js
