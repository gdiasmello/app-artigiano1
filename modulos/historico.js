// INÍCIO DO ARQUIVO modulos/historico.js - v0.0.92
Vue.component('tela-historico', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #E0E0E0;">🕒 Auditoria</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="background: #1A1A1A; border: 1px solid #333; padding: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1;">
                <label style="color: #AAA; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; display: block;">Filtrar Setor</label>
                <select v-model="filtroSetor" style="width: 100%; padding: 10px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; outline: none;">
                    <option value="Todos">Todos os Registos</option>
                    <option value="Produção">🍕 Produção</option>
                    <option value="Sacolão">🥕 Sacolão</option>
                    <option value="Insumos">📦 Insumos</option>
                    <option value="Gelo">🧊 Gelo</option>
                    <option value="Limpeza">🧹 Limpeza</option>
                    <option value="Login">🔒 Acessos e Segurança</option>
                </select>
            </div>
            
            <button v-if="podeApagar && filtrados.length > 0" @click="limparTudo" style="background: rgba(213,0,0,0.1); border: 1px solid #D50000; color: #FF5252; padding: 10px; border-radius: 8px; margin-left: 15px; cursor: pointer;">
                <i class="fas fa-trash-alt"></i> ZERAR
            </button>
        </div>

        <div v-if="filtrados.length === 0" style="text-align: center; color: #666; margin-top: 50px;">
            <i class="fas fa-history" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <p>Nenhum registo encontrado.</p>
        </div>

        <div v-for="h in filtrados" :key="h.id" class="card animate__animated animate__fadeInUp" style="padding: 15px; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 15px; border-left: 4px solid;" :style="{ borderLeftColor: getCorSetor(h.setor) }">
            
            <div style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;" :style="{ background: getCorFundo(h.setor), color: getCorSetor(h.setor) }">
                <i :class="getIconeSetor(h.setor)"></i>
            </div>

            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <strong style="color: white; font-size: 1rem;">{{ h.acao }}</strong>
                    <span style="color: #666; font-size: 0.75rem; text-align: right;">{{ h.dataStr }}<br>{{ h.horaStr }}</span>
                </div>
                <div style="color: #AAA; font-size: 0.85rem; margin-top: 5px;">
                    <i class="fas fa-user" style="margin-right: 5px;"></i> <b>{{ h.usuario }}</b>
                </div>
                <div v-if="h.detalhes" style="color: #FFF; background: #222; padding: 8px; border-radius: 5px; font-size: 0.85rem; margin-top: 8px; border: 1px dashed #444;">
                    {{ h.detalhes }}
                </div>
            </div>

            <button v-if="podeApagar" @click="apagarRegisto(h.id)" style="background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer; padding: 5px;">
                <i class="fas fa-times"></i>
            </button>

        </div>

    </div>
    `,
    data() {
        return {
            filtroSetor: 'Todos'
        };
    },
    computed: {
        podeApagar() {
            // Regra: Apenas administradores ou cargo 'Gerente' podem apagar
            return this.$root.usuario.permissoes.admin || this.$root.usuario.cargo === 'Gerente';
        },
        filtrados() {
            let lista = this.$root.historicoGlobais;
            if (this.filtroSetor !== 'Todos') {
                lista = lista.filter(h => h.setor === this.filtroSetor);
            }
            return lista;
        }
    },
    methods: {
        getCorSetor(setor) {
            const cores = { 'Produção': '#FFAB00', 'Sacolão': '#00C853', 'Insumos': '#D50000', 'Gelo': '#00B0FF', 'Limpeza': '#2962FF', 'Login': '#E0E0E0', 'Segurança': '#FF5252' };
            return cores[setor] || '#AAA';
        },
        getCorFundo(setor) {
            const hex = this.getCorSetor(setor);
            return hex + '22'; // Adiciona 22 no hex para criar transparência
        },
        getIconeSetor(setor) {
            const icones = { 'Produção': 'fas fa-calculator', 'Sacolão': 'fas fa-carrot', 'Insumos': 'fas fa-box-open', 'Gelo': 'fas fa-snowflake', 'Limpeza': 'fas fa-broom', 'Login': 'fas fa-sign-in-alt', 'Segurança': 'fas fa-shield-alt' };
            return icones[setor] || 'fas fa-info-circle';
        },
        apagarRegisto(id) {
            this.$root.vibrar(20);
            Swal.fire({
                title: 'Apagar Registo?',
                text: "Deseja remover este item da auditoria?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#D50000',
                background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$root.historicoGlobais = this.$root.historicoGlobais.filter(h => h.id !== id);
                    this.salvarNuvem();
                }
            });
        },
        limparTudo() {
            this.$root.vibrar([50, 50]);
            Swal.fire({
                title: 'Zerar Histórico?',
                text: "Isso apagará TODOS os registos visíveis no momento. Tem certeza?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#D50000',
                confirmButtonText: 'Sim, Apagar Tudo',
                background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (this.filtroSetor === 'Todos') {
                        this.$root.historicoGlobais = [];
                    } else {
                        this.$root.historicoGlobais = this.$root.historicoGlobais.filter(h => h.setor !== this.filtroSetor);
                    }
                    this.salvarNuvem();
                    Swal.fire({ icon: 'success', title: 'Apagado!', timer: 1000, showConfirmButton: false, background: '#1E1E1E' });
                }
            });
        },
        salvarNuvem() {
            // 🟢 SINCRONIZA A EXCLUSÃO COM A NUVEM PARA TODOS OS APARELHOS
            db.collection("operacao").doc("historico").set({ itens: this.$root.historicoGlobais }, { merge: true });
            this.$root.salvarMemoriaLocal();
        }
    }
});
// FIM DO ARQUIVO modulos/historico.js
