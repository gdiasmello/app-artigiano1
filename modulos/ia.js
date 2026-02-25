/**
 * Motor IA Maestro v2.20
 * Orquestra todos os insights preditivos do sistema.
 */
window.MotorIA = {
    _insightsAtivos: [], // Para gerenciar os insights que estão atualmente no mural
    analisar(root) {
        let insights = [];
        
        // Módulos carregados via script no index.html
        const modulos = [
            window.IA_Equipe,
            window.IA_Calendario,
            window.IA_Clima,
            window.IA_Massa,
            window.IA_Sacolao,
            window.IA_Limpeza,
            window.IA_Insumos,
            window.IA_Memoria,
            window.IA_Checklist
        ];

        modulos.forEach(mod => {
            if (mod && typeof mod.analisar === 'function') {
                try {
                    const result = mod.analisar(root);
                    if (Array.isArray(result)) insights.push(...result);
                } catch (e) {
                    console.error("Erro no módulo IA:", e);
                }
            }
        });

        this._insightsAtivos = insights; // Atualiza a lista de insights ativos

        // Ordenação: Urgentes primeiro
        return this._insightsAtivos.sort((a, b) => {
            const peso = { 'urgente': 3, 'gelo': 2, 'festa': 1, 'padrao': 0 };
            return (peso[b.tipo] || 0) - (peso[a.tipo] || 0);
        });
    },
    removerAviso(id) {
        const index = this._insightsAtivos.findIndex(insight => insight.id === id);
        if (index > -1) {
            this._insightsAtivos.splice(index, 1);
        }
    }
};
