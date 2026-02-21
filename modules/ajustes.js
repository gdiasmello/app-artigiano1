// modulos/ajustes.js - Menu de ERP v0.0.47

Vue.component('tela-ajustes', {
    template: `
    <div class="container animate__animated animate__fadeInRight" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #AAAAAA;">⚙️ Ajustes & ERP</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-times-circle"></i>
            </button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
            
            <div class="card" @click="$root.mudarTela('tela-ajustes-perfil')" style="padding: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; border-left: 4px solid #00B0FF; margin-bottom: 0;">
                <i class="fas fa-user-circle" style="font-size: 2rem; color: #00B0FF; width: 40px; text-align: center;"></i>
                <div>
                    <h4 style="margin: 0; color: white;">Meu Perfil</h4>
                    <p style="margin: 5px 0 0 0; color: #888; font-size: 0.85rem;">Mudar PIN, preferências e vibração.</p>
                </div>
            </div>

            <template v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar">
                
                <div class="card" @click="$root.mudarTela('tela-ajustes-loja')" style="padding: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; border-left: 4px solid #FFAB00; margin-bottom: 0;">
                    <i class="fas fa-store" style="font-size: 2rem; color: #FFAB00; width: 40px; text-align: center;"></i>
                    <div>
                        <h4 style="margin: 0; color: white;">Dados da Loja</h4>
                        <p style="margin: 5px 0 0 0; color: #888; font-size: 0.85rem;">Metas de produção, feriados locais.</p>
                    </div>
                </div>

                <div class="card" @click="$root.mudarTela('tela-ajustes-equipe')" style="padding: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; border-left: 4px solid #9C27B0; margin-bottom: 0;">
                    <i class="fas fa-users" style="font-size: 2rem; color: #9C27B0; width: 40px; text-align: center;"></i>
                    <div>
                        <h4 style="margin: 0; color: white;">Gestão de Equipe</h4>
                        <p style="margin: 5px 0 0 0; color: #888; font-size: 0.85rem;">Adicionar funcionários, permissões, cargos.</p>
                    </div>
                </div>

                <div class="card" @click="$root.mudarTela('tela-ajustes-produtos')" style="padding: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; border-left: 4px solid #00C853; margin-bottom: 0;">
                    <i class="fas fa-box" style="font-size: 2rem; color: #00C853; width: 40px; text-align: center;"></i>
                    <div>
                        <h4 style="margin: 0; color: white;">Produtos (Cardápio)</h4>
                        <p style="margin: 5px 0 0 0; color: #888; font-size: 0.85rem;">Editar ingredientes, fatores de conversão.</p>
                    </div>
                </div>

                <div class="card" @click="$root.mudarTela('tela-ajustes-rotas')" style="padding: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; border-left: 4px solid #D50000; margin-bottom: 0;">
                    <i class="fas fa-map-marked-alt" style="font-size: 2rem; color: #D50000; width: 40px; text-align: center;"></i>
                    <div>
                        <h4 style="margin: 0; color: white;">Rotas Físicas</h4>
                        <p style="margin: 5px 0 0 0; color: #888; font-size: 0.85rem;">Locais de armazenamento (ex: Geladeira 1).</p>
                    </div>
                </div>
                
                <div class="card" @click="$root.mudarTela('tela-ajustes-checklists')" style="padding: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; border-left: 4px solid #2962FF; margin-bottom: 0;">
                    <i class="fas fa-tasks" style="font-size: 2rem; color: #2962FF; width: 40px; text-align: center;"></i>
                    <div>
                        <h4 style="margin: 0; color: white;">Checklists & Rotinas</h4>
                        <p style="margin: 5px 0 0 0; color: #888; font-size: 0.85rem;">Processos diários (ex: Fechamento, Bater Massa).</p>
                    </div>
                </div>

            </template>

            <div class="card" @click="$root.mudarTela('tela-ajustes-ajuda')" style="padding: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; border-left: 4px solid #E0E0E0; margin-bottom: 0;">
                <i class="fas fa-question-circle" style="font-size: 2rem; color: #E0E0E0; width: 40px; text-align: center;"></i>
                <div>
                    <h4 style="margin: 0; color: white;">Ajuda & Manual</h4>
                    <p style="margin: 5px 0 0 0; color: #888; font-size: 0.85rem;">Como a IA calcula e organiza a pizzaria.</p>
                </div>
            </div>

        </div>

    </div>
    `,
    methods: {
        voltar() {
            this.$root.vibrar(30);
            this.$root.mudarTela('tela-dashboard');
        }
    }
});
