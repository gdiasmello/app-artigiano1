/**
 * Gestão de Produtos ERP v2.12.0
 * Validação rigorosa e interface otimizada.
 */
Vue.component('tela-ajustes-produtos', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: var(--cor-primaria);"><i class="fas fa-boxes"></i> Gestor ERP</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <!-- Formulário de Cadastro -->
        <div class="card" style="padding: 25px; border-top: 5px solid var(--cor-primaria);">
            <h4 style="margin-top: 0; color: white; margin-bottom: 20px;"><i class="fas fa-plus-circle"></i> Novo Produto</h4>
            
            <div style="margin-bottom: 15px;">
                <label class="label-form">NOME DO PRODUTO</label>
                <input type="text" v-model="novo.nome" placeholder="Ex: Mussarela, Detergente..." class="input-dark">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label class="label-form">SETOR / CATEGORIA</label>
                    <select v-model="novo.categoria" class="input-dark">
                        <option value="Insumos">Insumos / Frios</option>
                        <option value="Sacolão">Sacolão</option>
                        <option value="Embalagens">Embalagens</option>
                        <option value="Limpeza">Limpeza</option>
                        <option value="Gelo">Gelo</option>
                    </select>
                </div>
                <div>
                    <label class="label-form">LOCAIS (ROTAS)</label>
                    <div style="background: #1A1A1A; border: 1px solid #333; border-radius: 8px; padding: 10px; max-height: 150px; overflow-y: auto;">
                        <div v-for="r in $root.rotasSalvas" :key="r" style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                            <input type="checkbox" :value="r" v-model="novo.rotas" style="width: 18px; height: 18px;">
                            <span style="color: white; font-size: 0.85rem;">{{ r }}</span>
                        </div>
                        <div v-if="$root.rotasSalvas.length === 0" style="color: #555; font-size: 0.8rem; text-align: center;">Nenhuma rota cadastrada</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label class="label-form">UNIDADE</label>
                    <select v-model="novo.unidade" class="input-dark">
                        <option value="">Apenas Nome (Checklist)</option>
                        <option value="un">Unidades (un)</option>
                        <option value="Cx">Caixas (Cx)</option>
                        <option value="Kg">Quilos (Kg)</option>
                        <option value="L">Litros (L)</option>
                        <option value="Pct">Pacotes (Pct)</option>
                    </select>
                </div>
                <div>
                    <label class="label-form">META DE ESTOQUE (MÍNIMO)</label>
                    <input type="number" v-model.number="novo.meta" placeholder="0" class="input-dark">
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button @click="salvarProduto" class="btn" style="flex: 1; background: var(--cor-primaria); color: #121212;">
                    <i class="fas fa-save"></i> CADASTRAR
                </button>
                <button @click="adicionarEmMassa" class="btn" style="flex: 1; background: #333; color: white; border: 1px solid #555;">
                    <i class="fas fa-layer-group"></i> EM MASSA
                </button>
            </div>
        </div>

        <!-- Lista de Produtos -->
        <h4 style="color: #666; margin-bottom: 15px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Catálogo Atual ({{ $root.bancoProdutos.length }})</h4>
        
        <div v-for="prod in produtosOrdenados" :key="prod.id" class="item-produto">
            <div style="flex: 1;">
                <strong style="color: white;">{{ prod.nome }}</strong>
                <div style="font-size: 0.75rem; color: #666; margin-top: 4px;">
                    {{ prod.categoria }} | 
                    <span v-if="prod.rotas && prod.rotas.length > 0" style="color: #9C27B0;">
                        <i class="fas fa-map-marker-alt"></i> {{ prod.rotas.join(', ') }} | 
                    </span>
                    Meta: <span style="color: var(--cor-primaria);">{{ prod.meta }} {{ prod.unidade }}</span>
                </div>
            </div>
            <button @click="removerProduto(prod.id)" class="btn-delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>

    </div>
    `,
    data() {
        return {
            novo: { nome: '', categoria: 'Insumos', unidade: 'un', meta: '', rotas: [] }
        };
    },
    computed: {
        produtosOrdenados() {
            return [...this.$root.bancoProdutos].sort((a, b) => a.nome.localeCompare(b.nome));
        }
    },
    methods: {
        salvarProduto() {
            // 🟢 Validação Rigorosa
            if (!this.novo.nome.trim()) {
                Swal.fire({ icon: 'error', title: 'Nome Obrigatório', background: '#1E1E1E' });
                return;
            }
            if (this.novo.meta === '' || this.novo.meta < 0) {
                Swal.fire({ icon: 'error', title: 'Meta Inválida', text: 'A meta deve ser zero ou maior.', background: '#1E1E1E' });
                return;
            }

            const produto = {
                id: Date.now().toString(),
                nome: this.novo.nome.trim(),
                categoria: this.novo.categoria,
                unidade: this.novo.unidade,
                meta: this.novo.meta,
                rotas: [...this.novo.rotas]
            };

            this.$root.bancoProdutos.push(produto);
            this.sincronizar();
            
            this.novo.nome = '';
            this.novo.meta = '';
            this.novo.rotas = [];
            this.$root.vibrar(30);
        },
        adicionarEmMassa() {
            Swal.fire({
                title: 'Adicionar em Massa',
                html: `
                    <p style="color:#CCC; font-size:0.9rem;">Cole a lista de nomes abaixo (um por linha).<br>Eles usarão a Categoria: <b>${this.novo.categoria}</b> e Unidade: <b>${this.novo.unidade}</b>.</p>
                    <textarea id="listaMassa" class="swal2-textarea" style="background:#333; color:white; height:200px;" placeholder="Ex:\nCoca Cola\nGuaraná\nFanta"></textarea>
                `,
                showCancelButton: true,
                confirmButtonText: 'Processar Lista',
                confirmButtonColor: 'var(--cor-primaria)',
                background: '#1E1E1E', color: '#FFF',
                preConfirm: () => {
                    return document.getElementById('listaMassa').value;
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const linhas = result.value.split('\n');
                    let count = 0;
                    
                    linhas.forEach(linha => {
                        const nome = linha.trim();
                        if (nome) {
                            const produto = {
                                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                                nome: nome,
                                categoria: this.novo.categoria,
                                unidade: this.novo.unidade,
                                meta: this.novo.meta || 0,
                                rotas: [...this.novo.rotas]
                            };
                            this.$root.bancoProdutos.push(produto);
                            count++;
                        }
                    });

                    if (count > 0) {
                        this.sincronizar();
                        Swal.fire('Sucesso!', `${count} produtos adicionados.`, 'success');
                    }
                }
            });
        },
        removerProduto(id) {
            this.$root.autorizarAcao('excluirItem', () => {
                Swal.fire({
                    title: 'Excluir Produto?',
                    text: "Esta ação não pode ser desfeita.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#FF5252',
                    background: '#1E1E1E', color: '#FFF'
                }).then((res) => {
                    if (res.isConfirmed) {
                        this.$root.bancoProdutos = this.$root.bancoProdutos.filter(p => p.id !== id);
                        this.sincronizar();
                    }
                });
            });
        },
        sincronizar() {
            db.collection("configuracoes").doc("bancoProdutos").set({ lista: this.$root.bancoProdutos }, { merge: true });
            this.$root.salvarMemoriaLocal();
        }
    },
    mounted() {
        if (!document.getElementById('css-produtos')) {
            const style = document.createElement('style');
            style.id = 'css-produtos';
            style.innerHTML = `
                .label-form { color: #888; font-size: 0.7rem; font-weight: 800; margin-bottom: 8px; display: block; }
                .item-produto { background: #1A1A1A; padding: 15px; border-radius: 10px; margin-bottom: 8px; display: flex; align-items: center; border: 1px solid #333; }
                .btn-delete { background: rgba(255,82,82,0.1); border: 1px solid var(--cor-erro); color: var(--cor-erro); width: 40px; height: 40px; border-radius: 8px; cursor: pointer; }
            `;
            document.head.appendChild(style);
        }
    }
});
