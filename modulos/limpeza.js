Vue.component('tela-limpeza', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2 style="margin: 0; color: #2962FF;"><i class="fas fa-broom"></i> Limpeza</h2>
            </div>
        </div>

        <div v-if="produtosLimpeza.length === 0" class="card" style="padding: 30px; text-align: center;">
            <i class="fas fa-pump-soap" style="font-size: 3rem; color: #2962FF; margin-bottom: 15px;"></i>
            <h3 style="color: white; margin-top: 0;">Nenhum item cadastrado!</h3>
            <button @click="$root.mudarTela('tela-ajustes-produtos')" class="btn" style="background: #2962FF; color: white;">
                IR PARA CADASTRO ERP
            </button>
        </div>

        <div v-else>
            <!-- IA Memória -->
            <div v-if="sugestaoMemoria" class="animate__animated animate__fadeInDown" style="margin-bottom: 20px; background: rgba(255, 171, 0, 0.1); border: 1px solid var(--cor-primaria); padding: 15px; border-radius: 10px; display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-brain" style="color: var(--cor-primaria); font-size: 1.5rem;"></i>
                <div style="flex: 1;">
                    <strong style="color: var(--cor-primaria); display: block; font-size: 0.9rem;">IA MEMÓRIA:</strong>
                    <span style="color: #CCC; font-size: 0.8rem;">Notei que faz alguns dias que não pedimos itens de limpeza. Deseja conferir?</span>
                </div>
            </div>

            <p style="color: #888; font-size: 0.9rem; margin-bottom: 20px; text-align: center;">
                Toque nos itens que <b>estão faltando</b> ou acabando:
            </p>

            <div v-for="grupo in produtosAgrupados" :key="grupo.rota">
                <div v-if="grupo.rota" style="margin: 20px 0 10px 0; display: flex; align-items: center; gap: 10px; background: rgba(156, 39, 176, 0.1); padding: 8px 15px; border-radius: 8px;">
                    <i class="fas fa-map-marker-alt" style="color: #9C27B0;"></i>
                    <span style="color: #9C27B0; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                        {{ grupo.rota }}
                    </span>
                    <div style="height: 1px; flex: 1; background: #333;"></div>
                </div>

                <div class="grid-checklist">
                    <div v-for="prod in grupo.produtos" 
                         :key="prod.id + grupo.rota" 
                         @click="toggleItem(prod.id, grupo.rota)"
                         :class="['card-check', { 'is-checked': marcados[prod.id + '_' + grupo.rota] }]">
                        
                        <div class="check-box">
                            <i v-if="marcados[prod.id + '_' + grupo.rota]" class="fas fa-check"></i>
                        </div>
                        
                        <div style="flex: 1;">
                            <strong class="nome-prod">{{ prod.nome }}</strong>
                            <span class="meta-info">Meta: {{ prod.meta }} {{ prod.unidade || 'un' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botão Mágico -->
            <div v-if="temMarcados" class="animate__animated animate__fadeInUp" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 560px; z-index: 100;">
                <button @click="enviarParaInsumos" class="btn" style="background: #2962FF; color: white; box-shadow: 0 8px 20px rgba(41, 98, 255, 0.4); height: 60px; font-size: 1.1rem;">
                    <i class="fas fa-share-square"></i> ENVIAR PARA INSUMOS ({{ qtdMarcados }})
                </button>
            </div>
            
            <div v-else style="text-align: center; margin-top: 30px;">
                <button @click="finalizarSemFaltas" class="btn" style="background: #1A1A1A; color: #888; border: 1px solid #444; padding: 12px 25px; border-radius: 8px; font-size: 0.9rem;">
                    <i class="fas fa-check-double"></i> TUDO EM ORDEM (NADA A PEDIR)
                </button>
            </div>
        </div>
    </div>
    `,
    data() {
        return { marcados: {} };
    },
    computed: {
        produtosLimpeza() {
            const lista = (this.$root.bancoProdutos || []).filter(p => p.categoria === 'Limpeza');
            return this.$root.ordenarProdutosPorRota(lista);
        },
        produtosAgrupados() {
            const grupos = [];
            const produtos = this.produtosLimpeza;
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
            return insights.find(i => i.id === 'memoria_Limpeza');
        },
        temMarcados() {
            return Object.values(this.marcados).some(v => v === true);
        },
        qtdMarcados() {
            // Conta produtos únicos marcados
            const idsUnicos = new Set();
            Object.keys(this.marcados).forEach(key => {
                if (this.marcados[key]) idsUnicos.add(key.split('_')[0]);
            });
            return idsUnicos.size;
        }
    },
    methods: {
        toggleItem(id, rota) {
            this.$root.vibrar(15);
            const key = id + '_' + rota;
            this.$set(this.marcados, key, !this.marcados[key]);
        },
        enviarParaInsumos() {
            // Limpa itens de limpeza antigos do carrinho invisível
            this.$root.carrinhoInsumos = this.$root.carrinhoInsumos.filter(i => !i.isLimpeza);
            
            // Adiciona os novos marcados (apenas uma vez por produto)
            const idsProcessados = new Set();
            const agora = Date.now();
            Object.keys(this.marcados).forEach(key => {
                if (this.marcados[key]) {
                    const id = key.split('_')[0];
                    if (!idsProcessados.has(id)) {
                        const p = this.produtosLimpeza.find(x => x.id === id);
                        if (p) {
                            const quantidadePedida = p.meta || 1; // A IA precisa saber a quantidade pedida para auditoria
                            const unidadePedida = p.unidade || 'un';

                            this.$root.carrinhoInsumos.push({
                                id: p.id,
                                nome: p.nome,
                                quantidade: quantidadePedida,
                                unidade: unidadePedida,
                                isLimpeza: true
                            });
                            idsProcessados.add(id);

                            // 🧠 Alimenta a Memória da IA para auditoria de desperdício
                            if (!this.$root.memoriaOperacional.itens[p.nome]) {
                                this.$root.memoriaOperacional.itens[p.nome] = { historico: [] };
                            }
                            this.$root.memoriaOperacional.itens[p.nome].historico.push({
                                data: agora,
                                qtd: quantidadePedida,
                                unidade: unidadePedida
                            });
                            this.$root.memoriaOperacional.itens[p.nome].ultimaQtd = quantidadePedida;
                            this.$root.memoriaOperacional.itens[p.nome].ultimoPedido = agora;
                        }
                    }
                }
            });

            this.$root.dataPedidoLimpeza = new Date().toLocaleDateString('pt-BR');
            this.$root.registrarHistorico('Logística', 'Limpeza', `Enviou ${this.qtdMarcados} itens para o carrinho invisível.`);
            this.$root.salvarMemoriaLocal();
            db.collection("operacao").doc("memoria").set(this.$root.memoriaOperacional); // Sincroniza memória

            Swal.fire({
                icon: 'success',
                title: 'Carrinho Invisível Atualizado!',
                text: 'Estes itens serão somados ao pedido de Insumos.',
                background: '#1E1E1E', color: '#FFF', confirmButtonColor: '#2962FF'
            }).then(() => this.$root.mudarTela('tela-dashboard'));
        },
        finalizarSemFaltas() {
            this.$root.dataPedidoLimpeza = new Date().toLocaleDateString('pt-BR');
            this.$root.registrarHistorico('Contagem', 'Limpeza', 'Estoque verificado: Tudo OK.');
            this.$root.salvarMemoriaLocal();
            this.$root.mudarTela('tela-dashboard');
        }
    },
    mounted() {
        if (!document.getElementById('css-limpeza-checklist')) {
            const style = document.createElement('style');
            style.id = 'css-limpeza-checklist';
            style.innerHTML = `
                .grid-checklist { display: flex; flex-direction: column; gap: 10px; }
                .card-check { 
                    background: #1A1A1A; 
                    border: 1px solid #333; 
                    border-radius: 12px; 
                    padding: 18px; 
                    display: flex; 
                    align-items: center; 
                    gap: 15px; 
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .card-check.is-checked { 
                    border-color: #2962FF; 
                    background: rgba(41, 98, 255, 0.1); 
                }
                .check-box { 
                    width: 28px; 
                    height: 28px; 
                    border: 2px solid #444; 
                    border-radius: 8px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: #2962FF;
                    font-size: 1rem;
                }
                .is-checked .check-box { border-color: #2962FF; background: #2962FF; color: white; }
                .nome-prod { color: white; font-size: 1.1rem; display: block; }
                .meta-info { color: #666; font-size: 0.8rem; }
                .is-checked .nome-prod { color: #2962FF; font-weight: bold; font-size: 1.2rem; }
            `;
            document.head.appendChild(style);
        }
    }
});
