/**
 * Auditoria v2.10.0
 * Histórico de ações e exportação de dados.
 */
Vue.component('tela-historico', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #E0E0E0;"><i class="fas fa-history"></i> Auditoria</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <!-- Filtros -->
        <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 15px; scrollbar-width: none;">
            <button v-for="f in filtros" :key="f" @click="filtroAtivo = f" 
                    :style="filtroAtivo === f ? 'background: white; color: black;' : 'background: #222; color: #888; border: 1px solid #333;'"
                    style="padding: 8px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; white-space: nowrap; border: none; cursor: pointer;">
                {{ f }}
            </button>
        </div>

        <div v-if="logsFiltrados.length === 0" style="text-align: center; padding: 50px; color: #444;">
            <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <p>Nenhum registro encontrado.</p>
        </div>

        <div v-else>
            <div v-for="log in logsFiltrados" :key="log.id" class="card-log" :style="{ borderLeftColor: getCorSetor(log.setor) }">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                        <span class="badge-setor" :style="{ background: getCorSetor(log.setor) }">{{ log.setor }}</span>
                        <strong style="color: white; font-size: 0.9rem; margin-left: 8px;">{{ log.acao }}</strong>
                    </div>
                    <span style="color: #555; font-size: 0.7rem;">{{ log.horaStr }}</span>
                </div>
                <p style="color: #AAA; font-size: 0.85rem; margin: 0 0 10px 0; line-height: 1.4;">{{ log.detalhes }}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #222; padding-top: 8px;">
                    <span style="color: #666; font-size: 0.75rem;"><i class="fas fa-user"></i> {{ log.usuario }}</span>
                    <span style="color: #444; font-size: 0.7rem;">{{ log.dataStr }}</span>
                </div>
            </div>
            
            <button @click="exportarAuditoria" class="btn" style="background: #333; color: white; margin-top: 20px;">
                <i class="fas fa-file-export"></i> EXPORTAR LOGS (JSON)
            </button>
        </div>
    </div>
    `,
    data() {
        return {
            filtroAtivo: 'Todos',
            filtros: ['Todos', 'Massa', 'Sacolão', 'Insumos', 'Gelo', 'Limpeza', 'Segurança']
        };
    },
    computed: {
        logsFiltrados() {
            if (this.filtroAtivo === 'Todos') return this.$root.historicoGlobais;
            return this.$root.historicoGlobais.filter(l => l.setor === this.filtroAtivo);
        }
    },
    methods: {
        getCorSetor(setor) {
            const cores = { 'Massa': '#FFAB00', 'Sacolão': '#00E676', 'Insumos': '#FF5252', 'Gelo': '#00B0FF', 'Limpeza': '#2962FF', 'Segurança': '#FF5252' };
            return cores[setor] || '#555';
        },
        exportarAuditoria() {
            const data = JSON.stringify(this.$root.historicoGlobais, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `auditoria_pizzamaster_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
        }
    },
    mounted() {
        if (!document.getElementById('css-historico')) {
            const style = document.createElement('style');
            style.id = 'css-historico';
            style.innerHTML = `
                .card-log { background: #1A1A1A; border-radius: 10px; padding: 15px; margin-bottom: 10px; border-left: 4px solid #333; border-top: 1px solid #222; border-right: 1px solid #222; border-bottom: 1px solid #222; }
                .badge-setor { font-size: 0.6rem; font-weight: 900; color: #121212; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
            `;
            document.head.appendChild(style);
        }
    }
});
