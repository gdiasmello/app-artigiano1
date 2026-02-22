// INÍCIO DO ARQUIVO modulos/login.js - v0.0.70

Vue.component('tela-login', {
    template: `
    <div class="container animate__animated animate__fadeIn" style="display: flex; flex-direction: column; justify-content: center; min-height: 95vh;">
        
        <div v-if="!$root.estaInstalado" class="animate__animated animate__headShake animate__infinite animate__slower" style="background: #2962FF; color: white; padding: 18px; border-radius: 15px; margin-bottom: 30px; border-left: 6px solid #FFF; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-download" style="font-size: 1.8rem;"></i>
                <div style="flex: 1;">
                    <strong style="display: block; font-size: 1.1rem;">Instalar Aplicativo</strong>
                    <small v-if="isIOS" style="font-size: 0.85rem; line-height: 1.2; display: block; margin-top: 5px;">
                        Toque em <i class="fas fa-share-square"></i> e selecione <b>"Adicionar ao Ecrã Principal"</b>.
                    </small>
                    <small v-else style="font-size: 0.85rem;">Instale para rodar em tela cheia e ativar a digital.</small>
                </div>
                <button v-if="!isIOS" @click="$root.dispararInstalacao" style="background: white; color: #2962FF; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 900; cursor: pointer;">INSTALAR</button>
            </div>
        </div>

        <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-size: 4rem; margin-bottom: 5px;">🍕</div>
            <h1 style="margin: 0; letter-spacing: 3px; font-weight: 900; color: white;">PIZZA MASTER</h1>
            <p style="color: var(--text-sec); margin: 5px 0; font-size: 0.9rem;">ARTIGIANO LONDRINA</p>
        </div>

        <div class="card" style="padding: 25px; background: #1A1A1A; border: 1px solid #333;">
            
            <label style="display: block; margin-bottom: 8px; color: #888; font-weight: bold; font-size: 0.8rem; letter-spacing: 1px; text-align: center;">USUÁRIO</label>
            <input type="text" v-model="nomeUsuario" placeholder="Digite o seu nome" class="input-nativo" />

            <label style="display: block; margin-bottom: 8px; color: #888; font-weight: bold; font-size: 0.8rem; letter-spacing: 1px; text-align: center;">PIN DE ACESSO</label>
            <input type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" v-model="pin" placeholder="****" class="input-nativo" style="letter-spacing: 10px; font-size: 1.8rem; text-align: center;" @keyup.enter="verificarLogin" />

            <button @click="verificarLogin" class="btn" style="background: var(--cor-primaria); color: #121212; margin-top: 10px; height: 55px; font-size: 1.2rem;">
                ENTRAR
            </button>

            <button v-if="$root.biometriaDisponivel" @click="loginBiometrico" class="btn" style="background: rgba(0, 176, 255, 0.1); color: #00B0FF; margin-top: 15px; border: 1px solid #00B0FF; height: 55px;">
                <i class="fas fa-fingerprint" style="font-size: 1.2rem; margin-right: 8px;"></i> ACESSO BIOMÉTRICO
            </button>
        </div>

        <p class="versao-app">
            v0.0.70 | Status: {{ $root.estaInstalado ? 'APP' : 'BROWSER' }} | Bio: {{ $root.biometriaDisponivel ? 'ON' : 'OFF' }}
        </p>
    </div>
    `,
    data() {
        return {
            nomeUsuario: '',
            pin: '',
            isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
        };
    },
    methods: {
        async loginBiometrico() {
            this.$root.vibrar(30);
            
            const nomeDigitado = this.nomeUsuario.trim().toLowerCase();
            if (!nomeDigitado) {
                Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Digite o seu nome de usuário primeiro.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            const user = this.$root.equipe.find(u => u.nome.toLowerCase() === nomeDigitado);
            if (!user) {
                Swal.fire({ icon: 'error', title: 'Usuário não encontrado', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            const sucesso = await this.$root.verificarBiometriaLocal();
            if (sucesso) {
                this.logarUsuario(user);
            } else {
                Swal.fire({ icon: 'error', title: 'Falha na Biometria', text: 'Use o seu PIN numérico.', background: '#1E1E1E', color: '#FFF' });
            }
        },

        verificarLogin() {
            this.$root.vibrar(30);
            const nomeDigitado = this.nomeUsuario.trim().toLowerCase();
            const user = this.$root.equipe.find(u => u.nome.toLowerCase() === nomeDigitado && u.pin === this.pin);
            
            if (user) {
                this.logarUsuario(user);
            } else {
                this.$root.vibrar([100, 50, 100]);
                this.pin = '';
                Swal.fire({ icon: 'error', title: 'Usuário ou PIN Inválido', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
            }
        },

        logarUsuario(user) {
            this.$root.usuario = user;
            this.$root.vibrar([50, 50]);
            this.$root.registrarHistorico('Acesso', 'Login');
            this.$root.mudarTela('tela-dashboard');
            
            setTimeout(() => { 
                this.pin = ''; 
                this.nomeUsuario = ''; 
            }, 500);
        }
    },
    mounted() {
        if (!document.getElementById('css-login-nativo')) {
            const style = document.createElement('style'); style.id = 'css-login-nativo';
            style.innerHTML = `
                .input-nativo {
                    width: 100%;
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid #444;
                    background: #2C2C2C;
                    color: white;
                    font-size: 1.1rem;
                    box-sizing: border-box;
                    margin-bottom: 15px;
                    outline: none;
                    text-align: center;
                    transition: 0.2s;
                }
                .input-nativo:focus {
                    border-color: var(--cor-primaria);
                    background: #333;
                }
                @keyframes piscarSuave { 0% { opacity: 0.15; } 100% { opacity: 0.5; } }
                .versao-app { text-align: center; color: #FFF; font-size: 0.7rem; margin-top: 25px; animation: piscarSuave 2.5s infinite alternate ease-in-out; }
            `;
            document.head.appendChild(style);
        }
    }
});
// FIM DO ARQUIVO modulos/login.js
