// modulos/historico.js - Auditoria Geral v0.0.23

Vue.component('tela-historico', {
    template: `
    <div class="container animate__animated animate__fadeInRight" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #E0E0E0;">🕒 Auditoria Global</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <p style="color: var(--text-sec); font-size: 0.85rem; margin-bottom: 20px;">
            Registo offline ativado. Todas as ações ficam gravadas.
        </p>
        
        <div style="display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; scrollbar-width: none; padding-bottom: 5px;">
            <button @click="mudarAba('Todos')" :style="abaAtiva === 'Todos' ? btnAtivo : btnInativo">Todos</button>
            <button @click="mudarAba('Produção')" :style="abaAtiva === 'Produção' ? btnAtivo : btnInativo">Produção</button>
            <button @click="mudarAba('Pedidos')" :style="abaAtiva === 'Pedidos' ? btnAtivo : btnInativo">Pedidos</button>
            <button @click="mudarAba('Ajustes')" :style="abaAtiva === 'Ajustes' ? btnAtivo : btnInativo">Ajustes</button>
        </div>

        <div v-if="historicoFiltrado.length === 0" style="text-align: center; color: #666; padding: 20px; font-style: italic;">
            Nenhum registo nesta categoria.
        </div>

        <div v-for="item in historicoFiltrado" :key="item.id" class="card animate__animated animate__fadeIn" style="padding: 15px; margin-bottom: 10px; background: #1A1A1A; border-left: 3px solid #555;" :style="{ borderLeftColor: corSetor(item.setor) }">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <strong style="color: white; font-size: 1rem;">{{ item.acao }}</strong>
                <span style="color: var(--text-sec); font-size: 0.8rem; white-space: nowrap;"><i class="far fa-clock"></i> {{ item.horaStr }}</span>
            </div>
            
            <div v-if="item.detalhes" style="color: #CCC; font-size: 0.85rem; margin-bottom: 8px;">
                {{ item.detalhes }}
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.8rem; color: #888; border-top: 1px solid #333; padding-top: 8px;">
                <span><i class="fas fa-user-circle"></i> <b style="color: #FFF;">{{ item.usuario }}</b></span>
                <span>{{ item.dataStr }} • {{ item.setor }}</span>
            </div>
        </div>

    </div>
    `,
    data() {
        return {
            abaAtiva: 'Todos',
            btnAtivo: 'background: #333; color: #FFF; border: 1px solid #555; padding: 8px 15px; border-radius: 20px; font-weight: bold; transition: 0.2s; white-space: nowrap;',
            btnInativo: 'background: #1E1E1E; color: #888; border: 1px solid #222; padding: 8px 15px; border-radius: 20px; transition: 0.2s; white-space: nowrap;',
        };
    },
    computed: {
        historicoFiltrado() {
            if (this.abaAtiva === 'Todos') return this.$root.historicoGlobais;
            return this.$root.historicoGlobais.filter(h => h.setor === this.abaAtiva);
        }
    },
    methods: {
        voltar() {
            this.$root.vibrar(30);
            this.$root.mudarTela('tela-dashboard');
        },
        mudarAba(aba) {
            this.$root.vibrar(30);
            this.abaAtiva = aba;
        },
        corSetor(setor) {
            if (setor === 'Produção') return '#FFAB00';
            if (setor === 'Pedidos') return '#D50000';
            if (setor === 'Ajustes') return '#9C27B0';
            return '#555';
        }
    }
});
