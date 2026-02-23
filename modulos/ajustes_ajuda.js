// INÍCIO DO ARQUIVO modulos/ajustes_ajuda.js - v0.0.83
Vue.component('tela-ajustes-ajuda', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #888;">❓ Central de Ajuda</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="border-top: 3px solid #FFAB00; padding: 15px; margin-bottom: 15px;">
            <h3 style="color: white; margin-top: 0; font-size: 1.1rem;">Como utilizar o App</h3>
            
            <div class="ajuda-item" @click="abrirTutorial('massa')">
                <div class="ajuda-icon" style="color: var(--cor-primaria);"><i class="fas fa-calculator"></i></div>
                <div class="ajuda-texto"><strong>Produção de Massas</strong><small>Metas, IA e cálculos diários.</small></div>
                <i class="fas fa-chevron-right"></i>
            </div>

            <div class="ajuda-item" @click="abrirTutorial('pedidos')">
                <div class="ajuda-icon" style="color: #00C853; font-size: 1rem;"><i class="fas fa-shopping-basket"></i></div>
                <div class="ajuda-texto"><strong>Sacolão e Insumos</strong><small>Como fazer listas e enviar no Zap.</small></div>
                <i class="fas fa-chevron-right"></i>
            </div>

            <div class="ajuda-item" @click="abrirTutorial('limpeza')">
                <div class="ajuda-icon" style="color: #2962FF;"><i class="fas fa-broom"></i></div>
                <div class="ajuda-texto"><strong>Checklists e Limpeza</strong><small>Marcação de tarefas e rotinas.</small></div>
                <i class="fas fa-chevron-right"></i>
            </div>

            <div class="ajuda-item" @click="abrirTutorial('sugestoes')">
                <div class="ajuda-icon" style="color: #00E676;"><i class="fas fa-lightbulb"></i></div>
                <div class="ajuda-texto"><strong>Sugestões e Erros</strong><small>Como enviar prints para o Gerente.</small></div>
                <i class="fas fa-chevron-right"></i>
            </div>

            <div class="ajuda-item" @click="abrirTutorial('gestao')">
                <div class="ajuda-icon" style="color: #FF5252;"><i class="fas fa-users-cog"></i></div>
                <div class="ajuda-texto"><strong>Painel de Gestão</strong><small>Cadastrar equipe, produtos e rotas.</small></div>
                <i class="fas fa-chevron-right"></i>
            </div>

            <div class="ajuda-item" @click="abrirTutorial('login')">
                <div class="ajuda-icon"><i class="fas fa-lock"></i></div>
                <div class="ajuda-texto"><strong>Segurança e PIN</strong><small>Troca de senha e Reset.</small></div>
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>

        <div class="card" style="background: #111; border: 1px solid #333; padding: 15px;">
            <h3 style="color: #666; margin-top: 0; font-size: 0.8rem; letter-spacing: 1px;">SISTEMA</h3>
            <div style="font-size: 0.85rem; color: #AAA; line-height: 1.6;">
                <div>ID Usuário: <span style="color:white">{{ $root.usuario.id }}</span></div>
                <div>Status Nuvem: <span style="color:#00E676">Firebase Conectado</span></div>
                <div>Modo: <span style="color:#FFAB00">{{ $root.estaInstalado ? 'APP' : 'BROWSER' }}</span></div>
            </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
            <button @click="contatarSuporte" class="btn" style="background: #25D366; color: #FFF; display: flex; align-items: center; justify-content: center; gap: 10px; border:none; box-shadow: 0 4px 15px rgba(37,211,102,0.3);">
                <i class="fab fa-whatsapp" style="font-size: 1.4rem;"></i> FALAR COM O DESENVOLVEDOR
            </button>
            
            <button @click="reiniciarForçado" style="background: none; border: none; color: #FF5252; margin-top: 25px; font-size: 0.75rem; text-decoration: underline; opacity: 0.5;">
                Limpar Cache e Sair do App
            </button>
        </div>

    </div>
    `,
    methods: {
        abrirTutorial(tipo) {
            this.$root.vibrar(20);
            let c = { background: '#1E1E1E', color: '#FFF', confirmButtonColor: '#444' };
            if (tipo === 'massa') {
                Swal.fire({ ...c, title: 'Produção', html: '<div style="text-align:left; font-size:0.85rem;">O app calcula o histórico de vendas. Se o clima estiver acima de 27°C, a IA sugere aumentar a produção de massas leves.</div>' });
            } else if (tipo === 'pedidos') {
                Swal.fire({ ...c, title: 'Pedidos', html: '<div style="text-align:left; font-size:0.85rem;">Ao finalizar a contagem, clique no ícone do WhatsApp. O app gera a lista e você escolhe o fornecedor para enviar.</div>' });
            } else if (tipo === 'limpeza') {
                Swal.fire({ ...c, title: 'Checklists', html: '<div style="text-align:left; font-size:0.85rem;">As tarefas aparecem conforme o dia da semana. Ao marcar como feito, o Gerente recebe o registo na Auditoria.</div>' });
            } else if (tipo === 'sugestoes') {
                Swal.fire({ ...c, title: 'Feedbacks', html: '<div style="text-align:left; font-size:0.85rem;">Viu um erro? Tire um print e envie em <b>Ajustes > Sugestões</b>. O Gabriel receberá uma notificação no Dashboard dele.</div>' });
            } else if (tipo === 'gestao') {
                Swal.fire({ ...c, title: 'Gestão ERP', html: '<div style="text-align:left; font-size:0.85rem;">Apenas Administradores podem criar novos produtos ou alterar permissões da equipe. Use as rotas para organizar a contagem.</div>' });
            } else if (tipo === 'login') {
                Swal.fire({ ...c, title: 'PIN', html: '<div style="text-align:left; font-size:0.85rem;">Se trocar de PIN, ele fica guardado na sua conta. Se esquecer, peça reset. A senha volta para 1234 e você cria uma nova.</div>' });
            }
        },
        contatarSuporte() {
            this.$root.vibrar(30);
            const msg = encodeURIComponent("Olá Gabriel! Estou no PiZZA Master v0.0.83 e preciso de suporte.");
            window.open(`https://api.whatsapp.com/send?phone=5543984544686&text=${msg}`, '_blank');
        },
        reiniciarForçado() {
            Swal.fire({ title: 'Limpar tudo?', text: "Você será deslogado e o cache será limpo.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#FF5252', background: '#1E1E1E', color: '#FFF' }).then((r) => {
                if (r.isConfirmed) { localStorage.clear(); location.reload(true); }
            });
        }
    },
    mounted() {
        if (!document.getElementById('css-ajuda-v83')) {
            const s = document.createElement('style'); s.id = 'css-ajuda-v83';
            s.innerHTML = `
                .ajuda-item { display: flex; align-items: center; gap: 15px; padding: 12px 0; border-bottom: 1px solid #222; cursor: pointer; }
                .ajuda-item:last-child { border-bottom: none; }
                .ajuda-icon { width: 38px; height: 38px; background: #222; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
                .ajuda-texto { flex: 1; }
                .ajuda-texto strong { color: #EEE; font-size: 0.9rem; display: block; }
                .ajuda-texto small { color: #555; font-size: 0.75rem; }
                .ajuda-item i.fa-chevron-right { color: #333; font-size: 0.7rem; }
            `;
            document.head.appendChild(s);
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_ajuda.js
