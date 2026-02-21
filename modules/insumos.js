// modulos/insumos.js - Contagem Multi-Usuário v0.0.43

Vue.component('tela-insumos', {
    template: `
    <div class="container animate__animated animate__fadeInRight" style="padding-bottom: 120px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #D50000;">📦 Insumos</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <p style="color: var(--text-sec); font-size: 0.9rem; margin-bottom: 20px;">
            Se um insumo acabou antes do dia do pedido, adicione à lista! A IA regista quem anotou e a hora exata.
        </p>

        <div v-for="rota in rotasComProdutos" :key="rota" style="margin-bottom: 30px;">
            
            <h3 style="color: white; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
                <i class="fas fa-map-marker-alt" style="color: #D50000; margin-right: 10px;"></i> Rota: {{ rota }}
            </h3>

            <div v-for="item in produtosDaRota(rota)" :key="item.id" class="card" style="padding: 15px; border-left: 3px solid #D50000; margin-bottom: 10px; background: #1A1A1A;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div>
                        <strong style="font-size: 1.1rem; color: white; display: block;">{{ item.nome }}</strong>
                        <span v-if="item.grupo" :style="corDoGrupo(item.grupo)" style="padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; margin-bottom: 5px; display: inline-block;">
                            {{ iconeDoGrupo(item.grupo) }} {{ item.grupo }}
                        </span>
                        <small style="color: #888; display: block;">Contar em: <b style="color: #CCC;">{{ item.undContagem }}</b></small>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.75rem; background: #333; padding: 4px 8px; border-radius: 10px; color: var(--cor-primaria); display: block; margin-bottom: 3px; border: 1px solid var(--cor-primaria);">
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
                
                <div v-if="calcularFalta(item) > 0" style="margin-top: 10px; padding: 8px; background: rgba(213,0,0,0.1); border-radius: 5px; font-size: 0.85rem; color: #FF8A80; text-align: center;">
                    <span v-if="item.apenasNome">Sistema vai pedir: <b>{{ item.nome }}</b></span>
                    <span v-else>Sistema vai pedir: <b>{{ calcularCaixas(item) }} {{ item.undCompra }}</b></span>
                </div>
            </div>
        </div>

        <div v-if="rotasComProdutos.length === 0" style="text-align: center; color: #666; padding: 20px; font-style: italic;">
            Nenhum insumo cadastrado na base de dados central.
        </div>

        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #1A1A1A; border-top: 2px solid #333; padding: 15px; display: flex; flex-direction: column; gap: 10px; z-index: 1000;">
            <button v-if="temItensParaAdicionar" @click="guardarNaLista" class="animate__animated animate__headShake" style="width: 100%; max-width: 600px; margin: 0 auto; background: #2C2C2C; color: var(--cor-primaria); border: 1px solid var(--cor-primaria); padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                <i class="fas fa-save"></i> GUARDAR FALTAS NA LISTA
            </button>

            <button v-if="$root.carrinhoInsumos.length > 0" @click="abrirCarrinhoEEnviar" class="animate__animated animate__pulse animate__infinite" style="width: 100%; max-width: 600px; margin: 0 auto; background: #D50000; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(213, 0, 0, 0.4);">
                <i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i> VER LISTA & ENVIAR ({{ $root.carrinhoInsumos.length }} ITENS)
            </button>
        </div>

    </div>
    `,
    computed: {
        produtosInsumos() { return this.$root.bancoProdutos.filter(p => p.categoria === 'insumos'); },
        rotasComProdutos() {
            const locaisOcupados = this.produtosInsumos.map(p => p.local);
            return this.$root.rotasSalvas.filter(r => locaisOcupados.includes(r));
        },
        temItensParaAdicionar() { return this.produtosInsumos.some(p => this.calcularFalta(p) > 0); }
    },
    methods: {
        voltar() { this.$root.vibrar(30); this.$root.mudarTela('tela-dashboard'); },
        produtosDaRota(nomeDaRota) { return this.produtosInsumos.filter(p => p.local === nomeDaRota); },
        
        iconeDoGrupo(grupo) {
            if (grupo === 'Refrigerado') return '❄️';
            if (grupo === 'Seco') return '📦';
            if (grupo === 'Hortifruti') return '🥬';
            if (grupo === 'Limpeza') return '🧹';
            if (grupo === 'Bebidas') return '🥤';
            return '🏷️';
        },
        corDoGrupo(grupo) {
            if (grupo === 'Refrigerado') return 'background: rgba(0, 176, 255, 0.2); border: 1px solid #00B0FF; color: #82B1FF;';
            if (grupo === 'Seco') return 'background: rgba(255, 171, 0, 0.2); border: 1px solid #FFAB00; color: #FFD54F;';
            if (grupo === 'Hortifruti') return 'background: rgba(0, 200, 83, 0.2); border: 1px solid #00C853; color: #69F0AE;';
            if (grupo === 'Limpeza') return 'background: rgba(41, 98, 255, 0.2); border: 1px solid #2962FF; color: #82B1FF;';
            if (grupo === 'Bebidas') return 'background: rgba(156, 39, 176, 0.2); border: 1px solid #9C27B0; color: #E1BEE7;';
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

        // 🟢 GUARDA NA LISTA COM AUTOR E HORA
        guardarNaLista() {
            this.$root.vibrar(30);
            const itensFaltando = this.produtosInsumos.filter(p => this.calcularFalta(p) > 0);
            
            const agora = new Date();
            const horaStr = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
            const dataStr = String(agora.getDate()).padStart(2, '0') + '/' + String(agora.getMonth() + 1).padStart(2, '0');
            const autorAtual = this.$root.usuario.nome;
            
            itensFaltando.forEach(item => {
                let stringPedido = item.apenasNome ? item.nome : `${this.calcularCaixas(item)} ${item.undCompra} de ${item.nome}`;
                
                const indexExistente = this.$root.carrinhoInsumos.findIndex(c => c.idProduto === item.id);
                if (indexExistente !== -1) {
                    this.$root.carrinhoInsumos[indexExistente].textoPedido = stringPedido;
                    this.$root.carrinhoInsumos[indexExistente].autor = autorAtual;
                    this.$root.carrinhoInsumos[indexExistente].hora = horaStr;
                    this.$root.carrinhoInsumos[indexExistente].data = dataStr;
                } else {
                    this.$root.carrinhoInsumos.push({ 
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
            Swal.fire({ icon: 'success', title: 'Salvo na Lista!', text: 'Os itens foram guardados com o seu nome.', timer: 2000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
        },

        // 🟢 MOSTRA O AUTOR NO ECRÃ E GRAVA NA AUDITORIA
        abrirCarrinhoEEnviar() {
            this.$root.vibrar(30);
            let htmlLista = '<div style="text-align: left; background: #111; padding: 10px; border-radius: 8px; max-height: 250px; overflow-y: auto; color: #CCC; font-size: 0.9rem;">';
            
            this.$root.carrinhoInsumos.forEach(c => { 
                htmlLista += `<div style="margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                                <span style="color: white;">• ${c.textoPedido}</span><br>
                                <small style="color: #888; font-size: 0.75rem;"><i class="fas fa-user-edit"></i> ${c.autor} (${c.data} às ${c.hora})</small>
                              </div>`; 
            });
            htmlLista += '</div><p style="font-size: 0.85rem; color: #888; margin-top: 10px;">Apenas os itens vão para o fornecedor. Os nomes da equipa ficam na Auditoria.</p>';

            Swal.fire({
                title: 'Revisão do Pedido',
                html: htmlLista,
                showCancelButton: true, confirmButtonColor: '#D50000', cancelButtonColor: '#444', confirmButtonText: '✅ Enviar Whats', cancelButtonText: 'Voltar', background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$root.vibrar([50, 50, 50]);
                    
                    let textoPedido = "Olá! Segue o pedido da Artigiano:%0A%0A";
                    let resumoAuditoria = [];
                    
                    this.$root.carrinhoInsumos.forEach(c => {
                        textoPedido += `• ${c.textoPedido}%0A`;
                        resumoAuditoria.push(`${c.textoPedido} [Por: ${c.autor}]`); // A auditoria sabe quem foi!
                    });
                    textoPedido += "%0AObrigado!";
                    
                    this.$root.registrarHistorico('Pedido Enviado', 'Pedidos', `Insumos: ${resumoAuditoria.join(', ')}.`);
                    this.$root.carrinhoInsumos = [];
                    this.$root.salvarMemoriaLocal();

                    window.open(`https://wa.me/?text=${textoPedido}`, '_blank');
                    this.$root.mudarTela('tela-dashboard');
                }
            });
        }
    }
});
