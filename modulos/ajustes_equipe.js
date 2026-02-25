/**
 * Gestão de Equipe v2.14.0
 */
Vue.component('tela-ajustes-equipe', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #FF5252;"><i class="fas fa-users-cog"></i> Painel de Controle</h2>
            <div style="display: flex; gap: 15px;">
                <button v-if="$root.usuario.permissoes.admin" @click="togglePins" style="background: none; border: none; color: #AAA; font-size: 1.2rem; cursor: pointer;">
                    <i :class="showPins ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
                <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
            </div>
        </div>

        <!-- Pedidos de Reset -->
        <div v-if="$root.pedidosResetSenha.length > 0" class="card" style="padding: 20px; border-left: 5px solid #FFAB00; background: rgba(255,171,0,0.05); margin-bottom: 25px;">
            <h4 style="margin-top: 0; color: #FFAB00;"><i class="fas fa-key"></i> Pedidos de Reset Pendentes</h4>
            <div v-for="(p, i) in $root.pedidosResetSenha" :key="p.id" style="display: flex; justify-content: space-between; align-items: center; background: #222; padding: 12px; border-radius: 10px; margin-bottom: 10px;">
                <div style="flex: 1;">
                    <strong style="color: white; display: block;">{{ p.nome }}</strong>
                    <span style="color: #666; font-size: 0.7rem;">Solicitado em: {{ p.dataStr }}</span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button @click="aprovarReset(p, i)" class="btn-small" style="background: #00E676; color: #121212;">REDEFINIR</button>
                    <button @click="negarReset(i)" class="btn-small" style="background: #FF5252; color: white;">X</button>
                </div>
            </div>
        </div>

        <!-- Cadastro Simplificado -->
        <div class="card" style="padding: 20px; border-top: 5px solid #FF5252; margin-bottom: 30px;">
            <h4 style="margin-top: 0; color: white;">Adicionar Funcionário</h4>
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <input type="text" v-model="novo.nome" placeholder="Nome de Login" class="input-dark" style="flex: 2;">
                <select v-model="novo.cargo" class="input-dark" style="flex: 1;">
                    <option value="Atendente">Atendente</option>
                    <option value="Pizzaiolo">Pizzaiolo</option>
                    <option value="Gerente">Gerente</option>
                </select>
            </div>
            <p style="color: #666; font-size: 0.75rem; margin-bottom: 15px;">* A senha padrão inicial será <b>1234</b>.</p>
            <button @click="addMembro" class="btn" style="background: #FF5252; color: white;">CADASTRAR FUNCIONÁRIO</button>
        </div>

        <!-- Lista de Funcionários com Gestão de Permissões -->
        <h3 style="color: white; font-size: 1rem; margin-bottom: 15px;">Gestão de Acessos</h3>
        <div v-for="(m, i) in $root.equipe" :key="m.id" class="card" style="padding: 15px; margin-bottom: 15px; background: #1A1A1A;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <div>
                    <strong style="color: white; font-size: 1.1rem;">{{ m.nome }}</strong>
                    <div style="font-size: 0.75rem; color: #AAA; margin-top: 4px;">
                        {{ m.cargo }} | 
                        <span :style="{ color: showPins ? '#FFAB00' : '#444' }">PIN: {{ showPins ? m.pin : '****' }}</span>
                    </div>
                </div>
                <button v-if="m.id !== $root.usuario.id" @click="removerMembro(i)" style="background: none; border: none; color: #FF5252; cursor: pointer; padding: 5px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>

            <!-- Toggles de Permissão -->
            <div class="grid-permissoes">
                <div class="perm-item" @click="togglePerm(m, 'verMassa')">
                    <i class="fas fa-pizza-slice" :class="{ 'active': m.permissoes.verMassa }"></i>
                    <span>Massa</span>
                </div>
                <div class="perm-item" @click="togglePerm(m, 'verSacolao')">
                    <i class="fas fa-carrot" :class="{ 'active': m.permissoes.verSacolao }"></i>
                    <span>Sacolão</span>
                </div>
                <div class="perm-item" @click="togglePerm(m, 'verInsumos')">
                    <i class="fas fa-box-open" :class="{ 'active': m.permissoes.verInsumos }"></i>
                    <span>Insumos</span>
                </div>
                <div class="perm-item" @click="togglePerm(m, 'verGelo')">
                    <i class="fas fa-snowflake" :class="{ 'active': m.permissoes.verGelo }"></i>
                    <span>Gelo</span>
                </div>
                <div class="perm-item" @click="togglePerm(m, 'verLimpeza')">
                    <i class="fas fa-broom" :class="{ 'active': m.permissoes.verLimpeza }"></i>
                    <span>Limpeza</span>
                </div>
                <div class="perm-item" @click="togglePerm(m, 'verHistorico')">
                    <i class="fas fa-history" :class="{ 'active': m.permissoes.verHistorico }"></i>
                    <span>Histórico</span>
                </div>
                <div class="perm-item" @click="togglePerm(m, 'apagarHistorico')">
                    <i class="fas fa-eraser" :class="{ 'active': m.permissoes.apagarHistorico }"></i>
                    <span>Apagar</span>
                </div>
                <div class="perm-item" @click="togglePerm(m, 'admin')">
                    <i class="fas fa-user-shield" :class="{ 'active': m.permissoes.admin }"></i>
                    <span>Admin</span>
                </div>
            </div>
        </div>
    </div>
    `,
    data() { 
        return { 
            novo: { nome: '', cargo: 'Atendente' }, 
            showPins: false 
        }; 
    },
    methods: {
        togglePins() {
            this.showPins = !this.showPins;
        },
        togglePerm(membro, perm) {
            if (!membro.permissoes) membro.permissoes = {};
            membro.permissoes[perm] = !membro.permissoes[perm];
            this.sinc();
        },
        addMembro() {
            if (!this.novo.nome) return;
            const m = { 
                id: Date.now().toString(), 
                nome: this.novo.nome, 
                cargo: this.novo.cargo, 
                pin: '1234', 
                precisaTrocarSenha: true,
                permissoes: { 
                    verMassa: true,
                    verSacolao: true,
                    verInsumos: true,
                    verGelo: true,
                    verLimpeza: true,
                    verHistorico: true,
                    apagarHistorico: false,
                    admin: this.novo.cargo === 'Gerente' 
                } 
            };
            this.$root.equipe.push(m);
            this.sinc();
            this.novo.nome = '';
            Swal.fire('Cadastrado!', 'Funcionário adicionado com PIN 1234.', 'success');
        },
        aprovarReset(p, i) {
            const uIdx = this.$root.equipe.findIndex(u => u.id === p.idUsuario);
            if (uIdx !== -1) {
                this.$root.equipe[uIdx].pin = '1234';
                this.$root.equipe[uIdx].precisaTrocarSenha = true;
            }
            
            // Remove do Mural de Avisos
            this.$root.avisos = this.$root.avisos.filter(a => !(a.isResetRequest && a.idUsuario === p.idUsuario));
            db.collection("configuracoes").doc("avisos").set({ lista: this.$root.avisos });

            this.$root.pedidosResetSenha.splice(i, 1);
            this.sinc();
            Swal.fire('Resetado!', 'O PIN voltou para 1234.', 'success');
        },
        negarReset(i) {
            this.$root.pedidosResetSenha.splice(i, 1);
            this.sinc();
        },
        removerMembro(i) {
            Swal.fire({
                title: 'Remover Funcionário?',
                text: "Ele perderá acesso imediato ao sistema.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF5252',
                background: '#1E1E1E', color: '#FFF'
            }).then(res => {
                if (res.isConfirmed) {
                    this.$root.equipe.splice(i, 1);
                    this.sinc();
                }
            });
        },
        sinc() {
            db.collection("configuracoes").doc("equipe").set({ lista: this.$root.equipe });
            db.collection("configuracoes").doc("loja").set({ pedidosResetSenha: this.$root.pedidosResetSenha }, { merge: true });
        }
    },
    mounted() {
        if (!document.getElementById('css-equipe-gestao')) {
            const style = document.createElement('style');
            style.id = 'css-equipe-gestao';
            style.innerHTML = `
                .grid-permissoes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px; }
                .perm-item { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    gap: 5px; 
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    background: #222;
                    transition: all 0.2s;
                }
                .perm-item i { font-size: 1.1rem; color: #444; }
                .perm-item i.active { color: #00E676; }
                .perm-item span { font-size: 0.6rem; color: #888; text-transform: uppercase; font-weight: bold; }
                .btn-small { border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; cursor: pointer; }
            `;
            document.head.appendChild(style);
        }
    }
});

