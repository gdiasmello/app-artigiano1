/**
 * IA Calendário v2.4.0
 * Alertas de feriados e vésperas.
 */
window.IA_Calendario = {
    analisar(root) {
        let avisos = [];
        const hoje = new Date();
        const amanha = new Date(hoje); amanha.setDate(hoje.getDate() + 1);
        const diaHoje = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const diaAmanha = amanha.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        const feriados = {
            '01/01': 'Ano Novo', '01/05': 'Dia do Trabalho', '07/09': 'Independência',
            '12/10': 'Nossa Sr.ª Aparecida', '02/11': 'Finados', '15/11': 'Proclamação',
            '25/12': 'Natal', '31/12': 'Véspera de Ano Novo'
        };

        if (feriados[diaHoje]) {
            avisos.push({ id: 'feriado_hoje', texto: `Hoje é feriado: ${feriados[diaHoje]}!`, tipo: 'urgente', icone: 'fa-calendar-check' });
        }
        if (feriados[diaAmanha]) {
            avisos.push({ id: 'feriado_amanha', texto: `Amanhã é ${feriados[diaAmanha]}. Reforce a produção hoje!`, tipo: 'urgente', icone: 'fa-exclamation-circle', telaDestino: 'tela-massa' });
        }
        return avisos;
    }
};
