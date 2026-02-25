Vue.component('tela-logs', {
    template: `
    <div class="container animate__animated animate__fadeIn">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #FFF; margin: 0;"><i class="fas fa-file-alt"></i> Logs do Sistema</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="padding: 20px; border-top: 5px solid var(--cor-primaria);">
            <h4 style="color: white; margin-top: 0;">Exportar Dados</h4>
            <p style="color: #AAA; margin-bottom: 20px;">Gere um arquivo de texto com o histórico de erros e ações para análise técnica.</p>
            
            <button @click="baixarLogs" class="btn" style="background: var(--cor-primaria); color: #121212; font-weight: bold;">
                <i class="fas fa-download"></i> BAIXAR RELATÓRIO (.TXT)
            </button>
        </div>

        <div class="card" style="padding: 0; overflow: hidden; border: 1px solid #333;">
            <div style="padding: 15px; background: #1A1A1A; border-bottom: 1px solid #333;">
                <strong style="color: white;">Visualização Rápida</strong>
            </div>
            <div style="padding: 15px; max-height: 400px; overflow-y: auto; background: #000; font-family: 'Courier New', monospace; font-size: 0.8rem;">
                <div v-for="log in $root.historicoGlobais" :key="log.id" style="border-bottom: 1px solid #222; padding: 8px 0; color: #00E676;">
                    <span style="color: #666;">[{{ log.dataStr }} {{ log.horaStr }}]</span> 
                    <strong style="color: #FFF;">{{ log.acao }}</strong>
                    <div style="color: #AAA; margin-top: 2px;">{{ log.detalhes }}</div>
                </div>
                <div v-if="!$root.historicoGlobais || $root.historicoGlobais.length === 0" style="color: #666; text-align: center; padding: 20px;">
                    Nenhum registro encontrado no histórico recente.
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        baixarLogs() {
            let conteudo = "==========================================\n";
            conteudo += "       RELATÓRIO DE LOGS - PIZZA MASTER    \n";
            conteudo += "==========================================\n";
            conteudo += `Data de Geração: ${new Date().toLocaleString()}\n`;
            conteudo += `Versão do App: ${this.$root.versaoApp}\n`;
            conteudo += `Usuário Logado: ${this.$root.usuario ? this.$root.usuario.nome : 'Desconhecido'}\n\n`;

            conteudo += "=== DIAGNÓSTICO DE ROTAS ===\n";
            if (this.$root.rotasSalvas && this.$root.rotasSalvas.length > 0) {
                conteudo += `Total de Rotas: ${this.$root.rotasSalvas.length}\n`;
                this.$root.rotasSalvas.forEach((r, i) => {
                    conteudo += `Rota ${i+1}: ${r.nome || r} (Ordem: ${r.ordem || 'N/A'})\n`;
                });
            } else {
                conteudo += "ALERTA: Nenhuma rota carregada na memória.\n";
            }
            conteudo += "\n";

            conteudo += "=== HISTÓRICO DE AÇÕES E ERROS ===\n";
            if (this.$root.historicoGlobais && this.$root.historicoGlobais.length > 0) {
                this.$root.historicoGlobais.forEach(log => {
                    conteudo += `------------------------------------------\n`;
                    conteudo += `DATA: ${log.dataStr} às ${log.horaStr}\n`;
                    conteudo += `AÇÃO: ${log.acao.toUpperCase()}\n`;
                    conteudo += `SETOR: ${log.setor}\n`;
                    conteudo += `USUÁRIO: ${log.usuario}\n`;
                    conteudo += `DETALHES: ${log.detalhes}\n`;
                });
            } else {
                conteudo += "Nenhum histórico registrado.\n";
            }

            const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `LOGS_PIZZA_MASTER_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
});
