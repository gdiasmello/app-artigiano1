// modulos/ajustes_checklists.js - Gestão de Rotinas v0.0.47

Vue.component('tela-ajustes-checklists', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #2962FF;">✅ Checklists</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <p v-if="!modoFormulario" style="color: var(--text-sec); font-size: 0.9rem; margin-bottom: 20px;">
            Crie rotinas passo a passo que aparecerão no Mural dos funcionários nos dias programados.
        </p>

        <div v-if="modoFormulario" class="card animate__animated animate__fadeInDown" style="border-left: 3px solid #2962FF; border-top: 3px solid #2962FF; margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: white;">{{ checklistEditando ? 'Editar Checklist' : 'Novo Checklist' }}</h3>
                <button @click="fecharFormulario" style="background: none; border: none; color: #FF5252; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-times-circle"></i></button>
            </div>

            <label style="color:#82B1FF; font-size:0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Título do Checklist</label>
            <input type="text" v-model="form.titulo" placeholder="Ex: Abertura da Loja" class="input-dark" style="margin-bottom:15px; width: 100%; padding: 12px; background: #2C2C2C; border: none; border-radius: 5px; color: white; box-sizing: border-box;" />

            <label style="color:#82B1FF; font-size:0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Para qual Cargo?</label>
            <select v-model="form.cargoDestino" class="input-dark" style="margin-bottom: 15px; width: 100%; padding: 12px; background: #2C2C2C; border: none; border-radius: 5px; color: white; box-sizing: border-box;">
                <option value="Todos">Toda a Equipe</option>
                <option value="Pizzaiolo">Só Pizzaiolos</option>
                <option value="Atendente">Só Atendentes</option>
                <option value="Gerente">Só Gerentes</option>
            </select>

            <label style="color:#82B1FF; font-size:0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Dias da Semana que Aparecerá</label>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; gap: 5px;">
                <button v-for="(dia, index) in diasSemanaNomes" :key="index" @click="toggleDia(index)" 
                        style="flex: 1; padding: 10px 0; border-radius: 8px; border: 1px solid #444; font-weight: bold; cursor: pointer; transition: 0.2s;"
                        :style="form.diasSemana.includes(index) ? 'background: #2962FF; color: #FFF; border-color: #2962FF;' : 'background: #222; color: #888;'">
                    {{ dia }}
                </button>
            </div>

            <div style="background: rgba(41, 98, 255, 0.1); padding: 15px; border-radius: 8px; border: 1px dashed #2962FF; margin-bottom: 20px;">
                <h5 style="margin: 0 0 10px 0; color: #82B1FF;">Tarefas do Checklist</h5>
                
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" v-model="novaTarefa" placeholder="Ex: Ligar forno" @keyup.enter="adicionarTarefa" style="flex: 1; padding: 10px; background: #111; border: 1px solid #444; color: white; border-radius: 5px;" />
                    <button @click="adicionarTarefa" style="background: #2962FF; color: white; border: none; padding: 0 15px; border-radius: 5px; font-weight: bold; cursor: pointer;">+</button>
                </div>

                <div v-for="(tarefa, idx) in form.tarefas" :key="idx" style="display: flex; justify-content: space-between; align-items: center; background: #1A1A1A; padding: 10px; border-radius: 5px; margin-bottom: 5px; border: 1px solid #333;">
                    <span style="color: white; font-size: 0.9rem;">{{ idx + 1 }}. {{ tarefa.texto }}</span>
                    <button @click="removerTarefa(idx)" style="background: none; border: none; color: #FF5252; cursor: pointer;"><i class="fas fa-trash"></i></button>
                </div>
                
                <div v-if="form.tarefas.length === 0" style="color: #666; font-size: 0.85rem; font-style: italic; text-align: center;">
                    Nenhuma tarefa adicionada.
                </div>
            </div>

            <button class="btn" style="background: #2962FF; color: white;" @click="salvarChecklist">
                <i class="fas fa-save"></i> SALVAR CHECKLIST
            </button>
        </div>

        <div v-if="!modoFormulario">
            <button class="btn" style="background: #2962FF; color: white; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(41, 98, 255, 0.3);" @click="abrirParaNovo">
                <i class="fas fa-plus-circle"></i> CRIAR NOVO CHECKLIST
            </button>

            <div v-for="chk in $root.bancoChecklists" :key="chk.id" class="card" style="padding: 15px; background: #1A1A1A; border-left: 3px solid #2962FF; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <strong style="color: white; font-size: 1.1rem; display: block;">{{ chk.titulo }}</strong>
                        <span style="background: #333; color: #00B0FF; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-right: 5px;"><i class="fas fa-user-tag"></i> {{ chk.cargoDestino }}</span>
                        <small style="color: #888;">{{ chk.tarefas.length }} tarefas</small>
                        <div style="margin-top: 5px; font-size: 0.75rem; color: #AAA;">
                            <span v-if="chk.diasSemana.length === 7">Todos os dias</span>
                            <span v-else>{{ exibirDias(chk.diasSemana) }}</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <button @click="abrirParaEditar(chk)" style="background: none; border: none; color: #00B0FF; font-size: 1.2rem; cursor: pointer; padding: 5px;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <div style="width: 1px; height: 20px; background: #444;"></div>
                        <button @click="tentaRemoverChecklist(chk.id, chk.titulo)" style="background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer; padding: 5px;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="$root.bancoChecklists.length === 0" style="text-align: center; color: #666; padding: 20px; font-style: italic;">
                Nenhum checklist criado.
            </div>
        </div>

    </div>
    `,
    data() {
        return {
            modoFormulario: false,
            checklistEditando: null, 
            diasSemanaNomes: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
            novaTarefa: '',
            
            formPadrao: {
                titulo: '', cargoDestino: 'Todos', diasSemana: [0, 1, 2, 3, 4, 5, 6], tarefas: []
            },
            form: {}
        };
    },
    methods: {
        voltar() {
            this.$root.vibrar(30);
            if (this.modoFormulario) { this.fecharFormulario(); } 
            else { this.$root.mudarTela('tela-ajustes'); }
        },
        abrirParaNovo() {
            this.$root.vibrar(30);
            this.checklistEditando = null;
            this.form = JSON.parse(JSON.stringify(this.formPadrao));
            this.novaTarefa = '';
            this.modoFormulario = true;
            window.scrollTo(0, 0);
        },
        abrirParaEditar(chk) {
            this.$root.vibrar(30);
            this.checklistEditando = chk.id;
            this.form = JSON.parse(JSON.stringify(chk));
            this.novaTarefa = '';
            this.modoFormulario = true;
            window.scrollTo(0, 0);
        },
        fecharFormulario() { this.$root.vibrar(30); this.modoFormulario = false; },
        
        toggleDia(index) {
            this.$root.vibrar(15);
            const pos = this.form.diasSemana.indexOf(index);
            if (pos > -1) {
                this.form.diasSemana.splice(pos, 1);
            } else {
                this.form.diasSemana.push(index);
                this.form.diasSemana.sort(); // Mantém a ordem
            }
        },

        adicionarTarefa() {
            if (!this.novaTarefa.trim()) return;
            this.$root.vibrar(15);
            this.form.tarefas.push({ id: Date.now() + Math.floor(Math.random() * 1000), texto: this.novaTarefa.trim() });
            this.novaTarefa = '';
        },
        removerTarefa(idx) {
            this.$root.vibrar(15);
            this.form.tarefas.splice(idx, 1);
        },

        exibirDias(diasArray) {
            const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            return diasArray.map(d => nomes[d]).join(', ');
        },
        
        salvarChecklist() {
            this.$root.vibrar(30);
            
            if (!this.form.titulo || this.form.diasSemana.length === 0 || this.form.tarefas.length === 0) {
                this.$root.vibrar([100, 50, 100]);
                Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Preencha o título, escolha os dias e adicione pelo menos uma tarefa.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            this.$root.autorizarAcao('adicionar', () => {
                
                if (this.checklistEditando) {
                    const index = this.$root.bancoChecklists.findIndex(c => c.id === this.checklistEditando);
                    if (index !== -1) {
                        this.$root.bancoChecklists[index] = { ...this.form, id: this.checklistEditando };
                        this.$root.registrarHistorico('Checklist Editado', 'Ajustes', `O checklist "${this.form.titulo}" foi atualizado.`);
                    }
                } else {
                    const novoChk = { ...this.form, id: Date.now() };
                    this.$root.bancoChecklists.push(novoChk);
                    this.$root.registrarHistorico('Checklist Criado', 'Ajustes', `Novo checklist "${this.form.titulo}" adicionado.`);
                }

                this.$root.salvarMemoriaLocal();
                this.$root.vibrar([50, 50, 50]);
                Swal.fire({ icon: 'success', title: 'Salvo com Sucesso!', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
                this.fecharFormulario();
            });
        },

        tentaRemoverChecklist(idChk, tituloChk) {
            this.$root.vibrar(30);
            
            this.$root.autorizarAcao('remover', () => {
                Swal.fire({
                    title: 'Apagar Checklist?', text: `Deseja remover "${tituloChk}"? Esta ação não pode ser desfeita.`, icon: 'warning',
                    showCancelButton: true, confirmButtonColor: '#FF5252', cancelButtonColor: '#444', confirmButtonText: 'Sim, Apagar', cancelButtonText: 'Cancelar', background: '#1E1E1E', color: '#FFF'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.$root.bancoChecklists = this.$root.bancoChecklists.filter(c => c.id !== idChk);
                        this.$root.registrarHistorico('Checklist Apagado', 'Ajustes', `A rotina "${tituloChk}" foi excluída.`);
                        this.$root.salvarMemoriaLocal();
                        this.$root.vibrar([50, 50, 50]);
                        Swal.fire({ icon: 'success', title: 'Apagado!', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
                    }
                });
            });
        }
    }
});
