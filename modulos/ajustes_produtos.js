// modulos/ajustes_produtos.js - Gestão de Produtos v0.0.55

Vue.component('tela-ajustes-produtos', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #00C853;">📦 Produtos</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div v-if="modo === 'unico'" class="card animate__animated animate__fadeInDown" style="border-left: 3px solid #00C853; border-top: 3px solid #00C853;">
            <h3 style="color: white; margin-top: 0;">{{ produtoEditando ? 'Editar' : 'Novo' }} Produto</h3>
            
            <label class="label-ia">Nome do Item</label>
            <input type="text" v-model="form.nome" placeholder="Ex: Bacon" class="input-dark" />

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
                <div>
                    <label class="label-ia">Módulo</label>
                    <select v-model="form.categoria" class="input-dark">
                        <option value="insumos">📦 Insumos</option>
                        <option value="sacolao">🥬 Sacolão</option>
                        <option value="limpeza">🧹 Limpeza</option>
                    </select>
                </div>
                <div>
                    <label class="label-ia">Rota</label>
                    <select v-model="form.local" class="input-dark">
                        <option v-for="r in $root.rotasSalvas" :value="r">{{ r }}</option>
                    </select>
                </div>
            </div>

            <label class="label-ia">Unidade de Contagem (Como conto?)</label>
            <input type="text" v-model="form.undContagem" placeholder="Ex: kg, fatias" class="input-dark" style="margin-bottom:15px;" />

            <label style="display: flex; align-items: center; gap: 10px; color: #FFF; background: #222; padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #444; cursor: pointer;">
                <input type="checkbox" v-model="form.apenasNome" style="transform: scale(1.3);">
                <span>Pedir apenas o nome (Sem caixas)</span>
            </label>

            <div v-if="!form.apenasNome" style="background: rgba(0, 200, 83, 0.1); padding: 15px; border-radius: 8px; border: 1px dashed #00C853; margin-bottom: 15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <label class="label-ia">Unidade Compra</label>
                        <input type="text" v-model="form.undCompra" placeholder="Ex: Caixas" class="input-dark" />
                    </div>
                    <div>
                        <label class="label-ia">Fator (Vem quantos?)</label>
                        <input type="number" v-model.number="form.fator" class="input-dark" />
                    </div>
                </div>
            </div>

            <button class="btn" style="background: #00C853; color: #121212;" @click="salvarUnico">SALVAR</button>
        </div>

        <div v-if="modo === 'massa'" class="animate__animated animate__fadeIn">
            <div class="card" style="border-top: 4px solid #00B0FF; padding: 10px;">
                <p style="color: #82B1FF; font-size: 0.85rem; margin-bottom: 10px;"><i class="fas fa-info-circle"></i> Preencha a lista e salve tudo de uma vez.</p>
                
                <div v-for="(item, idx) in listaMassa" :key="idx" style="background: #111; padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid #333;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="color: #00B0FF; font-weight: bold;">Item #{{ idx + 1 }}</span>
                        <button @click="removerDaMassa(idx)" style="background:none; border:none; color:#FF5252;"><i class="fas fa-times"></i></button>
                    </div>

                    <input type="text" v-model="item.nome" placeholder="Nome do Produto" class="input-dark" style="margin-bottom: 10px;" />
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <select v-model="item.local" class="input-dark">
                            <option value="">Selecione a Rota</option>
                            <option v-for="r in $root.rotasSalvas" :value="r">{{ r }}</option>
                        </select>
                        <select v-model="item.categoria" class="input-dark">
                            <option value="insumos">Insumos</option>
                            <option value="sacolao">Sacolão</option>
                            <option value="limpeza">Limpeza</option>
                        </select>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <input type="text" v-model="item.undContagem" placeholder="Como conto? (kg)" class="input-dark" />
                        <input type="text" v-model="item.undCompra" placeholder="Como peço? (Cx)" class="input-dark" />
                    </div>
                </div>

                <button @click="novaLinhaMassa" style="width: 100%; padding: 12px; background: #222; color: #00B0FF; border: 1px dashed #00B0FF; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 15px;">
                    + ADICIONAR OUTRA LINHA
                </button>

                <button @click="salvarMassa" class="btn" style="background: #00C853; color: #121212;">
                    CONCLUIR E SALVAR TUDO ({{ listaMassa.length }})
                </button>
            </div>
        </div>

        <div v-if="modo === 'lista'">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <button class="btn" style="background: #00C853; color: #121212; padding: 12px;" @click="abrirUnico">
                    <i class="fas fa-plus"></i> + Um
                </button>
                <button class="btn" style="background: #00B0FF; color: #121212; padding: 12px;" @click="abrirMassa">
                    <i class="fas fa-layer-group"></i> ++ Vários
                </button>
            </div>

            <div v-for="p in $root.bancoProdutos" :key="p.id" class="card" style="padding: 12px; display: flex; justify-content: space-between; align-items: center; border-left: 3px solid #444;">
                <div>
                    <strong style="color: white;">{{ p.nome }}</strong><br>
                    <small style="color: #888;">{{ p.local }} | {{ p.categoria }}</small>
                </div>
                <div style="display: flex; gap: 15px;">
                    <button @click="editar(p)" style="background:none; border:none; color:#00B0FF;"><i class="fas fa-edit"></i></button>
                    <button @click="apagar(p.id, p.nome)" style="background:none; border:none; color:#FF5252;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>

    </div>
    `,
    data() {
        return {
            modo: 'lista', // lista, unico, massa
            produtoEditando: null,
            form: { nome: '', local: '', categoria: 'insumos', undContagem: '', estoqueIdeal: 10, apenasNome: false, undCompra: '', fator: 1 },
            listaMassa: []
        };
    },
    methods: {
        voltar() { 
            if (this.modo !== 'lista') { this.modo = 'lista'; } 
            else { this.$root.mudarTela('tela-ajustes'); }
        },
        abrirUnico() { 
            this.produtoEditando = null; 
            this.form = { nome: '', local: this.$root.rotasSalvas[0], categoria: 'insumos', undContagem: '', estoqueIdeal: 10, apenasNome: false, undCompra: '', fator: 1 };
            this.modo = 'unico'; 
        },
        abrirMassa() {
            this.listaMassa = [{ nome: '', local: this.$root.rotasSalvas[0], categoria: 'insumos', undContagem: '', undCompra: '', fator: 1 }];
            this.modo = 'massa';
        },
        novaLinhaMassa() {
            this.listaMassa.push({ nome: '', local: this.$root.rotasSalvas[0], categoria: 'insumos', undContagem: '', undCompra: '', fator: 1 });
        },
        removerDaMassa(idx) {
            if (this.listaMassa.length > 1) this.listaMassa.splice(idx, 1);
        },
        editar(p) {
            this.produtoEditando = p.id;
            this.form = JSON.parse(JSON.stringify(p));
            this.modo = 'unico';
        },
        salvarUnico() {
            if (!this.form.nome || !this.form.local) return;
            this.$root.autorizarAcao('adicionar', () => {
                if (this.produtoEditando) {
                    const idx = this.$root.bancoProdutos.findIndex(x => x.id === this.produtoEditando);
                    this.$root.bancoProdutos[idx] = { ...this.form };
                } else {
                    this.$root.bancoProdutos.push({ ...this.form, id: Date.now() });
                }
                this.$root.salvarMemoriaLocal();
                this.modo = 'lista';
                Swal.fire({ icon: 'success', title: 'Salvo!', timer: 1000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
            });
        },
        salvarMassa() {
            this.$root.autorizarAcao('adicionar', () => {
                const validos = this.listaMassa.filter(x => x.nome.trim() !== '');
                validos.forEach(item => {
                    this.$root.bancoProdutos.push({
                        ...item,
                        id: Date.now() + Math.random(),
                        estoqueIdeal: 10,
                        apenasNome: item.undCompra === '' ? true : false,
                        fator: 1
                    });
                });
                this.$root.salvarMemoriaLocal();
                this.modo = 'lista';
                Swal.fire({ icon: 'success', title: `${validos.length} Itens Salvos!`, background: '#1E1E1E', color: '#FFF' });
            });
        },
        apagar(id, nome) {
            this.$root.autorizarAcao('remover', () => {
                Swal.fire({
                    title: 'Apagar ' + nome + '?',
                    showCancelButton: true, confirmButtonColor: '#FF5252', background: '#1E1E1E', color: '#FFF'
                }).then(r => {
                    if (r.isConfirmed) {
                        this.$root.bancoProdutos = this.$root.bancoProdutos.filter(x => x.id !== id);
                        this.$root.salvarMemoriaLocal();
                    }
                });
            });
        }
    }
});
