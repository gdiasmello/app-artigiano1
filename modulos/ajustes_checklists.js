/**
 * Checklists v2.11.0
 */
Vue.component('tela-ajustes-checklists', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #00E676;"><i class="fas fa-clipboard-check"></i> Gestão de Rotinas</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <!-- Criar/Editar Checklist -->
        <div class="card" style="padding: 20px; border-top: 5px solid #00E676; margin-bottom: 25px;">
            <h4 style="color: white; margin-top: 0;">{{ editandoId ? 'Editar Rotina' : 'Nova Rotina Inteligente' }}</h4>
            
            <input type="text" v-model="novo.titulo" placeholder="Ex: Fechamento de Massa" class="input-dark" style="margin-bottom: 15px;">
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <select v-model="novo.publico" class="input-dark" style="flex: 1;">
                    <option value="Todos">Público: Todos</option>
                    <option value="Gerente">Público: Gerentes</option>
                    <option value="Pizzaiolo">Público: Pizzaiolos</option>
                    <option value="Atendente">Público: Atendentes</option>
                    <option value="Pessoal">Privado: Só Eu</option>
                </select>
                <input type="time" v-model="novo.agendamento.horario" class="input-dark" style="width: 120px;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="color: #888; font-size: 0.7rem; font-weight: bold; display: block; margin-bottom: 8px;">DIAS DA SEMANA</label>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <button v-for="(dia, idx) in diasSemana" 
                            :key="idx" 
                            @click="toggleDia(idx)"
                            :style="novo.agendamento.dias.includes(idx) ? 'background: #00E676; color: #121212;' : 'background: #222; color: #666;'"
                            style="border: none; padding: 5px 10px; border-radius: 4px; font-size: 0.7rem; cursor: pointer; font-weight: bold;">
                        {{ dia }}
                    </button>
                </div>
            </div>

            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <label style="display: flex; align-items: center; gap: 8px; color: #AAA; font-size: 0.8rem; cursor: pointer;">
                    <input type="checkbox" v-model="novo.agendamento.feriado"> Só Feriados
                </label>
                <label style="display: flex; align-items: center; gap: 8px; color: #AAA; font-size: 0.8rem; cursor: pointer;">
                    <input type="checkbox" v-model="novo.agendamento.vespera"> Só Vésperas
                </label>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #888; font-size: 0.7rem; font-weight: bold; display: block; margin-bottom: 8px;">TAREFAS (Uma por linha)</label>
                <textarea v-model="tarefasTexto" class="input-dark" rows="4" placeholder="Ex:\nDesligar Ar Condicionado\nLimpar Bancadas\nAlimentar Levain"></textarea>
            </div>

            <div style="display: flex; gap: 10px;">
                <button @click="salvar" class="btn" style="background: #00E676; color: #121212; flex: 2;">
                    {{ editandoId ? 'ATUALIZAR' : 'CRIAR CHECKLIST' }}
                </button>
                <button v-if="editandoId" @click="cancelarEdicao" class="btn" style="background: #333; color: white; flex: 1;">CANCELAR</button>
            </div>
        </div>

        <h3 style="color: white; font-size: 1rem; margin-bottom: 15px;">Rotinas Cadastradas</h3>
        <div v-for="(c, i) in $root.bancoChecklists" :key="c.id" class="card" style="padding: 15px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="color: white; font-size: 1rem;">{{ c.titulo }}</strong>
                <div style="display: flex; gap: 12px;">
                    <button @click="editar(c)" style="background: none; border: none; color: #00B0FF; cursor: pointer; font-size: 1.1rem;"><i class="fas fa-edit"></i></button>
                    <button @click="rm(i)" style="background: none; border: none; color: #FF5252; cursor: pointer; font-size: 1.1rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; border-top: 1px solid #222; padding-top: 10px;">
                <div style="font-size: 0.7rem; color: #888; display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-user-shield" style="color: #00E676;"></i> {{ c.publico }}
                </div>
                <div v-if="c.agendamento.horario" style="font-size: 0.7rem; color: #888; display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-clock" style="color: #FFAB00;"></i> {{ c.agendamento.horario }}
                </div>
                <div style="font-size: 0.7rem; color: #888; display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-tasks" style="color: #00B0FF;"></i> {{ c.tarefas.length }} tarefas
                </div>
            </div>
        </div>
    </div>
    `,
    data() { 
        return { 
            editandoId: null,
            tarefasTexto: '',
            diasSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            novo: { 
                titulo: '', 
                publico: 'Todos',
                tarefas: [],
                agendamento: {
                    horario: '',
                    dias: [0,1,2,3,4,5,6],
                    feriado: false,
                    vespera: false
                }
            } 
        }; 
    },
    methods: {
        toggleDia(idx) {
            const pos = this.novo.agendamento.dias.indexOf(idx);
            if (pos === -1) this.novo.agendamento.dias.push(idx);
            else this.novo.agendamento.dias.splice(pos, 1);
        },
        editar(c) {
            this.editandoId = c.id;
            this.novo = JSON.parse(JSON.stringify(c));
            this.tarefasTexto = c.tarefas.join('\n');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        cancelarEdicao() {
            this.editandoId = null;
            this.novo = { 
                titulo: '', 
                publico: 'Todos',
                tarefas: [],
                agendamento: { horario: '', dias: [0,1,2,3,4,5,6], feriado: false, vespera: false }
            };
            this.tarefasTexto = '';
        },
        salvar() {
            if (!this.novo.titulo) return;
            
            this.novo.tarefas = this.tarefasTexto.split('\n').filter(t => t.trim() !== '');
            this.novo.idCriador = this.$root.usuario.id;

            if (this.editandoId) {
                const idx = this.$root.bancoChecklists.findIndex(c => c.id === this.editandoId);
                if (idx !== -1) this.$root.bancoChecklists.splice(idx, 1, { ...this.novo });
            } else {
                this.novo.id = Date.now();
                this.$root.bancoChecklists.push({ ...this.novo });
            }

            this.sinc();
            this.cancelarEdicao();
            Swal.fire('Sucesso', 'Rotina salva com sucesso!', 'success');
        },
        rm(i) {
            Swal.fire({
                title: 'Excluir Rotina?',
                text: "Esta ação não pode ser desfeita.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF5252',
                background: '#1E1E1E', color: '#FFF'
            }).then(res => {
                if (res.isConfirmed) {
                    this.$root.bancoChecklists.splice(i, 1);
                    this.sinc();
                }
            });
        },
        sinc() {
            db.collection("configuracoes").doc("checklists").set({ lista: this.$root.bancoChecklists });
        }
    }
});
