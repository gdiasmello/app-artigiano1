// INÍCIO DO ARQUIVO modulos/ajustes.js - v0.0.75
Vue.component('tela-ajustes', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #AAAAAA;">⚙️ Ajustes</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
            
            <button @click="$root.mudarTela('tela-ajustes-perfil')" class="menu-btn" style="border-left: 4px solid #00B0FF;">
                <i class="fas fa-user-circle" style="color: #00B0FF;"></i> Meu Perfil & WhatsApp
            </button>

            <button @click="$root.mudarTela('tela-ajustes-sugestoes')" class="menu-btn" style="border-left: 4px solid #00E676;">
                <i class="fas fa-lightbulb" style="color: #00E676;"></i> Sugestões & Erros
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-produtos')" class="menu-btn" style="border-left: 4px solid #00C853;">
                <i class="fas fa-box" style="color: #00C853;"></i> Banco de Produtos
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-rotas')" class="menu-btn" style="border-left: 4px solid #FFAB00;">
                <i class="fas fa-route" style="color: #FFAB00;"></i> Rotas da Loja
            </button>

            <button v-if="$root.usuario.permissoes.admin" @click="$root.mudarTela('tela-ajustes-equipe')" class="menu-btn" style="border-left: 4px solid #D50000;">
                <i class="fas fa-users" style="color: #D50000;"></i> Gestão de Equipe
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-checklists')" class="menu-btn" style="border-left: 4px solid #2962FF;">
                <i class="fas fa-tasks" style="color: #2962FF;"></i> Checklists
            </button>

            <button v-if="$root.usuario.permissoes.admin" @click="$root.mudarTela('tela-ajustes-loja')" class="menu-btn" style="border-left: 4px solid #E0E0E0;">
                <i class="fas fa-store" style="color: #E0E0E0;"></i> Configurações do ERP
            </button>
            
            <button @click="$root.mudarTela('tela-ajustes-ajuda')" class="menu-btn" style="border-left: 4px solid #888;">
                <i class="fas fa-question-circle" style="color: #888;"></i> Ajuda & Suporte
            </button>
            
        </div>
    </div>
    `,
    mounted() {
        if (!document.getElementById('css-ajustes-menu')) {
            const style = document.createElement('style'); style.id = 'css-ajustes-menu';
            style.innerHTML = `
                .menu-btn {
                    background: #1A1A1A; color: white; border: 1px solid #333; padding: 20px;
                    border-radius: 12px; font-size: 1.1rem; font-weight: bold; text-align: left;
                    cursor: pointer; display: flex; align-items: center; gap: 15px; transition: 0.2s;
                }
                .menu-btn:active { background: #222; transform: scale(0.98); }
                .menu-btn i { font-size: 1.5rem; width: 30px; text-align: center; }
            `;
            document.head.appendChild(style);
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes.js
