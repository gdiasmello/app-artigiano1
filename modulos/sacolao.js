// INÍCIO DO ARQUIVO modulos/sacolao.js - v0.0.89
Vue.component('tela-sacolao', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00C853;">🥕 Sacolão</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>
        
        <div v-for="rota in rotas" :key="rota" style="margin-bottom: 20px;">
            <h3 style="color: #69F0AE; border-bottom: 1px solid #333; padding-bottom: 5px;">📍 {{ rota }}</h3>
            
            <div v-for="p in produtosPorRota(rota)" :key="p.id" class="card" style="padding: 15px; margin-bottom: 10px; border-left: 4px solid #00C853; display: flex; flex-direction: column; gap: 10px;">
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <strong style="color: white; font-size: 1.1rem;">{{ p.nome }}</strong>
                        
                        <div v-if="!p.apenasNome" style="color: #888; font-size: 0.8rem;">
                            Contar: {{ p.undContagem }} | Pedir: {{ p.undCompra }} (x{{ p.fator }})
                        </div>
                        
                        <div v-if="p.apenasNome" style="color: #00C853; font-size: 0.8rem;">
                            Item Simples (Só Pedir)
                        </div>
                        
                        <div v-if="getObs(p.id)" style="color: #FFAB00; font-size: 0.85rem; margin-top: 5px;">
                            <i class="fas fa-comment-dots"></i> Obs: {{ getObs(p.id) }}
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <button @click="ajustar(p.id, -1)" class="btn-circ-sm">-</button>
                        <span style="color: white; font-size: 1.3rem; font-weight: bold; width: 30px; text-align: center;">
                            {{ getQtd(p.id) }}
                        </span>
                        <button @click="ajustar(p.id, 1)" class="btn-circ-sm" style="background: #00C853; color: #000;">+</button>
                    </div>
                </div>

                <button v-if="getQtd(p.id) > 0" @click="addObs(p.id)" style="background: #222; color: #00C853; border: 1px dashed #00C853; padding: 8px; border-radius: 5px; font-size: 0.8rem; cursor: pointer;">
                    <i class="fas fa-edit"></i> ADICIONAR OBSERVAÇÃO
                </button>

            </div>
        </div>

        <div v-if="temItens" class="animate__animated animate__fadeInUp" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 560px; z-index: 100;">
            <button @click="fecharPedido" class="btn" style="background: #25D366; color: white; box-shadow: 0 5px 15px rgba(37,211,102,0.4); font-size: 1.1rem; height: 55px;">
                <i class="fab fa-whatsapp" style="font-size: 1.3rem; margin-right: 8px;"></i> ENVIAR PEDIDO
            </button>
        </div>

        <div v-if="produtosFiltrados.length === 0" style="text-align: center; color: #666; margin-top: 50px;">
            Nenhum produto cadastrado no Sacolão.
        </div>
    </div>
    `,
    computed: {
        produtosFiltrados() { 
            return this.$root.bancoProdutos.filter(p => p.categoria === 'sacolao'); 
        },
        rotas() { 
            return [...new Set(this.produtosFiltrados.map(p => p.local))].sort(); 
        },
        temItens() { 
            return this.$root.carrinhoSacolao.length > 0; 
        }
    },
    methods: {
        produtosPorRota(r) { 
            return this.produtosFiltrados.filter(p => p.local === r).sort((a,b) => a.nome.localeCompare(b.nome)); 
        },
        getQtd(id) { 
            const i = this.$root.carrinhoSacolao.find(x => x.id === id); 
            return i ? i.qtd : 0; 
        },
        getObs(id) { 
            const i = this.$root.carrinhoSacolao.find(x => x.id === id); 
            return i ? i.obs : ''; 
        },
        ajustar(id, v) {
            this.$root.vibrar(15);
            let idx = this.$root.carrinhoSacolao.findIndex(x => x.id === id);
            
            if (idx === -1 && v > 0) { 
                this.$root.carrinhoSacolao.push({ id, qtd: v, obs: '' }); 
            } else if (idx !== -1) {
                this.$root.carrinhoSacolao[idx].qtd += v;
                if (this.$root.carrinhoSacolao[idx].qtd <= 0) {
                    this.$root.carrinhoSacolao.splice(idx, 1);
                }
            }
            this.salvarNuvem();
        },
        async addObs(id) {
            this.$root.vibrar(20);
            const idx = this.$root.carrinhoSacolao.findIndex(x => x.id === id);
            if (idx === -1) return;
            
            const { value: text } = await Swal.fire({ 
                title: 'Observação no item', 
                input: 'text', 
                inputValue: this.$root.carrinhoSacolao[idx].obs, 
                placeholder: 'Ex: Mais verde, marca X...', 
                background: '#1E1E1E', 
                color: '#FFF', 
                showCancelButton: true, 
                confirmButtonColor: '#00C853' 
            });
            
            if (text !== undefined) { 
                this.$root.carrinhoSacolao[idx].obs = text; 
                this.salvarNuvem(); 
            }
        },
        salvarNuvem() { 
            // 🟢 SALVA NO FIREBASE IMEDIATAMENTE
            db.collection("operacao").doc("carrinhoSacolao").set({ 
                itens: this.$root.carrinhoSacolao, 
                user: this.$root.usuario.nome, 
                ts: Date.now() 
            });
            this.$root.salvarMemoriaLocal();
        },
        fecharPedido() {
            this.$root.vibrar(30); 
            let txt = '';
            
            this.$root.carrinhoSacolao.forEach(item => {
                const p = this.$root.bancoProdutos.find(x => x.id === item.id);
                if (p) {
                    const obs = item.obs ? ` (Obs: ${item.obs})` : '';
                    if (p.apenasNome) { 
                        txt += `- ${item.qtd}x ${p.nome}${obs}\n`; 
                    } else { 
                        const t = item.qtd / p.fator; 
                        txt += `- ${t} ${p.undCompra} de ${p.nome}${obs}\n`; 
                    }
                }
            });
            
            if (!txt) return;
            
            this.$root.registrarHistorico('Pedido', 'Sacolão', 'Gerou lista no WhatsApp.');
            
            // 🟢 USA A MENSAGEM CONFIGURADA NO PERFIL PARA O WHATSAPP
            this.$root.enviarWhatsApp(txt); 
            
            Swal.fire({ 
                title: 'Limpar Lista?', 
                text: 'Deseja zerar os itens agora que enviou o pedido?', 
                showCancelButton: true, 
                confirmButtonColor: '#FF5252', 
                confirmButtonText: 'Sim, limpar', 
                cancelButtonColor: '#444',
                cancelButtonText: 'Manter',
                background: '#1E1E1E', 
                color: '#FFF'
            }).then((r) => {
                if (r.isConfirmed) { 
                    this.$root.carrinhoSacolao = []; 
                    this.salvarNuvem(); 
                }
            });
        }
    },
    mounted() {
        // 🟢 LÊ DO FIREBASE (Sincroniza os telemóveis)
        db.collection("operacao").doc("carrinhoSacolao").onSnapshot((doc) => {
            if (doc.exists) { 
                this.$root.carrinhoSacolao = doc.data().itens || []; 
                this.$root.salvarMemoriaLocal(); 
            }
        });
        
        if (!document.getElementById('css-sac')) {
            const s = document.createElement('style'); 
            s.id = 'css-sac';
            s.innerHTML = `
                .btn-circ-sm { 
                    width: 45px; 
                    height: 45px; 
                    border-radius: 50%; 
                    border: none; 
                    background: #333; 
                    color: white; 
                    font-size: 1.5rem; 
                    font-weight: bold; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    transition: 0.1s;
                } 
                .btn-circ-sm:active { 
                    transform: scale(0.9); 
                }
            `;
            document.head.appendChild(s);
        }
    }
});
// FIM DO ARQUIVO modulos/sacolao.js
