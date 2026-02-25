/**
 * Execução de Checklist v1.0.0
 */
Vue.component('tela-execucao-checklist', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="checklist" style="padding-bottom: 100px;">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="margin: 0; color: #00E676;"><i class="fas fa-tasks"></i> {{ checklist.titulo }}</h2>
        </div>

        <div class="card" style="padding: 20px; border-top: 5px solid #00E676;">
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 20px;">
                Complete todas as tarefas para finalizar a rotina.
            </p>

            <div v-for="(tarefa, idx) in checklist.tarefas" 
                 :key="idx" 
                 @click="toggleTarefa(idx)"
                 :class="['item-tarefa', { 'concluida': tarefasConcluidas[idx] }]">
                <div class="check-circle">
                    <i v-if="tarefasConcluidas[idx]" class="fas fa-check"></i>
                </div>
                <span>{{ tarefa }}</span>
            </div>

            <button v-if="tudoPronto" @click="finalizar" class="btn" style="background: #00E676; color: #121212; margin-top: 25px; height: 60px; font-weight: bold;">
                FINALIZAR ROTINA
            </button>
        </div>
    </div>
    `,
    data() {
        return {
            checklist: null,
            tarefasConcluidas: {}
        };
    },
    computed: {
        tudoPronto() {
            if (!this.checklist) return false;
            return this.checklist.tarefas.every((_, idx) => this.tarefasConcluidas[idx]);
        }
    },
    methods: {
        toggleTarefa(idx) {
            this.$root.vibrar(10);
            this.$set(this.tarefasConcluidas, idx, !this.tarefasConcluidas[idx]);
        },
        finalizar() {
            const hojeStr = new Date().toLocaleDateString('pt-BR');
            const chave = `${this.checklist.id}_${hojeStr}`;
            
            this.$set(this.$root.checklistsConcluidos, chave, true);
            
            // Sincroniza no banco
            db.collection("operacao").doc("checklists_concluidos").set(this.$root.checklistsConcluidos);
            
            this.$root.registrarHistorico('Rotina', 'Checklist', `Concluiu a rotina: ${this.checklist.titulo}`);
            
            Swal.fire({
                icon: 'success',
                title: 'Excelente!',
                text: 'Rotina concluída com sucesso.',
                background: '#1E1E1E', color: '#FFF'
            }).then(() => {
                this.$root.mudarTela('tela-dashboard');
            });
        }
    },
    mounted() {
        // Pega o checklist dos dados do aviso ou do estado global se necessário
        // Como o Dashboard passa o aviso todo, podemos tentar pegar de lá
        // Mas o ideal é que o root tenha um 'checklistEmExecucao'
        if (this.$root.dadosNavegacao) {
            this.checklist = this.$root.dadosNavegacao;
        }

        if (!document.getElementById('css-exec-checklist')) {
            const style = document.createElement('style');
            style.id = 'css-exec-checklist';
            style.innerHTML = `
                .item-tarefa { 
                    display: flex; 
                    align-items: center; 
                    gap: 15px; 
                    padding: 18px; 
                    background: #1A1A1A; 
                    border-radius: 12px; 
                    margin-bottom: 12px; 
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #333;
                }
                .item-tarefa.concluida { 
                    background: rgba(0, 230, 118, 0.05); 
                    border-color: rgba(0, 230, 118, 0.2);
                    opacity: 0.8;
                }
                .check-circle { 
                    width: 28px; 
                    height: 28px; 
                    border: 2px solid #444; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 0.9rem;
                    color: #00E676;
                    flex-shrink: 0;
                }
                .concluida .check-circle { border-color: #00E676; background: #00E676; color: #121212; }
                .item-tarefa span { color: white; font-size: 1rem; }
                .concluida span { text-decoration: line-through; color: #666; }
            `;
            document.head.appendChild(style);
        }
    }
});
