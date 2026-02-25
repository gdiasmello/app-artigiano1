/**
 * Insumos v2.8.0
 * Consolidação final de pedidos (Insumos + Limpeza).
 */
Vue.component('tela-insumos', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2 style="margin: 0; color: var(--cor-erro);"><i class="fas fa-box-open"></i> Insumos & Geral</h2>
            </div>
        </div>

        <div v-if="produtosInsumos.length === 0" class="card" style="padding: 30px; text-align: center;">
            <i class="fas fa-cubes" style="font-size: 3rem; color: var(--cor-erro); margin-bottom: 15px;"></i>
            <h3 style="color: white; margin-top: 0;">Nenhum insumo cadastrado!</h3>
            <button @click="$root.mudarTela('tela-ajustes-produtos')" class="btn" style="background: var(--cor-erro); color: white;">
                IR PARA CADASTRO ERP
            </button>
        </div>

        <div v-else>
            <!-- IA Memória -->
            <div v-if="sugestaoMemoria" class="animate__animated animate__fadeInDown" style="margin-bottom: 20px; background: rgba(255, 171, 0, 0.1); border: 1px solid var(--cor-primaria); padding: 15px; border-radius: 10px; display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-brain" style="color: var(--cor-primaria); font-size: 1.5rem;"></i>
                <div style="flex: 1;">
                    <strong style="color: var(--cor-primaria); display: block; font-size: 0.9rem;">IA MEMÓRIA:</strong>
                    <span style="color: #CCC; font-size: 0.8rem;">Notei que faz alguns dias que não pedimos insumos. Deseja conferir?</span>
                </div>
            </div>

            <!-- Busca Inteligente -->
            <div style="margin-bottom: 20px;">
                <div style="display: flex; gap: 10px;">
                    <input type="text" v-model="busca" placeholder="Buscar ou descrever item..." class="input-dark" @keyup.enter="buscarItem">
                    <button @click="buscarItem" class="btn" style="width: 60px; background: var(--cor-primaria); color: #121212;">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>

            <div v-for="grupo in produtosAgrupados" :key="grupo.rota">
                <div v-if="grupo.rota" style="margin: 20px 0 10px 0; display: flex; align-items: center; gap: 10px; background: rgba(156, 39, 176, 0.1); padding: 8px 15px; border-radius: 8px;">
                    <i class="fas fa-map-marker-alt" style="color: #9C27B0;"></i>
                    <span style="color: #9C27B0; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                        {{ grupo.rota }}
                    </span>
                    <div style="height: 1px; flex: 1; background: #333;"></div>
                </div>
                
                <div class="card" style="padding: 15px; border-top: 4px solid var(--cor-erro); margin-bottom: 20px;">
                    <div v-for="prod in grupo.produtos" :key="prod.id + grupo.rota" class="item-estoque" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #222;">
                        <div style="flex: 1;">
                            <strong style="color: white; font-size: 1.1rem; display: block;">{{ prod.nome }}</strong>
                            <span style="color: #888; font-size: 0.8rem;">Meta: {{ calcularMetaAjustada(prod) }} {{ prod.unidade }}</span>
                        </div>
                        <div style="text-align: right;">
                            <label style="color: #AAA; font-size: 0.7rem; display: block; margin-bottom: 5px;">Qtd. Atual</label>
                            <input type="number" v-model.number="contagens[prod.id + '_' + grupo.rota]" placeholder="0" class="input-estoque" style="width: 80px; text-align: center; font-size: 1.2rem; font-weight: bold; color: var(--cor-secundaria); background: #1A1A1A; border: 1px solid #333; border-radius: 5px; padding: 5px;">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Carrinho Consolidado -->
            <div v-if="carrinhoFinal.length > 0" class="animate__animated animate__fadeInUp" style="margin-top: 20px;">
                <div class="card" style="padding: 20px; border: 1px solid var(--cor-erro); background: #222;">
                    <h4 style="color: var(--cor-erro); margin-top: 0;"><i class="fas fa-shopping-cart"></i> Pedido Consolidado:</h4>
                    
                    <div v-if="itensLimpezaNoCarrinho.length > 0" style="margin-bottom: 15px; padding: 10px; background: rgba(41, 98, 255, 0.1); border-radius: 8px;">
                        <small style="color: #2962FF; font-weight: bold; display: block; margin-bottom: 5px;">SETOR: LIMPEZA</small>
                        <ul style="color: #CCC; font-size: 0.9rem; padding-left: 20px; margin: 0;">
                            <li v-for="item in itensLimpezaNoCarrinho" :key="item.id">
                                {{ item.quantidade }} {{ item.unidade }} de {{ item.nome }}
                            </li>
                        </ul>
                    </div>

                    <div v-if="itensInsumosNoCarrinho.length > 0" style="margin-bottom: 15px; padding: 10px; background: rgba(255, 82, 82, 0.1); border-radius: 8px;">
                        <small style="color: var(--cor-erro); font-weight: bold; display: block; margin-bottom: 5px;">SETOR: INSUMOS / FRIOS</small>
                        <ul style="color: #CCC; font-size: 0.9rem; padding-left: 20px; margin: 0;">
                            <li v-for="item in itensInsumosNoCarrinho" :key="item.id">
                                {{ item.quantidade }} {{ item.unidade }} de {{ item.nome }}
                            </li>
                        </ul>
                    </div>

                    <button @click="finalizarPedido" class="btn" style="background: var(--cor-sucesso); color: #121212; height: 60px; font-size: 1.1rem;">
                        <i class="fab fa-whatsapp"></i> ENVIAR PEDIDO COMPLETO
                    </button>
                    
                    <button @click="limparCarrinho" style="background: none; border: none; color: #555; width: 100%; margin-top: 15px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-trash"></i> Limpar Carrinho e Recomeçar
                    </button>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return { contagens: {}, busca: '' };
    },
    computed: {
        isVespera() {
            const amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
            const dataAmanha = amanha.toISOString().split('T')[0];
            return this.$root.feriados.some(f => f.data === dataAmanha);
        },
        isFeriado() {
            const hoje = new Date().toISOString().split('T')[0];
            return this.$root.feriados.some(f => f.data === hoje);
        },
        eventoDeHoje() {
            const hoje = new Date().toISOString().split('T')[0];
            return this.$root.eventosEspeciais.find(e => e.data === hoje);
        },
        nomeFeriado() {
            const hoje = new Date().toISOString().split('T')[0];
            const amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
            const dataAmanha = amanha.toISOString().split('T')[0];
            
            const feriadoHoje = this.$root.feriados.find(f => f.data === hoje);
            if (feriadoHoje) return feriadoHoje.nome;

            const feriadoAmanha = this.$root.feriados.find(f => f.data === dataAmanha);
            return feriadoAmanha ? feriadoAmanha.nome : '';
        },
        ajusteClima() {
            if (!this.$root.clima.modoSmart) return 0;

            let ajuste = 0;
            if (this.$root.clima.isCalor) ajuste -= 10; // Reduz 10% em dias quentes
            if (this.$root.clima.vaiChoverPico) ajuste += 20; // Aumenta 20% se houver previsão de chuva no pico

            return ajuste;
        },
        produtosInsumos() {
            const categoriasExcluidas = ['Sacolão', 'Limpeza', 'Gelo'];
            const lista = (this.$root.bancoProdutos || []).filter(p => !categoriasExcluidas.includes(p.categoria));
            return this.$root.ordenarProdutosPorRota(lista);
        },
        produtosAgrupados() {
            const grupos = [];
            const produtos = this.produtosInsumos;
            
            // Pega as rotas na ordem certa
            this.$root.rotasSalvas.forEach(rota => {
                const prodsDaRota = produtos.filter(p => (p.rotas && p.rotas.includes(rota)) || p.rota === rota);
                if (prodsDaRota.length > 0) {
                    grupos.push({ rota, produtos: prodsDaRota });
                }
            });

            // Produtos sem rota
            const semRota = produtos.filter(p => (!p.rotas || p.rotas.length === 0) && !p.rota);
            if (semRota.length > 0) {
                grupos.push({ rota: '', produtos: semRota });
            }

            return grupos;
        },
        sugestaoMemoria() {
            const insights = window.IA_Memoria.analisar(this.$root);
            return insights.find(i => i.id === 'memoria_Insumos');
        },
        itensLimpezaNoCarrinho() {
            return this.$root.carrinhoInsumos.filter(i => i.isLimpeza);
        },
        itensInsumosNoCarrinho() {
            let pedido = [];
            const totais = {};
            
            // Soma contagens de todas as rotas
            Object.keys(this.contagens).forEach(key => {
                const prodId = key.split('_')[0];
                const valor = parseFloat(this.contagens[key]) || 0;
                if (!totais[prodId]) totais[prodId] = 0;
                totais[prodId] += valor;
            });

            this.produtosInsumos.forEach(p => {
                const atual = totais[p.id] || 0;
                const metaAjustada = this.calcularMetaAjustada(p);
                
                // Verifica se houve alguma contagem para este produto
                const foiContado = Object.keys(this.contagens).some(k => k.startsWith(p.id + '_'));

                if (foiContado && atual < metaAjustada) {
                    pedido.push({ id: p.id, nome: p.nome, quantidade: metaAjustada - atual, unidade: p.unidade });
                }
            });
            return pedido;
        },
        carrinhoFinal() {
            return [...this.itensLimpezaNoCarrinho, ...this.itensInsumosNoCarrinho];
        }
    },
    methods: {
        buscarItem() {
            if (!this.busca) return;
            
            const termo = this.busca.toLowerCase().trim();
            const encontrado = this.$root.bancoProdutos.find(p => p.nome.toLowerCase().includes(termo));
            
            if (encontrado) {
                Swal.fire({ icon: 'success', text: `Item "${encontrado.nome}" encontrado na lista.`, timer: 1000, showConfirmButton: false });
                this.busca = '';
            } else {
                // 🤖 Fallback para IA
                this.$root.estadoErroIA = {
                    titulo: "Item Não Encontrado",
                    mensagem: `Não encontramos "${this.busca}" no banco de dados padrão.`,
                    icone: "fa-search-minus",
                    cor: "var(--cor-primaria)",
                    telaDestino: 'tela-insumos',
                    contexto: {
                        tipo: 'BUSCA_PRODUTO',
                        termo: this.busca,
                        setor: 'Insumos'
                    },
                    callbackSugestao: (acao) => {
                        if (acao.tipo === 'ADD_ITEM') {
                            this.$root.carrinhoInsumos.push({
                                id: acao.produtoId || Date.now(),
                                nome: acao.nome || this.busca,
                                quantidade: acao.quantidade || 1,
                                unidade: acao.unidade || 'un',
                                isIA: true
                            });
                        }
                    }
                };
                this.$root.mudarTela('tela-erros');
            }
        },
        calcularMetaAjustada(produto) {
            let meta = parseFloat(produto.meta) || 0;

            if (this.eventoDeHoje) {
                const mult = (this.eventoDeHoje.multiplicador || 0) / 100;
                meta = Math.ceil(meta * (1 + mult));
            } else if (this.isFeriado) {
                const mult = (this.$root.multiplicadoresProducao.feriado || 0) / 100;
                meta = Math.ceil(meta * (1 + mult));
            } else if (this.isVespera) {
                const mult = (this.$root.multiplicadoresProducao.vespera || 0) / 100;
                meta = Math.ceil(meta * (1 + mult));
            }

            // Aplica ajuste de clima se o modo smart estiver ativo
            if (this.$root.clima.modoSmart && this.ajusteClima !== 0) {
                meta = Math.ceil(meta * (1 + this.ajusteClima / 100));
            }
            return meta;
        },
        limparCarrinho() {
            this.$root.carrinhoInsumos = [];
            this.contagens = {};
            this.$root.salvarMemoriaLocal();
        },
        async finalizarPedido() {
            // 🤖 Validação de Proporção via IA antes de finalizar
            const pedidoInsumos = this.itensInsumosNoCarrinho;
            const farinha = pedidoInsumos.find(i => i.nome.toLowerCase().includes('farinha'));
            const fermento = pedidoInsumos.find(i => i.nome.toLowerCase().includes('fermento'));
            
            if (farinha && fermento) {
                this.$root.estadoErroIA = {
                    titulo: "Validando Proporções",
                    mensagem: "A IA está verificando se as quantidades de Farinha e Fermento fazem sentido.",
                    icone: "fa-balance-scale",
                    cor: "var(--cor-primaria)",
                    telaDestino: 'tela-insumos',
                    contexto: {
                        tipo: 'VALIDACAO_PROPORCAO',
                        itens: pedidoInsumos
                    },
                    permitirIgnorar: true,
                    callbackIgnorar: () => {
                        this.processarEnvioWhatsApp();
                    },
                    callbackSugestao: (acao) => {
                        if (acao.tipo === 'UPDATE_QUANTITY') {
                            const item = this.produtosInsumos.find(p => p.id === acao.produtoId);
                            if (item) {
                                this.$set(this.contagens, item.id, item.meta - acao.quantidade);
                            }
                        }
                    }
                };
                this.$root.mudarTela('tela-erros');
                return;
            }

            this.processarEnvioWhatsApp();
        },
        processarEnvioWhatsApp() {
            let txt = `*📦 PEDIDO DE COMPRA - PIZZA MASTER*\n`;
            txt += `_Data: ${new Date().toLocaleDateString('pt-BR')}_\n`;
            txt += `----------------------------------\n\n`;
            const agora = Date.now();
            
            if (this.itensInsumosNoCarrinho.length > 0) {
                txt += `*🍎 INSUMOS E EMBALAGENS:*\n`;
                this.itensInsumosNoCarrinho.forEach(i => {
                    // Busca o produto original para checar a flag
                    const produtoOriginal = this.$root.bancoProdutos.find(p => p.id === i.id);
                    const soNome = produtoOriginal && produtoOriginal.pedirSoNome;

                    if (soNome) {
                        txt += `• ${i.nome}\n`;
                    } else {
                        txt += `• ${i.nome}: *${i.quantidade} ${i.unidade}*\n`;
                    }
                    
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
                txt += `\n`;
            }
            
            if (this.itensLimpezaNoCarrinho.length > 0) {
                txt += `*🧼 LIMPEZA E HIGIENE:*\n`;
                this.itensLimpezaNoCarrinho.forEach(i => {
                    txt += `• ${i.nome}: *${i.quantidade} ${i.unidade}*\n`;
                    
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
                txt += `\n`;
            }

            txt += `----------------------------------\n`;
            txt += `_Gerado automaticamente via PiZZA Master_`;

            this.$root.enviarWhatsApp(txt);
            this.$root.registrarHistorico('Pedido', 'Insumos', `Pedido consolidado com ${this.carrinhoFinal.length} itens.`);
            
            // Sincroniza memória
            db.collection("operacao").doc("memoria").set(this.$root.memoriaOperacional);

            this.$root.dataPedidoInsumos = new Date().toLocaleDateString('pt-BR');
            this.limparCarrinho();
            
            Swal.fire({ 
                icon: 'success', 
                title: 'Pedido Enviado!', 
                text: 'O carrinho foi limpo e o histórico registrado.',
                background: '#1E1E1E',
                color: '#FFF'
            }).then(() => this.$root.mudarTela('tela-dashboard'));
        }
    }
});
