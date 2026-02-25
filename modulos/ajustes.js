/**
 * Menu de Ajustes v2.0.1
 * Central de comando do sistema.
 */
Vue.component('tela-ajustes', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="margin: 0; color: white;">Ajustes & Gestão</h2>
        </div>

        <div class="menu-ajustes">
            <button @click="$root.mudarTela('tela-ajustes-perfil')" class="btn-ajuste">
                <div class="info"><i class="fas fa-user-circle" style="color: #00B0FF;"></i> <span>Meu Perfil</span></div>
                <i class="fas fa-chevron-right"></i>
            </button>

            <button v-if="isAdmin" @click="$root.mudarTela('tela-ajustes-avisos')" class="btn-ajuste">
                <div class="info"><i class="fas fa-bullhorn" style="color: #FFAB00;"></i> <span>Mural de Avisos</span></div>
                <i class="fas fa-chevron-right"></i>
            </button>

            <button v-if="isAdmin" @click="$root.mudarTela('tela-ajustes-loja')" class="btn-ajuste">
                <div class="info"><i class="fas fa-store" style="color: #FF9800;"></i> <span>Configurações da Loja</span></div>
                <i class="fas fa-chevron-right"></i>
            </button>

            <button v-if="isAdmin" @click="$root.mudarTela('tela-ajustes-equipe')" class="btn-ajuste">
                <div class="info"><i class="fas fa-users-cog" style="color: #FF5252;"></i> <span>Gestão de Equipe</span></div>
                <i class="fas fa-chevron-right"></i>
            </button>

            <button v-if="isAdmin" @click="$root.mudarTela('tela-gestao-produtos')" class="btn-ajuste">
                <div class="info"><i class="fas fa-boxes" style="color: #00E676;"></i> <span>Gestão ERP (Produtos)</span></div>
                <i class="fas fa-chevron-right"></i>
            </button>

            <button v-if="isAdmin" @click="$root.mudarTela('tela-ajustes-rotas')" class="btn-ajuste">
                <div class="info"><i class="fas fa-route" style="color: #9C27B0;"></i> <span>Gestão de Rotas</span></div>
                <i class="fas fa-chevron-right"></i>
            </button>

            <button v-if="isAdmin" @click="$root.mudarTela('tela-ajustes-checklists')" class="btn-ajuste">
                <div class="info"><i class="fas fa-clipboard-list" style="color: #5C6BC0;"></i> <span>Checklists</span></div>
                <i class="fas fa-chevron-right"></i>
            </button>

            <button @click="$root.mudarTela('tela-ajustes-ajuda')" class="btn-ajuste">
                <div class="info"><i class="fas fa-question-circle" style="color: #888;"></i> <span>Ajuda & Suporte</span></div>
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>

        <div style="text-align: center; margin-top: 40px; opacity: 0.3;">
            <p style="font-size: 0.7rem; color: #AAA;">PiZZA Master v{{ $root.versaoApp }} | Londrina-PR</p>
        </div>
    </div>
    `,
    computed: {
        isAdmin() {
            return this.$root.usuario?.permissoes?.admin || this.$root.usuario?.cargo === 'Gerente';
        }
    },
    mounted() {
        if (!document.getElementById('css-ajustes')) {
            const style = document.createElement('style');
            style.id = 'css-ajustes';
            style.innerHTML = `
                .menu-ajustes { display: flex; flex-direction: column; gap: 10px; }
                .btn-ajuste { 
                    width: 100%; 
                    background: #1A1A1A; 
                    border: 1px solid #333; 
                    padding: 20px; 
                    border-radius: 12px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-ajuste:active { transform: scale(0.98); background: #222; }
                .btn-ajuste .info { display: flex; align-items: center; gap: 15px; }
                .btn-ajuste .info i { font-size: 1.4rem; width: 30px; text-align: center; }
                .btn-ajuste .info span { color: white; font-weight: 600; font-size: 1rem; }
                .btn-ajuste > i { color: #444; }
            `;
            document.head.appendChild(style);
        }
    }
});
