// INÍCIO DO ARQUIVO modulos/ajustes_equipe.js - v2.1.2
Vue.component('tela-ajustes-equipe', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #FF5252;"><i class="fas fa-users-cog"></i> Gestão de Equipe</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div v-if="$root.pedidosResetSenha && $root.pedidosResetSenha.length > 0" class="card animate__animated animate__pulse" style="padding: 20px; border-left: 4px solid #FFAB00; margin-bottom: 20px; background: rgba(255, 171, 0, 0.1);">
            <h4 style="margin-top: 0; color: #FFAB00;"><i class="fas fa-key"></i> Pedidos de Reset de Senha</h4>
            <div v-for="(pedido, idx) in $root.pedidosResetSenha" :key="pedido.id" style="display: flex; justify-content: space-between; align-items: center; background: #222; padding: 10px; border-radius: 8px; margin-bottom: 8px;">
                <div>
                    <strong style="color: white; text-transform: capitalize;">{{ pedido.nome }}</strong>
                    <span style="color: #888; font-size: 0.8rem; display: block;">Solicitado em: {{ pedido.dataStr }}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button @click="aprovarReset(pedido, idx)" style="background: #00E676; color: #121212; border: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">Aprovar</button>
                    <button @click="negarReset(idx)" style="background: #FF5252; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">Negar</button>
                </div>
            </div>
        </div>

        <div class="card" style="padding: 20px; border-top: 4px solid #FF5252; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white; margin-bottom: 20px;"><i class="fas fa-user-plus"></i> Novo Funcionário</h4>
            
            <label class="label-form">NOME CURTO (Para Login)</label>
            <input type="text" v-model="novoNome" placeholder="Ex: vitor" class="input-form">
            
            <label class="label-form">CARGO / FUNÇÃO (Preenche permissões automaticamente)</label>
            <select v-model="novoCargo" class="input-form">
                <option value="Atendente">Atendente</option>
                <option value="Pizzaiolo">Pizzaiolo</option>
                <option value="Auxiliar">Auxiliar</option>
                <option value="Gerente">Gerente / Admin</option>
            </select>

            <div style="background: #1A1A1A; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <label class="label-form" style="margin-bottom: 10px; color: #00E676;"><i class="fas fa-lock-open"></i> PERMISSÕES DE ACESSO</label>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label class="checkbox-label"><input type="checkbox" v-model="novasPermissoes.producao"> Produção (Massa)</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="novasPermissoes.pedidos"> Fazer Pedidos</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="novasPermissoes.limpeza"> Limpeza</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="novasPermissoes.historico"> Ver Auditoria</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="novasPermissoes.avisos"> Criar Avisos</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="novasPermissoes.gerenciar"> Editar Produtos</label>
                    <label class="checkbox-label" style="grid-column: span 2; color: #FF5252; font-weight: bold;">
                        <input type="checkbox" v-model="novasPermissoes.admin"> Administrador Total
                    </label>
                </div>
            </div>

            <button @click="adicionarMembro" class="btn" style="background: #FF5252; color: white; font-weight: bold; height: 55px;">
                CADASTRAR E SINCRONIZAR
            </button>
        </div>

        <h4 style="color: #AAA; margin-bottom: 10px; font-size: 0.9rem;">EQUIPE ATUAL ({{ $root.equipe.length }})</h4>
        
        <div v-for="(membro, idx) in $root.equipe" :key="membro.id" class="card" style="padding: 15px; margin-bottom: 10px; border-left: 4px solid #444;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <strong style="color: white; font-size: 1.1rem; display: block; text-transform: capitalize;">{{ membro.nome }}</strong>
                    <span style="color: #888; font-size: 0.85rem; display: block; margin-top: 3px;">Cargo: {{ membro.cargo }}</span>
                    <span style="color: #888; font-size: 0.85rem; display: block; margin-top: 3px;">PIN: <b style="color: #FFAB00; letter-spacing: 2px;">{{ membro.pin }}</b></span>
                    
                    <span v-if="membro.termoAceito" style="color: #00E676; font-size: 0.75rem; display: block; margin-top: 5px;">
                        <i class="fas fa-check-circle"></i> Termo assinado
                    </span>
                    <span v-else style="color: #FF5252; font-size: 0.75rem; display: block; margin-top: 5px;">
                        <i class="fas fa-clock"></i> Pendente assinatura
                    </span>
                </div>
                
                <div style="display: flex; gap: 10px;" v-if="membro.id !== $root.usuario.id && membro.id !== 'master_key'">
                    <button @click="toggleEditarPermissoes(membro.id)" style="background: #2962FF; border: none; color: white; width: 40px; height: 40px; border-radius: 8px; cursor: pointer;" title="Editar Permissões">
                        <i class="fas fa-user-shield"></i>
                    </button>
                    <button @click="resetarPin(membro)" style="background: #333; border: 1px solid #555; color: white; width: 40px; height: 40px; border-radius: 8px; cursor: pointer;" title="Resetar PIN para 1234">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button @click="removerMembro(idx)" style="background: rgba(255,82,82,0.1); border: 1px solid #FF5252; color: #FF5252; width: 40px; height: 40px; border-radius: 8px; cursor: pointer;" title="Excluir">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>

            <div v-if="editandoId === membro.id" class="animate__animated animate__fadeIn" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #444;">
                <label style="color: #00B0FF; font-size: 0.8rem; font-weight: bold; display: block; margin-bottom: 10px;">EDITAR ACESSOS DE {{ membro.nome.toUpperCase() }}</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                    <label class="checkbox-label"><input type="checkbox" v-model="membro.permissoes.producao"> Produção</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="membro.permissoes.pedidos"> Pedidos</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="membro.permissoes.limpeza"> Limpeza</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="membro.permissoes.historico"> Auditoria</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="membro.permissoes.avisos"> Avisos</label>
                    <label class="checkbox-label"><input type="checkbox" v-model="membro.permissoes.gerenciar"> Edição ERP</label>
                    <label class="checkbox-label" style="grid-column: span 2; color: #FF5252;"><input type="checkbox" v-model="membro.permissoes.admin"> Admin Total</label>
                </div>
                <button @click="salvarEdicao(membro)" class="btn" style="background: #00B0FF; color: white; font-weight: bold;">
                    SALVAR ALTERAÇÕES
                </button>
            </div>

        </div>
    </div>
    `,
    data() {
        return {
            novoNome: '',
            novoCargo: 'Atendente',
            novasPermissoes: {
                producao: false, pedidos: true, limpeza: true, historico: false, avisos: false, gerenciar: false, admin: false
            },
            editandoId: null
        };
    },
    watch: {
        // Preenche automaticamente as permissões quando o Gerente troca o cargo no select
        novoCargo(cargo) {
            if (cargo === 'Gerente') {
                this.novasPermissoes = { producao: true, pedidos: true, limpeza: true, historico: true, avisos: true, gerenciar: true, admin: true };
            } else if (cargo === 'Pizzaiolo') {
                this.novasPermissoes = { producao: true, pedidos: true, limpeza: true, historico: false, avisos: false, gerenciar: false, admin: false };
            } else if (cargo === 'Atendente') {
                this.novasPermissoes = { producao: false, pedidos: true, limpeza: true, historico: false, avisos: false, gerenciar: false, admin: false };
            } else { // Auxiliar
                this.novasPermissoes = { producao: false, pedidos: false, limpeza: true, historico: false, avisos: false, gerenciar: false, admin: false };
            }
        }
    },
    methods: {
        adicionarMembro() {
            if (!this.novoNome.trim()) {
                Swal.fire({ icon: 'warning', text: 'Preencha o nome do funcionário.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            const nomeLimpo = this.novoNome.trim().toLowerCase();
            
            if (this.$root.equipe.find(u => u.nome === nomeLimpo)) {
                Swal.fire({ icon: 'error', title: 'Atenção', text: 'Já existe um funcionário com esse nome!', background: '#1E1E1E', color: '#FFF' });
                return;
            }
            
            const novo = {
                id: Date.now().toString(),
                nome: nomeLimpo,
                cargo: this.novoCargo,
                pin: '1234',
                termoAceito: false,
                // Clona as permissões exatamente como o gerente deixou nos checkboxes
                permissoes: JSON.parse(JSON.stringify(this.novasPermissoes)) 
            };

            this.$root.equipe.push(novo);
            this.novoNome = '';
            
            // Sincroniza imediatamente na nuvem com aviso de sucesso
            this.salvarNuvem(true, 'Funcionário cadastrado e enviado para a nuvem automaticamente!');
        },

        removerMembro(idx) {
            Swal.fire({
                title: 'Remover funcionário?', 
                text: 'Ele perderá acesso ao sistema na mesma hora.', 
                icon: 'warning', 
                showCancelButton: true, 
                confirmButtonColor: '#FF5252', 
                cancelButtonColor: '#444',
                confirmButtonText: 'Sim, Remover',
                background: '#1E1E1E', 
                color: '#FFF'
            }).then((r) => {
                if (r.isConfirmed) {
                    this.$root.equipe.splice(idx, 1);
                    // Salva na nuvem silenciosamente
                    this.salvarNuvem(false); 
                }
            });
        },
        
        resetarPin(membro) {
            Swal.fire({
                title: 'Resetar PIN?', 
                text: 'A senha voltará a ser 1234 e ele terá de assinar o termo novamente.', 
                icon: 'question', 
                showCancelButton: true, 
                confirmButtonColor: '#00E676', 
                cancelButtonColor: '#444',
                confirmButtonText: 'Sim, Resetar',
                background: '#1E1E1E', 
                color: '#FFF'
            }).then((r) => {
                if (r.isConfirmed) {
                    membro.pin = '1234';
                    membro.termoAceito = false;
                    this.salvarNuvem(true, 'PIN resetado e sincronizado com a nuvem.');
                }
            });
        },

        toggleEditarPermissoes(id) {
            this.editandoId = this.editandoId === id ? null : id;
        },

        salvarEdicao(membro) {
            this.editandoId = null;
            this.salvarNuvem(true, `Permissões de ${membro.nome} atualizadas.`);
        },

        aprovarReset(pedido, idx) {
            const usuario = this.$root.equipe.find(u => u.id === pedido.idUsuario);
            if (usuario) {
                usuario.pin = '1234';
                usuario.termoAceito = false;
            }
            this.$root.pedidosResetSenha.splice(idx, 1);
            db.collection("configuracoes").doc("loja").set({ pedidosResetSenha: this.$root.pedidosResetSenha }, { merge: true });
            this.salvarNuvem(true, 'Senha resetada para 1234.');
        },

        negarReset(idx) {
            this.$root.pedidosResetSenha.splice(idx, 1);
            db.collection("configuracoes").doc("loja").set({ pedidosResetSenha: this.$root.pedidosResetSenha }, { merge: true });
            this.$root.salvarMemoriaLocal();
        },

        // 🟢 A MÁGICA DA SINCRONIZAÇÃO INVISÍVEL
        salvarNuvem(exibirAviso = false, mensagem = '') {
            db.collection("configuracoes").doc("equipe").set({ lista: this.$root.equipe }, { merge: true })
            .then(() => {
                this.$root.salvarMemoriaLocal();
                if (exibirAviso) {
                    this.$root.vibrar(30);
                    Swal.fire({
                        icon: 'success', 
                        title: 'Tudo Certo!', 
                        text: mensagem,
                        timer: 2000, 
                        showConfirmButton: false, 
                        background: '#1E1E1E', 
                        color: '#FFF'
                    });
                }
            })
            .catch(err => {
                Swal.fire('Erro de Conexão', 'Problema na internet: ' + err.message, 'error');
            });
        }
    },
    mounted() {
        // Estilos para o formulário e checkboxes
        if (!document.getElementById('css-equipe-v2')) {
            const style = document.createElement('style'); 
            style.id = 'css-equipe-v2';
            style.innerHTML = `
                .label-form { color: #888; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; display: block; letter-spacing: 0.5px; }
                .input-form { width: 100%; margin-bottom: 20px; padding: 15px; border-radius: 8px; border: 1px solid #444; background: #222; color: white; box-sizing: border-box; font-size: 1rem; outline: none; }
                .input-form:focus { border-color: #FF5252; }
                .checkbox-label { color: white; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; cursor: pointer; }
                .checkbox-label input[type="checkbox"] { transform: scale(1.3); cursor: pointer; accent-color: #00E676; }
            `;
            document.head.appendChild(style);
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_equipe.js
