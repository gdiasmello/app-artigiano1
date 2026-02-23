// INÍCIO DO ARQUIVO modulos/limpeza.js - v0.0.85
Vue.component('tela-limpeza', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2962FF;">🧹 Limpeza</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div v-if="checklistsAtivos.length === 0" style="text-align: center; color: #666; margin-top: 50px;">
            <i class="fas fa-check-double" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <p>Tudo limpo por aqui hoje!</p>
        </div>

        <div v-for="chk in checklistsAtivos" :key="chk.id" class="card" style="border-left: 4px solid #2962FF; padding: 15px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #82B1FF;">{{ chk.titulo }}</h4>
            <div v-for="t in chk.tarefas" :key="t.id" @click="toggleTarefa(t.id, t.texto)" style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #222; cursor: pointer;">
                <div style="width: 24px; height: 24px; border-radius: 6px; border: 2px solid #444; display: flex; align-items: center; justify-content: center;" :style="foiFeito(t.id) ? 'background: #2962FF; border-color: #2962FF;' : ''">
                    <i v-if="foiFeito(t.id)" class="fas fa-check" style="color: white; font-size: 0.8rem;"></i>
                </div>
                <span :style="foiFeito(t.id) ? 'color: #555; text-decoration: line-through;' : 'color: #EEE;'">{{ t.texto }}</span>
            </div>
        </div>
    </div>
    `,
    computed: {
        checklistsAtivos() {
            const hj = new Date().getDay();
            return this.$root.bancoChecklists.filter(c => c.diasSemana.includes(hj));
        }
    },
    methods: {
        foiFeito(id) {
            const hj = new Date().toISOString().split('T')[0];
            return this.$root.tarefasConcluidas.some(t => t.idTarefa === id && t.dataAcao === hj);
        },
        toggleTarefa(id, txt) {
            this.$root.vibrar(20);
            const hj = new Date().toISOString().split('T')[0];
            const tId = hj + "_" + id; // ID único na nuvem para este dia e tarefa
            
            const concluida = this.foiFeito(id);

            // 🟢 SINCRONIZA COM FIREBASE
            if (!concluida) {
                db.collection("tarefas_dia").doc(tId).set({
                    idTarefa: id,
                    texto: txt,
                    dataAcao: hj,
                    usuario: this.$root.usuario.nome,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                this.$root.registrarHistorico('Limpeza', 'Rotina', txt);
            } else {
                db.collection("tarefas_dia").doc(tId).delete();
            }
        }
    },
    mounted() {
        // 🟢 ESCUTA AS TAREFAS DO DIA EM TEMPO REAL
        const hj = new Date().toISOString().split('T')[0];
        db.collection("tarefas_dia").where("dataAcao", "==", hj)
            .onSnapshot((snapshot) => {
                let lista = [];
                snapshot.forEach(doc => lista.push(doc.data()));
                this.$root.tarefasConcluidas = lista;
            });
    }
});
// FIM DO ARQUIVO modulos/limpeza.js
