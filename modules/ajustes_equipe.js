// modulos/ajustes_equipe.js - v0.0.33

Vue.component('tela-ajustes-equipe', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #FFAB00;">👥 Equipe & Acessos</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="border-left: 3px solid #FFAB00;">
            <h4 style="margin: 0 0 10px 0; color: white;">Adicionar Funcionário</h4>
            <input type="text" v-model="formFunc.nome" placeholder="Nome do Funcionário" class="input-dark" style="margin-bottom:10px;" />
            <input type="number" v-model="formFunc.pin" placeholder="PIN de Acesso (Ex: 1234)" class="input-dark" style="margin-bottom:10px;" />
            
            <label style="color:#CCC; font-size:0.8rem;">Data de Nascimento</label>
            <input type="date" v-model="formFunc.nascimento" class="input-dark" style="margin-bottom:15px;" />
            
            <label style="color:var(--cor-primaria); font-size:0.9rem; font-weight: bold; margin-bottom: 5px; display: block;">Cargo / Função</label>
            <select v-model="formFunc.cargo" @change="aplicarCargo" class="input-dark" style="margin-bottom: 15px; border: 1px solid var(--cor-primaria);">
                <option value="Personalizado">Personalizado (Escolher Manualmente)</option>
                <option value="Pizzaiolo">🍕 Pizzaiolo</option>
                <option value="Atendente">🛎️ Atendente / Salão</option>
                <option value="Gerente">👔 Gerente</option>
            </select>

            <h5 style="color: white; margin: 15px 0 10px 0; border-bottom: 1px solid #333; padding-bottom: 5px;">Permissões de Visualização</h5>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <label style="color: #CCC; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;"><input type="checkbox" v-model="formFunc.permissoes.producao" @change="formFunc.cargo = 'Personalizado'" style="transform: scale(1.2);" /> 🍕 Produção</label>
                <label style="color: #CCC; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;"><input type="checkbox" v-model="formFunc.permissoes.pedidos" @change="formFunc.cargo = 'Personalizado'" style="transform: scale(1.2);" /> 📦 Pedidos/Gelo</label>
                <label style="color: #CCC; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;"><input type="checkbox" v-model="formFunc.permissoes.limpeza" @change="formFunc.cargo = 'Personalizado'" style="transform: scale(1.2);" /> 🧹 Limpeza</label>
                <label style="color: #CCC; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;"><input type="checkbox" v-model="formFunc.permissoes.historico" @change="formFunc.cargo = 'Personalizado'" style="transform: scale(1.2);" /> 🕒 Auditoria</label>
                <label style="color: #CCC; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;"><input type="checkbox" v-model="formFunc.permissoes.gerenciar" @change="formFunc.cargo = 'Personalizado'" style="transform: scale(1.2);" /> ⚙️ Ver Ajustes</label>
            </div>

            <h5 style="color: white; margin: 15px 0 10px 0; border-bottom: 1px solid #333; padding-bottom: 5px;">Ações Restritas</h5>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                <label style="color: #00C853; display: flex; align-items: center; gap: 8px;"><input type="checkbox" v-model="formFunc.permissoes.adicionar" @change="formFunc.cargo = 'Personalizado'" style="transform: scale(1.3);" /> <b>(+) Adicionar Itens/Dados</b></label>
                <label style="color: #FF5252; display: flex; align-items: center; gap: 8px;"><input type="checkbox" v-model="formFunc.permissoes.remover" @change="formFunc.cargo = 'Personalizado'" style="transform: scale(1.3);" /> <b>(-) Remover Itens/Dados</b></label>
                <label style="color: #FFAB00; display: flex; align-items: center; gap: 8px;"><input type="checkbox" v-model="formFunc.permissoes.avisos" @change="formFunc.cargo = 'Personalizado'" style="transform: scale(1.3);" /> Publicar no Mural</label>
                <label style="color: #2962FF; display: flex; align-items: center; gap: 8px;"><input type="checkbox" v-model="formFunc.permissoes.admin" @change="formFunc.cargo = 'Personalizado'" style="transform: scale(1.3);" /> 👑 <b>Administrador Geral</b></label>
            </div>
            
            <button class="btn" style="background: #FFAB00; color: #121212;" @click="salvarNovoFuncionario">
                <i class="fas fa-user-plus"></i> CADASTRAR FUNCIONÁRIO
            </button>
        </div>

        <h3 style="color: white; border-bottom: 1px solid #333; padding-bottom: 10px; margin-top: 20px;">Equipe Cadastrada</h3>
        
        <div class="card" v-for="membro in $root.equipe" :key="membro.id" style="margin-bottom: 10px; padding: 15px; background: #1A1A1A;">
             <div style="display: flex; justify-content: space-between; align-items: center;">
                 <div>
                     <strong style="color: white; font-size: 1.1rem; display: block;">{{ membro.nome }}</strong>
                     <small style="color: #888;">Cargo: <b style="color: #CCC;">{{ membro.cargo || 'Não Definido' }}</b></small>
                 </div>
                 
                 <div style="display: flex; gap: 10px; align-items: center;">
                     <div v-if="membro.permissoes.admin" style="background: #2962FF; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.7rem; font-weight: bold;">
                         ADMIN
                     </div>
                     <button @click="tentarRemoverFuncionario(membro.id, membro.nome)" style="background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer; padding: 5px;">
                         <i class="fas fa-trash"></i>
                     </button>
                 </div>
             </div>
        </div>

    </div>
    `,
    data() {
        return {
            formFunc: { 
                nome: '', pin: '', nascimento: '', cargo: 'Personalizado',
                permissoes: { producao: false, pedidos: false, limpeza: false, historico: false, gerenciar: false, adicionar: false, remover: false, avisos: false, admin: false } 
            }
        };
    },
    mounted() {
        if (!document.getElementById('css-equipe')) {
            const style = document.createElement('style'); style.id = 'css-equipe';
            style.innerHTML = `.input-dark { width: 100%; padding: 12px; background: #2C2C2C; border: none; border-radius: 5px; color: white; box-sizing: border-box; }`;
            document.head.appendChild(style);
        }
    },
    methods: {
        voltar() {
            this.$root.vibrar(30);
            this.$root.mudarTela('tela-ajustes');
        },
        // 🟢 NOVO: Aplica as permissões corretas quando seleciona um cargo
        aplicarCargo() {
            this.$root.vibrar(15);
            let p = this.formFunc.permissoes;
            
            // Reseta tudo primeiro
            Object.keys(p).forEach(key => p[key] = false);

            if (this.formFunc.cargo === 'Pizzaiolo') {
                p.producao = true;
                p.limpeza = true;
                p.pedidos = true; // Precisa fazer pedido de Insumos
            } 
            else if (this.formFunc.cargo === 'Atendente') {
                p.pedidos = true; // Para Gelo e Bebidas
                p.limpeza = true; // Para limpeza do salão
                p.avisos = true;
            } 
            else if (this.formFunc.cargo === 'Gerente') {
                // Gerente tem acesso a quase tudo, exceto remover ou gerenciar configurações finais de sistema (a não ser que você queira)
                p.producao = true; p.pedidos = true; p.limpeza = true; p.historico = true; p.gerenciar = true; p.adicionar = true; p.avisos = true;
                p.remover = true; // Gerente pode remover
            }
        },
        salvarNovoFuncionario() {
            this.$root.vibrar(30);
            if(!this.formFunc.nome || !this.formFunc.pin) {
                this.$root.vibrar([100, 50, 100]);
                Swal.fire('Erro', 'Preencha nome e PIN!', 'error');
                return;
            }

            this.$root.autorizarAcao('adicionar', () => {
                this.$root.equipe.push({
                    id: Date.now(),
                    nome: this.formFunc.nome,
                    pin: this.formFunc.pin,
                    nascimento: this.formFunc.nascimento,
                    cargo: this.formFunc.cargo,
                    permissoes: JSON.parse(JSON.stringify(this.formFunc.permissoes)),
                    preferencias: { vibracao: true }
                });
                
                this.$root.registrarHistorico('Cadastro de Equipe', 'Equipe', `Funcionário ${this.formFunc.nome} (${this.formFunc.cargo}) adicionado.`);
                this.$root.vibrar([50, 50, 50]);
                Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Funcionário cadastrado!', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
                
                this.formFunc = { nome: '', pin: '', nascimento: '', cargo: 'Personalizado', permissoes: { producao: false, pedidos: false, limpeza: false, historico: false, gerenciar: false, adicionar: false, remover: false, avisos: false, admin: false } };
            });
        },
        tentarRemoverFuncionario(idFuncionario, nome) {
            this.$root.vibrar(30);
            
            if (idFuncionario === this.$root.usuario.id) {
                Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Você não pode apagar o próprio usuário!', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            this.$root.autorizarAcao('remover', () => {
                Swal.fire({
                    title: 'Tem certeza?',
                    text: `Você vai remover o funcionário ${nome}.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#FF5252',
                    cancelButtonColor: '#444',
                    confirmButtonText: 'Sim, Apagar',
                    cancelButtonText: 'Cancelar',
                    background: '#1E1E1E', color: '#FFF'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.$root.equipe = this.$root.equipe.filter(m => m.id !== idFuncionario);
                        this.$root.registrarHistorico('Exclusão de Equipe', 'Equipe', `Funcionário ${nome} foi removido.`);
                        this.$root.vibrar([50, 50, 50]);
                        Swal.fire({ icon: 'success', title: 'Removido', timer: 1000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
                    }
                });
            });
        }
    }
});
