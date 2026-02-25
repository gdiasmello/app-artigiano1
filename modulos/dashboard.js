/**
 * Dashboard v2.15.0
 * Interface principal com controle de permissões e IA integrada.
 */
Vue.component('tela-dashboard', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
            <div>
                <h2 style="margin:0; color:white; text-transform: capitalize;">Olá, {{ $root.usuario.nome }} 👋</h2>
                <p style="margin:5px 0 0 0; color:#AAA; font-size:0.85rem;">
                    <i class="fas fa-user-tag" style="color:var(--cor-primaria);"></i> {{ $root.usuario.cargo }}
                </p>
                <p v-if="$root.clima.temperatura !== 'Off'" style="margin:2px 0 0 0; color:var(--cor-secundaria); font-size:0.8rem;">
                    <i class="fas fa-temperature-high"></i> Londrina: {{ $root.clima.temperatura }}°C
                </p>
            </div>
            <button @click="$root.fazerLogout()" style="background:rgba(255,82,82,0.1); border:1px solid var(--cor-erro); color:var(--cor-erro); padding:10px 15px; border-radius:8px; font-weight:bold;">
                <i class="fas fa-sign-out-alt"></i> Sair
            </button>
        </div>

        <!-- Alerta de Reset de Senha (Só Gerentes) -->
        <div v-if="podeVerAjustes && $root.pedidosResetSenha.length > 0" 
             @click="$root.mudarTela('tela-ajustes-equipe')" 
             class="card animate__animated animate__pulse animate__infinite" 
             style="background: var(--cor-erro); padding: 15px; margin-bottom: 20px; cursor: pointer; color: white; border: none;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-key"></i> 
                <span>{{ $root.pedidosResetSenha.length }} pedido(s) de reset de PIN pendentes!</span>
            </div>
        </div>

        <!-- Mural de IA e Avisos -->
        <div style="margin-bottom:25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong style="color:var(--cor-primaria); font-size: 0.9rem;">
                    <i class="fas fa-bullhorn"></i> MURAL & INSIGHTS
                </strong>
                <button v-if="podeVerAjustes" @click="$root.mudarTela('tela-ajustes-avisos')" style="background: var(--cor-primaria); color: #121212; border: none; padding: 6px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(255, 171, 0, 0.2);">
                    <i class="fas fa-plus-circle"></i> NOVO AVISO
                </button>
            </div>
            
            <div v-if="avisosConsolidados.length > 0" class="animate__animated animate__fadeInDown">
                <div v-for="aviso in avisosConsolidados" 
                     :key="aviso.id" 
                     @click="navegarAviso(aviso)" 
                     :style="getEstiloAviso(aviso)" 
                     class="card-aviso">
                    
                    <div style="flex:1;">
                        <div class="aviso-header">
                            <i :class="['fas', aviso.icone || 'fa-info-circle']"></i>
                            <span>{{ getTituloAviso(aviso) }}</span>
                        </div>
                        <p class="aviso-texto">{{ aviso.texto }}</p>
                    </div>
                    
                    <i v-if="aviso.telaDestino" class="fas fa-chevron-right" style="opacity: 0.5;"></i>
                </div>
            </div>
            <div v-else class="card" style="padding: 15px; text-align: center; background: rgba(255,255,255,0.02); border: 1px dashed #333;">
                <span style="color: #555; font-size: 0.8rem;">Nenhum aviso ou insight no momento.</span>
            </div>
        </div>

        <!-- Grid de Módulos (Permissões Dinâmicas) -->
        <div class="grid-modulos">
            <button v-if="podeVer('verMassa')" @click="$root.mudarTela('tela-massa')" class="card-modulo" style="border-bottom: 4px solid var(--cor-primaria);">
                <i class="fas fa-pizza-slice" style="color:var(--cor-primaria);"></i>
                <span>Produção</span>
            </button>
            
            <button v-if="podeVer('verSacolao')" @click="$root.mudarTela('tela-sacolao')" class="card-modulo" style="border-bottom: 4px solid var(--cor-sucesso);">
                <i class="fas fa-carrot" style="color:var(--cor-sucesso);"></i>
                <span>Sacolão</span>
            </button>
            
            <button v-if="podeVer('verInsumos')" @click="$root.mudarTela('tela-insumos')" class="card-modulo" style="border-bottom: 4px solid var(--cor-erro);">
                <i class="fas fa-box-open" style="color:var(--cor-erro);"></i>
                <span>Insumos</span>
            </button>
            
            <button v-if="podeVer('verInsumos')" @click="$root.mudarTela('tela-gelo')" class="card-modulo" style="border-bottom: 4px solid var(--cor-secundaria);">
                <i class="fas fa-snowflake" style="color:var(--cor-secundaria);"></i>
                <span>Gelo</span>
            </button>
            
            <button v-if="podeVer('verLimpeza')" @click="$root.mudarTela('tela-limpeza')" class="card-modulo" style="border-bottom: 4px solid #2962FF;">
                <i class="fas fa-broom" style="color:#2962FF;"></i>
                <span>Limpeza</span>
            </button>
            
            <button v-if="podeVer('verHistorico')" @click="$root.mudarTela('tela-historico')" class="card-modulo" style="border-bottom: 4px solid #E0E0E0;">
                <i class="fas fa-history" style="color:#E0E0E0;"></i>
                <span>Auditoria</span>
            </button>
        </div>

        <!-- Footer Actions -->
        <div style="margin-top:25px;">
            <button @click="$root.mudarTela('tela-ajustes')" class="btn" style="background:#2C2C2C; color:white; border:1px solid #444; height:60px;">
                <i class="fas fa-cog"></i> Ajustes & Gestão
            </button>
        </div>

    </div>
    `,
    computed: {
        avisosConsolidados() {
            const humanos = this.$root.avisos.filter(a => {
                if (a.expiracao && a.expiracao !== 'perm' && Date.now() > a.expiracao) return false;
                
                const isParaTodos = a.publico === 'Todos';
                const isParaMeuCargo = a.publico === this.$root.usuario.cargo;
                const isParaMim = a.publico === `user_${this.$root.usuario.id}`;
                const souAdmin = this.$root.usuario.permissoes?.admin;

                return isParaTodos || isParaMeuCargo || isParaMim || souAdmin;
            }).map(a => ({ ...a, origem: 'humano' }));
            
            const ia = window.MotorIA ? window.MotorIA.analisar(this.$root).map(a => ({ ...a, origem: 'ia' })) : [];
            const checklists = window.IA_Checklist ? window.IA_Checklist.analisar(this.$root).map(a => ({ ...a, origem: 'checklist' })) : [];
            
            // Verificação de Sazonais (Apenas para Admin/Gerente)
            let sazonais = [];
            if (this.podeVerAjustes) {
                const hoje = new Date().toISOString().split('T')[0];
                sazonais = this.$root.bancoProdutos
                    .filter(p => p.sazonal && p.validadeSazonal && p.validadeSazonal < hoje)
                    .map(p => ({
                        id: `sazonal_${p.nome}`,
                        tipo: 'sazonal',
                        origem: 'sistema',
                        titulo: 'PRODUTO SAZONAL EXPIRADO',
                        texto: `O prazo do produto "${p.nome}" (${p.contextoSazonal}) acabou. Ainda está sendo vendido?`,
                        icone: 'fa-calendar-times',
                        cor: '#FFAB00',
                        acao: true, // Flag para indicar que tem interação
                        produto: p
                    }));
            }

            return [...sazonais, ...ia, ...checklists, ...humanos];
        },
        podeVerAjustes() {
            return this.$root.usuario?.permissoes?.admin || this.$root.usuario?.cargo === 'Gerente';
        }
    },
    methods: {
        podeVer(permissao) {
            if (this.$root.usuario?.permissoes?.admin) return true;
            return this.$root.usuario?.permissoes?.[permissao];
        },
        navegarAviso(aviso) {
            if (aviso.tipo === 'sazonal') {
                Swal.fire({
                    title: 'Produto Sazonal Expirado',
                    text: `O produto "${aviso.produto.nome}" ainda está sendo vendido?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, manter (+15 dias)',
                    cancelButtonText: 'Não, remover produto',
                    confirmButtonColor: '#00E676',
                    cancelButtonColor: '#FF5252',
                    background: '#1E1E1E', color: '#FFF'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Adicionar 15 dias à validade
                        const novaData = new Date();
                        novaData.setDate(novaData.getDate() + 15);
                        aviso.produto.validadeSazonal = novaData.toISOString().split('T')[0];
                        
                        // Atualizar no banco
                        const index = this.$root.bancoProdutos.findIndex(p => p.nome === aviso.produto.nome);
                        if (index > -1) {
                            this.$root.bancoProdutos[index] = aviso.produto;
                            db.collection('configuracoes').doc('bancoProdutos').set({ lista: this.$root.bancoProdutos });
                            Swal.fire('Atualizado!', 'Validade estendida por 15 dias.', 'success');
                        }
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // Remover produto
                        const index = this.$root.bancoProdutos.findIndex(p => p.nome === aviso.produto.nome);
                        if (index > -1) {
                            this.$root.bancoProdutos.splice(index, 1);
                            db.collection('configuracoes').doc('bancoProdutos').set({ lista: this.$root.bancoProdutos });
                            Swal.fire('Removido!', 'O produto foi excluído do estoque.', 'success');
                        }
                    }
                });
                return;
            }

            // Remover aviso do mural ao clicar
            if (aviso.origem === 'ia' && window.MotorIA) {
                window.MotorIA.removerAviso(aviso.id);
            } else if (aviso.origem === 'checklist' && window.IA_Checklist) {
                window.IA_Checklist.removerAviso(aviso.id);
            } else if (aviso.origem === 'humano') {
                const index = this.$root.avisos.findIndex(a => a.id === aviso.id);
                if (index > -1) {
                    this.$root.avisos.splice(index, 1);
                }
            }

            if (aviso.origem !== 'ia') {
                if (aviso.dados) this.$root.dadosNavegacao = aviso.dados;
                if (aviso.telaDestino) this.$root.mudarTela(aviso.telaDestino);
            }

        },
        getTituloAviso(aviso) {
            if (aviso.tipo === 'sazonal') return aviso.titulo;
            if (aviso.origem === 'ia') {
                const titulos = { 'festa': 'DIA ESPECIAL', 'gelo': 'CLIMA', 'urgente': 'ALERTA' };
                return titulos[aviso.tipo] || 'DICA';
            }
            if (aviso.origem === 'checklist') return 'ROTINA OPERACIONAL';
            return aviso.urgente ? 'COMUNICADO URGENTE' : 'AVISO DA EQUIPE';
        },
        getEstiloAviso(aviso) {
            let cor = 'var(--cor-primaria)';
            if (aviso.tipo === 'festa') cor = 'var(--cor-sucesso)';
            if (aviso.tipo === 'gelo') cor = 'var(--cor-secundaria)';
            if (aviso.origem === 'checklist') cor = '#00E676';
            if (aviso.tipo === 'urgente' || aviso.urgente) cor = 'var(--cor-erro)';
            
            return {
                borderLeft: `4px solid ${cor}`,
                background: `linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)`,
                cursor: aviso.telaDestino ? 'pointer' : 'default'
            };
        }
    },
    mounted() {
        if (!document.getElementById('css-dashboard')) {
            const style = document.createElement('style');
            style.id = 'css-dashboard';
            style.innerHTML = `
                .grid-modulos { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .card-modulo { 
                    background: var(--bg-card); 
                    border: 1px solid #333; 
                    border-radius: 12px; 
                    padding: 20px; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    gap: 10px; 
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .card-modulo:active { transform: scale(0.95); }
                .card-modulo i { font-size: 2rem; }
                .card-modulo span { color: white; font-weight: 600; font-size: 0.95rem; }
                
                .card-aviso { 
                    background: #222; 
                    border-radius: 10px; 
                    padding: 15px; 
                    margin-bottom: 10px; 
                    display: flex; 
                    align-items: center; 
                    gap: 15px;
                }
                .aviso-header { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 5px; opacity: 0.8; }
                .aviso-texto { color: white; font-size: 0.9rem; margin: 0; line-height: 1.4; }
            `;
            document.head.appendChild(style);
        }
    }
});
