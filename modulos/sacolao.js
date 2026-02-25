/**
 * Sacolão v2.6.0
 * Gestão de vegetais e hortifrúti.
 */
Vue.component('tela-sacolao', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="margin: 0; color: var(--cor-sucesso);"><i class="fas fa-carrot"></i> Sacolão</h2>
        </div>

        <div v-if="produtosSacolao.length === 0" class="card" style="padding: 30px; text-align: center;">
            <i class="fas fa-leaf" style="font-size: 3rem; color: var(--cor-sucesso); margin-bottom: 15px;"></i>
            <h3 style="color: white; margin-top: 0;">Nenhum vegetal cadastrado!</h3>
            <button @click="$root.mudarTela('tela-ajustes-produtos')" class="btn" style="background: var(--cor-sucesso); color: white;">
                IR PARA CADASTRO ERP
            </button>
        </div>

        <div v-else>
            <!-- IA Memória -->
            <div v-if="sugestaoMemoria" class="animate__animated animate__fadeInDown" style="margin-bottom: 20px; background: rgba(255, 171, 0, 0.1); border: 1px solid var(--cor-primaria); padding: 15px; border-radius: 10px; display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-brain" style="color: var(--cor-primaria); font-size: 1.5rem;"></i>
                <div style="flex: 1;">
                    <strong style="color: var(--cor-primaria); display: block; font-size: 0.9rem;">IA MEMÓRIA:</strong>
                    <span style="color: #CCC; font-size: 0.8rem;">Baseado no histórico, você costuma pedir estes itens hoje.</span>
                </div>
            </div>

            <div v-for="grupo in produtosAgrupados" :key="grupo.rota">
                <div v-if="grupo.rota" style="margin: 20px 0 10px 0; display: flex; align-items: center; gap: 10px;">
                    <div style="height: 1px; flex: 1; background: #333;"></div>
                    <span style="color: #9C27B0; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                        <i class="fas fa-map-marker-alt"></i> {{ grupo.rota }}
                    </span>
                    <div style="height: 1px; flex: 1; background: #333;"></div>
                </div>

                <div class="card" style="padding: 20px; border-top: 5px solid var(--cor-sucesso); margin-bottom: 20px;">
                    <div v-for="prod in grupo.produtos" :key="prod.id + grupo.rota" class="item-estoque">
                        <div style="flex: 1;">
                            <strong style="color: white; font-size: 1.1rem; display: block;">{{ prod.nome }}</strong>
                            <span style="color: #888; font-size: 0.8rem;">Meta: {{ prod.meta }} {{ prod.unidade }}</span>
                        </div>
                        <input type="number" v-model.number="contagens[prod.id + '_' + grupo.rota]" placeholder="0" class="input-estoque">
                    </div>
                </div>
            </div>

            <div v-if="pedidoCalculado.length > 0" class="animate__animated animate__fadeInUp" style="margin-top: 20px;">
                <div class="card" style="padding: 20px; border: 1px dashed var(--cor-sucesso); background: rgba(0, 230, 118, 0.05);">
                    <h4 style="color: var(--cor-sucesso); margin-top: 0;"><i class="fas fa-shopping-basket"></i> Lista de Compras:</h4>
                    <ul style="color: white; padding-left: 20px; margin-bottom: 20px;">
                        <li v-for="item in pedidoCalculado" :key="item.id">
                            Pedir {{ item.quantidade }} {{ item.unidade }} de {{ item.nome }}
                        </li>
                    </ul>
                    <button @click="enviarPedido" class="btn" style="background: #25D366; color: white;">
                        <i class="fab fa-whatsapp"></i> ENVIAR PEDIDO AO FORNECEDOR
                    </button>
                </div>
            </div>
            
            <div v-else-if="concluido" class="card" style="padding: 20px; text-align: center; border-color: var(--cor-sucesso);">
                <i class="fas fa-check-circle" style="color: var(--cor-sucesso); font-size: 2rem; margin-bottom: 10px;"></i>
                <h4 style="color: white; margin: 0;">Sacolão Completo!</h4>
                <button @click="finalizarSemPedido" class="btn" style="background: var(--cor-sucesso); color: #121212; margin-top: 15px;">
                    REGISTRAR CONTAGEM
                </button>
            </div>
        </div>
    </div>
    `,
    data() { return { contagens: {} }; },
    computed: {
        produtosSacolao() {
            const lista = (this.$root.bancoProdutos || []).filter(p => p.categoria === 'Sacolão');
            return this.$root.ordenarProdutosPorRota(lista);
        },
        produtosAgrupados() {
            const grupos = [];
            const produtos = this.produtosSacolao;
            this.$root.rotasSalvas.forEach(rota => {
                const prodsDaRota = produtos.filter(p => (p.rotas && p.rotas.includes(rota)) || p.rota === rota);
                if (prodsDaRota.length > 0) grupos.push({ rota, produtos: prodsDaRota });
            });
            const semRota = produtos.filter(p => (!p.rotas || p.rotas.length === 0) && !p.rota);
            if (semRota.length > 0) grupos.push({ rota: '', produtos: semRota });
            return grupos;
        },
        sugestaoMemoria() {
            const insights = window.IA_Memoria.analisar(this.$root);
            return insights.find(i => i.id === 'memoria_Sacolão');
        },
        concluido() {
            if (this.produtosSacolao.length === 0) return false;
            return this.produtosSacolao.every(p => {
                const rotasDoProd = (p.rotas && p.rotas.length > 0) ? p.rotas : [p.rota || ''];
                return rotasDoProd.every(r => {
                    const key = p.id + '_' + r;
                    return this.contagens[key] !== undefined && this.contagens[key] !== '';
                });
            });
        },
        pedidoCalculado() {
            let pedido = [];
            const totais = {};
            
            Object.keys(this.contagens).forEach(key => {
                const prodId = key.split('_')[0];
                const valor = parseFloat(this.contagens[key]) || 0;
                if (!totais[prodId]) totais[prodId] = 0;
                totais[prodId] += valor;
            });

            this.produtosSacolao.forEach(p => {
                const atual = totais[p.id] || 0;
                const meta = parseFloat(p.meta) || 0;
                
                const rotasDoProd = (p.rotas && p.rotas.length > 0) ? p.rotas : [p.rota || ''];
                const totalmenteContado = rotasDoProd.every(r => this.contagens[p.id + '_' + r] !== undefined);

                if (totalmenteContado && atual < meta) {
                    pedido.push({ id: p.id, nome: p.nome, quantidade: meta - atual, unidade: p.unidade });
                }
            });
            return pedido;
        }
    },
    methods: {
        enviarPedido() {
            let txt = "*PEDIDO DE SACOLÃO / HORTIFRÚTI*\n\n";
            const agora = Date.now();
            
            this.pedidoCalculado.forEach(i => {
                txt += `- ${i.quantidade} ${i.unidade} de ${i.nome}\n`;
                
                // 🧠 Alimenta a Memória da IA
                if (!this.$root.memoriaOperacional.itens[i.nome]) {
                    this.$root.memoriaOperacional.itens[i.nome] = { historico: [] };
                }
                this.$root.memoriaOperacional.itens[i.nome].historico.push({
                    data: agora,
                    qtd: i.quantidade,
                    unidade: i.unidade
                });
                this.$root.memoriaOperacional.itens[i.nome].ultimaQtd = i.quantidade;
                this.$root.memoriaOperacional.itens[i.nome].ultimoPedido = agora;
            });
            
            this.$root.enviarWhatsApp(txt);
            this.$root.dataPedidoSacolao = new Date().toLocaleDateString('pt-BR');
            this.$root.registrarHistorico('Pedido', 'Sacolão', `Enviado pedido com ${this.pedidoCalculado.length} itens.`);
            
            // Sincroniza memória
            db.collection("operacao").doc("memoria").set(this.$root.memoriaOperacional);
            
            this.$root.salvarMemoriaLocal();
            
            Swal.fire({ icon: 'success', title: 'Pedido Enviado!', background: '#1E1E1E' })
                .then(() => this.$root.mudarTela('tela-dashboard'));
        },
        finalizarSemPedido() {
            this.$root.dataPedidoSacolao = new Date().toLocaleDateString('pt-BR');
            this.$root.registrarHistorico('Contagem', 'Sacolão', 'Estoque conferido e completo.');
            this.$root.salvarMemoriaLocal();
            this.$root.mudarTela('tela-dashboard');
        }
    }
});
