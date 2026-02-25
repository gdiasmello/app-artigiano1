/**
 * IA Insumos v2.8.0
 * Alertas de pedido e carrinho.
 */
window.IA_Insumos = {
    analisar(root) {
        let avisos = [];
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        const dataHoje = hoje.toLocaleDateString('pt-BR');

        // Segunda (1) e Quinta (4) são dias de pedido oficial
        if ((diaSemana === 1 || diaSemana === 4) && root.dataPedidoInsumos !== dataHoje) {
            avisos.push({
                id: 'alerta_pedido_insumos',
                texto: "Hoje é dia de pedido ao Atacadista! Verifique o estoque de Insumos e Frios.",
                tipo: 'urgente',
                icone: 'fa-truck-loading',
                telaDestino: 'tela-insumos'
            });
        }

        if (root.carrinhoInsumos.length > 0) {
            avisos.push({
                id: 'carrinho_pendente',
                texto: `Existem ${root.carrinhoInsumos.length} itens aguardando no carrinho. Finalize o pedido!`,
                tipo: 'padrao',
                icone: 'fa-shopping-cart',
                telaDestino: 'tela-insumos'
            });
        }

        return avisos;
    }
};
