// INÍCIO DO ARQUIVO modulos/dashboard.js - v0.0.81
Vue.component('tela-dashboard', {
    template: `
    <div class="container animate__animated animate__fadeIn" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
                <h2 style="margin: 0; color: var(--cor-primaria);">Olá, {{ $root.usuario.nome }}! 🍕</h2>
                <p style="margin: 0; color: var(--text-sec);">{{ $root.usuario.cargo }} | Artigiano</p>
            </div>
            <button @click="$root.fazerLogout()" style="background: none; border: none; color: #FF5252; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>

        <div v-if="checklistsDoDia.length > 0" class="animate__animated animate__fadeInDown" style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; color: #FFF; font-size: 1.1rem;"><i class="fas fa-tasks" style="color: #00C853;"></i> Checklists Hoje</h3>
            <div v-for="chk in checklistsDoDia" :key="chk.id" class="card" style="border-left: 4px solid #00C853; background: #1A1A1A; padding: 15px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #69F0AE;">{{ chk.titulo }}</h4>
                <div v-for="t in chk.tarefas" :key="t.id" @click="marcarTarefa(t.id, t.texto)" style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #333; cursor: pointer;">
                    <div style="width: 24px; height: 24px; border-radius: 5px; border: 2px solid #555; display: flex; align-items: center; justify-content: center;" :style="foiFeitoHoje(t.id) ? 'background: #00C853; border-color: #00C853;' : ''">
                        <i v-if="foiFeitoHoje(t.id)" class="fas fa-check" style="color: #121212; font-size: 0.8rem;"></i>
                    </div>
                    <span :style="foiFeitoHoje(t.id) ? 'color: #666; text-decoration: line-through;' : 'color: #CCC;'">{{ t.texto }}</span>
                </div>
            </div>
        </div>

        <div v-if="temAlgumAviso" class="animate__animated animate__fadeInDown" style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #FFF; font-size: 1.1rem;"><i class="fas fa-bullhorn" style="color: #FF5252;"></i> Mural de Avisos</h3>
            
            <div v-for="p in $root.pedidosResetSenha" :key="'p'+p.id" class="card" style="border-left: 4px solid #FF5252; background: #2A1111;" v-if="$root.usuario.permissoes.admin">
                <strong style="color: #FF5252;"><i class="fas fa-key"></i> RESET DE SENHA</strong>
                <p style="color: white; margin: 10px 0;"><b>{{ p.nome }}</b> esqueceu a senha e pediu reset. Autoriza?</p>
                <div style="display: flex; gap: 10px;">
                    <button @click="autorizarReset(p)" style="flex: 1; background: #00E676; color: #121212; border: none; padding: 12px; border-radius: 8px; font-weight: bold;">SIM</button>
                    <button @click="recusarReset(p.id)" style="flex: 1; background: #444; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold;">NÃO</button>
                </div>
            </div>

            <div v-for="a in avisosAtivos" :key="a.id" class="card" :style="a.importante ? 'border-left: 4px solid #FF5252; background: #2A1111;' : 'border-left: 4px solid #FFAB00; background: #222;'">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <strong :style="a.importante ? 'color: #FF5252;' : 'color: #FFAB00;'">{{ a.titulo }}</strong>
                    <button v-if="a.isManual" @click="excluirAviso(a.id)" style="background:none; border:none; color:#FF5252; opacity: 0.6;"><i class="fas fa-trash-alt"></i></button>
                </div>
                <p style="color: white; margin: 5px 0; font-size: 0.95rem;">{{ a.texto }}</p>
                
                <div v-if="a.acao === 'contarMassas'" style="margin-top: 12px; display: flex; gap: 10px;">
                    <input type="number" inputmode="numeric" v-model.number="inputMassas" placeholder="Qtd" style="flex: 1; padding: 12px; background: #111; border: 1px solid var(--cor-primaria); color: white; border-radius: 8px; text-align: center;">
                    <button @click="confirmarMassasHoje" style="background: var(--cor-primaria); color: #121212; padding: 0 20px; border-radius: 8px; font-weight: bold; border: none;">OK</button>
                </div>

                <div v-if="a.acao === 'resolverSazonal'" style="margin-top: 12px; display: flex; gap: 10px;">
                    <button @click="$root.resolverPizzaSazonal(a.nomePizza, true)" style="flex: 1; background: #2962FF; color: white; padding: 12px; border-radius: 8px; font-weight: bold; border: none;">SIM</button>
                    <button @click="$root.resolverPizzaSazonal(a.nomePizza, false)" style="flex: 1; background: #FF5252; color: white; padding: 12px; border-radius: 8px; font-weight: bold; border: none;">NÃO</button>
                </div>
            </div>
        </div>

        <div class="card" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border: none;">
            <div>
                <h3 style="margin:0; font-size: 1.1rem;"><i class="fas fa-cloud-sun"></i> Londrina, PR</h3>
                <small style="opacity: 0.8;">Modo IA: {{ $root.clima.modoSmart ? 'Ativado' : 'Manual' }}</small>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 2rem; font-weight: 900;">{{ $root.clima.temperatura }}°C</div>
                <small v-if="$root.clima.isCalor" style="color: #FFAB00; font-weight: bold;">ALERTA DE CALOR</small>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            
            <div v-if="$root.usuario.permissoes.producao || $root.usuario.permissoes.admin" @click="$root.mudarTela('tela-massa')" class="menu-item-box">
                <i class="fas fa-calculator" style="color: var(--cor-primaria);"></i><span>Produção</span>
            </div>

            <div v-if="$root.usuario.permissoes.pedidos || $root.usuario.permissoes.admin" @click="$root.mudarTela('tela-sacolao')" class="menu-item-box">
                <i class="fas fa-carrot" style="color: #00C853;"></i><span>Sacolão</span>
            </div>

            <div v-if="$root.usuario.permissoes.pedidos || $root.usuario.permissoes.admin" @click="$root.mudarTela('tela-insumos')" class="menu-item-box">
                <i class="fas fa-box-open" style="color: #D50000;"></i><span>Insumos</span>
            </div>

            <div v-if="$root.usuario.permissoes.limpeza || $root.usuario.permissoes.admin" @click="$root.mudarTela('tela-limpeza')" class="menu-item-box">
                <i class="fas fa-broom" style="color: #2962FF;"></i><span>Limpeza</span>
            </div>

            <div v-if="$root.usuario.permissoes.pedidos || $root.usuario.permissoes.admin" @click="$root.mudarTela('tela-gelo')" class="menu-item-box">
                <i class="fas fa-snowflake" style="color: #00B0FF;"></i><span>Gelo</span>
            </div>

            <div v-if="$root.usuario.permissoes.historico || $root.usuario.permissoes.admin" @click="$root.mudarTela('tela-historico')" class="menu-item-box">
                <i class="fas fa-history" style="color: #E0E0E0;"></i><span>Auditoria</span>
            </div>

            <div v-if="$root.usuario.permissoes.gerenciar || $root.usuario.permissoes.admin" @click="$root.mudarTela('tela-ajustes')" style="grid-column: span 2;" class="menu-item-box">
                <i class="fas fa-cog" style="color: #AAAAAA;"></i><span>Ajustes & ERP</span>
            </div>
        </div>

    </div>
    `,
    data() {
        return { inputMassas: '' };
    },
    computed: {
        checklistsDoDia() {
            const hj = new Date().getDay();
            return this.$root.bancoChecklists.filter(chk => {
                if (!chk.diasSemana.includes(hj)) return false;
                return this.$root.usuario.permissoes.admin || chk.cargoDestino === 'Todos' || chk.cargoDestino === this.$root.usuario.cargo;
            });
        },
        avisosAtivos() {
            let lista = [];
            const hoje = new Date();
            const hjStr = hoje.toISOString().split('T')[0];

            // 1. Missão de Contagem de Massas
            if (this.$root.dataEstoqueMassas !== hjStr && (this.$root.usuario.permissoes.producao || this.$root.usuario.permissoes.admin)) {
                lista.push({ id: 'm-massas', titulo: '🍕 MISSÃO DIÁRIA', texto: 'Quantas massas sobraram na geladeira?', acao: 'contarMassas', importante: true });
            }

            // 2. Alerta de Gelo (IA baseada no Clima)
            if (this.$root.clima.isCalor && !this.$root.clima.geloVerificado) {
                lista.push({ id: 'm-gelo', titulo: '🧊 ALERTA TÉRMICO', texto: 'Calor acima de 27°C. Verifiquem o estoque de gelo!', importante: true });
            }

            // 3. Revisão Sazonal (IA de Cardápio)
            this.$root.bancoProdutos.forEach(p => {
                if (p.sazonal?.ativa && new Date(p.sazonal.dataExpiracao) <= hoje) {
                    if (!lista.some(x => x.nomePizza === p.sazonal.nomePizza)) {
                        lista.push({ id: 'saz-'+p.sazonal.nomePizza, titulo: '⏳ IA: REVISÃO SAZONAL', texto: 'A validade da pizza "'+p.sazonal.nomePizza+'" expirou. Manter?', acao: 'resolverSazonal', nomePizza: p.sazonal.nomePizza, importante: true });
                    }
                }
            });

            // 4. Aniversários da Equipa
            const md = String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0');
            this.$root.equipe.forEach(m => {
                if (m.nascimento && m.nascimento.endsWith(md)) {
                    lista.push({ id: 'niver-'+m.id, titulo: '🎂 PARABÉNS!', texto: 'Hoje é o aniversário de ' + m.nome + '! 🎉', importante: true });
                }
            });

            // 5. Avisos Manuais
            const avisosManuais = this.$root.avisos.filter(a => new Date(a.dataExpiracao) > hoje).filter(a => {
                return a.cargoDestino === 'Todos' || this.$root.usuario.permissoes.admin || a.cargoDestino === this.$root.usuario.cargo;
            }).map(a => ({ ...a, isManual: true }));

            return lista.concat(avisosManuais);
        },
        temAlgumAviso() {
            return this.avisosAtivos.length > 0 || (this.$root.pedidosResetSenha.length > 0 && this.$root.usuario.permissoes.admin);
        }
    },
    methods: {
        foiFeitoHoje(id) {
            return this.$root.tarefasConcluidas.some(t => t.idTarefa === id && t.dataAcao === new Date().toISOString().split('T')[0]);
        },
        marcarTarefa(id, txt) {
            this.$root.vibrar(20);
            const hj = new Date().toISOString().split('T')[0];
            const i = this.$root.tarefasConcluidas.findIndex(t => t.idTarefa === id && t.dataAcao === hj);
            if (i > -1) {
                this.$root.tarefasConcluidas.splice(i, 1);
            } else {
                this.$root.tarefasConcluidas.push({ idTarefa: id, dataAcao: hj });
                this.$root.vibrar([30, 30]);
                this.$root.registrarHistorico('Checklist', 'Rotina', txt);
            }
        },
        confirmarMassasHoje() {
            if (this.inputMassas === '' || this.inputMassas < 0) return;
            this.$root.vibrar([50, 50]);
            this.$root.estoqueMassasHoje = this.inputMassas;
            this.$root.dataEstoqueMassas = new Date().toISOString().split('T')[0];
            this.$root.registrarHistorico('Contagem', 'Produção', this.inputMassas + ' massas em estoque.');
            this.inputMassas = '';
            Swal.fire({ icon: 'success', title: 'Contagem Registada!', timer: 1200, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
        },
        autorizarReset(p) {
            this.$root.vibrar([50, 50]);
            const uIdx = this.$root.equipe.findIndex(u => u.id === p.idUsuario);
            if (uIdx !== -1) {
                this.$root.equipe[uIdx].pin = '1234'; // Volta para a senha provisória
                this.$root.pedidosResetSenha = this.$root.pedidosResetSenha.filter(x => x.id !== p.id);
                this.$root.salvarMemoriaLocal();
                Swal.fire({ icon: 'success', title: 'Senha Resetada!', text: 'O PIN do ' + p.nome + ' agora é 1234.', background: '#1E1E1E', color: '#FFF' });
            }
        },
        recusarReset(id) {
            this.$root.pedidosResetSenha = this.$root.pedidosResetSenha.filter(x => x.id !== id);
            this.$root.salvarMemoriaLocal();
        },
        excluirAviso(id) {
            this.$root.vibrar(20);
            this.$root.avisos = this.$root.avisos.filter(a => a.id !== id);
            this.$root.salvarMemoriaLocal();
        }
    },
    mounted() {
        if (!document.getElementById('css-dashboard-v81')) {
            const style = document.createElement('style');
            style.id = 'css-dashboard-v81';
            style.innerHTML = `
                .menu-item-box { 
                    background: var(--bg-card); padding: 22px 15px; border-radius: 18px; 
                    text-align: center; border: 1px solid #2A2A2A; cursor: pointer; 
                    display: flex; flex-direction: column; align-items: center; gap: 10px; 
                    transition: all 0.2s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                .menu-item-box:active { transform: scale(0.92); background: #252525; border-color: #444; }
                .menu-item-box i { font-size: 2.2rem; }
                .menu-item-box span { font-weight: bold; color: white; font-size: 0.95rem; letter-spacing: 0.5px; }
            `;
            document.head.appendChild(style);
        }
    }
});
// FIM DO ARQUIVO modulos/dashboard.js
