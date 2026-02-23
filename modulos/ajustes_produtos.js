// INÍCIO DO ARQUIVO modulos/ajustes_produtos.js - v0.0.98
Vue.component('tela-ajustes-produtos', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00C853;">📦 Produtos ERP</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div v-if="modo === 'lista'">
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button @click="abrirNovoUnico" class="btn" style="background: #00C853; color: #121212; flex: 1; font-size: 0.9rem;">
                    <i class="fas fa-plus"></i> ÚNICO
                </button>
                <button @click="abrirNovoLote" class="btn" style="background: #2962FF; color: white; flex: 1; font-size: 0.9rem;">
                    <i class="fas fa-layer-group"></i> VÁRIOS (LOTE)
                </button>
            </div>

            <input type="text" v-model="busca" placeholder="🔍 Buscar produto..." class="input-dark" style="margin-bottom: 20px;" />

            <div v-for="p in produtosFiltrados" :key="p.id" class="card" style="padding: 15px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #00C853; margin-bottom: 10px;">
                <div @click="editar(p)" style="flex: 1; cursor: pointer;">
                    <strong style="color: white; font-size: 1.1rem; display: block;">{{ p.nome }}</strong>
                    <div style="color: #AAA; font-size: 0.8rem; margin-top: 5px;">
                        <span><i class="fas fa-bullseye" style="color: #FFAB00;"></i> Meta: {{ p.estoqueIdeal }}</span> | 
                        <span>📍 {{ p.local }}</span> | 
                        <span>🏷️ {{ p.categoria }}</span>
                    </div>
                    <div v-if="p.sazonal && p.sazonal.ativa" style="color: #FF5252; font-size: 0.75rem; margin-top: 5px; font-weight: bold;">
                        <i class="fas fa-pizza-slice"></i> Sazonal: {{ p.sazonal.nomePizza }} (Até {{ formatarData(p.sazonal.dataExpiracao) }})
                    </div>
                </div>
                <div style="display: flex; gap: 15px;">
                    <button @click="editar(p)" style="background: none; border: none; color: #00B0FF; font-size: 1.2rem; cursor: pointer;"><i class="fas fa-edit"></i></button>
                    <button @click="apagar(p.id)" style="background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer;"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            
            <div v-if="produtosFiltrados.length === 0" style="text-align: center; color: #666; margin-top: 30px;">
                Nenhum produto encontrado.
            </div>
        </div>

        <div v-if="modo === 'unico'" class="card animate__animated animate__fadeInUp" style="border-top: 4px solid #00C853; padding: 20px;">
            <h3 style="color: white; margin-top: 0;">{{ editandoId ? 'Editar Produto' : 'Novo Produto' }}</h3>
            
            <label class="label-ia">Nome do Item</label>
            <input type="text" v-model="form.nome" class="input-dark" style="margin-bottom: 15px;" />
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label class="label-ia">Módulo</label>
                    <select v-model="form.categoria" class="input-dark">
                        <option value="insumos">Insumos</option>
                        <option value="sacolao">Sacolão</option>
                        <option value="limpeza">Limpeza</option>
                    </select>
                </div>
                <div>
                    <label class="label-ia">Rota / Local</label>
                    <select v-model="form.local" class="input-dark">
                        <option v-for="r in $root.rotasSalvas" :value="r">{{ r }}</option>
                    </select>
                </div>
            </div>

            <label class="label-ia" style="color: #FFAB00;"><i class="fas fa-bullseye"></i> Meta / Estoque Ideal na Loja</label>
            <input type="number" inputmode="numeric" v-model.number="form.estoqueIdeal" placeholder="Ex: 10" class="input-dark" style="margin-bottom: 15px; border-color: #FFAB00;" />

            <div style="background: #222; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px;">
                <label style="display: flex; align-items: center; gap: 10px; color: white; font-weight: bold; cursor: pointer; margin-bottom: 10px;">
                    <input type="checkbox" v-model="form.apenasNome" style="transform: scale(1.3);"> Apenas nome (Sem caixas)
                </label>
                
                <div v-if="!form.apenasNome" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <label class="label-ia">Como conto?</label>
                        <input type="text" v-model="form.undContagem" placeholder="Ex: Peça, Fatias" class="input-dark" />
                    </div>
                    <div>
                        <label class="label-ia">Como peço?</label>
                        <input type="text" v-model="form.undCompra" placeholder="Ex: Kg, Cx" class="input-dark" />
                    </div>
                    <div style="grid-column: span 2;">
                        <label class="label-ia">Fator (Quantos itens vêm na caixa/kg?)</label>
                        <input type="number" inputmode="numeric" v-model.number="form.fator" placeholder="Ex: 1" class="input-dark" />
                    </div>
                </div>
            </div>

            <div style="background: rgba(255, 82, 82, 0.1); padding: 15px; border-radius: 8px; border: 1px dashed #FF5252; margin-bottom: 20px;">
                <label style="display: flex; align-items: center; gap: 10px; color: #FF5252; font-weight: bold; cursor: pointer;">
                    <input type="checkbox" v-model="form.sazonal.ativa" style="transform: scale(1.3);"> 🍕 Ingrediente Sazonal?
                </label>
                
                <div v-if="form.sazonal.ativa" style="margin-top: 15px; display: grid; grid-template-columns: 1fr; gap: 10px;">
                    <div>
                        <label class="label-ia">Nome da Pizza Sazonal</label>
                        <input type="text" v-model="form.sazonal.nomePizza" placeholder="Ex: Pizza de Inverno" class="input-dark" />
                    </div>
                    <div>
                        <label class="label-ia">Data Limite (Validade do Cardápio)</label>
                        <input type="date" v-model="form.sazonal.dataExpiracao" class="input-dark" />
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button @click="voltar" class="btn" style="background: #444; color: white; flex: 1;">CANCELAR</button>
                <button @click="salvarUnico" class="btn" style="background: #00C853; color: #121212; flex: 2; font-weight: bold;">SALVAR</button>
            </div>
        </div>

        <div v-if="modo === 'lote'">
            <div style="background: rgba(41,98,255,0.1); padding: 15px; border-radius: 8px; border: 1px solid #2962FF; margin-bottom: 15px;">
                <p style="color: #82B1FF; margin: 0; font-size: 0.9rem; text-align: center;">
                    <i class="fas fa-info-circle"></i> Adicione vários produtos de uma vez para ganhar tempo.
                </p>
            </div>

            <div v-for="(item, index) in lote" :key="item.id" class="card animate__animated animate__fadeIn" style="border-top: 3px solid #2962FF; padding: 15px; margin-bottom: 20px; position: relative;">
                
                <button @click="removerDoLote(index)" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer;">
                    <i class="fas fa-times-circle"></i>
                </button>
                
                <h4 style="margin: 0 0 15px 0; color: #82B1FF;">Item #{{ index + 1 }}</h4>
                
                <label class="label-ia">Nome do Item</label>
                <input type="text" v-model="item.nome" class="input-dark" style="margin-bottom: 10px;" />
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <select v-model="item.categoria" class="input-dark">
                        <option value="insumos">Insumos</option><option value="sacolao">Sacolão</option><option value="limpeza">Limpeza</option>
                    </select>
                    <select v-model="item.local" class="input-dark">
                        <option v-for="r in $root.rotasSalvas" :value="r">{{ r }}</option>
                    </select>
                </div>

                <label class="label-ia" style="color: #FFAB00;"><i class="fas fa-bullseye"></i> Meta / Estoque Ideal</label>
                <input type="number" inputmode="numeric" v-model.number="item.estoqueIdeal" class="input-dark" style="margin-bottom: 10px; border-color: #FFAB00;" />

                <div style="background: #222; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; gap: 10px; color: white; font-weight: bold; cursor: pointer; margin-bottom: 10px; font-size: 0.9rem;">
                        <input type="checkbox" v-model="item.apenasNome" style="transform: scale(1.2);"> Apenas nome
                    </label>
                    
                    <div v-if="!item.apenasNome" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <input type="text" v-model="item.undContagem" placeholder="Como Conto (Ex: Pc)" class="input-dark" />
                        <input type="text" v-model="item.undCompra" placeholder="Como Peço (Ex: Kg)" class="input-dark" />
                        <div style="grid-column: span 2; display: flex; align-items: center; gap: 10px;">
                            <label class="label-ia" style="margin: 0; white-space: nowrap;">Fator:</label>
                            <input type="number" inputmode="numeric" v-model.number="item.fator" placeholder="Ex: 1" class="input-dark" />
                        </div>
                    </div>
                </div>

                <div style="background: rgba(255, 82, 82, 0.1); padding: 10px; border-radius: 8px; border: 1px dashed #FF5252;">
                    <label style="display: flex; align-items: center; gap: 10px; color: #FF5252; font-weight: bold; cursor: pointer; font-size: 0.9rem;">
                        <input type="checkbox" v-model="item.sazonal.ativa" style="transform: scale(1.2);"> É Sazonal?
                    </label>
                    <div v-if="item.sazonal.ativa" style="margin-top: 10px; display: grid; grid-template-columns: 1fr; gap: 10px;">
                        <input type="text" v-model="item.sazonal.nomePizza" placeholder="Nome da Pizza" class="input-dark" />
                        <input type="date" v-model="item.sazonal.dataExpiracao" class="input-dark" />
                    </div>
                </div>

            </div>

            <button @click="addAoLote" class="btn" style="background: #222; color: #82B1FF; border: 1px dashed #2962FF; margin-bottom: 20px;">
                <i class="fas fa-plus"></i> ADICIONAR MAIS UM ITEM
            </button>

            <div style="display: flex; gap: 10px;">
                <button @click="voltar" class="btn" style="background: #444; color: white; flex: 1;">CANCELAR</button>
                <button @click="salvarLote" class="btn" style="background: #2962FF; color: white; flex: 2; font-weight: bold;">SALVAR TUDO</button>
            </div>
        </div>

    </div>
    `,
    data() {
        return {
            modo: 'lista',
            busca: '',
            editandoId: null,
            form: this.gerarNovoItem(),
            lote: []
        };
    },
    computed: {
        produtosFiltrados() {
            if (!this.busca) return this.$root.bancoProdutos.sort((a,b) => a.nome.localeCompare(b.nome));
            const termo = this.busca.toLowerCase();
            return this.$root.bancoProdutos.filter(p => p.nome.toLowerCase().includes(termo)).sort((a,b) => a.nome.localeCompare(b.nome));
        }
    },
    methods: {
        voltar() {
            if (this.modo !== 'lista') { this.modo = 'lista'; } 
            else { this.$root.mudarTela('tela-ajustes'); }
        },
        gerarNovoItem() {
            return {
                id: null,
                nome: '',
                categoria: 'insumos',
                local: this.$root.rotasSalvas[0] || 'Estoque Seco',
                undContagem: '',
                undCompra: '',
                fator: 1,
                estoqueIdeal: '',
                apenasNome: false,
                sazonal: { ativa: false, nomePizza: '', dataExpiracao: '' }
            };
        },
        abrirNovoUnico() {
            this.editandoId = null;
            this.form = this.gerarNovoItem();
            this.modo = 'unico';
            this.$root.vibrar(20);
        },
        abrirNovoLote() {
            this.lote = [this.gerarNovoItem()];
            this.modo = 'lote';
            this.$root.vibrar(20);
        },
        addAoLote() {
            this.$root.vibrar(15);
            this.lote.push(this.gerarNovoItem());
        },
        removerDoLote(index) {
            this.$root.vibrar(20);
            this.lote.splice(index, 1);
            if (this.lote.length === 0) this.voltar();
        },
        editar(p) {
            this.$root.vibrar(20);
            this.editandoId = p.id;
            this.form = JSON.parse(JSON.stringify(p)); // Clone profundo
            // Garante que o objeto sazonal existe caso seja um produto antigo
            if (!this.form.sazonal) this.form.sazonal = { ativa: false, nomePizza: '', dataExpiracao: '' };
            this.modo = 'unico';
        },
        salvarUnico() {
            if (!this.form.nome.trim()) {
                Swal.fire({ icon: 'warning', title: 'Nome Obrigatório', background: '#1E1E1E', color: '#FFF' });
                return;
            }
            
            this.$root.vibrar(30);
            if (this.editandoId) {
                const idx = this.$root.bancoProdutos.findIndex(x => x.id === this.editandoId);
                this.$root.bancoProdutos[idx] = { ...this.form };
            } else {
                this.form.id = Date.now();
                this.$root.bancoProdutos.push({ ...this.form });
            }
            
            this.salvarNuvem();
            this.modo = 'lista';
            Swal.fire({ icon: 'success', title: 'Salvo!', timer: 1000, showConfirmButton: false, background: '#1E1E1E' });
        },
        salvarLote() {
            const validos = this.lote.filter(item => item.nome.trim() !== '');
            if (validos.length === 0) {
                Swal.fire({ icon: 'warning', title: 'Nenhum item preenchido', background: '#1E1E1E', color: '#FFF' });
                return;
            }
            
            this.$root.vibrar([30, 30]);
            validos.forEach((item, index) => {
                item.id = Date.now() + index; // Garante IDs únicos
                this.$root.bancoProdutos.push({ ...item });
            });
            
            this.salvarNuvem();
            this.modo = 'lista';
            Swal.fire({ icon: 'success', title: `${validos.length} itens salvos!`, timer: 1500, showConfirmButton: false, background: '#1E1E1E' });
        },
        apagar(id) {
            this.$root.vibrar(30);
            Swal.fire({
                title: 'Excluir Produto?',
                text: "Esta ação não pode ser desfeita.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF5252',
                confirmButtonText: 'Sim, excluir',
                background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$root.bancoProdutos = this.$root.bancoProdutos.filter(p => p.id !== id);
                    this.salvarNuvem();
                }
            });
        },
        salvarNuvem() {
            // 🟢 SINCRONIZA COM O FIREBASE EM TEMPO REAL
            db.collection("configuracoes").doc("bancoProdutos").set({ 
                lista: this.$root.bancoProdutos 
            }, { merge: true });
            
            this.$root.salvarMemoriaLocal();
        },
        formatarData(d) {
            if (!d) return '';
            const p = d.split('-');
            return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
        }
    },
    mounted() {
        // 🟢 ESCUTA MUDANÇAS DA NUVEM (Se alguém adicionar num telemóvel, aparece no outro)
        db.collection("configuracoes").doc("bancoProdutos").onSnapshot((doc) => {
            if (doc.exists) {
                this.$root.bancoProdutos = doc.data().lista || [];
                this.$root.salvarMemoriaLocal();
            }
        });

        if (!document.getElementById('css-prod-v98')) {
            const style = document.createElement('style');
            style.id = 'css-prod-v98';
            style.innerHTML = `
                .input-dark { width: 100%; padding: 12px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; outline: none; }
                .input-dark:focus { border-color: #00C853; }
                .label-ia { color: #AAA; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; display: block; }
            `;
            document.head.appendChild(style);
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_produtos.js
