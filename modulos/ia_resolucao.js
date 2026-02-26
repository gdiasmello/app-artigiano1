const IA_Resolucao = {
    async resolverErro(contexto, root) {
        const apiKey = window.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("API Key não encontrada.");
            return null;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
        
        const prompt = `
            Você é a IA do PiZZA Master, um ERP inteligente para pizzarias.
            Seu objetivo é resolver erros de entrada de dados dos funcionários.
            
            BANCO DE PRODUTOS ATUAL:
            ${JSON.stringify(root.bancoProdutos.map(p => ({ id: p.id, nome: p.nome, unidade: p.unidade, categoria: p.categoria })))}
            
            CONTEXTO DO ERRO:
            ${JSON.stringify(contexto)}
            
            REGRAS:
            1. Se o item não for encontrado, busque o mais similar ou um sinônimo no banco de produtos.
            2. Se a quantidade for absurda, sugira a correção baseada em proporções reais.
            3. Se a unidade for incompatível, converta usando bom senso.
            4. Se for uma descrição vaga, tente identificar o produto.
            
            Responda APENAS o JSON estruturado com o seguinte schema:
            {
                "tipo": "CORRECAO | PROPORCAO | CONVERSAO | CHATBOT",
                "titulo": "string",
                "mensagem": "string",
                "icone": "string (fa-icon)",
                "cor": "hex",
                "sugestao": {
                    "label": "string",
                    "acao": {
                        "tipo": "ADD_ITEM | UPDATE_QUANTITY",
                        "produtoId": "string",
                        "quantidade": number,
                        "unidade": "string"
                    }
                }
            }
        `;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            return JSON.parse(text);
        } catch (e) {
            console.error("Erro na IA de Resolução:", e);
            return null;
        }
    }
};

window.IA_Resolucao = IA_Resolucao;
