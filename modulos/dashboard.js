// INÍCIO DO ARQUIVO modulos/dashboard.js - v1.0.5
Vue.component('tela-dashboard', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <div>
                <h2 style="margin: 0; color: white;">Olá, {{ $root.usuario.nome }} 👋</h2>
                <p style="margin: 5px 0 0 0; color: #AAA; font-size: 0.85rem;">
                    <i class="fas fa-temperature-high" style="color: #FFAB00;"></i> Londrina: {{ $root.clima.temperatura }}°C
                </p>
            </div>
            
            <button @click="$root.fazerLogout()" style="background: rgba(255, 82, 82, 0.1); border: 1px solid #FF5252; color: #FF5252; padding: 10px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s;">
                <i class="fas fa-sign-out-alt"></i> Sair
            </button>
        </div>

        <div v-if="$root.avisos.length > 0" class="card animate__animated animate__fadeInDown" style="border-left: 4px solid #FFAB00; padding: 15px; margin-bottom: 20px;">
            <strong style="color: #FFAB00; display: block; margin-bottom: 5px;">
                <i class="fas fa-bullhorn"></i> Mural de Avisos
            </strong>
            <p v-for="aviso in $root.avisos" :key="aviso.id" style="color: #FFF; font-size: 0.9rem; margin: 5px 0;">
                - {{ aviso.texto }}
            </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            
            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.producao" @click="$root.mudarTela('tela-massa')" class="card" style="padding: 20px; text-align: center; border-bottom: 4px solid var(--cor-primaria); cursor: pointer; transition: 0.2s;">
                <i class="fas fa-pizza-slice" style="font-size: 2.5rem; color: var(--cor-primaria); margin-bottom: 10px;"></i>
                <h4 style="margin: 0; color: white;">Produção</h4>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.pedidos" @click="$root.mudarTela('tela-sacolao')" class="card" style="padding: 20px; text-align: center; border-bottom: 4px solid #00C853; cursor: pointer; transition: 0.2s;">
                <i class="fas fa-carrot" style="font-size: 2.5rem; color: #00C853; margin-bottom: 10px;"></i>
                <h4 style="margin: 0; color: white;">Sacolão</h4>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.pedidos" @click="$root.mudarTela('tela-insumos')" class="card" style="padding: 20px; text-align: center; border-bottom: 4px solid #D50000; cursor: pointer; transition: 0.2s;">
                <i class="fas fa-box-open" style="font-size: 2.5rem; color: #D50000; margin-bottom: 10px;"></i>
                <h4 style="margin: 0; color: white;">Insumos</h4>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.pedidos" @click="$root.mudarTela('tela-gelo')" class="card" style="padding: 20px; text-align: center; border-bottom: 4px solid #00B0FF; cursor: pointer; transition: 0.2s;">
                <i class="fas fa-snowflake" style="font-size: 2.5rem; color: #00B0FF; margin-bottom: 10px;"></i>
                <h4 style="margin: 0; color: white;">Gelo</h4>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.limpeza" @click="$root.mudarTela('tela-limpeza')" class="card" style="padding: 20px; text-align: center; border-bottom: 4px solid #2962FF; cursor: pointer; transition: 0.2s;">
                <i class="fas fa-broom" style="font-size: 2.5rem; color: #2962FF; margin-bottom: 10px;"></i>
                <h4 style="margin: 0; color: white;">Limpeza</h4>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.historico || $root.usuario.cargo === 'Gerente'" @click="$root.mudarTela('tela-historico')" class="card" style="padding: 20px; text-align: center; border-bottom: 4px solid #E0E0E0; cursor: pointer; transition: 0.2s;">
                <i class="fas fa-history" style="font-size: 2.5rem; color: #E0E0E0; margin-bottom: 10px;"></i>
                <h4 style="margin: 0; color: white;">Auditoria</h4>
            </button>

        </div>

        <div style="margin-top: 20px;">
            <button @click="$root.mudarTela('tela-ajustes')" class="btn" style="width: 100%; background: #2C2C2C; color: white; border: 1px solid #444; height: 60px; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-cog"></i> Configurações & Ajustes
            </button>
        </div>

    </div>
    `,
    methods: {
        abrirTelaDeNovidades(atualizarVersao = true) {
            const htmlNovidades = `
                <div style="text-align: left; font-size: 0.9rem; line-height: 1.5; color: #CCC;">
                    <h3 style="color: #FFAB00; text-align: center; margin-top: 0;">Chegou a v${this.$root.versaoApp}! 🚀</h3>
                    <p>Veja as melhorias desta atualização:</p>
                    <ul style="padding-left: 20px; margin-bottom: 20px;">
                        <li><b style="color: #00E676;">Meu Perfil:</b> Você agora pode alterar sua senha e nome nas configurações.</li>
                        <li><b style="color: #00B0FF;">Envio Único:</b> O botão de Insumos agora junta Limpeza e Extras na mesma mensagem de WhatsApp!</li>
                        <li><b style="color: #FF5252;">Sugestões:</b> O botão de reporte agora manda mensagem diretamente para o desenvolvedor.</li>
                    </ul>
                </div>
            `;

            Swal.fire({
                html: htmlNovidades,
                background: '#1E1E1E',
                color: '#FFF',
                confirmButtonColor: '#FFAB00',
                confirmButtonText: 'Entendi, fechar!'
            }).then(() => {
                // Se foi um popup automático, atualiza a versão lida na base de dados do utilizador
                if (atualizarVersao) {
                    this.$root.marcarVersaoVista();
                }
            });
        },
        verificarTutorialInicial() {
            // Verifica se o utilizador já viu o tutorial do Dashboard
            if (this.$root.precisaVerTutorial('tut_dashboard_v1')) {
                setTimeout(() => {
                    Swal.fire({
                        title: 'Bem-vindo ao PiZZA Master!',
                        html: `
                            <div style="text-align: left; font-size: 0.9rem; color: #CCC; line-height: 1.5;">
                                Esta é a sua <b>Tela Principal (Dashboard)</b>.<br><br>
                                Aqui você tem acesso a todos os setores da pizzaria organizados por cores. <br><br>
                                <b style="color: #00E676;">Dica Mágica:</b> O sistema grava automaticamente as suas contagens na nuvem em tempo real para manter toda a equipa sincronizada!
                            </div>
                        `,
                        icon: 'info',
                        confirmButtonText: 'Vamos lá!',
                        confirmButtonColor: '#2962FF',
                        background: '#1E1E1E', 
                        color: '#FFF'
                    }).then(() => {
                        this.$root.marcarTutorialVisto('tut_dashboard_v1');
                    });
                }, 800); // Atraso suave para dar tempo da tela renderizar
            }
        }
    },
    mounted() {
        // 🟢 DETECÇÃO AUTOMÁTICA DE VERSÃO NOVA
        if (this.$root.usuario) {
            const versaoDoUsuario = this.$root.usuario.versaoVista || '0.0.0';
            const versaoSistema = this.$root.versaoApp;

            if (versaoDoUsuario !== versaoSistema) {
                // Se for uma versão nova, mostra as novidades automaticamente
                setTimeout(() => {
                    this.abrirTelaDeNovidades(true);
                }, 500);
            } else {
                // Se já viu as novidades, verifica se precisa ver o tutorial pela primeira vez
                this.verificarTutorialInicial();
            }
        }
    }
});
// FIM DO ARQUIVO modulos/dashboard.js
