// INÍCIO DO ARQUIVO modulos/ajustes_sugestoes.js - v0.0.74
Vue.component('tela-ajustes-sugestoes', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00E676;">💡 Feedbacks</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="border-top: 3px solid #00E676; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: white;">Nova Mensagem</h3>
            
            <label class="label-ia">Tipo de Mensagem</label>
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button @click="form.tipo = 'Ideia'" :style="form.tipo === 'Ideia' ? 'background:#00E676;color:#121212;' : 'background:#222;color:#FFF;'" style="flex:1; padding:10px; border-radius:8px; border:none; font-weight:bold; cursor:pointer;">💡 Ideia</button>
                <button @click="form.tipo = 'Erro'" :style="form.tipo === 'Erro' ? 'background:#FF5252;color:#FFF;' : 'background:#222;color:#FFF;'" style="flex:1; padding:10px; border-radius:8px; border:none; font-weight:bold; cursor:pointer;">🐞 Erro</button>
            </div>

            <label class="label-ia">O que aconteceu?</label>
            <textarea v-model="form.texto" placeholder="Descreva sua sugestão ou o problema que encontrou..." style="width:100%; height:100px; background:#2C2C2C; color:#FFF; padding:12px; border:1px solid #444; border-radius:8px; box-sizing:border-box; margin-bottom:15px; font-family:inherit;"></textarea>

            <label class="label-ia">Anexar Print (Opcional)</label>
            <div style="margin-bottom: 20px;">
                <input type="file" accept="image/*" @change="processarImagem" id="fileInput" style="display:none;">
                <button onclick="document.getElementById('fileInput').click()" style="width:100%; background:#222; color:#00E676; border:1px dashed #00E676; padding:15px; border-radius:8px; font-weight:bold; cursor:pointer;">
                    <i class="fas fa-camera"></i> Escolher Foto / Tirar Print
                </button>
                <div v-if="form.imagem" style="margin-top:10px; position:relative; text-align:center;">
                    <img :src="form.imagem" style="max-width:100%; border-radius:8px; border:1px solid #444;" />
                    <button @click="form.imagem = null" style="position:absolute; top:-10px; right:-10px; background:#FF5252; color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer;"><i class="fas fa-times"></i></button>
                </div>
            </div>

            <button @click="enviar" class="btn" style="background: #00E676; color: #121212;">ENVIAR PARA A GERÊNCIA</button>
        </div>

        <div v-if="$root.usuario.permissoes.admin || $root.usuario.permissoes.gerenciar">
            <h3 style="color: #00B0FF; border-bottom: 1px solid #333; padding-bottom: 10px;">Caixa de Entrada ({{ $root.feedbacks.length }})</h3>
            
            <div v-if="$root.feedbacks.length === 0" style="color:#888; text-align:center; padding:20px;">
                Nenhuma mensagem na caixa.
            </div>

            <div v-for="fb in feedOrdenados" :key="fb.id" class="card" :style="fb.tipo === 'Erro' ? 'border-left:4px solid #FF5252;' : 'border-left:4px solid #00E676;'">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <div>
                        <strong style="color:white; display:block;">{{ fb.autor }}</strong>
                        <small style="color:#888;">{{ fb.dataStr }} às {{ fb.horaStr }}</small>
                    </div>
                    <span :style="fb.tipo === 'Erro' ? 'color:#FF5252; background:#2A1111;' : 'color:#00E676; background:#112A11;'" style="padding:3px 8px; border-radius:5px; font-size:0.75rem; font-weight:bold;">
                        {{ fb.tipo }}
                    </span>
                </div>
                
                <p style="color:#DDD; margin:0 0 10px 0; font-size:0.95rem; white-space: pre-wrap;">{{ fb.texto }}</p>
                
                <img v-if="fb.imagem" :src="fb.imagem" style="max-width:100%; border-radius:5px; margin-bottom:10px; border:1px solid #333;" />

                <div style="text-align:right; border-top:1px dashed #333; padding-top:10px;">
                    <button @click="apagar(fb.id)" style="background:none; border:none; color:#FF5252; cursor:pointer; font-weight:bold;"><i class="fas fa-trash"></i> APAGAR</button>
                </div>
            </div>
        </div>

    </div>
    `,
    data() {
        return {
            form: { tipo: 'Ideia', texto: '', imagem: null }
        };
    },
    computed: {
        feedOrdenados() {
            // Mostra os mais recentes primeiro
            return [...this.$root.feedbacks].sort((a, b) => b.id - a.id);
        }
    },
    methods: {
        // 🟢 COMPRESSOR DE IMAGEM PARA NÃO TRAVAR O CELULAR
        processarImagem(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            this.$root.vibrar(20);
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const max = 600; // Resolução máxima
                    let w = img.width; let h = img.height;
                    
                    // Reduz proporcionalmente
                    if (w > h && w > max) { h *= max / w; w = max; }
                    else if (h > max) { w *= max / h; h = max; }
                    
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    
                    // Converte para JPEG com 60% de qualidade
                    this.form.imagem = canvas.toDataURL('image/jpeg', 0.6);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        },

        enviar() {
            if (!this.form.texto.trim()) {
                Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Escreva alguma coisa antes de enviar.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            this.$root.vibrar(30);
            const agora = new Date();
            const novoFeed = {
                id: Date.now(),
                autor: this.$root.usuario.nome,
                tipo: this.form.tipo,
                texto: this.form.texto,
                imagem: this.form.imagem,
                dataStr: agora.toLocaleDateString('pt-BR'),
                horaStr: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };

            // Salva na lista de Feedbacks
            this.$root.feedbacks.push(novoFeed);

            // Cria um aviso automático para o Gerente
            const exp = new Date(); exp.setHours(exp.getHours() + 48); // Fica no mural 48h
            this.$root.avisos.push({
                id: Date.now() + 1,
                titulo: novoFeed.tipo === 'Erro' ? '🐞 NOVO ERRO REPORTADO' : '💡 NOVA SUGESTÃO',
                texto: `${novoFeed.autor} enviou um feedback. Vá em Ajustes > Feedbacks para ler.`,
                autor: 'Sistema',
                dataExpiracao: exp.toISOString(),
                importante: novoFeed.tipo === 'Erro',
                cargoDestino: 'Gerente'
            });

            this.$root.salvarMemoriaLocal();
            this.$root.registrarHistorico('Feedback', 'Sistema', `Enviou um(a) ${this.form.tipo}`);

            // Limpa o formulário
            this.form.texto = '';
            this.form.imagem = null;

            Swal.fire({ icon: 'success', title: 'Enviado!', text: 'A gerência foi notificada.', background: '#1E1E1E', color: '#FFF' });
        },

        apagar(id) {
            this.$root.vibrar(30);
            this.$root.autorizarAcao('remover', () => {
                this.$root.feedbacks = this.$root.feedbacks.filter(f => f.id !== id);
                this.$root.salvarMemoriaLocal();
            });
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_sugestoes.js
