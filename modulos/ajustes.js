// INÍCIO DO ARQUIVO modulos/ajustes.js - v2.0.1
Vue.component('tela-ajustes', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="margin: 0; color: white;">Ajustes</h2>
        </div>

        <button v-if="temNovidade" @click="verNovidades" class="animate__animated animate__pulse animate__infinite" style="width: 100%; text-align: left; background: rgba(255, 171, 0, 0.05); border: 1px dashed #FFAB00; padding: 15px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-star" style="color: #FFAB00; font-size: 1.8rem;"></i>
                <div>
                    <strong style="color: #FFAB00; display: block; font-size: 1.1rem;">O que há de Novo?</strong>
                    <span style="color: #AAA; font-size: 0.85rem;">Veja as novidades da versão {{ $root.versaoApp }}</span>
                </div>
            </div>
            <i class="fas fa-chevron-right" style="color: #FFAB00;"></i>
        </button>

        <div style="display: flex; flex-direction: column; gap: 10px;">
            
            <button @click="$root.mudarTela('tela-ajustes-perfil')" class="btn-menu-ajuste">
                <div class="esq"><i class="fas fa-user-circle" style="color: #00B0FF;"></i> <span>Meu Perfil (Senha e Nome)</span></div>
                <i class="fas fa-chevron-right dir"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.avisos" @click="$root.mudarTela('tela-ajustes-avisos')" class="btn-menu-ajuste">
                <div class="esq"><i class="fas fa-bullhorn" style="color: #FFAB00;"></i> <span>Gestão de Avisos</span></div>
                <i class="fas fa-chevron-right dir"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-loja')" class="btn-menu-ajuste">
                <div class="esq"><i class="fas fa-store" style="color: #FF9800;"></i> <span>Ajustes da Loja (Metas & IA)</span></div>
                <i class="fas fa-chevron-right dir"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-equipe')" class="btn-menu-ajuste">
                <div class="esq"><i class="fas fa-users" style="color: #FF5252;"></i> <span>Gestão de Equipe</span></div>
                <i class="fas fa-chevron-right dir"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-produtos')" class="btn-menu-ajuste">
                <div class="esq"><i class="fas fa-box" style="color: #00E676;"></i> <span>Gestão ERP (Produtos)</span></div>
                <i class="fas fa-chevron-right dir"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-rotas')" class="btn-menu-ajuste">
                <div class="esq"><i class="fas fa-route" style="color: #9C27B0;"></i> <span>Gestão de Rotas</span></div>
                <i class="fas fa-chevron-right dir"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-checklists')" class="btn-menu-ajuste">
                <div class="esq"><i class="fas fa-clipboard-list" style="color: #5C6BC0;"></i> <span>Gestão de Checklists</span></div>
                <i class="fas fa-chevron-right dir"></i>
            </button>

            <button @click="$root.mudarTela('tela-ajustes-ajuda')" class="btn-menu-ajuste">
                <div class="esq"><i class="fas fa-question-circle" style="color: #888;"></i> <span>Ajuda e Suporte</span></div>
                <i class="fas fa-chevron-right dir"></i>
            </button>

        </div>
    </div>
    `,
    mounted() {
        if (!document.getElementById('css-menu-ajustes')) {
            const style = document.createElement('style'); style.id = 'css-menu-ajustes';
            style.innerHTML = `
                .btn-menu-ajuste { width: 100%; background: #1A1A1A; border: 1px solid #333; padding: 18px 15px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s; }
                .btn-menu-ajuste:active { transform: scale(0.98); border-color: #555; }
                .btn-menu-ajuste .esq { display: flex; align-items: center; gap: 15px; font-size: 1.05rem; color: white; font-weight: 500; }
                .btn-menu-ajuste .esq i { font-size: 1.3rem; width: 25px; text-align: center; }
                .btn-menu-ajuste .dir { color: #555; font-size: 1.1rem; }
            `;
            document.head.appendChild(style);
        }
    },
    computed: {
        temNovidade() {
            if (!this.$root.usuario) return false;
            const vista = this.$root.usuario.versaoVista || '0.0.0';
            return vista !== this.$root.versaoApp;
        }
    },
    methods: {
        verNovidades() {
            this.$root.vibrar(30);
            Swal.fire({
                title: 'O que há de novo?',
                html: `
                <div style="text-align:left; font-size:0.9rem; line-height:1.5; color:#CCC;">
                    <h3 style="color:#FFAB00; text-align:center; margin-top:0;">Versão ${this.$root.versaoApp} 🚀</h3>
                    <ul style="padding-left:20px;">
                        <li><b style="color:#00E676;">Layouts Restaurados:</b> O design bonito do seu menu de ajustes voltou!</li>
                        <li><b style="color:#9C27B0;">Rotas:</b> Seta de voltar reposicionada corretamente para a esquerda.</li>
                        <li><b style="color:#FFAB00;">Notificações:</b> Este aviso de novidades agora aparece apenas dentro do Menu Ajustes.</li>
                    </ul>
                </div>`,
                background: '#1E1E1E', color: '#FFF', confirmButtonColor: '#FFAB00'
            }).then(() => {
                this.$root.marcarNovidadesLidas();
            });
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes.js
