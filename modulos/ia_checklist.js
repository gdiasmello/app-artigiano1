/**
 * IA Checklist v1.0.0
 * Analisa o contexto para sugerir rotinas operacionais no mural.
 */
window.IA_Checklist = {
    analisar(root) {
        let sugestoes = [];
        const agora = new Date();
        const horaMin = agora.getHours() * 60 + agora.getMinutes();
        const diaSemana = agora.getDay();
        const hojeStr = agora.toLocaleDateString('pt-BR');
        
        // Verifica se é feriado ou véspera (simulado ou vindo do root)
        const isFeriado = root.feriados && root.feriados.includes(hojeStr);
        const amanha = new Date(agora);
        amanha.setDate(amanha.getDate() + 1);
        const amanhaStr = amanha.toLocaleDateString('pt-BR');
        const isVespera = root.feriados && root.feriados.includes(amanhaStr);

        root.bancoChecklists.forEach(c => {
            // 1. Filtro de Público
            let podeVer = false;
            if (c.publico === 'Todos') podeVer = true;
            else if (c.publico === 'Pessoal' && c.idCriador === root.usuario.id) podeVer = true;
            else if (c.publico === root.usuario.cargo) podeVer = true;
            else if (root.usuario.permissoes?.admin) podeVer = true;

            if (!podeVer) return;

            // 2. Filtro de Conclusão (Não mostrar se já concluiu hoje)
            const chaveConcluido = `${c.id}_${hojeStr}`;
            if (root.checklistsConcluidos && root.checklistsConcluidos[chaveConcluido]) return;

            // 3. Filtro de Agendamento Inteligente
            const ag = c.agendamento;
            let match = true;

            // Dias da semana
            if (ag.dias && !ag.dias.includes(diaSemana)) match = false;

            // Feriado / Véspera
            if (ag.feriado && !isFeriado) match = false;
            if (ag.vespera && !isVespera) match = false;

            // Horário (Mostra se estiver dentro de uma janela de 2 horas do horário definido)
            if (ag.horario) {
                const [h, m] = ag.horario.split(':').map(Number);
                const agendaMin = h * 60 + m;
                // Mostra 30 min antes e até 2 horas depois
                if (horaMin < agendaMin - 30 || horaMin > agendaMin + 120) match = false;
            }

            if (match) {
                sugestoes.push({
                    id: `checklist_${c.id}`,
                    texto: `📋 ROTINA: ${c.titulo}. Clique para iniciar o procedimento.`,
                    tipo: 'padrao',
                    icone: 'fa-tasks',
                    telaDestino: 'tela-execucao-checklist',
                    dados: c
                });
            }
        });

        return sugestoes;
    }
};
