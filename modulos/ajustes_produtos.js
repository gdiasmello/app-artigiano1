// modulos/ajustes_produtos.js - Gestão Inteligente v0.0.42

Vue.component('tela-ajustes-produtos', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #00C853;">📦 Gestão de Produtos</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div v-if="modoFormulario" class="card animate__animated animate__fadeInDown" style="border-left: 3px solid #00C853; border-top: 3px solid #00C853; margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: white;">{{ produtoEditando ? 'Editar Produto' : 'Novo Produto' }}</h3>
                <button @click="fecharFormulario" style="background: none; border: none; color: #FF5252; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-times-circle"></i></button>
            </div>

            <label style="color:var(--cor-primaria); font-size:0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Nome do Item</label>
            <input type="text" v-model="form.nome" placeholder="Ex: Queijo Mussarela" class="input-dark" style="margin-bottom:15px;" />

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div>
                    <label style="color:var(--cor-primaria); font-size:0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Módulo (Ecrã)</label>
                    <select v-model="form.categoria" class="input-dark" style="border: 1px solid var(--cor-primaria);">
                        <option value="insumos">📦 Insumos (Comida)</option>
                        <option value="sacolao">🥬 Sacolão (Hortifruti)</option>
                        <option value="limpeza">🧹 Material de Limpeza</option>
                    </select>
                </div>
                <div>
                    <label style="color:var(--cor-primaria); font-size:0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Rota Física</label>
                    <select v-model="form.local" class="input-dark" style="border: 1px solid var(--cor-primaria);">
                        <option v-for="rota in $root.rotasSalvas" :value="rota">{{ rota }}</option>
                    </select>
                </div>
            </div>

            <label style="color:var(--cor-primaria); font-size:0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Grupo do Produto (Etiqueta Visual)</label>
            <select v-model="form.grupo" class="input-dark" style="margin-bottom: 15px;">
                <option value="Refrigerado">❄️ Refrigerado / Congelado</option>
                <option value="Seco">📦 Estoque Seco</option>
                <option value="Hortifruti">🥬 Hortifruti (Verduras/Legumes)</option>
                <option value="Limpeza">🧹 Material de Limpeza</option>
                <option value="Bebidas">🥤 Bebidas</option>
                <option value="Outros">🏷️ Outros</option>
            </select>

            <div v-if="form.categoria !== 'limpeza'">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div>
                        <label style="color:var(--cor-primaria); font-size:0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Unid. Contagem Loja</label>
                        <input type="text" v-model="form.undContagem" placeholder="Ex: kg, fatias" class="input-dark" />
                    </div>
                    <div>
                        <label style="color:var(--cor-primaria); font-size:0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Meta Ideal (Estoque)</label>
                        <input type="number" v-model.number="form.estoqueIdeal" placeholder="Ex: 10" class="input-dark" />
                    </div>
                </div>

                <label style="display: flex; align-items: center; gap: 10px; color: #FFF; background: #222; padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #444; cursor: pointer;">
                    <input type="checkbox" v-model="form.apenasNome" style="transform: scale(1.3);">
                    <span style="font-size: 0.95rem;">Produto Simples (Pedir apenas o nome)</span>
                </label>

                <div v-if="!form.apenasNome" style="background: rgba(0, 200, 83, 0.1); padding: 15px; border-radius: 8px; border: 1px dashed #00C853; margin-bottom: 15px;">
                    <h5 style="margin: 0 0 10px 0; color: #69F0AE;">Conversão para Compra</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="color:#CCC; font-size:0.8rem; margin-bottom: 5px; display: block;">Fornecedor vende em:</label>
                            <input type="text" v-model="form.undCompra" placeholder="Ex: Caixas, Fardos" class="input-dark" />
                        </div>
                        <div>
                            <label style="color:#CCC; font-size:0.8rem; margin-bottom: 5px; display: block;">Quantos vêm na caixa?</label>
                            <input type="number" v-model.number="form.fator" placeholder="Ex: 5" class="input-dark" />
                        </div>
                    </div>
                </div>

            </div>

            <button class="btn" style="background: #00C853; color: #121212;" @click="salvarProduto">
                <i class="fas fa-save"></i> SALVAR PRODUTO
            </button>
        </div>

        <div v-if="!modoFormulario">
            <button class="btn" style="background: #00C853; color: #121212; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0, 200, 83, 0.3);" @click="abrirParaNovo">
                <i class="fas fa-plus-circle"></i> ADICIONAR NOVO PRODUTO
            </button>

            <div style="display: flex; gap: 8px; margin-bottom: 15px; overflow-x: auto; padding-bottom: 5px;">
                <button @click="mudarAba('todos')" :style="abaAtiva === 'todos' ? btnAtivo : btnInativo" style="white-space: nowrap;">Todos</button>
                <button @click="mudarAba('insumos')" :style="abaAtiva === 'insumos' ? btnAtivo : btnInativo" style="white-space: nowrap;">Insumos</button>
                <button @click="mudarAba('limpeza')" :style="abaAtiva === 'limpeza' ? btnAtivo : btnInativo" style="white-space: nowrap;">Limpeza</button>
                <button @click="mudarAba('sacolao')" :style="abaAtiva === 'sacolao' ? btnAtivo : btnInativo" style="white-space: nowrap;">Sacolão</button>
            </div>

            <div v-for="item in produtosFiltrados" :key="item.id" class="card" style="padding: 15px; background: #1A1A1A; border-left: 3px solid #444; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <strong style="color: white; font-size: 1.1rem; display: block;">{{ item.nome }}</strong>
                        <span style="background: #333; color: #FFF; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-right: 5px;">{{ item.grupo || 'Outros' }}</span>
                        <small style="color: var(--cor-primaria);">Rota: {{ item.local }}</small><br>
                        
                        <small v-if="item.categoria !== 'limpeza'" style="color: #888;">Meta: {{ item.estoqueIdeal }} {{ item.undContagem }}</small>
                        <small v-else style="color: #888;">Produto de Checklist</small>
                    </div>
                    
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <button @click="abrirParaEditar(item)" style="background: none; border: none; color: #00B0FF; font-size: 1.2rem; cursor: pointer; padding: 5px;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <div style="width: 1px; height: 20px; background: #444;"></div>
                        <button @click="tentaRemoverProduto(item.id, item.nome)" style="background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer; padding: 5px;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="produtosFiltrados.length === 0" style="text-align: center; color: #666; padding: 20px; font-style: italic;">
                Nenhum produto encontrado nesta categoria.
            </div>
        </div>

    </div>
    `,
    data() {
        return {
            modoFormulario: false,
            produtoEditando: null, 
            abaAtiva: 'todos',
            btnAtivo: 'background: #00C853; color: #121212; border: none; padding: 8px 12px; border-radius: 8px; font-weight: bold; transition: 0.2s;',
            btnInativo: 'background: #222; color: #888; border: 1px solid #444; padding: 8px 12px; border-radius: 8px; font-weight: bold; transition: 0.2s;',
            
            formPadrao: {
                nome: '', categoria: 'insumos', local: '', grupo: 'Seco', undContagem: '', estoqueIdeal: '', 
                apenasNome: false, undCompra: '', fator: 1
            },
            form: {}
        };
    },
    computed: {
        produtosFiltrados() {
            if (this.abaAtiva === 'todos') return this.$root.bancoProdutos;
            return this.$root.bancoProdutos.filter(p => p.categoria === this.abaAtiva);
        }
    },
    mounted() {
        if (!document.getElementById('css-produtos')) {
            const style = document.createElement('style'); style.id = 'css-produtos';
            style.innerHTML = `.input-dark { width: 100%; padding: 12px; background: #2C2C2C; border: none; border-radius: 5px; color: white; box-sizing: border-box; }`;
            document.head.appendChild(style);
        }
        if (this.$root.rotasSalvas.length > 0) {
            this.formPadrao.local = this.$root.rotasSalvas[0];
        }
        this.form = JSON.parse(JSON.stringify(this.formPadrao));
    },
    methods: {
        voltar() {
            this.$root.vibrar(30);
            if (this.modoFormulario) { this.fecharFormulario(); } 
            else { this.$root.mudarTela('tela-ajustes'); }
        },
        mudarAba(aba) { this.$root.vibrar(15); this.abaAtiva = aba; },
        abrirParaNovo() {
            this.$root.vibrar(30);
            this.produtoEditando = null;
            this.form = JSON.parse(JSON.stringify(this.formPadrao));
            this.modoFormulario = true;
            window.scrollTo(0, 0);
        },
        abrirParaEditar(produto) {
            this.$root.vibrar(30);
            this.produtoEditando = produto.id;
            this.form = JSON.parse(JSON.stringify(produto));
            if (!this.form.grupo) this.form.grupo = 'Seco'; 
            this.modoFormulario = true;
            window.scrollTo(0, 0);
        },
        fecharFormulario() { this.$root.vibrar(30); this.modoFormulario = false; },
        
        salvarProduto() {
            this.$root.vibrar(30);
            
            // 🟢 VALIDAÇÃO INTELIGENTE (Ignora os campos matemáticos se for Limpeza)
            if (!this.form.nome || !this.form.local) {
                this.$root.vibrar([100, 50, 100]);
                Swal.fire({ icon: 'warning', title: 'Campos Vazios', text: 'Preencha o Nome e a Rota do produto.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            if (this.form.categoria !== 'limpeza' && (!this.form.undContagem || !this.form.estoqueIdeal)) {
                this.$root.vibrar([100, 50, 100]);
                Swal.fire({ icon: 'warning', title: 'Campos Matemáticos', text: 'Para Insumos ou Sacolão, é obrigatório preencher a Unidade de Contagem e a Meta Ideal.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            this.$root.autorizarAcao('adicionar', () => {
                
                // Se for limpeza, força o "apenas nome" para garantir que vai limpo para o WhatsApp
                if (this.form.categoria === 'limpeza') {
                    this.form.apenasNome = true;
                    this.form.undContagem = '';
                    this.form.estoqueIdeal = '';
                }

                if (this.form.apenasNome) {
                    this.form.undCompra = '';
                    this.form.fator = 1;
                }

                if (this.produtoEditando) {
                    const index = this.$root.bancoProdutos.findIndex(p => p.id === this.produtoEditando);
                    if (index !== -1) {
                        this.$root.bancoProdutos[index] = { ...this.form, id: this.produtoEditando };
                        this.$root.registrarHistorico('Produto Editado', 'Cardápio', `O item "${this.form.nome}" foi atualizado.`);
                    }
                } else {
                    const novoProduto = { ...this.form, id: Date.now(), emEstoque: '' };
                    this.$root.bancoProdutos.push(novoProduto);
                    this.$root.registrarHistorico('Produto Criado', 'Cardápio', `O item "${this.form.nome}" foi adicionado.`);
                }

                this.$root.salvarMemoriaLocal();
                this.$root.vibrar([50, 50, 50]);
                Swal.fire({ icon: 'success', title: 'Salvo com Sucesso!', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
                this.fecharFormulario();
            });
        },

        tentaRemoverProduto(idProduto, nomeProduto) {
            this.$root.vibrar(30);
            this.$root.autorizarAcao('remover', () => {
                Swal.fire({
                    title: 'Apagar Produto?', text: `Deseja excluir "${nomeProduto}" permanentemente da loja?`, icon: 'warning',
                    showCancelButton: true, confirmButtonColor: '#FF5252', cancelButtonColor: '#444', confirmButtonText: 'Sim, Apagar', cancelButtonText: 'Cancelar', background: '#1E1E1E', color: '#FFF'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.$root.bancoProdutos = this.$root.bancoProdutos.filter(p => p.id !== idProduto);
                        this.$root.registrarHistorico('Produto Apagado', 'Cardápio', `O item "${nomeProduto}" foi excluído.`);
                        this.$root.salvarMemoriaLocal();
                        this.$root.vibrar([50, 50, 50]);
                        Swal.fire({ icon: 'success', title: 'Apagado!', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
                    }
                });
            });
        }
    }
});
