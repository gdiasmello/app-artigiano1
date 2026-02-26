Vue.component('tela-login', {
    template: `
    <div class="container" style="display: flex; flex-direction: column; justify-content: center; min-height: 90vh;">
        <div style="text-align: center; margin-bottom: 50px;">
            <i class="fas fa-pizza-slice" style="font-size: 5rem; color: var(--cor-primaria); margin-bottom: 20px;"></i>
            <h1 style="margin: 0; color: white; font-size: 2.5rem; font-weight: 900;">PiZZA <span style="color: var(--cor-primaria);">Master</span></h1>
            <p style="color: #666; margin-top: 8px; font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Intelligence ERP</p>
        </div>

        <div v-if="$root.carregandoDados" style="text-align: center; padding: 40px;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 3rem; color: var(--cor-primaria); margin-bottom: 20px;"></i>
            <h3 style="color: white; margin: 0;">Sincronizando...</h3>
        </div>

        <div v-else class="card" style="padding: 30px; border-top: 5px solid var(--cor-primaria);">
            <div style="margin-bottom: 25px;">
                <label style="color: #888; font-size: 0.75rem; font-weight: 800; margin-bottom: 10px; display: block;">USUÁRIO</label>
                <input type="text" v-model="usuarioDigitado" placeholder="Seu nome" class="input-dark" @keyup.enter="focarPin">
            </div>

            <div style="margin-bottom: 30px;">
                <label style="color: #888; font-size: 0.75rem; font-weight: 800; margin-bottom: 10px; display: block;">PIN (4 DÍGITOS)</label>
                <input type="password" ref="pinInput" inputmode="numeric" maxlength="4" v-model="pin" placeholder="****" class="input-dark" style="letter-spacing: 20px; text-align: center; font-size: 2rem; font-weight: 900; color: var(--cor-primaria);" @keyup.enter="fazerLogin">
            </div>

            <button @click="fazerLogin" class="btn" style="background: var(--cor-primaria); color: #121212; height: 65px; font-size: 1.2rem;">
                ACESSAR SISTEMA <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button @click="loginEmergencia" style="background: none; border: none; color: #555; text-decoration: underline; cursor: pointer;">Login de Emergência (Admin)</button>
        </div>
    </div>
    `,
    data() {
        return { usuarioDigitado: '', pin: '' };
    },
    methods: {
        focarPin() { if (this.$refs.pinInput) this.$refs.pinInput.focus(); },
        fazerLogin() {
            const nome = this.usuarioDigitado.trim().toLowerCase();
            if ((nome === 'gabriel' && this.pin === '0000') || (nome === 'admin' && this.pin === '9999')) {
                this.$root.usuario = { id: 'master', nome: 'Administrador', cargo: 'Gerente', permissoes: { admin: true } };
                this.$root.mudarTela('tela-dashboard');
                return;
            }
            const user = this.$root.equipe.find(u => u.nome.toLowerCase() === nome);
            if (user && user.pin === this.pin) {
                this.$root.usuario = user;
                this.$root.mudarTela('tela-dashboard');
            } else {
                Swal.fire({ icon: 'error', title: 'Acesso Negado', background: '#1E1E1E', color: '#FFF' });
                this.pin = '';
            }
        },
        loginEmergencia() {
            this.usuarioDigitado = 'admin';
            this.pin = '9999';
            this.fazerLogin();
        }
    }
});
