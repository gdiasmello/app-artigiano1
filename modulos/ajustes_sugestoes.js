/**
 * Sugestões v1.0.2
 */
Vue.component('tela-ajustes-sugestoes', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #FFD600;"><i class="fas fa-lightbulb"></i> Sugestões & Bugs</h2>
            <button @click="$root.mudarTela('tela-ajustes-ajuda')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>
        
        <div class="card" style="padding: 20px; border-top: 5px solid #FFD600;">
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 20px;">
                Encontrou um erro ou tem uma ideia incrível? Descreva abaixo e, se possível, anexe uma foto.
            </p>

            <textarea v-model="msg" placeholder="Descreva o erro ou sugestão detalhadamente..." class="input-dark" rows="5" style="margin-bottom: 20px;"></textarea>
            
            <!-- Upload de Imagem -->
            <div style="margin-bottom: 25px;">
                <label style="display: block; color: #AAA; font-size: 0.8rem; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Anexar Imagem (Opcional)</label>
                
                <div v-if="!imagemBase64" @click="triggerUpload" style="width: 100%; height: 150px; border: 2px dashed #333; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; color: #555; transition: all 0.2s;">
                    <i class="fas fa-camera" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <span>Tirar foto ou selecionar</span>
                </div>

                <div v-else style="position: relative; width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #444;">
                    <img :src="imagemBase64" style="width: 100%; display: block;">
                    <button @click="imagemBase64 = null" style="position: absolute; top: 10px; right: 10px; background: rgba(255,82,82,0.8); border: none; color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <input type="file" ref="fileInput" accept="image/*" style="display: none;" @change="handleUpload">
            </div>

            <button @click="enviar" class="btn" style="background: #25D366; color: white; height: 60px; font-size: 1.1rem;">
                <i class="fab fa-whatsapp"></i> ENVIAR FEEDBACK
            </button>
        </div>

        <div v-if="enviando" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 3rem; color: var(--cor-primaria); margin-bottom: 20px;"></i>
            <h3 style="color: white;">Processando...</h3>
        </div>
    </div>
    `,
    data() { 
        return { 
            msg: '',
            imagemBase64: null,
            enviando: false
        }; 
    },
    methods: {
        triggerUpload() {
            this.$refs.fileInput.click();
        },
        handleUpload(e) {
            const file = e.target.targetFiles?.[0] || e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                this.imagemBase64 = event.target.result;
            };
            reader.readAsDataURL(file);
        },
        async enviar() {
            if (!this.msg) {
                Swal.fire({ icon: 'warning', text: 'Por favor, descreva sua sugestão ou erro.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            this.enviando = true;

            try {
                // Salva no banco de dados para registro interno (opcional mas recomendado para "mostrar" depois)
                const sugestao = {
                    id: Date.now(),
                    usuario: this.$root.usuario.nome,
                    texto: this.msg,
                    imagem: this.imagemBase64,
                    data: new Date().toISOString()
                };
                
                // Tenta salvar no Firestore se a coleção existir ou cria
                await db.collection("feedbacks").add(sugestao);

                // Prepara mensagem para WhatsApp
                let textoWhats = `*PIZZA MASTER - FEEDBACK*\n`;
                textoWhats += `*Usuário:* ${this.$root.usuario.nome}\n`;
                textoWhats += `*Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n`;
                textoWhats += `*Mensagem:*\n${this.msg}\n\n`;
                
                if (this.imagemBase64) {
                    textoWhats += `_(O usuário anexou uma imagem que foi salva no banco de dados)_`;
                }

                const link = `https://api.whatsapp.com/send?phone=5543984544686&text=${encodeURIComponent(textoWhats)}`;
                window.open(link, '_blank');

                this.msg = '';
                this.imagemBase64 = null;
                
                Swal.fire({
                    icon: 'success',
                    title: 'Obrigado!',
                    text: 'Seu feedback foi registrado e enviado com sucesso.',
                    background: '#1E1E1E',
                    color: '#FFF'
                }).then(() => {
                    this.$root.mudarTela('tela-ajustes-ajuda');
                });

            } catch (error) {
                console.error("Erro ao enviar feedback:", error);
                Swal.fire('Erro', 'Não foi possível salvar seu feedback, mas você ainda pode enviar via WhatsApp.', 'error');
            } finally {
                this.enviando = false;
            }
        }
    }
});

