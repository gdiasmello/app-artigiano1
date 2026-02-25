/**
 * IA Limpeza v2.7.0
 * Alertas de estoque de limpeza.
 */
window.IA_Limpeza = {
    analisar(root) {
        let avisos = [];
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        const dataHoje = hoje.toLocaleDateString('pt-BR');

        // Quarta-feira (3) é dia de conferir limpeza
        if (diaSemana === 3 && root.dataPedidoLimpeza !== dataHoje) {
            avisos.push({
                id: 'alerta_limpeza',
                texto: "Dia de conferir o estoque de Limpeza! Garanta que nada falte para o fim de semana.",
                tipo: 'padrao',
                icone: 'fa-broom',
                telaDestino: 'tela-limpeza'
            });
        }
        return avisos;
    }
};
