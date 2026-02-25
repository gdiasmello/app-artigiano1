/**
 * IA Clima & Gelo v2.4.0
 * Integração entre temperatura e logística de gelo.
 */
window.IA_Clima = {
    analisar(root) {
        let avisos = [];
        if (!root.clima || root.clima.temperatura === 'Off') return [];

        const temp = parseFloat(root.clima.temperatura);
        const hoje = new Date();
        const diaSemana = hoje.getDay();

        // Lógica Preditiva de Gelo
        if (temp >= 27) {
            let urgencia = 'gelo';
            let msg = `Calor detectado (${temp}°C). O consumo de gelo vai dobrar hoje!`;
            
            // Se for fim de semana, a urgência aumenta
            if (diaSemana === 5 || diaSemana === 6 || diaSemana === 0) {
                urgencia = 'urgente';
                msg = `🔥 ALERTA DE CALOR NO FIM DE SEMANA (${temp}°C). Verifique o estoque de GELO imediatamente!`;
            }

            avisos.push({
                id: 'alerta_clima_gelo',
                texto: msg,
                tipo: urgencia,
                icone: 'fa-snowflake',
                telaDestino: 'tela-gelo'
            });
        }

        // Dica de Vinhos para noites frias
        if (temp <= 16 && hoje.getHours() >= 18) {
            avisos.push({
                id: 'dica_vinho',
                texto: `Noite fria (${temp}°C). Ótimo momento para sugerir vinhos e calzones! 🍷`,
                tipo: 'padrao',
                icone: 'fa-wine-glass'
            });
        }

        return avisos;
    }
};
