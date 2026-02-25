Vue.component('tela-gestao-produtos', {
    template: `
    <div class="container animate__animated animate__fadeInRight">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #00E676;"><i class="fas fa-boxes"></i> Gestão de Produtos</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #00E676; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;">Adicionar Novo Produto</h4>
            <div class="form-grupo">
                <label>Tipo de Produto</label>
                <select v-model="tipoProduto" class="input-dark">
                    <option value="insumo">Insumo</option>
                    <option value="limpeza">Produto de Limpeza</option>
                </select>
            </div>

            <div v-if="tipoProduto === 'insumo'">
                <div class="form-grupo">
                    <label>Nome do Insumo</label>
                    <input type="text" v-model="novoInsumo.nome" class="input-dark">
                </div>
                <div class="form-grupo">
                    <label>Local de Armazenamento</label>
                    <div style="display: flex; gap: 10px;">
                        <select v-model="novoInsumo.local" class="input-dark" style="flex: 1;">
                            <option value="" disabled>Selecione um local...</option>
                            <option v-for="rota in $root.rotasSalvas" :key="rota.nome || rota" :value="rota.nome || rota">
                                {{ rota.nome || rota }}
                            </option>
                        </select>
                        <button @click="criarNovaRota" class="btn" style="width: auto; padding: 0 15px; background: #333; color: #00E676;"><i class="fas fa-plus"></i></button>
                    </div>
                    <div v-if="!$root.rotasSalvas || $root.rotasSalvas.length === 0" style="color: #FFAB00; font-size: 0.8rem; margin-top: 5px; display: flex; align-items: center; gap: 5px;">
                        <i class="fas fa-exclamation-triangle"></i> Nenhuma rota encontrada. Clique no (+) para criar.
                    </div>
                </div>
                <div class="form-grupo-inline">
                    <div class="form-grupo">
                        <label>Meta</label>
                        <input type="number" v-model.number="novoInsumo.meta" class="input-dark">
                    </div>
                    <div class="form-grupo">
                        <label>Fator</label>
                        <input type="number" v-model.number="novoInsumo.fator" class="input-dark">
                    </div>
                </div>
                <div class="form-grupo-inline">
                    <div class="form-grupo">
                        <label>Como Conto</label>
                        <select v-model="novoInsumo.comoConto" class="input-dark">
                            <option>Unidade</option>
                            <option>Pacote</option>
                            <option>Kg</option>
                            <option>Litro</option>
                        </select>
                    </div>
                    <div class="form-grupo">
                        <label>Como Peço</label>
                        <select v-model="novoInsumo.comoPeco" class="input-dark">
                            <option>Caixa</option>
                            <option>Fardo</option>
                            <option>Kg</option>
                            <option>Litro</option>
                            <option>Galão</option>
                        </select>
                    </div>
                </div>

                <!-- Configurações Avançadas de Conversão -->
                <div style="background: #222; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px dashed #444;">
                    <h5 style="margin: 0 0 10px 0; color: #AAA;">Configurações Avançadas</h5>
                    
                    <div class="form-grupo-inline">
                        <div class="form-grupo">
                            <label>Estoque Mínimo (na Loja)</label>
                            <input type="number" v-model.number="novoInsumo.estoqueMinimo" class="input-dark" placeholder="Ex: 30">
                        </div>
                        <div class="form-grupo">
                            <label>Qtd por Embalagem</label>
                            <input type="number" v-model.number="novoInsumo.qtdEmbalagem" class="input-dark" placeholder="Ex: 20 un/cx">
                        </div>
                    </div>
                    <div class="form-grupo">
                        <label>Peso Unitário (se contar un e pedir kg)</label>
                        <input type="number" v-model.number="novoInsumo.pesoUnitario" class="input-dark" placeholder="Ex: 0.5 (500g)">
                    </div>

                    <div style="margin-top: 10px;">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: #FFF;">
                            <input type="checkbox" v-model="novoInsumo.pedirSoNome" style="transform: scale(1.2);">
                            Pedir apenas pelo nome (WhatsApp)
                        </label>
                        <p style="font-size: 0.75rem; color: #666; margin: 5px 0 0 25px;">Ex: "Comprar Bacon" (sem quantidade específica).</p>
                    </div>
                </div>

                <!-- Configuração Sazonal -->
                <div style="background: rgba(255, 171, 0, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #FFAB00;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: #FFAB00; font-weight: bold; margin-bottom: 10px;">
                        <input type="checkbox" v-model="novoInsumo.sazonal" style="transform: scale(1.2);">
                        Produto Sazonal / Temporário
                    </label>
                    
                    <div v-if="novoInsumo.sazonal" class="animate__animated animate__fadeIn">
                        <div class="form-grupo">
                            <label>Válido Até</label>
                            <input type="date" v-model="novoInsumo.validadeSazonal" class="input-dark">
                        </div>
                        <div class="form-grupo">
                            <label>Contexto (Nome da Pizza/Prato)</label>
                            <input type="text" v-model="novoInsumo.contextoSazonal" class="input-dark" placeholder="Ex: Pizza de Natal">
                        </div>
                        <p style="font-size: 0.8rem; color: #AAA; margin-top: 5px;">
                            <i class="fas fa-info-circle"></i> Após a data, um aviso aparecerá no Mural perguntando se o produto deve ser mantido.
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="tipoProduto === 'limpeza'">
                <div class="form-grupo">
                    <label>Nome do Produto de Limpeza</label>
                    <input type="text" v-model="novoLimpeza.nome" class="input-dark">
                </div>
            </div>

            <button v-if="editandoIndex === null" @click="adicionarProduto" class="btn" style="background: #00E676; color: #121212; width: 100%; height: 50px;"><i class="fas fa-plus"></i> ADICIONAR À LISTA</button>
            <div v-else style="display: flex; gap: 10px;">
                <button @click="salvarEdicao" class="btn" style="background: #FFAB00; color: #121212; flex: 1; height: 50px;"><i class="fas fa-save"></i> ATUALIZAR PRODUTO</button>
                <button @click="cancelarEdicao" class="btn" style="background: #333; color: white; width: 100px; height: 50px;">CANCELAR</button>
            </div>
            <p v-if="lote.length === 0 && editandoIndex === null" style="text-align: center; color: #666; font-size: 0.8rem; margin-top: 10px;">
                <i class="fas fa-info-circle"></i> Dica: Você pode adicionar vários produtos à lista antes de salvar.
            </p>
        </div>

        <div v-if="lote.length > 0" class="card" style="padding: 25px; border-top: 5px solid #00B0FF; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;">Produtos a Serem Adicionados</h4>
            <div v-for="(p, i) in lote" :key="i" class="item-produto">
                <div style="flex: 1;">
                    <strong style="color: white;">{{ p.nome }}</strong>
                    <div style="color: #888; font-size: 0.8rem;">{{ p.tipo === 'insumo' ? 'Insumo - ' + p.local : 'Limpeza' }}</div>
                </div>
                <button @click="removerDoLote(i)" class="btn-delete-aviso"><i class="fas fa-times"></i></button>
            </div>
            <button @click="salvarLote" class="btn" style="background: #00B0FF; color: #121212; width: 100%; height: 50px; margin-top: 20px;"><i class="fas fa-save"></i> SALVAR LOTE NO BANCO DE DADOS</button>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #888; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;">Produtos Cadastrados</h4>
            <input type="text" v-model="filtroProdutos" placeholder="Buscar produto..." class="input-dark" style="margin-bottom: 15px;">
            
            <div v-if="produtosSelecionados.length > 0" style="margin-bottom: 15px;">
                <button @click="removerSelecionados" class="btn" style="background: #FF5252; color: white; height: 40px;">
                    <i class="fas fa-trash"></i> EXCLUIR {{ produtosSelecionados.length }} SELECIONADOS
                </button>
            </div>

            <div v-for="(p, i) in produtosFiltrados" :key="i" class="item-produto">
                <input type="checkbox" :value="p" v-model="produtosSelecionados" style="margin-right: 15px; transform: scale(1.5);">
                <div style="flex: 1;">
                    <strong style="color: white;">{{ p.nome }}</strong>
                    <div style="color: #888; font-size: 0.8rem;">{{ p.tipo === 'insumo' ? 'Insumo - ' + p.local : 'Limpeza' }}</div>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button @click="editarProduto(p)" class="btn-delete-aviso" style="background: #FFAB00; color: #121212;"><i class="fas fa-pencil-alt"></i></button>
                    <button @click="removerProduto(p)" class="btn-delete-aviso"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            tipoProduto: 'insumo',
            editandoIndex: null,
            novoInsumo: { 
                nome: '', 
                local: '', 
                meta: null, 
                fator: null, 
                comoConto: 'Unidade', 
                comoPeco: 'Caixa',
                // Novos Campos
                sazonal: false,
                validadeSazonal: '',
                contextoSazonal: '',
                pedirSoNome: false,
                estoqueMinimo: null,
                qtdEmbalagem: null,
                pesoUnitario: null
            },
            novoLimpeza: { nome: '' },
            filtroProdutos: '',
            lote: [],
            produtosSelecionados: []
        };
    },
    computed: {
        produtosFiltrados() {
            if (!this.filtroProdutos) {
                return this.$root.bancoProdutos;
            }
            const filtro = this.filtroProdutos.toLowerCase();
            return this.$root.bancoProdutos.filter(p => p.nome.toLowerCase().includes(filtro));
        }
    },
    methods: {
        criarNovaRota() {
            Swal.fire({
                title: 'Novo Local de Armazenamento',
                input: 'text',
                inputPlaceholder: 'Ex: Prateleira A, Geladeira 1...',
                showCancelButton: true,
                confirmButtonText: 'Criar',
                cancelButtonText: 'Cancelar',
                background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const novaRota = result.value.trim();
                    if (this.$root.rotasSalvas.some(r => r.nome.toLowerCase() === novaRota.toLowerCase())) {
                        return Swal.fire('Erro', 'Este local já existe.', 'error');
                    }
                    
                    this.$root.rotasSalvas.push({ nome: novaRota, ordem: this.$root.rotasSalvas.length });
                    db.collection('configuracoes').doc('rotas').set({ lista: this.$root.rotasSalvas });
                    
                    this.novoInsumo.local = novaRota;
                    Swal.fire('Sucesso', 'Novo local criado!', 'success');
                }
            });
        },
        adicionarProduto() {
            const produto = this.tipoProduto === 'insumo' ? { ...this.novoInsumo, tipo: 'insumo' } : { ...this.novoLimpeza, tipo: 'limpeza' };
            if (!produto.nome.trim()) {
                return Swal.fire('Atenção', 'O nome do produto é obrigatório.', 'warning');
            }

            if (this.isDuplicado(produto.nome) || this.lote.some(p => p.nome.toLowerCase() === produto.nome.toLowerCase())) {
                return Swal.fire('Produto Duplicado', 'Um produto com este nome já existe ou está na lista para ser adicionado.', 'error');
            }

            this.lote.push(produto);
            this.resetarFormularios();
        },
        resetarFormularios() {
            this.novoInsumo = { 
                nome: '', 
                local: '', 
                meta: null, 
                fator: null, 
                comoConto: 'Unidade', 
                comoPeco: 'Caixa',
                sazonal: false,
                validadeSazonal: '',
                contextoSazonal: '',
                pedirSoNome: false,
                estoqueMinimo: null,
                qtdEmbalagem: null,
                pesoUnitario: null
            };
            if (this.$root.rotasSalvas && this.$root.rotasSalvas.length > 0) {
                this.novoInsumo.local = this.$root.rotasSalvas[0].nome;
            }
            this.novoLimpeza = { nome: '' };
        },
        removerSelecionados() {
            if (this.produtosSelecionados.length === 0) return;

            Swal.fire({
                title: 'Confirmar Exclusão em Massa',
                text: `Deseja realmente remover ${this.produtosSelecionados.length} produtos selecionados?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sim, excluir tudo!',
                cancelButtonText: 'Cancelar',
                background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Remove os produtos selecionados da lista principal
                    this.$root.bancoProdutos = this.$root.bancoProdutos.filter(p => !this.produtosSelecionados.some(sel => sel.nome === p.nome && sel.tipo === p.tipo));
                    
                    db.collection('configuracoes').doc('bancoProdutos').set({ lista: this.$root.bancoProdutos });
                    
                    Swal.fire('Excluído!', `${this.produtosSelecionados.length} produtos foram removidos.`, 'success');
                    this.produtosSelecionados = [];
                }
            });
        },
        editarProduto(produto) {
            const index = this.$root.bancoProdutos.findIndex(p => p.nome === produto.nome && p.tipo === produto.tipo);
            if (index === -1) return;

            this.editandoIndex = index;
            this.tipoProduto = produto.tipo;
            
            if (produto.tipo === 'insumo') {
                this.novoInsumo = { ...produto };
            } else {
                this.novoLimpeza = { ...produto };
            }
            
            // Rola a página para o topo para ver o formulário
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        salvarEdicao() {
            if (this.editandoIndex === null) return;

            const produtoEditado = this.tipoProduto === 'insumo' ? { ...this.novoInsumo, tipo: 'insumo' } : { ...this.novoLimpeza, tipo: 'limpeza' };
            
            // Atualiza no array local
            this.$root.bancoProdutos.splice(this.editandoIndex, 1, produtoEditado);
            
            // Salva no Firebase
            db.collection('configuracoes').doc('bancoProdutos').set({ lista: this.$root.bancoProdutos });
            
            Swal.fire('Sucesso', 'Produto atualizado com sucesso!', 'success');
            this.cancelarEdicao();
        },
        cancelarEdicao() {
            this.editandoIndex = null;
            this.resetarFormularios();
        },
        removerProduto(produto) {
            Swal.fire({
                title: 'Confirmar Exclusão',
                text: `Deseja realmente remover o produto "${produto.nome}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar',
                background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    const index = this.$root.bancoProdutos.findIndex(p => p.nome === produto.nome && p.tipo === produto.tipo);
                    if (index > -1) {
                        this.$root.bancoProdutos.splice(index, 1);
                        db.collection('configuracoes').doc('bancoProdutos').set({ lista: this.$root.bancoProdutos });
                        Swal.fire('Excluído!', 'O produto foi removido.', 'success');
                    }
                }
            });
        },
        isDuplicado(nome) {
            const nomeNormalizado = nome.trim().toLowerCase();
            return this.$root.bancoProdutos.some(p => p.nome.toLowerCase() === nomeNormalizado);
        },
        removerDoLote(index) {
            this.lote.splice(index, 1);
        },
        salvarLote() {
            if (this.lote.length === 0) {
                return Swal.fire('Atenção', 'A lista de produtos está vazia.', 'warning');
            }

            this.$root.bancoProdutos.push(...this.lote);
            db.collection('configuracoes').doc('bancoProdutos').set({ lista: this.$root.bancoProdutos });
            Swal.fire('Sucesso!', `${this.lote.length} produtos foram adicionados.`, 'success');
            this.lote = [];
        }
    },
    mounted() {
        if (this.$root.rotasSalvas && this.$root.rotasSalvas.length > 0) {
            this.novoInsumo.local = this.$root.rotasSalvas[0].nome;
        }
        if (!document.getElementById('css-gestao-produtos')) {
            const style = document.createElement('style');
            style.id = 'css-gestao-produtos';
            style.innerHTML = `
                .item-produto { background: #1A1A1A; border-left: 4px solid #888; padding: 10px 15px; border-radius: 8px; margin-bottom: 8px; display: flex; align-items: center; }
            `;
            document.head.appendChild(style);
        }
    }
});
