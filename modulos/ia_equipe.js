/**
 * IA Equipe v2.4.0
 * Monitoramento de aniversários e eventos da equipe.
 */
window.IA_Equipe = {
    analisar(root) {
        let avisos = [];
        const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        (root.equipe || []).forEach(membro => {
            if (membro.nascimento) {
                const partes = membro.nascimento.split('-'); 
                const niver = `${partes[2]}/${partes[1]}`;
                if (niver === hoje) {
                    avisos.push({
                        id: `niver_${membro.id}`,
                        texto: `Hoje é aniversário de ${membro.nome}! Parabéns! 🎂🎉`,
                        tipo: 'festa',
                        icone: 'fa-birthday-cake'
                    });
                }
            }
        });
        return avisos;
    }
};
