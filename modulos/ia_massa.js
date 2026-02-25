/**
 * IA Massa v2.5.0
 * Preditividade baseada em dia da semana e histórico.
 */
window.IA_Massa = {
    analisar(root) {
        let avisos = [];
        const hoje = new Date();
        const diaSemana = hoje.getDay(); // 0=Dom, 5=Sex
        const horaAtual = hoje.getHours();
        const dataHoje = hoje.toLocaleDateString('pt-BR');

        // Alerta de Horário (16h00)
        if (root.dataEstoqueMassas !== dataHoje && horaAtual >= 16) {
            avisos.push({
                id: 'massa_16h',
                texto: "🚨 ATENÇÃO: A contagem de MASSAS ainda não foi registrada hoje! (Limite 16h)",
                tipo: 'urgente',
                icone: 'fa-clock',
                telaDestino: 'tela-massa'
            });
        }

        // Alerta de Chuva no Pico
        if (root.clima.vaiChoverPico) {
            avisos.push({
                id: 'chuva_pico',
                texto: "🌧️ IA: Alerta de chuva forte para hoje à noite (18h-22h). Reforce a produção de massa para o aumento no Delivery!",
                tipo: 'padrao',
                icone: 'fa-cloud-showers-heavy',
                telaDestino: 'tela-massa'
            });
        }

        // Se for Sexta ou Sábado e ainda não houve produção
        const isFimDeSemana = (diaSemana === 5 || diaSemana === 6);
        
        if (root.dataEstoqueMassas !== dataHoje) {
            if (horaAtual >= 14 && horaAtual < 16) { // Entre 14h e 16h (depois das 16h o alerta acima assume)
                avisos.push({
                    id: 'massa_pendente',
                    texto: isFimDeSemana 
                        ? "🚨 ALERTA CRÍTICO: Sexta/Sábado exige produção antecipada. Registre a massa AGORA!" 
                        : "Atenção: A contagem de massas para hoje ainda não foi realizada.",
                    tipo: isFimDeSemana ? 'urgente' : 'padrao',
                    icone: 'fa-pizza-slice',
                    telaDestino: 'tela-massa'
                });
            }
        } else {
            // Se já registrou, mas o estoque está baixo para um fim de semana
            const estoque = Number(root.estoqueMassasHoje) || 0;
            const meta = root.metas[diaSemana] || 80;
            
            if (estoque < (meta * 0.3) && isFimDeSemana && horaAtual < 21) {
                avisos.push({
                    id: 'massa_baixa',
                    texto: `Estoque de massa perigosamente baixo (${estoque}) para uma noite de fim de semana!`,
                    tipo: 'urgente',
                    icone: 'fa-exclamation-triangle',
                    telaDestino: 'tela-massa'
                });
            }
        }

        return avisos;
    }
};
