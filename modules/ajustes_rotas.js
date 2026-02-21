// modulos/ajustes_rotas.js - Gestão de Rotas v0.0.48

Vue.component('tela-ajustes-rotas', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #D50000;">🗺️ Rotas Físicas</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="border-left: 3px solid #D50000; margin-bottom: 25px;">
            <h4 style="margin: 0 0 10px 0; color: white;">Nova Rota de Armazenamento</h4>
            <div style="display: flex; gap: 10px;">
                <input type="text" v-model="novaRota" placeholder="Ex: Geladeira 2" class="input-dark" style="flex:1;" />
                <button class="btn" style="width: auto; background: #D50000; color: white; padding: 0 20px;" @click="tentaAdicionarRota">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
        
        <h4 style="color: white; border-bottom: 1px solid #333; padding-bottom: 10px;">Ordem da Contagem Física</h4>
        <p style="color: var(--text-sec); font-size: 0.85rem; margin-bottom: 15px;">Mova para cima ou para baixo para definir o caminho do funcionário, ou apague se o local não existir mais.</p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div v-for="(rota, index) in $root.rotasSalvas" :key="index" style="background: #1A1A1A; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #333;">
                
                <span style="color: white; font-size: 1.1rem;"><b>{{ index + 1 }}º</b> - {{ rota }}</span>
                
                <div style="display: flex; gap: 12px; align-items: center;">
                    <button @click="moverRota(index, -1)" :disabled="index === 0" style="background: none; border: none; color: index === 0 ? '#444' : '#FFF'; font-size: 1.5rem; cursor: pointer; transition: 0.2s;">
                        <i class="fas fa-arrow-circle-up"></i>
                    </button>
                    <button @click="moverRota(index, 1)" :disabled="index === $root.rotasSalvas.length - 1" style="background: none; border: none; color: index === $root.rotasSalvas.length - 1 ? '#444' : '#FFF'; font-size: 1.5rem; cursor: pointer; transition: 0.2s;">
                        <i class="fas fa-arrow-circle-down"></i>
                    </button>
                    
                    <div style="width: 1px; height: 20px; background: #444; margin: 0 5px;"></div>
                    
                    <button @click="tentaRemoverRota(index)" style="background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer; padding: 5px;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>

            </div>
        </div>

    </div>
    `,
    data() {
        return {
            novaRota: ''
        };
    },
    mounted() {
        // Garante o estilo do input escuro para ficar em harmonia com o tema
        if (!document.getElementById('css-rotas')) {
            const style = document.createElement('style'); style.id = 'css-rotas';
            style.innerHTML = `.input-dark { width: 100%; padding: 12px; background: #2C2C2C; border: none; border-radius: 5px; color: white; box-sizing: border-box; }`;
            document.head.appendChild(style);
        }
    },
    methods: {
        voltar() {
            this.$root.vibrar(30);
            this.$root.mudarTela('tela-ajustes');
        },
        tentaAdicionarRota() {
            this.$root.vibrar(30);
            if(this.novaRota.trim() === '') return;
            
            this.$root.autorizarAcao('adicionar', () => {
                this.$root.rotasSalvas.push(this.novaRota.trim());
                this.$root.registrarHistorico('Nova Rota', 'Ajustes', `Criada a rota de armazenamento: ${this.novaRota.trim()}`);
                this.novaRota = ''; 
                this.$root.vibrar([50, 50, 50]);
                Swal.fire({ icon: 'success', title: 'Adicionada!', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
            });
        },
        
        // 🟢 FUNÇÃO DE EXCLUSÃO INTELIGENTE COM PROTEÇÃO DE DADOS
        tentaRemoverRota(index) {
            this.$root.vibrar(30);
            const nomeDaRota = this.$root.rotasSalvas[index];

            // 1. Verifica se é a ÚLTIMA rota do sistema.
            if (this.$root.rotasSalvas.length <= 1) {
                Swal.fire({ icon: 'error', title: 'Atenção', text: 'Você não pode apagar a última rota da loja!', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            // Pede permissão para Remover (Senha do Gerente se o utilizador não for admin)
            this.$root.autorizarAcao('remover', () => {
                
                // 2. Procura no Cérebro se existem produtos associados a esta rota
                const produtosAfetados = this.$root.bancoProdutos.filter(p => p.local === nomeDaRota);

                if (produtosAfetados.length > 0) {
                    // Há produtos! Força a escolha do novo local.
                    let optionsHtml = '';
                    this.$root.rotasSalvas.forEach(r => {
                        if (r !== nomeDaRota) optionsHtml += `<option value="${r}">${r}</option>`;
                    });

                    Swal.fire({
                        title: 'Rota em Uso!',
                        html: `<p style="color: #CCC; font-size: 0.9rem;">Existem <b>${produtosAfetados.length} produtos</b> armazenados em "${nomeDaRota}".<br>Para evitar que desapareçam, escolha o novo local para eles:</p>
                               <select id="swal-nova-rota" style="width: 100%; padding: 10px; background: #2C2C2C; color: white; border: 1px solid var(--cor-primaria); border-radius: 5px; margin-top: 10px; font-size: 1rem;">
                                  ${optionsHtml}
                               </select>`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#FF5252',
                        cancelButtonColor: '#444',
                        confirmButtonText: 'Mover e Apagar',
                        cancelButtonText: 'Cancelar',
                        background: '#1E1E1E', color: '#FFF',
                        preConfirm: () => {
                            return document.getElementById('swal-nova-rota').value;
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const novaRotaEscolhida = result.value;
                            
                            // 3. Move os produtos globalmente
                            this.$root.bancoProdutos.forEach(p => {
                                if (p.local === nomeDaRota) { p.local = novaRotaEscolhida; }
                            });

                            // 4. Apaga a rota antiga
                            this.$root.rotasSalvas.splice(index, 1);
                            
                            this.$root.registrarHistorico('Rota Apagada e Migrada', 'Ajustes', `Rota "${nomeDaRota}" apagada. Produtos transferidos para "${novaRotaEscolhida}".`);
                            this.$root.vibrar([50, 50, 50]);
                            Swal.fire({ icon: 'success', title: 'Sucesso!', text: `A rota foi apagada e ${produtosAfetados.length} produtos foram movidos para ${novaRotaEscolhida}.`, timer: 3000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
                        }
                    });

                } else {
                    // Está vazia, apaga diretamente
                    Swal.fire({
                        title: 'Apagar Rota?',
                        text: `O local "${nomeDaRota}" está vazio. Deseja remover?`,
                        icon: 'question',
                        showCancelButton: true, confirmButtonColor: '#FF5252', cancelButtonColor: '#444', confirmButtonText: 'Sim, Apagar', cancelButtonText: 'Cancelar', background: '#1E1E1E', color: '#FFF'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.$root.rotasSalvas.splice(index, 1);
                            this.$root.registrarHistorico('Rota Excluída', 'Ajustes', `O local "${nomeDaRota}" foi removido do sistema.`);
                            this.$root.vibrar([50, 50, 50]);
                            Swal.fire({ icon: 'success', title: 'Removida!', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
                        }
                    });
                }
            });
        },
        moverRota(index, direcao) {
            this.$root.vibrar(15);
            const novoIndex = index + direcao;
            if (novoIndex < 0 || novoIndex >= this.$root.rotasSalvas.length) return;
            const rotaMovida = this.$root.rotasSalvas.splice(index, 1)[0];
            this.$root.rotasSalvas.splice(novoIndex, 0, rotaMovida);
        }
    }
});
