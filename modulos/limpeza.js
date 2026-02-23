// INÍCIO DO ARQUIVO modulos/limpeza.js - v0.0.95
Vue.component('tela-limpeza', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2962FF;">🧹 Limpeza & Diversos</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <p style="color: #AAA; font-size: 0.9rem; margin-bottom: 20px;">
            Marque o que está a faltar na loja. O pedido vai junto com os Insumos.
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 25px;">
            <div v-for="p in produtosLimpeza" :key="p.id" @click="toggleItem(p.id)" class="card" style="padding: 15px; margin: 0; display: flex; align-items: center; gap: 15px; cursor: pointer; border: 1px solid #333;" :style="selecionados.includes(p.id) ? 'background: rgba(41,98,255,0.1); border-color: #2962FF;' : ''">
                
                <div style="width: 28px; height: 28px; border-radius: 6px; border: 2px solid #555; display: flex; align-items: center; justify-content: center; transition: 0.2s;" :style="selecionados.includes(p.id) ? 'background: #2962FF; border-color: #2962FF;' : ''">
                    <i v-if="selecionados.includes(p.id)" class="fas fa-check" style="color: white; font-size: 1rem;"></i>
                </div>
                
                <strong style="color: white; font-size: 1.1rem; flex: 1;" :style="selecionados.includes(p.id) ? 'color: #82B1FF;' : ''">{{ p.nome }}</strong>
                
            </div>
        </div>

        <div class="card" style="border-top: 4px solid #FFAB00; padding: 15px;">
            <label style="color: #FFAB00; font-size: 0.9rem; font-weight: bold; margin-bottom: 10px; display: block;">
                <i class="fas fa-plus-circle"></i> Faltou algo mais? (Lâmpada, vasilha, etc)
            </label>
            <textarea v-model="algoMais" @blur="salvarNuvem" placeholder="Escreva aqui..." rows="3" style="width: 100%; padding: 12px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; outline: none; resize: none;"></textarea>
        </div>

        <div class="animate__animated animate__fadeInUp" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 560px; z-index: 100;">
            <button @click="$root.mudarTela('tela-insumos')" class="btn" style="background: #2962FF; color: white; box-shadow: 0 5px 15px rgba(41,98,255,0.4); font-size: 1.1rem; height: 55px;">
                IR PARA INSUMOS <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>
            </button>
        </div>

    </div>
    `,
    data() {
        return {
            selecionados: [],
            algoMais: ''
        };
    },
    computed: {
        produtosLimpeza() { 
            return this.$root.bancoProdutos.filter(p => p.categoria === 'limpeza').sort((a,b) => a.nome.localeCompare(b.nome)); 
        }
    },
    methods: {
        toggleItem(id) {
            this.$root.vibrar(15);
            if (this.selecionados.includes(id)) {
                this.selecionados = this.selecionados.filter(x => x !== id);
            } else {
                this.selecionados.push(id);
            }
            this.salvarNuvem();
        },
        salvarNuvem() { 
            // Salva a lista de IDs marcados e o texto na Nuvem
            db.collection("operacao").doc("carrinhoLimpeza").set({ 
                selecionados: this.selecionados, 
                algoMais: this.algoMais,
                user: this.$root.usuario.nome, 
                ts: Date.now() 
            });
        }
    },
    mounted() {
        // Puxa o estado atual da Nuvem para todos verem igual
        db.collection("operacao").doc("carrinhoLimpeza").onSnapshot((doc) => {
            if (doc.exists) { 
                const data = doc.data();
                this.selecionados = data.selecionados || [];
                this.algoMais = data.algoMais || '';
            }
        });
    }
});
// FIM DO ARQUIVO modulos/limpeza.js
