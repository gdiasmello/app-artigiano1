/**
 * IA Sacolão v2.6.0
 * Alertas de feira e vegetais.
 */
window.IA_Sacolao = {
    analisar(root) {
        let avisos = [];
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        const dataHoje = hoje.toLocaleDateString('pt-BR');

        // Terça (2) e Sexta (5) são dias de feira
        if ((diaSemana === 2 || diaSemana === 5) && root.dataPedidoSacolao !== dataHoje) {
            avisos.push({
                id: 'alerta_sacolao',
                texto: "Hoje é dia de feira! Verifique os vegetais e envie o pedido.",
                tipo: 'urgente',
                icone: 'fa-carrot',
                telaDestino: 'tela-sacolao'
            });
        }
        return avisos;
    }
};
