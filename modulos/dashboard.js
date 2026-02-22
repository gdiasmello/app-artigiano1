// INÍCIO DO ARQUIVO modulos/dashboard.js - v0.0.71
Vue.component('tela-dashboard', {
    template: `
    <div class="container animate__animated animate__fadeIn" style="padding-bottom:100px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div><h2 style="margin:0;color:var(--cor-primaria);">Olá, {{$root.usuario.nome}}! 🍕</h2><p style="margin:0;color:var(--text-sec);">Resumo da Operação</p></div>
            <button @click="$root.fazerLogout()" style="background:none;border:none;color:var(--text-sec);font-size:1.5rem;"><i class="fas fa-sign-out-alt"></i></button>
        </div>
        
        <div v-if="checklistsDoDia.length>0" style="margin-bottom:25px;">
            <h3 style="margin:0 0 10px 0;color:#FFF;"><i class="fas fa-tasks" style="color:#00C853;"></i> Checklists Hoje</h3>
            <div v-for="chk in checklistsDoDia" :key="chk.id" class="card" style="border-left:4px solid #00C853;background:#1A1A1A;padding:15px;margin-bottom:10px;">
                <h4 style="margin:0 0 10px 0;color:#69F0AE;">{{chk.titulo}}</h4>
                <div v-for="t in chk.tarefas" :key="t.id" @click="marcarTarefa(t.id, t.texto)" style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #333;cursor:pointer;">
                    <div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:5px;border:2px solid #555;" :style="foiFeitoHoje(t.id)?'background:#00C853;border-color:#00C853;':''"><i v-if="foiFeitoHoje(t.id)" class="fas fa-check" style="color:#121212;font-size:0.8rem;"></i></div>
                    <span :style="foiFeitoHoje(t.id)?'color:#666;text-decoration:line-through;':'color:#CCC;'">{{t.texto}}</span>
                </div>
            </div>
        </div>

        <div v-if="todosOsAvisos.length>0" style="margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <h3 style="margin:0;color:#FFF;"><i class="fas fa-bullhorn" style="color:#FF5252;"></i> Mural de Avisos</h3>
                <button v-if="$root.usuario.permissoes.admin||$root.usuario.permissoes.avisos" @click="criarAvisoDialog" style="background:#2962FF;border:none;color:white;padding:5px 12px;border-radius:15px;font-weight:bold;font-size:0.8rem;">+ CRIAR</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div v-for="a in todosOsAvisos" :key="a.id" class="card" :style="a.importante?'border-left:4px solid #FF5252;background:#2A1111;':'border-left:4px solid #FFAB00;background:#222;'">
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><strong :style="a.importante?'color:#FF5252;':'color:#FFAB00;'">{{a.titulo||'AVISO'}}</strong>
                        <div style="display:flex;gap:12px;align-items:center;"><small v-if="!a.isAniversario" style="color:#888;">{{a.autor}}</small><small v-else style="color:#FFAB00;font-size:1.2rem;">🎉</small><button v-if="a.isManual" @click="excluirAviso(a.id)" style="background:none;border:none;color:#FF5252;font-size:1.1rem;padding:0;"><i class="fas fa-trash-alt"></i></button></div>
                    </div>
                    <div v-if="a.cargoDestino&&a.cargoDestino!=='Todos'" style="margin-bottom:8px;"><span style="background:#333;color:#00B0FF;padding:3px 8px;border-radius:5px;font-size:0.75rem;border:1px solid #00B0FF;">Apenas {{a.cargoDestino}}s</span></div>
                    <p style="color:white;margin:0;font-size:1rem;">{{a.texto}}</p>
                    <div v-if="a.acao==='contarMassas'" style="margin-top:15px;border-top:1px dashed #555;padding-top:15px;display:flex;gap:10px;">
                        <input type="number" inputmode="numeric" v-model.number="inputMassas" placeholder="Qtd" style="flex:1;padding:12px;background:#111;border:1px solid var(--cor-primaria);border-radius:8px;color:white;font-size:1.2rem;text-align:center;">
                        <button @click="confirmarMassasHoje" style="background:var(--cor-primaria);color:#121212;border:none;padding:0 25px;border-radius:8px;font-weight:bold;">OK</button>
                    </div>
                    <div v-if="a.acao==='verificarGelo'" style="margin-top:15px;text-align:right;border-top:1px dashed #555;padding-top:10px;"><button @click="irParaGelo" style="background:#00B0FF;color:#121212;border:none;padding:8px 15px;border-radius:8px;font-weight:bold;font-size:0.85rem;">IR P/ GELO</button></div>
                    <div v-if="a.acao==='resolverSazonal'" style="margin-top:15px;border-top:1px dashed #555;padding-top:15px;display:flex;gap:10px;">
                        <button @click="$root.resolverPizzaSazonal(a.nomePizza, true)" style="flex:1;background:#2962FF;color:white;border:none;padding:12px;border-radius:8px;font-weight:bold;">SIM</button>
                        <button @click="$root.resolverPizzaSazonal(a.nomePizza, false)" style="flex:1;background:#FF5252;color:white;border:none;padding:12px;border-radius:8px;font-weight:bold;">NÃO</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="$root.usuario.permissoes.admin||$root.usuario.permissoes.avisos" style="text-align:right;margin-bottom:20px;"><button @click="criarAvisoDialog" style="background:#2C2C2C;border:1px solid #444;color:white;padding:8px 15px;border-radius:15px;font-size:0.8rem;">+ Novo</button></div>

        <div class="card" style="background:linear-gradient(135deg,#1e3c72 0%,#2a5298 100%);color:white;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div><h3 style="margin:0"><i class="fas fa-cloud"></i> Londrina</h3><small>Modo IA: <b :style="{color:$root.clima.modoSmart?'#00E676':'#FF5252'}">{{$root.clima.modoSmart?'ATIVADO':'OFF'}}</b></small></div>
            <div style="font-size:2.2rem;font-weight:bold;"><i v-if="$root.clima.isCalor" class="fas fa-sun" style="color:#FFAB00;font-size:1.5rem;margin-right:5px;"></i>{{$root.clima.temperatura}}°C</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
            <div v-if="$root.usuario.permissoes.producao||$root.usuario.permissoes.admin" @click="$root.mudarTela('tela-massa')" style="background:var(--bg-card);padding:20px;border-radius:15px;text-align:center;border:1px solid rgba(255,171,0,0.3);"><i class="fas fa-calculator" style="font-size:2rem;color:var(--cor-primaria);margin-bottom:10px;"></i><div>Produção</div></div>
            <div v-if="$root.usuario.permissoes.pedidos||$root.usuario.permissoes.admin" @click="$root.mudarTela('tela-sacolao')" style="background:var(--bg-card);padding:20px;border-radius:15px;text-align:center;border:1px solid rgba(0,200,83,0.3);"><i class="fas fa-carrot" style="font-size:2rem;color:#00C853;margin-bottom:10px;"></i><div>Sacolão</div></div>
            <div v-if="$root.usuario.permissoes.pedidos||$root.usuario.permissoes.admin" @click="$root.mudarTela('tela-insumos')" style="background:var(--bg-card);padding:20px;border-radius:15px;text-align:center;border:1px solid rgba(213,0,0,0.3);"><i class="fas fa-box-open" style="font-size:2rem;color:#D50000;margin-bottom:10px;"></i><div>Insumos</div></div>
            <div v-if="$root.usuario.permissoes.pedidos||$root.usuario.permissoes.admin" @click="$root.mudarTela('tela-gelo')" style="background:var(--bg-card);padding:20px;border-radius:15px;text-align:center;border:1px solid rgba(0,176,255,0.3);"><i class="fas fa-snowflake" style="font-size:2rem;color:#00B0FF;margin-bottom:10px;"></i><div>Gelo</div></div>
            <div v-if="$root.usuario.permissoes.limpeza||$root.usuario.permissoes.admin" @click="$root.mudarTela('tela-limpeza')" style="background:var(--bg-card);padding:20px;border-radius:15px;text-align:center;border:1px solid rgba(41,98,255,0.3);"><i class="fas fa-broom" style="font-size:2rem;color:#2962FF;margin-bottom:10px;"></i><div>Limpeza</div></div>
            <div v-if="$root.usuario.permissoes.historico||$root.usuario.permissoes.admin" @click="$root.mudarTela('tela-historico')" style="background:var(--bg-card);padding:20px;border-radius:15px;text-align:center;border:1px solid rgba(224,224,224,0.3);"><i class="fas fa-history" style="font-size:2rem;color:#E0E0E0;margin-bottom:10px;"></i><div>Auditoria</div></div>
            <div v-if="$root.usuario.permissoes.gerenciar||$root.usuario.permissoes.admin" @click="$root.mudarTela('tela-ajustes')" style="grid-column:span 2;background:var(--bg-card);padding:20px;border-radius:15px;text-align:center;border:1px solid rgba(170,170,170,0.3);"><i class="fas fa-cog" style="font-size:2rem;color:#AAAAAA;margin-bottom:10px;"></i><div>Ajustes</div></div>
        </div>
    </div>
    `,
    data() { return { inputMassas: '' }; },
    computed: {
        checklistsDoDia() {
            const hojeIndex = new Date().getDay(); 
            return this.$root.bancoChecklists.filter(chk => {
                if (!chk.diasSemana.includes(hojeIndex)) return false;
                if (this.$root.usuario.permissoes.admin || chk.cargoDestino === 'Todos') return true;
                return chk.cargoDestino === this.$root.usuario.cargo;
            });
        },
        todosOsAvisos() {
            let lista = [];
            const hoje = new Date(); const hojeStr = hoje.toISOString().split('T')[0]; 
            
            if (this.$root.dataEstoqueMassas !== hojeStr && this.$root.naPizzaria && (this.$root.usuario.permissoes.producao || this.$root.usuario.permissoes.admin)) {
                lista.push({ id: 'aviso-massas', titulo: '🍕 MISSÃO DIÁRIA', texto: 'Quantas massas sobraram hoje?', autor: 'IA', importante: true, acao: 'contarMassas', isManual: false, cargoDestino: 'Todos' });
            }

            if (this.$root.clima.modoSmart && this.$root.clima.isCalor && !this.$root.clima.geloVerificado && (this.$root.usuario.permissoes.pedidos || this.$root.usuario.permissoes.admin)) {
                lista.push({ id: 'aviso-gelo', titulo: '🧊 CALOR', texto: `A temperatura está alta. Verifique o gelo.`, autor: 'IA', importante: true, acao: 'verificarGelo', isManual: false, cargoDestino: 'Todos' });
            }

            let sazonais = new Set();
            this.$root.bancoProdutos.forEach(p => {
                if (p.sazonal && p.sazonal.ativa && p.sazonal.dataExpiracao && new Date(p.sazonal.dataExpiracao) <= hoje) sazonais.add(p.sazonal.nomePizza);
            });

            sazonais.forEach(n => {
                if (this.$root.usuario.permissoes.admin || this.$root.usuario.permissoes.gerenciar) {
                    lista.push({ id: 'sazonal-'+n, titulo: '⏳ REVISÃO', texto: `Ainda estamos vendendo a pizza "${n}"?`, autor: 'IA', importante: true, acao: 'resolverSazonal', nomePizza: n, isManual: false, cargoDestino: 'Todos' });
                }
            });

            const md = String(hoje.getMonth()+1).padStart(2,'0')+'-'+String(hoje.getDate()).padStart(2,'0');
            this.$root.equipe.forEach(m => {
                if (m.nascimento && m.nascimento.endsWith(md)) lista.push({ id: 'niver-'+m.id, titulo: '🎂 ANIVERSÁRIO!', texto: `Niver do ${m.nome}!`, isAniversario: true, importante: true, isManual: false, cargoDestino: 'Todos' });
            });

            const man = this.$root.avisos.filter(a => new Date(a.dataExpiracao) > new Date()).filter(a => {
                if (a.cargoDestino === 'Todos' || !a.cargoDestino || this.$root.usuario.permissoes.admin) return true;
                return a.cargoDestino === this.$root.usuario.cargo;
            }).map(a => ({ ...a, isManual: true }));
            
            return lista.concat(man);
        }
    },
    methods: {
        foiFeitoHoje(id) { return this.$root.tarefasConcluidas.some(t => t.idTarefa === id && t.dataAcao === new Date().toISOString().split('T')[0]); },
        marcarTarefa(id, txt) {
            this.$root.vibrar(15);
            const hj = new Date().toISOString().split('T')[0];
            const i = this.$root.tarefasConcluidas.findIndex(t => t.idTarefa === id && t.dataAcao === hj);
            if (i > -1) this.$root.tarefasConcluidas.splice(i, 1); 
            else { this.$root.tarefasConcluidas.push({ idTarefa: id, dataAcao: hj }); this.$root.vibrar([30, 30]); this.$root.registrarHistorico('Checklist', 'Rotina', txt); }
        },
        excluirAviso(id) {
            this.$root.autorizarAcao('remover', () => { this.$root.avisos = this.$root.avisos.filter(a => a.id !== id); this.$root.salvarMemoriaLocal(); });
        },
        confirmarMassasHoje() {
            if (!this.inputMassas) return;
            this.$root.vibrar(30);
            this.$root.estoqueMassasHoje = Number(this.inputMassas); this.$root.dataEstoqueMassas = new Date().toISOString().split('T')[0]; 
            this.$root.registrarHistorico('Contagem', 'Produção', `Informadas ${this.inputMassas} massas.`); this.inputMassas = '';
        },
        irParaGelo() { this.$root.clima.geloVerificado = true; this.$root.mudarTela('tela-gelo'); },
        async criarAvisoDialog() {
            const { value: v } = await Swal.fire({
                title: 'Aviso',
                html: `<textarea id="av-txt" style="width:100%;height:60px;background:#2C2C2C;color:#FFF;padding:10px;"></textarea><br><select id="av-dest" style="width:100%;margin-top:10px;background:#2C2C2C;color:#FFF;padding:10px;"><option value="Todos">Todos</option><option value="Pizzaiolo">Pizzaiolos</option><option value="Atendente">Atendentes</option></select><br><label style="color:white;margin-top:10px;display:block;"><input type="checkbox" id="av-urg"> Urgente</label>`,
                background: '#1E1E1E', color: '#FFF', showCancelButton: true
            });
            if (v && document.getElementById('av-txt').value) {
                const exp = new Date(); exp.setHours(exp.getHours() + 24);
                this.$root.avisos.push({ id: Date.now(), texto: document.getElementById('av-txt').value, autor: this.$root.usuario.nome, dataExpiracao: exp.toISOString(), importante: document.getElementById('av-urg').checked, cargoDestino: document.getElementById('av-dest').value });
                this.$root.salvarMemoriaLocal();
            }
        }
    }
});
// FIM DO ARQUIVO modulos/dashboard.js
