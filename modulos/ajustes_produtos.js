// INÍCIO DO ARQUIVO modulos/ajustes_produtos.js - v0.0.72
Vue.component('tela-ajustes-produtos', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom:100px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
            <h2 style="margin:0;color:#00C853;">📦 Produtos</h2>
            <button @click="voltar" style="background:none;border:none;color:var(--text-sec);font-size:1.5rem;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div v-if="modo==='unico'" class="card" style="border-left:3px solid #00C853;border-top:3px solid #00C853;">
            <h3 style="color:white;margin-top:0;">{{produtoEditando?'Editar':'Novo'}} Produto</h3>
            <label class="label-ia">Nome do Item</label>
            <input type="text" v-model="form.nome" class="input-dark" style="margin-bottom:15px;" />

            <div class="grid-dupla" style="margin-bottom:15px;">
                <div><label class="label-ia">Módulo</label>
                <select v-model="form.categoria" class="input-dark"><option value="insumos">Insumos</option><option value="sacolao">Sacolão</option><option value="limpeza">Limpeza</option></select></div>
                <div><label class="label-ia">Rota</label>
                <select v-model="form.local" class="input-dark"><option v-for="r in $root.rotasSalvas" :value="r">{{r}}</option></select></div>
            </div>

            <div v-if="form.categoria!=='limpeza'">
                <label class="label-ia">Como conto?</label>
                <input type="text" v-model="form.undContagem" class="input-dark" style="margin-bottom:15px;" />
                <label class="check-caixa"><input type="checkbox" v-model="form.apenasNome"><span>Apenas nome (Sem caixas)</span></label>
                <div v-if="!form.apenasNome" class="caixa-destaque">
                    <div class="grid-dupla">
                        <div><label class="label-ia">Como peço?</label><input type="text" v-model="form.undCompra" class="input-dark" /></div>
                        <div><label class="label-ia">Fator</label><input type="number" v-model.number="form.fator" class="input-dark" /></div>
                    </div>
                </div>
                <label class="check-caixa" style="border-color:#FFAB00;color:#FFAB00;"><input type="checkbox" v-model="form.isSazonal"><span>🍕 Ingrediente Sazonal</span></label>
                <div v-if="form.isSazonal" class="caixa-destaque" style="border-color:#FFAB00;background:rgba(255,171,0,0.1);">
                    <label class="label-ia" style="color:#FFAB00;">Nome da Pizza Sazonal</label><input type="text" v-model="form.nomePizza" class="input-dark" style="margin-bottom:10px;" />
                    <label class="label-ia" style="color:#FFAB00;">Dias no Cardápio</label><input type="number" v-model.number="form.diasSazonal" class="input-dark" />
                </div>
            </div>
            
            <div v-else style="background:rgba(41,98,255,0.1);padding:15px;border-radius:8px;border:1px dashed #2962FF;margin-bottom:15px;text-align:center;">
                <i class="fas fa-broom" style="color:#2962FF;font-size:2rem;margin-bottom:10px;"></i>
                <p style="color:#82B1FF;margin:0;font-size:0.9rem;">Itens de limpeza são diretos. Indique apenas o nome e a rota. Eles aparecerão na lista final como uma caixa de seleção para serem encomendados!</p>
            </div>

            <button class="btn" style="background:#00C853;color:#121212;" @click="salvarUnico">SALVAR</button>
        </div>

        <div v-if="modo==='massa'" class="animate__animated animate__fadeIn">
            <div class="card" style="border-top:4px solid #00B0FF;padding:15px;">
                <p style="color:#82B1FF;font-size:0.85rem;margin-top:0;margin-bottom:15px;"><i class="fas fa-info-circle"></i> Adicionar vários de uma vez.</p>
                
                <div v-for="(item, idx) in listaMassa" :key="idx" style="background:#111;padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid #333;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                        <span style="color:#00B0FF;font-weight:bold;">Item #{{idx+1}}</span>
                        <button @click="removerDaMassa(idx)" style="background:none;border:none;color:#FF5252;font-size:1.2rem;"><i class="fas fa-times-circle"></i></button>
                    </div>

                    <input type="text" v-model="item.nome" placeholder="Nome do Produto" class="input-dark" style="margin-bottom:10px;" />
                    
                    <div class="grid-dupla" style="margin-bottom:10px;">
                        <select v-model="item.local" class="input-dark"><option value="">Rota</option><option v-for="r in $root.rotasSalvas" :value="r">{{r}}</option></select>
                        <select v-model="item.categoria" class="input-dark"><option value="insumos">Insumos</option><option value="sacolao">Sacolão</option><option value="limpeza">Limpeza</option></select>
                    </div>

                    <div v-if="item.categoria!=='limpeza'">
                        <div class="grid-dupla" style="margin-bottom:10px;">
                            <input type="text" v-model="item.undContagem" placeholder="Como conto?" class="input-dark" />
                            <input type="text" v-model="item.undCompra" placeholder="Como peço?" class="input-dark" />
                        </div>
                        <div class="grid-dupla" style="margin-bottom:10px;">
                            <input type="number" v-model.number="item.fator" placeholder="Fator" class="input-dark" />
                            <label class="check-caixa" style="margin:0;font-size:0.8rem;border-color:#FFAB00;color:#FFAB00;justify-content:center;"><input type="checkbox" v-model="item.isSazonal"> É Sazonal?</label>
                        </div>
                        <div v-if="item.isSazonal" style="background:rgba(255,171,0,0.1);padding:10px;border-radius:5px;border:1px dashed #FFAB00;margin-top:10px;">
                            <input type="text" v-model="item.nomePizza" placeholder="Nome da Pizza" class="input-dark" style="margin-bottom:10px;" />
                            <input type="number" v-model.number="item.diasSazonal" placeholder="Dias" class="input-dark" />
                        </div>
                    </div>
                    
                    <div v-else style="margin-bottom:10px;color:#82B1FF;font-size:0.85rem;text-align:center;background:rgba(41,98,255,0.1);padding:10px;border-radius:5px;">
                        <i class="fas fa-broom"></i> Apenas o Nome e Rota serão usados.
                    </div>
                </div>
                
                <button @click="novaLinhaMassa" style="width:100%;padding:12px;background:#222;color:#00B0FF;border:1px dashed #00B0FF;border-radius:8px;font-weight:bold;margin-bottom:15px;">+ ADICIONAR OUTRA LINHA</button>
                <button @click="salvarMassa" class="btn" style="background:#00C853;color:#121212;">SALVAR TUDO ({{listaMassa.length}})</button>
            </div>
        </div>

        <div v-if="modo==='lista'">
            <div class="grid-dupla" style="margin-bottom:20px;">
                <button class="btn" style="background:#00C853;color:#121212;" @click="abrirUnico">+ Um Produto</button>
                <button class="btn" style="background:#00B0FF;color:#121212;" @click="abrirMassa">++ Vários</button>
            </div>
            <div v-for="p in $root.bancoProdutos" :key="p.id" class="card" style="padding:12px;display:flex;justify-content:space-between;align-items:center;border-left:3px solid #444;">
                <div>
                    <strong style="color:white;">{{p.nome}}</strong><span v-if="p.sazonal&&p.sazonal.ativa" style="background:#FFAB00;color:#121212;font-size:0.65rem;font-weight:bold;padding:2px 6px;border-radius:4px;margin-left:5px;">Sazonal</span><br>
                    <small style="color:#888;">{{p.local}} | {{p.categoria}}</small>
                </div>
                <div style="display:flex;gap:15px;"><button @click="editar(p)" style="background:none;border:none;color:#00B0FF;"><i class="fas fa-edit"></i></button><button @click="apagar(p.id, p.nome)" style="background:none;border:none;color:#FF5252;"><i class="fas fa-trash"></i></button></div>
            </div>
        </div>
    </div>
    `,
    data() { return { modo: 'lista', produtoEditando: null, form: { nome: '', local: '', categoria: 'insumos', undContagem: '', estoqueIdeal: 10, apenasNome: false, undCompra: '', fator: 1, isSazonal: false, nomePizza: '', diasSazonal: 30 }, listaMassa: [] }; },
    mounted() {
        if (!document.getElementById('css-produtos-fix')) {
            const style = document.createElement('style'); style.id = 'css-produtos-fix';
            style.innerHTML = `
                .grid-dupla { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; box-sizing: border-box; }
                .input-dark { width: 100% !important; padding: 12px !important; background: #2C2C2C !important; border: 1px solid #444 !important; border-radius: 5px !important; color: white !important; box-sizing: border-box !important; font-size: 1rem !important; margin: 0 !important; min-width: 0 !important; }
                .input-dark:focus { outline: none; border-color: var(--cor-primaria) !important; }
                .label-ia { color: #82B1FF; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; display: block; }
                .check-caixa { display: flex; align-items: center; gap: 10px; color: #FFF; background: #222; padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #444; cursor: pointer; box-sizing: border-box; width: 100%; }
                .caixa-destaque { background: rgba(0, 200, 83, 0.1); padding: 15px; border-radius: 8px; border: 1px dashed #00C853; margin-bottom: 15px; box-sizing: border-box; width: 100%; }
            `;
            document.head.appendChild(style);
        }
    },
    methods: {
        voltar() { if (this.modo !== 'lista') this.modo = 'lista'; else this.$root.mudarTela('tela-ajustes'); },
        abrirUnico() { this.produtoEditando = null; this.form = { nome: '', local: this.$root.rotasSalvas[0]||'', categoria: 'insumos', undContagem: '', estoqueIdeal: 10, apenasNome: false, undCompra: '', fator: 1, isSazonal: false, nomePizza: '', diasSazonal: 30 }; this.modo = 'unico'; },
        abrirMassa() { this.listaMassa = [{ nome: '', local: this.$root.rotasSalvas[0]||'', categoria: 'insumos', undContagem: '', undCompra: '', fator: 1, isSazonal: false, nomePizza: '', diasSazonal: 30 }]; this.modo = 'massa'; },
        novaLinhaMassa() { this.listaMassa.push({ nome: '', local: this.$root.rotasSalvas[0]||'', categoria: 'insumos', undContagem: '', undCompra: '', fator: 1, isSazonal: false, nomePizza: '', diasSazonal: 30 }); },
        removerDaMassa(idx) { if (this.listaMassa.length > 1) this.listaMassa.splice(idx, 1); },
        editar(p) { this.produtoEditando = p.id; this.form = JSON.parse(JSON.stringify(p)); if (!this.form.sazonal) this.form.sazonal = { ativa: false }; this.form.isSazonal = this.form.sazonal.ativa; this.form.nomePizza = this.form.sazonal.nomePizza || ''; this.form.diasSazonal = 30; this.modo = 'unico'; },
        salvarUnico() {
            if (!this.form.nome || !this.form.local) return;
            this.$root.autorizarAcao('adicionar', () => {
                let p = { ...this.form };
                // 🟢 Sistema força a simplicidade para itens de Limpeza
                if(p.categoria === 'limpeza') { p.apenasNome = true; p.undContagem = ''; p.undCompra = ''; p.fator = 1; p.isSazonal = false; }
                
                let sazonalObj = { ativa: false };
                if (p.isSazonal && p.nomePizza && p.diasSazonal) { let d = new Date(); d.setDate(d.getDate() + Number(p.diasSazonal)); sazonalObj = { ativa: true, nomePizza: p.nomePizza, dataExpiracao: d.toISOString() }; }
                
                if (this.produtoEditando) { const idx = this.$root.bancoProdutos.findIndex(x => x.id === this.produtoEditando); this.$root.bancoProdutos[idx] = { ...p, sazonal: sazonalObj }; } 
                else { this.$root.bancoProdutos.push({ ...p, sazonal: sazonalObj, id: Date.now() }); }
                this.$root.salvarMemoriaLocal(); this.modo = 'lista'; Swal.fire({ icon: 'success', title: 'Salvo!', timer: 1000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
            });
        },
        salvarMassa() {
            this.$root.autorizarAcao('adicionar', () => {
                const validos = this.listaMassa.filter(x => x.nome.trim() !== '');
                validos.forEach(item => {
                    let isLimp = item.categoria === 'limpeza';
                    let sazonalObj = { ativa: false };
                    if (!isLimp && item.isSazonal && item.nomePizza && item.diasSazonal) { let d = new Date(); d.setDate(d.getDate() + Number(item.diasSazonal)); sazonalObj = { ativa: true, nomePizza: item.nomePizza, dataExpiracao: d.toISOString() }; }
                    
                    this.$root.bancoProdutos.push({ 
                        nome: item.nome, local: item.local, categoria: item.categoria, 
                        undContagem: isLimp?'':item.undContagem, undCompra: isLimp?'':item.undCompra, 
                        fator: isLimp?1:(item.fator||1), id: Date.now() + Math.random(), 
                        estoqueIdeal: 10, apenasNome: isLimp?true:(item.undCompra===''), 
                        sazonal: sazonalObj 
                    });
                });
                this.$root.salvarMemoriaLocal(); this.modo = 'lista'; Swal.fire({ icon: 'success', title: 'Salvos!', background: '#1E1E1E', color: '#FFF' });
            });
        },
        apagar(id, nome) {
            this.$root.autorizarAcao('remover', () => {
                Swal.fire({ title: 'Apagar ' + nome + '?', showCancelButton: true, confirmButtonColor: '#FF5252', background: '#1E1E1E', color: '#FFF' }).then(r => {
                    if (r.isConfirmed) { this.$root.bancoProdutos = this.$root.bancoProdutos.filter(x => x.id !== id); this.$root.salvarMemoriaLocal(); }
                });
            });
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_produtos.js
