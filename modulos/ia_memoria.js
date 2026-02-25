/**
 * IA Memória Operacional v1.0.0
 * Aprende com o histórico de pedidos para prever necessidades futuras.
 */
window.IA_Memoria = {
    analisar(root) {
        let sugestoes = [];
        const historico = root.historicoGlobais || [];
        
        // Filtra apenas ações de "Pedido"
        const pedidosHistorico = historico.filter(h => h.acao === 'Pedido');
        
        if (pedidosHistorico.length < 2) return [];

        const hoje = new Date().getTime();
        const umDia = 24 * 60 * 60 * 1000;

        // Analisa por setor
        const setores = ['Sacolão', 'Insumos', 'Limpeza'];
        setores.forEach(setor => {
            const pedidosSetor = pedidosHistorico.filter(p => p.setor === setor);
            if (pedidosSetor.length === 0) return;

            // Pega o último pedido
            const ultimo = pedidosSetor[0];
            const dataUltimo = new Date(ultimo.id).getTime();
            const diasDesdeUltimo = (hoje - dataUltimo) / umDia;

            // Se faz mais de 3 dias, sugere conferir
            if (diasDesdeUltimo >= 3) {
                // Tenta encontrar itens específicos deste setor na memória detalhada
                const itensSetor = root.bancoProdutos.filter(p => p.categoria === setor || (setor === 'Insumos' && p.categoria !== 'Sacolão' && p.categoria !== 'Limpeza'));
                let itensSugeridos = [];
                
                itensSetor.forEach(p => {
                    const mem = root.memoriaOperacional.itens[p.nome];
                    if (mem && mem.ultimaQtd) {
                        itensSugeridos.push(`${p.nome} (última vez: ${mem.ultimaQtd} ${p.unidade})`);
                    }
                });

                let texto = `🧠 IA Memória: Notei que faz ${Math.floor(diasDesdeUltimo)} dias que não pedimos ${setor}.`;
                if (itensSugeridos.length > 0) {
                    texto += ` Geralmente pedimos: ${itensSugeridos.slice(0, 3).join(', ')}...`;
                }

                sugestoes.push({
                    id: `memoria_${setor}`,
                    texto: texto,
                    tipo: 'padrao',
                    icone: 'fa-brain',
                    telaDestino: this.getTelaPorSetor(setor)
                });
            }
        });

        return sugestoes;
    },

    getTelaPorSetor(setor) {
        const mapas = {
            'Sacolão': 'tela-sacolao',
            'Insumos': 'tela-insumos',
            'Limpeza': 'tela-limpeza'
        };
        return mapas[setor] || 'tela-dashboard';
    }
};
