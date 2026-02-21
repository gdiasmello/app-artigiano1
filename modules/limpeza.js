// modulos/limpeza.js - Faltas Simplificadas e Rastreadas v0.0.43

Vue.component('tela-limpeza', {
    template: `
    <div class="container animate__animated animate__fadeInRight" style="padding-bottom: 120px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #2962FF;">🧹 Limpeza (Faltas)</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <p style="color: var(--text-sec); font-size: 0.9rem; margin-bottom: 20px;">
            Toque nos produtos que estão a faltar. A IA regista quem anotou e adiciona ao pedido geral de Insumos.
        </p>

        <div v-for="rota in rotasComProdutos" :key="rota" style="margin-bottom: 25px;">
            
            <h3 style="color: white; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 12px; font-size: 1.1rem;">
                <i class="fas fa-map-marker-alt" style="color: #2962FF; margin-right: 10px;"></i> {{ rota }}
            </h3>

            <div v-for="item in produtosDaRota(rota)" :key="item.id" 
                 @click="alternarSelecao(item.id)"
                 class="card" 
                 style="padding: 15px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s;"
                 :style="selecionados.includes(item.id) ? 'background: rgba(0, 200, 83, 0.1); border-left: 4px solid #00C853;' : 'background: #1A1A1A; border-left: 4px solid #2962FF;'">
                
                <div style="display: flex; flex-direction: column;">
                    <strong :style="selecionados.includes(item.id) ? 'color: #00C853; font-size: 1.1rem;' : 'color: white; font-size: 1.1rem;'">
                        {{ item.nome }}
                    </strong>
                    
                    <span v-if="item.grupo" :style="corDoGrupo(item.grupo)" style="padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; margin-top: 5px; width: fit-content;">
                        {{ iconeDoGrupo(item.grupo) }} {{ item.grupo }}
                    </span>
                </div>

                <div style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; border: 2px solid #555; transition: 0.2s;"
                     :style="selecionados.includes(item.id) ? 'background: #00C853; border-color: #00C853;' : 'background: transparent;'">
                    <i v-if="selecionados.includes(item.id)" class="fas fa-check" style="color: #121212; font-size: 1rem;"></i>
                </div>

            </div>
        </div>

        <div v-if="rotasComProdutos.length === 0" style="text-align: center; color: #666; padding: 20px; font-style: italic;">
            Nenhum produto de limpeza cadastrado. Vá aos Ajustes para adicionar.
        </div>

        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #1A1A1A; border-top: 2px solid #333; padding: 15px; display: flex; flex-direction: column; gap: 10px; z-index: 1000;">
            
            <button v-if="selecionados.length > 0" @click="guardarNaLista" class="animate__animated animate__headShake" style="width: 100%; max-width: 600px; margin: 0 auto; background: #2C2C2C; color: #00C853; border: 1px solid #00C853; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                <i class="fas fa-save"></i> GUARDAR {{ selecionados.length }} ITEM(S) NA LISTA
            </button>

            <button v-if="$root.carrinhoInsumos.length > 0" @click="abrirCarrinhoEEnviar" class="animate__animated animate__pulse animate__infinite" style="width: 100%; max-width: 600px; margin: 0 auto; background: #D50000; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(213, 0, 0, 0.4);">
                <i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i> VER LISTA & ENVIAR ({{ $root.carrinhoInsumos.length }} ITENS)
            </button>
        </div>

    </div>
    `,
    data() {
        return {
            selecionados: [] 
        };
    },
    computed: {
        produtosLimpeza() {
            return this.$root.bancoProdutos.filter(p => p.categoria === 'limpeza');
        },
        rotasComProdutos() {
            const locaisOcupados = this.produtosLimpeza.map(p => p.local);
            return this.$root.rotasSalvas.filter(r => locaisOcupados.includes(r));
        }
    },
    methods: {
        voltar() { this.$root.vibrar(30); this.$root.mudarTela('tela-dashboard'); },
        
        produtosDaRota(nomeDaRota) { 
            return this.produtosLimpeza.filter(p => p.local === nomeDaRota); 
        },

        alternarSelecao(idProduto) {
            this.$root.vibrar(15);
            const index = this.selecionados.indexOf(idProduto);
            if (index > -1) {
                this.selecionados.splice(index, 1); 
            } else {
                this.selecionados.push(idProduto); 
            }
        },
        
        iconeDoGrupo(grupo) {
            if (grupo === 'Limpeza') return '🧹';
            return '🏷️';
        },
        corDoGrupo(grupo) {
            if (grupo === 'Limpeza') return 'background: rgba(41, 98, 255, 0.2); border: 1px solid #2962FF; color: #82B1FF;';
            return 'background: #333; border: 1px solid #555; color: #CCC;';
        },

        // 🟢 GUARDA NA LISTA COM AUTOR E HORA
        guardarNaLista() {
            this.$root.vibrar(30);
            
            const agora = new Date();
            const horaStr = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
            const dataStr = String(agora.getDate()).padStart(2, '0') + '/' + String(agora.getMonth() + 1).padStart(2, '0');
            const autorAtual = this.$root.usuario.nome;

            this.selecionados.forEach(idProduto => {
                const item = this.produtosLimpeza.find(p => p.id === idProduto);
                if (item) {
                    const stringPedido = item.nome; 
                    
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
                }
            });

            this.selecionados = []; 
            this.$root.salvarMemoriaLocal();
            
            this.$root.vibrar([50, 50, 50]);
            Swal.fire({ icon: 'success', title: 'Salvo na Lista!', text: 'Produtos de Limpeza guardados com o seu nome.', timer: 2000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
        },

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
                title: 'Lista de Terça (Insumos + Limpeza)',
                html: htmlLista,
                showCancelButton: true, confirmButtonColor: '#D50000', cancelButtonColor: '#444', confirmButtonText: '✅ Confirmar & Enviar Whats', cancelButtonText: 'Voltar', background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$root.vibrar([50, 50, 50]);
                    
                    let textoPedido = "Olá! Segue o pedido da Artigiano (Insumos & Limpeza):%0A%0A";
                    let resumoAuditoria = [];
                    
                    this.$root.carrinhoInsumos.forEach(c => {
                        textoPedido += `• ${c.textoPedido}%0A`;
                        resumoAuditoria.push(`${c.textoPedido} [Por: ${c.autor}]`);
                    });
                    textoPedido += "%0AObrigado!";
                    
                    this.$root.registrarHistorico('Pedido Gerado', 'Pedidos', `Insumos/Limpeza: ${resumoAuditoria.join(', ')}.`);
                    
                    this.$root.carrinhoInsumos = [];
                    this.$root.salvarMemoriaLocal();

                    window.open(`https://wa.me/?text=${textoPedido}`, '_blank');
                    this.$root.mudarTela('tela-dashboard');
                }
            });
        }
    }
});
