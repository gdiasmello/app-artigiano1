// INÍCIO DO ARQUIVO modulos/ajustes.js - v0.0.97
Vue.component('tela-ajustes', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #AAAAAA;">⚙️ Ajustes & Gestão</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
            
            <button @click="$root.mudarTela('tela-ajustes-perfil')" class="btn-ajuste">
                <i class="fas fa-user-circle" style="color: #00B0FF;"></i>
                <span>Meu Perfil</span>
                <i class="fas fa-chevron-right seta"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-loja')" class="btn-ajuste">
                <i class="fas fa-store" style="color: #FFAB00;"></i>
                <span>Ajustes da Loja (Metas & IA)</span>
                <i class="fas fa-chevron-right seta"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-equipe')" class="btn-ajuste">
                <i class="fas fa-users" style="color: #D50000;"></i>
                <span>Gestão de Equipe</span>
                <i class="fas fa-chevron-right seta"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-produtos')" class="btn-ajuste">
                <i class="fas fa-box-open" style="color: #00C853;"></i>
                <span>Gestão ERP (Produtos)</span>
                <i class="fas fa-chevron-right seta"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-rotas')" class="btn-ajuste">
                <i class="fas fa-route" style="color: #9C27B0;"></i>
                <span>Gestão de Rotas</span>
                <i class="fas fa-chevron-right seta"></i>
            </button>

            <button v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar" @click="$root.mudarTela('tela-ajustes-checklists')" class="btn-ajuste">
                <i class="fas fa-clipboard-list" style="color: #2962FF;"></i>
                <span>Gestão de Checklists</span>
                <i class="fas fa-chevron-right seta"></i>
            </button>

            <button @click="$root.mudarTela('tela-ajustes-ajuda')" class="btn-ajuste">
                <i class="fas fa-question-circle" style="color: #888;"></i>
                <span>Ajuda e Suporte</span>
                <i class="fas fa-chevron-right seta"></i>
            </button>
            
            <button @click="$root.mudarTela('tela-ajustes-sugestoes')" class="btn-ajuste">
                <i class="fas fa-lightbulb" style="color: #FFD600;"></i>
                <span>Sugestões & Bugs</span>
                <i class="fas fa-chevron-right seta"></i>
            </button>

        </div>
    </div>
    `,
    mounted() {
        if (!document.getElementById('css-ajustes-v97')) {
            const style = document.createElement('style');
            style.id = 'css-ajustes-v97';
            style.innerHTML = `
                .btn-ajuste { 
                    width: 100%; 
                    background: var(--bg-card); 
                    border: 1px solid #333; 
                    padding: 20px 15px; 
                    border-radius: 12px; 
                    display: flex; 
                    align-items: center; 
                    cursor: pointer; 
                    transition: 0.2s; 
                }
                .btn-ajuste:active { background: #252525; transform: scale(0.98); }
                .btn-ajuste i:first-child { font-size: 1.5rem; width: 35px; text-align: center; }
                .btn-ajuste span { flex: 1; text-align: left; color: white; font-size: 1.05rem; font-weight: bold; margin-left: 10px; }
                .seta { color: #555; font-size: 0.9rem; }
            `;
            document.head.appendChild(style);
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes.js
