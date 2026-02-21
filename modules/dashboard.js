// modulos/dashboard.js - Dashboard Compacto e Seguro v0.0.53

Vue.component('tela-dashboard', {
    template: `
    <div class="container animate__animated animate__fadeIn" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
                <h2 style="margin: 0; color: var(--cor-primaria);">Olá, {{ $root.usuario.nome }}! 🍕</h2>
                <p style="margin: 0; color: var(--text-sec);">Resumo da Operação</p>
            </div>
            <button @click="$root.fazerLogout()" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>

        <div v-if="checklistsDoDia.length > 0" class="animate__animated animate__fadeInDown" style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; color: #FFF;"><i class="fas fa-tasks" style="color: #00C853;"></i> Seus Checklists Hoje</h3>
            <div v-for="chk in checklistsDoDia" :key="chk.id" class="card" style="border-left: 4px solid #00C853; background: #1A1A1A; padding: 15px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #69F0AE;">{{ chk.titulo }}</h4>
                <div v-for="tarefa in chk.tarefas" :key="tarefa.id" @click="marcarTarefa(tarefa.id, tarefa.texto)" style="display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #333; cursor: pointer;">
                    <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 5px; border: 2px solid #555; transition: 0.2s;" :style="foiFeitoHoje(tarefa.id) ? 'background: #00C853; border-color: #00C853;' : 'background: transparent;'">
                        <i v-if="foiFeitoHoje(tarefa.id)" class="fas fa-check" style="color: #121212; font-size: 0.8rem;"></i>
                    </div>
                    <span :style="foiFeitoHoje(tarefa.id) ? 'color: #666; text-decoration: line-through;' : 'color: #CCC;'">{{ tarefa.texto }}</span>
                </div>
            </div>
        </div>

        <div v-if="todosOsAvisos.length > 0" class="animate__animated animate__fadeInDown" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; color: #FFF;"><i class="fas fa-bullhorn" style="color: #FF5252;"></i> Mural de Avisos</h3>
                <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.avisos" @click="criarAvisoDialog" style="background: #2962FF; border: none; color: white; padding: 5px 12px; border-radius: 15px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">+ CRIAR</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div v-for="aviso in todosOsAvisos" :key="aviso.id" class="card" :style="aviso.importante ? 'border-left: 4px solid #FF5252; background: #2A1111;' : 'border-left: 4px solid #FFAB00; background: #222;'">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                        <strong :style="aviso.importante ? 'color: #FF5252;' : 'color: #FFAB00;'">{{ aviso.titulo || (aviso.importante ? '⚠️ URGENTE' : '📌 AVISO') }}</strong>
                        <div style="display: flex; gap: 12px; align-items: center;">
                            <small v-if="!aviso.isAniversario" style="color: #888;">{{ aviso.autor }}</small>
                            <small v-else class="animate__animated animate__tada animate__infinite" style="color: #FFAB00; font-size: 1.2rem;">🎉🎈🎁</small>
                            <button v-if="aviso.isManual" @click="excluirAviso(aviso.id)" style="background: none; border: none; color: #FF5252; font-size: 1.1rem; cursor: pointer; padding: 0;"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                    <div v-if="aviso.cargoDestino && aviso.cargoDestino !== 'Todos'" style="margin-bottom: 8px;"><span style="background: #333; color: #00B0FF; padding: 3px 8px; border-radius: 5px; font-size: 0.75rem; border: 1px solid #00B0FF;"><i class="fas fa-user-tag"></i> Apenas {{ aviso.cargoDestino }}s</span></div>
                    <p style="color: white; margin: 0; font-size: 1rem;">{{ aviso.texto }}</p>
                    <div v-if="aviso.acao === 'contarMassas'" style="margin-top: 15px; border-top: 1px dashed #555; padding-top: 15px;">
                        <label style="color: #CCC; font-size: 0.9rem; margin-bottom: 8px; display: block;">Digite a quantidade:</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="number" inputmode="numeric" v-model.number="inputMassas" placeholder="Ex: 15" style="flex: 1; padding: 12px; background: #111; border: 1px solid var(--cor-primaria); border-radius: 8px; color: white; font-size: 1.2rem; text-align: center;">
                            <button @click="confirmarMassasHoje" style="background: var(--cor-primaria); color: #121212; border: none; padding: 0 25px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.1rem;">OK</button>
                        </div>
                    </div>
                    <div v-if="aviso.acao === 'verificarGelo'" style="margin-top: 15px; text-align: right; border-top: 1px dashed #555; padding-top: 10px;">
                        <button @click="irParaGelo" style="background: #00B0FF; color: #121212; border: none; padding: 8px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 0.85rem;"><i class="fas fa-snowflake"></i> IR PARA O GELO</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.avisos" style="text-align: right; margin-bottom: 20px;">
            <button @click="criarAvisoDialog" style="background: #2C2C2C; border: 1px solid #444; color: white; padding: 8px 15px; border-radius: 15px; cursor: pointer; font-size: 0.8rem;"><i class="fas fa-plus"></i> Novo Aviso</button>
        </div>

        <div class="card" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div><h3 style="margin:0"><i class="fas fa-cloud"></i> Londrina</h3><small>Modo IA: <b :style="{color: $root.clima.modoSmart ? '#00E676' : '#FF5252'}">{{ $root.clima.modoSmart ? 'ATIVADO' : 'DESLIGADO' }}</b></small></div>
            <div style="font-size: 2.2rem; font-weight: bold;"><i v-if="$root.clima.isCalor" class="fas fa-sun" style="color: #FFAB00; font-size: 1.5rem; margin-right: 5px;"></i>{{ $root.clima.temperatura }}°C</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div v-if="$root.usuario.permissoes.producao || $root.usuario.permissoes.admin" class="menu-item" @click="$root.mudarTela('tela-massa')" style="background: var(--bg-card); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(255,171,0,0.3); cursor: pointer;"><i class="fas fa-calculator" style="font-size: 2rem; color: var(--cor-primaria); margin-bottom: 10px;"></i><div style="font-weight: bold;">Produção</div></div>
            <div v-if="$root.usuario.permissoes.pedidos || $root.usuario.permissoes.admin" class="menu-item" @click="$root.mudarTela('tela-sacolao')" style="background: var(--bg-card); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(0,200,83,0.3); cursor: pointer;"><i class="fas fa-carrot" style="font-size: 2rem; color: #00C853; margin-bottom: 10px;"></i><div style="font-weight: bold;">Sacolão</div></div>
            <div v-if="$root.usuario.permissoes.pedidos || $root.usuario.permissoes.admin" class="menu-item" @click="$root.mudarTela('tela-insumos')" style="background: var(--bg-card); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(213,0,0,0.3); cursor: pointer;"><i class="fas fa-box-open" style="font-size: 2rem; color: #D50000; margin-bottom: 10px;"></i><div style="font-weight: bold;">Insumos</div></div>
            <div v-if="$root.usuario.permissoes.pedidos || $root.usuario.permissoes.admin" class="menu-item" @click="$root.mudarTela('tela-gelo')" style="background: var(--bg-card); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(0,176,255,0.3); cursor: pointer;"><i class="fas fa-snowflake" style="font-size: 2rem; color: #00B0FF; margin-bottom: 10px;"></i><div style="font-weight: bold;">Gelo</div></div>
            <div v-if="$root.usuario.permissoes.limpeza || $root.usuario.permissoes.admin" class="menu-item" @click="$root.mudarTela('tela-limpeza')" style="background: var(--bg-card); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(41,98,255,0.3); cursor: pointer;"><i class="fas fa-broom" style="font-size: 2rem; color: #2962FF; margin-bottom: 10px;"></i><div style="font-weight: bold;">Limpeza</div></div>
            <div v-if="$root.usuario.permissoes.historico || $root.usuario.permissoes.admin" class="menu-item" @click="$root.mudarTela('tela-historico')" style="background: var(--bg-card); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(224,224,224,0.3); cursor: pointer;"><i class="fas fa-history" style="font-size: 2rem; color: #E0E0E0; margin-bottom: 10px;"></i><div style="font-weight: bold;">Auditoria</div></div>
            <div v-if="$root.usuario.permissoes.gerenciar || $root.usuario.permissoes.admin" class="menu-item" @click="$root.mudarTela('tela-ajustes')" style="grid-column: span 2; background: var(--bg-card); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(170,170,170,0.3); cursor: pointer;"><i class="fas fa-cog" style="font-size: 2rem; color: #AAAAAA; margin-bottom: 10px;"></i><div style="font-weight: bold;">Ajustes & ERP</div></div>
        </div>
    </div>
    `,
    data() { return { inputMassas: '' }; },
    computed: {
        checklistsDoDia() {
            const hojeIndex = new Date().getDay(); 
            return this.$root.bancoChecklists.filter(chk => {
                if (!chk.diasSemana.includes(hojeIndex)) return false;
                if (this.$root.usuario.permissoes.admin) return true;
                if (chk.cargoDestino === 'Todos') return true;
                return chk.cargoDestino === this.$root.usuario.cargo;
            });
        },
        todosOsAvisos() {
            let listaFinal = [];
            const hoje = new Date(); const hojeStr = hoje.toISOString().split('T')[0]; 
            if (this.$root.dataEstoqueMassas !== hojeStr && this.$root.naPizzaria && (this.$root.usuario.permissoes.producao || this.$root.usuario.permissoes.admin)) {
                listaFinal.push({ id: 'aviso-massas', titulo: '🍕 MISSÃO DIÁRIA', texto: 'Quantas massas sobraram hoje?', autor: 'IA', importante: true, acao: 'contarMassas', isManual: false, cargoDestino: 'Todos' });
            }
            if (this.$root.clima.modoSmart && this.$root.clima.isCalor && !this.$root.clima.geloVerificado && (this.$root.usuario.permissoes.pedidos || this.$root.usuario.permissoes.admin)) {
                listaFinal.push({ id: 'aviso-gelo', titulo: '🧊 CALOR', texto: `Temperatura: ${this.$root.clima.temperatura}°C! Verifiquem gelo.`, autor: 'IA', importante: true, acao: 'verificarGelo', isManual: false, cargoDestino: 'Todos' });
            }
            const mesDia = String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0');
            this.$root.equipe.forEach(m => {
                if (m.nascimento && m.nascimento.endsWith(mesDia)) listaFinal.push({ id: 'niver-'+m.id, titulo: '🎂 ANIVERSÁRIO!', texto: `Niver de ${m.nome}!`, isAniversario: true, importante: true, isManual: false, cargoDestino: 'Todos' });
            });
            const agora = new Date();
            const avisosManuais = this.$root.avisos.filter(a => new Date(a.dataExpiracao) > agora).filter(a => {
                if (a.cargoDestino === 'Todos' || !a.cargoDestino) return true;
                if (this.$root.usuario.permissoes.admin) return true;
                return a.cargoDestino === this.$root.usuario.cargo;
            }).map(a => ({ ...a, isManual: true }));
            return listaFinal.concat(avisosManuais);
        }
    },
    methods: {
        foiFeitoHoje(idTarefa) {
            const hojeStr = new Date().toISOString().split('T')[0];
            return this.$root.tarefasConcluidas.some(t => t.idTarefa === idTarefa && t.dataAcao === hojeStr);
        },
        marcarTarefa(idTarefa, textoTarefa) {
            this.$root.vibrar(15);
            const hojeStr = new Date().toISOString().split('T')[0];
            const index = this.$root.tarefasConcluidas.findIndex(t => t.idTarefa === idTarefa && t.dataAcao === hojeStr);
            if (index > -1) { this.$root.tarefasConcluidas.splice(index, 1); } 
            else {
                this.$root.tarefasConcluidas.push({ idTarefa: idTarefa, dataAcao: hojeStr });
                this.$root.vibrar([30, 30]); 
                this.$root.registrarHistorico('Checklist', 'Rotina', `Concluído: "${textoTarefa}"`);
            }
        },
        excluirAviso(id) {
            this.$root.vibrar(30);
            this.$root.autorizarAcao('remover', () => {
                Swal.fire({ title: 'Apagar?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#FF5252', background: '#1E1E1E', color: '#FFF' }).then((res) => {
                    if (res.isConfirmed) {
                        this.$root.avisos = this.$root.avisos.filter(a => a.id !== id);
                        this.$root.salvarMemoriaLocal(); this.$root.vibrar([50, 50]); Swal.fire({ icon: 'success', title: 'Apagado!', timer: 1000, showConfirmButton: false, background: '#1E1E1E' });
                    }
                });
            });
        },
        confirmarMassasHoje() {
            this.$root.vibrar(30);
            if (!this.inputMassas) return;
            Swal.fire({ title: 'Confirmação', text: `Temos ${this.inputMassas} massas?`, icon: 'question', showCancelButton: true, confirmButtonColor: '#00C853', background: '#1E1E1E', color: '#FFF' }).then((res) => {
                if (res.isConfirmed) {
                    this.$root.vibrar([50, 50]);
                    this.$root.estoqueMassasHoje = Number(this.inputMassas); this.$root.dataEstoqueMassas = new Date().toISOString().split('T')[0]; 
                    this.$root.registrarHistorico('Estoque', 'Produção', `${this.inputMassas} massas.`); this.inputMassas = '';
                }
            });
        },
        irParaGelo() { this.$root.vibrar(30); this.$root.clima.geloVerificado = true; this.$root.mudarTela('tela-gelo'); },
        abrirHistorico() { this.$root.vibrar(30); this.$root.mudarTela('tela-historico'); },
        async criarAvisoDialog() {
            this.$root.vibrar(30);
            const { value: formValues } = await Swal.fire({
                title: 'Novo Aviso',
                html: `<textarea id="av-txt" style="width:100%;height:80px;background:#2C2C2C;color:#FFF;padding:10px;"></textarea>
                       <div style="display:flex;gap:10px;margin-top:10px;"><input type="number" id="av-val" value="24" style="flex:1;background:#2C2C2C;color:#FFF;"><select id="av-uni" style="flex:1;background:#2C2C2C;color:#FFF;"><option value="horas">Horas</option><option value="dias">Dias</option></select></div>
                       <select id="av-dest" style="width:100%;margin-top:10px;background:#2C2C2C;color:#FFF;padding:10px;"><option value="Todos">Toda a Equipe</option><option value="Pizzaiolo">Pizzaiolos</option><option value="Atendente">Atendentes</option><option value="Gerente">Gerentes</option></select>
                       <label style="display:block;margin-top:15px;color:white;"><input type="checkbox" id="av-urg">⚠️ Urgente</label>`,
                background: '#1E1E1E', color: '#FFF', showCancelButton: true, confirmButtonColor: '#2962FF',
                preConfirm: () => { if(!document.getElementById('av-txt').value) return false; return true; }
            });
            if (formValues) {
                const min = document.getElementById('av-uni').value === 'horas' ? Number(document.getElementById('av-val').value)*60 : Number(document.getElementById('av-val').value)*24*60;
                const exp = new Date(); exp.setMinutes(exp.getMinutes() + min);
                this.$root.avisos.push({ id: Date.now(), texto: document.getElementById('av-txt').value, autor: this.$root.usuario.nome, dataExpiracao: exp.toISOString(), importante: document.getElementById('av-urg').checked, cargoDestino: document.getElementById('av-dest').value });
                this.$root.salvarMemoriaLocal();
            }
        }
    }
});
// AQUI É O FINAL EXATO DO CÓDIGO - CERTIFIQUE-SE DE COPIAR ESTA LINHA!
