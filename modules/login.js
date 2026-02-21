// modulos/login.js - Tela de Acesso do PiZZA Master v0.0.24

Vue.component('tela-login', {
    template: `
    <div class="login-screen container animate__animated animate__fadeIn" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between;">
        
        <div style="text-align: center; margin-top: 5vh;">
            
            <div v-if="$root.eventoInstalacao" class="animate__animated animate__bounceInDown" style="background: rgba(255, 171, 0, 0.1); border: 1px solid var(--cor-primaria); padding: 15px; border-radius: 12px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; text-align: left;">
                <div>
                    <strong style="color: var(--cor-primaria); display: block; font-size: 1.1rem;"><i class="fas fa-mobile-alt"></i> Instalar App</strong>
                    <small style="color: #CCC;">Adicione à tela inicial para aceder offline.</small>
                </div>
                <button @click="instalarApp" style="background: var(--cor-primaria); color: #121212; border: none; padding: 10px 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    INSTALAR
                </button>
            </div>

            <i class="fas fa-pizza-slice animate__animated animate__pulse animate__infinite" 
               style="font-size: 4rem; color: var(--cor-primaria); margin-bottom: 20px;"></i>
            <h2 style="margin-bottom: 5px;">PiZZA Master</h2>
            <p style="color: #888; margin-bottom: 40px;">Sistema Inteligente de Gestão</p>
            
            <input type="text" 
                   v-model="form.nome" 
                   placeholder="Seu Nome (Ex: Gabriel)" 
                   style="width: 100%; padding: 15px; background: #2C2C2C; border: none; border-radius: 10px; color: white; font-size: 1rem; margin-bottom: 15px; box-sizing: border-box;">
            
            <input type="password" 
                   inputmode="numeric" 
                   pattern="[0-9]*"
                   v-model="form.pin" 
                   placeholder="PIN" 
                   maxlength="4" 
                   @keyup.enter="entrar"
                   style="width: 100%; padding: 15px; background: #2C2C2C; border: none; border-radius: 10px; color: white; font-size: 1.2rem; margin-bottom: 25px; box-sizing: border-box; text-align: center; letter-spacing: 5px;">
            
            <button class="btn" style="background-color: var(--cor-primaria); color: #121212; margin-top: 10px;" @click="entrar">
                ENTRAR NO SISTEMA
            </button>
        </div>

        <div style="text-align: center; padding-bottom: 20px;">
            <p style="font-size: 0.85rem; color: #555; margin: 0;">PizzaMaster Systems © 2026</p>
            <p style="font-size: 0.9rem; color: white; opacity: 0.7; margin-top: 5px; font-weight: bold; letter-spacing: 1px;">v0.0.24</p>
        </div>

    </div>
    `,
    data() {
        return {
            form: { nome: '', pin: '' }
        };
    },
    methods: {
        async instalarApp() {
            this.$root.vibrar(30);
            if (!this.$root.eventoInstalacao) return;
            
            // Dispara o pop-up nativo do telemóvel
            this.$root.eventoInstalacao.prompt();
            
            const { outcome } = await this.$root.eventoInstalacao.userChoice;
            if (outcome === 'accepted') {
                this.$root.vibrar([50, 50, 50]);
                this.$root.eventoInstalacao = null; // Esconde o nosso banner
            }
        },
        entrar() {
            this.$root.vibrar(30); // Vibração leve ao tocar no botão

            const nomeDigitado = this.form.nome.trim().toLowerCase();
            const pinDigitado = this.form.pin.trim();

            // Procura o funcionário no banco de dados
            const usuarioEncontrado = this.$root.equipe.find(u => u.nome.toLowerCase() === nomeDigitado && u.pin === pinDigitado);

            if (usuarioEncontrado) {
                // Sucesso: Copia os dados do utilizador para a sessão atual
                this.$root.usuario = JSON.parse(JSON.stringify(usuarioEncontrado)); 
                const nomeFormatado = usuarioEncontrado.nome.charAt(0).toUpperCase() + usuarioEncontrado.nome.slice(1);

                // 🟢 NOVO: Regista no Histórico que o funcionário iniciou o turno
                this.$root.registrarHistorico('Login Efetuado', 'Acesso', `Início de sessão no dispositivo.`);

                // Verifica Aniversário
                const hoje = new Date();
                const mesDiaHoje = String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0');
                
                if (usuarioEncontrado.nascimento && usuarioEncontrado.nascimento.endsWith(mesDiaHoje)) {
                    this.$root.vibrar([50, 100, 50, 100, 50]); // Vibração de festa!
                    Swal.fire({
                        title: `🎉 Feliz Aniversário, ${nomeFormatado}! 🎂`,
                        text: 'A equipa Artigiano deseja-lhe um dia incrível!',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/3014/3014404.png',
                        imageWidth: 100, imageHeight: 100, background: '#1E1E1E', color: '#FFF', confirmButtonColor: '#FFAB00', confirmButtonText: 'Obrigado! 🥳',
                        backdrop: `rgba(0,0,0,0.8) url("https://media.tenor.com/t3uLq5d7z5MAAAAi/confetti.gif") left top no-repeat`
                    }).then(() => { this.$root.mudarTela('tela-dashboard'); });
                } else {
                    this.$root.vibrar([50, 50, 50]); // Vibração de Sucesso
                    Swal.fire({ icon: 'success', title: `Bem-vindo, ${nomeFormatado}!`, timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
                    this.$root.mudarTela('tela-dashboard');
                }
            } else {
                // Erro de Autenticação
                this.$root.vibrar([100, 50, 100]); // Vibração de erro (duplo forte)
                Swal.fire({ icon: 'error', title: 'Acesso Negado', text: 'Nome ou PIN incorretos.', confirmButtonColor: '#FFAB00', background: '#1E1E1E', color: '#FFF' });
            }
        }
    }
});
