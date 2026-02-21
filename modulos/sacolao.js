// modulos/sacolao.js - Contagem para o Dia Seguinte v0.0.43

Vue.component('tela-sacolao', {
    template: `
    <div class="container animate__animated animate__fadeInRight" style="padding-bottom: 120px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #00C853;">🥬 Sacolão</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <p style="color: var(--text-sec); font-size: 0.9rem; margin-bottom: 20px;">
            Conte hoje o que vai precisar amanhã. Guarde na lista e envie quando for a hora certa!
        </p>

        <div v-for="rota in rotasComProdutos" :key="rota" style="margin-bottom: 30px;">
            
            <h3 style="color: white; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
                <i class="fas fa-map-marker-alt" style="color: #00C853; margin-right: 10px;"></i> Rota: {{ rota }}
            </h3>

            <div v-for="item in produtosDaRota(rota)" :key="item.id" class="card" style="padding: 15px; border-left: 3px solid #00C853; margin-bottom: 10px; background: #1A1A1A;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div>
                        <strong style="font-size: 1.1rem; color: white; display: block;">{{ item.nome }}</strong>
                        <span v-if="item.grupo" :style="corDoGrupo(item.grupo)" style="padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; margin-bottom: 5px; display: inline-block;">
                            {{ iconeDoGrupo(item.grupo) }} {{ item.grupo }}
                        </span>
                        <small style="color: #888; display: block;">Contar em: <b style="color: #CCC;">{{ item.undContagem }}</b></small>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.75rem; background: #333; padding: 4px 8px; border-radius: 10px; color: #00C853; display: block; margin-bottom: 3px; border: 1px solid #00C853;">
                            Meta: {{ item.estoqueIdeal }}
                        </span>
                        <span v-if="!item.apenasNome" style="font-size: 0.7rem; color: #888; display: block;">
                            (Vem {{ item.fator }} por {{ item.undCompra }})
                        </span>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                    <label style="color: var(--text-sec); font-size: 0.9rem; flex: 1;">Tem na Loja?</label>
                    <input type="number" inputmode="numeric" v-model.number="item.emEstoque" placeholder="0" style="width: 100px; padding: 10px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; font-size: 1.2rem; text-align: center; margin: 0;">
                </div>
                
                <div v-if="calcularFalta(item) > 0" style="margin-top: 10px; padding: 8px; background: rgba(0,200,83,0.1); border-radius: 5px; font-size: 0.85rem; color: #69F0AE; text-align: center;">
                    <span v-if="item.apenasNome">A IA pedirá: <b>{{ item.nome }}</b></span>
                    <span v-else>A IA pedirá: <b>{{ calcularCaixas(item) }} {{ item.undCompra }}</b></span>
                </div>
            </div>
            
        </div>

        <div v-if="rotasComProdutos.length === 0" style="text-align: center; color: #666; padding: 20px; font-style: italic;">
            Nenhum item de hortifruti cadastrado.
        </div>

        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #1A1A1A; border-top: 2px solid #333; padding: 15px; display: flex; flex-direction: column; gap: 10px; z-index: 1000;">
            <button v-if="temItensParaAdicionar" @click="guardarNaLista" class="animate__animated animate__headShake" style="width: 100%; max-width: 600px; margin: 0 auto; background: #2C2C2C; color: #00C853; border: 1px solid #00C853; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                <i class="fas fa-save"></i> GUARDAR PARA PEDIR DEPOIS
            </button>

            <button v-if="$root.carrinhoSacolao.length > 0" @click="abrirCarrinhoEEnviar" class="animate__animated animate__pulse animate__infinite" style="width: 100%; max-width: 600px; margin: 0 auto; background: #00C853; color: #121212; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(0, 200, 83, 0.4);">
                <i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i> ENVIAR SACOLÃO ({{ $root.carrinhoSacolao.length }} ITENS)
            </button>
        </div>

    </div>
    `,
    computed: {
        produtosSacolao() { return this.$root.bancoProdutos.filter(p => p.categoria === 'sacolao'); },
        rotasComProdutos() {
            const locaisOcupados = this.produtosSacolao.map(p => p.local);
            return this.$root.rotasSalvas.filter(r => locaisOcupados.includes(r));
        },
        temItensParaAdicionar() { return this.produtosSacolao.some(p => this.calcularFalta(p) > 0); }
    },
    methods: {
        voltar() { this.$root.vibrar(30); this.$root.mudarTela('tela-dashboard'); },
        produtosDaRota(nomeDaRota) { return this.produtosSacolao.filter(p => p.local === nomeDaRota); },
        
        iconeDoGrupo(grupo) {
            if (grupo === 'Refrigerado') return '❄️';
            if (grupo === 'Seco') return '📦';
            if (grupo === 'Hortifruti') return '🥬';
            return '🏷️';
        },
        corDoGrupo(grupo) {
            if (grupo === 'Hortifruti') return 'background: rgba(0, 200, 83, 0.2); border: 1px solid #00C853; color: #69F0AE;';
            return 'background: #333; border: 1px solid #555; color: #CCC;';
        },

        calcularFalta(item) {
            if (item.emEstoque === '' || item.emEstoque === null) return 0;
            const diferenca = item.estoqueIdeal - item.emEstoque;
            return diferenca > 0 ? diferenca : 0;
        },
        calcularCaixas(item) {
            const faltaFisica = this.calcularFalta(item);
            if (faltaFisica <= 0) return 0;
            return Math.ceil(faltaFisica / item.fator);
        },

        // 🟢 GUARDA NO CARRINHO DE SACOLÃO COM O AUTOR E HORA
        guardarNaLista() {
            this.$root.vibrar(30);
            const itensFaltando = this.produtosSacolao.filter(p => this.calcularFalta(p) > 0);
            
            const agora = new Date();
            const horaStr = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
            const dataStr = String(agora.getDate()).padStart(2, '0') + '/' + String(agora.getMonth() + 1).padStart(2, '0');
            const autorAtual = this.$root.usuario.nome;
            
            itensFaltando.forEach(item => {
                let stringPedido = item.apenasNome ? item.nome : `${this.calcularCaixas(item)} ${item.undCompra} de ${item.nome}`;
                
                const indexExistente = this.$root.carrinhoSacolao.findIndex(c => c.idProduto === item.id);
                if (indexExistente !== -1) {
                    this.$root.carrinhoSacolao[indexExistente].textoPedido = stringPedido;
                    this.$root.carrinhoSacolao[indexExistente].autor = autorAtual;
                    this.$root.carrinhoSacolao[indexExistente].hora = horaStr;
                    this.$root.carrinhoSacolao[indexExistente].data = dataStr;
                } else {
                    this.$root.carrinhoSacolao.push({ 
                        idProduto: item.id, 
                        textoPedido: stringPedido,
                        autor: autorAtual,
                        hora: horaStr,
                        data: dataStr
                    });
                }
                item.emEstoque = ''; 
            });

            this.$root.salvarMemoriaLocal();
            this.$root.vibrar([50, 50, 50]);
            Swal.fire({ icon: 'success', title: 'Salvo!', text: 'Hortifruti guardado para ser enviado amanhã.', timer: 2000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
        },

        abrirCarrinhoEEnviar() {
            this.$root.vibrar(30);
            
            let htmlLista = '<div style="text-align: left; background: #111; padding: 10px; border-radius: 8px; max-height: 250px; overflow-y: auto; color: #CCC; font-size: 0.9rem;">';
            this.$root.carrinhoSacolao.forEach(c => { 
                htmlLista += `<div style="margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                                <span style="color: #69F0AE;">• ${c.textoPedido}</span><br>
                                <small style="color: #888; font-size: 0.75rem;"><i class="fas fa-user-edit"></i> ${c.autor} (${c.data} às ${c.hora})</small>
                              </div>`; 
            });
            htmlLista += '</div><p style="font-size: 0.85rem; color: #888; margin-top: 10px;">Enviar pedido ao fornecedor?</p>';

            Swal.fire({
                title: 'Pedido de Hortifruti',
                html: htmlLista,
                showCancelButton: true, confirmButtonColor: '#00C853', cancelButtonColor: '#444', confirmButtonText: '✅ Enviar Whats', cancelButtonText: 'Voltar', background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$root.vibrar([50, 50, 50]);
                    
                    let textoPedido = "Olá! Segue o pedido de Hortifruti da Artigiano:%0A%0A";
                    let resumoAuditoria = [];
                    
                    this.$root.carrinhoSacolao.forEach(c => {
                        textoPedido += `• ${c.textoPedido}%0A`;
                        resumoAuditoria.push(`${c.textoPedido} [Por: ${c.autor}]`); 
                    });
                    textoPedido += "%0AObrigado e bom dia!";
                    
                    this.$root.registrarHistorico('Pedido Enviado', 'Pedidos', `Sacolão: ${resumoAuditoria.join(', ')}.`);
                    this.$root.carrinhoSacolao = [];
                    this.$root.salvarMemoriaLocal();

                    window.open(`https://wa.me/?text=${textoPedido}`, '_blank');
                    this.$root.mudarTela('tela-dashboard');
                }
            });
        }
    }
});
