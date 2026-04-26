import { TERMOS_TECNICOS, INTENCOES, CAMPOS_FILTRO, FUNCOES_ORCAMENTO } from '@/data/thesaurus/termosAgente'
import { filtrarDespesas, filtrarServidores, getContratos, getReceitas } from './portalApi'
import type { TipoIntencao } from '@/data/thesaurus/termosAgente'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const MAX_RETRIES = 2

export interface MensagemHistorico {
  role: 'user' | 'assistant'
  text: string
}

export interface RespostaAgente {
  mensagem: string
  intencao?: TipoIntencao | null
  filtros?: Record<string, string>
  linkDetalhe?: string
  resumoDados?: string
}

function montarSystemPrompt(): string {
  const termosFormatados = Object.entries(TERMOS_TECNICOS)
    .map(([tecnico, cidadao]) => `  "${tecnico}" = "${cidadao}"`)
    .join('\n')

  const funcoesFormatadas = FUNCOES_ORCAMENTO.map(
    (f) => `  ${f.nome} (sinônimos: ${f.sinonimos.join(', ')})`,
  ).join('\n')

  const camposFormatados = Object.entries(CAMPOS_FILTRO)
    .map(([cat, campos]) => {
      const lista = Object.entries(campos)
        .map(([k, v]) => `    - ${k}: ${v}`)
        .join('\n')
      return `  ${cat}:\n${lista}`
    })
    .join('\n')

  const hoje = new Date()
  const dataAtual = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  return `Você é um assistente de transparência pública do Portal da Transparência do Maranhão (MA).
Seu objetivo é ajudar cidadãos a consultar dados públicos usando linguagem simples e acessível.

DATA ATUAL: ${dataAtual}. Use isso para contextualizar anos e períodos mencionados pelo usuário.

CATEGORIAS DE DADOS DISPONÍVEIS:
- despesas: gastos do governo estadual
- servidores: funcionários públicos e salários
- contratos: contratos com empresas (licitações)
- receitas: arrecadação de impostos e transferências

GLOSSÁRIO (termos técnicos → linguagem cidadã):
${termosFormatados}

ÁREAS ORÇAMENTÁRIAS (função):
${funcoesFormatadas}

FILTROS DISPONÍVEIS POR CATEGORIA:
${camposFormatados}

INTENÇÕES RECONHECIDAS:
- despesas: ${INTENCOES.despesas.join(', ')}
- servidores: ${INTENCOES.servidores.join(', ')}
- contratos: ${INTENCOES.contratos.join(', ')}
- receitas: ${INTENCOES.receitas.join(', ')}

INSTRUÇÕES:
1. Identifique a intenção do usuário (despesas, servidores, contratos, receitas ou null se não souber).
2. Extraia filtros relevantes da pergunta (ano, funcao, etc.).
3. Para "funcao", mapeie sinônimos para o nome oficial (ex: "saúde" → "Saúde", "escola" → "Educação").
4. Responda SEMPRE em português, usando linguagem simples e acessível ao cidadão comum.
5. Nunca invente dados — use apenas os fornecidos no contexto de dados reais.
6. Se não souber responder, diga honestamente e sugira uma busca mais específica.

FORMATO DE RESPOSTA (JSON obrigatório):
{
  "mensagem": "texto da resposta em linguagem cidadã",
  "intencao": "despesas" | "servidores" | "contratos" | "receitas" | null,
  "filtros": { "campo": "valor" },
  "linkDetalhe": "/despesas" | "/servidores" | "/contratos" | "/receitas" | null
}

Retorne APENAS o JSON, sem markdown, sem bloco de código, sem texto extra.`
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function consultarDados(
  intencao: TipoIntencao,
  filtros: Record<string, string>,
): Promise<string> {
  try {
    if (intencao === 'despesas') {
      const resp = await filtrarDespesas({
        ano: filtros.ano ? Number(filtros.ano) : undefined,
        funcao: filtros.funcao,
        natureza: filtros.natureza,
        situacao: filtros.situacao,
        fornecedor: filtros.fornecedor,
      })
      const { resumo, meta } = resp
      return `Encontrei ${meta.total_registros.toLocaleString('pt-BR')} registros. Total pago: ${formatarMoeda(resumo.total_pago)}. Total comprometido: ${formatarMoeda(resumo.total_empenhado)}.`
    }

    if (intencao === 'servidores') {
      const resp = await filtrarServidores({
        ano: filtros.ano ? Number(filtros.ano) : undefined,
        mes: filtros.mes,
        nome: filtros.nome,
        orgao: filtros.orgao,
        cargo: filtros.cargo,
        vinculo: filtros.vinculo,
        situacao: filtros.situacao,
        municipio: filtros.municipio,
      })
      const { resumo, meta } = resp
      return `Encontrei ${meta.total_registros.toLocaleString('pt-BR')} servidores. Total da folha: ${formatarMoeda(resumo.total_folha)}. Média salarial: ${formatarMoeda(resumo.media_salarial)}.`
    }

    if (intencao === 'contratos') {
      const resp = await getContratos(filtros.ano ? Number(filtros.ano) : undefined)
      const { total_contratos, valor_total } = resp.resumo
      return `Encontrei ${total_contratos} contratos com valor total de ${formatarMoeda(valor_total)}.`
    }

    if (intencao === 'receitas') {
      const resp = await getReceitas(filtros.ano ? Number(filtros.ano) : undefined)
      const { total_arrecadado, total_previsto, percentual_execucao } = resp.resumo
      return `Arrecadação: ${formatarMoeda(total_arrecadado)} de ${formatarMoeda(total_previsto)} previstos (${percentual_execucao}% executado).`
    }
  } catch {
    // silencia — sem dados disponíveis
  }
  return ''
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
  error?: {
    code?: number
    details?: Array<{ retryDelay?: string }>
  }
}

function parseRetryDelay(errorJson: GeminiResponse): number {
  const delayStr = errorJson.error?.details?.find((d) => d.retryDelay)?.retryDelay ?? ''
  const seconds = parseInt(delayStr, 10)
  return isNaN(seconds) ? 5000 : seconds * 1000
}

export async function enviarMensagem(
  mensagemUsuario: string,
  historico: MensagemHistorico[] = [],
): Promise<RespostaAgente> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

  if (!apiKey) {
    return {
      mensagem:
        'O assistente não está configurado. Adicione a chave VITE_GEMINI_API_KEY no arquivo .env.',
      intencao: null,
    }
  }

  // Gemini usa "model" em vez de "assistant"
  const contents = [
    ...historico.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: mensagemUsuario }] },
  ]

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: montarSystemPrompt() }] },
    contents,
    generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
  })

  let attempt = 0
  while (attempt <= MAX_RETRIES) {
    try {
      const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      if (response.status === 429) {
        const errorJson: GeminiResponse = await response.json()
        console.warn('Gemini 429:', JSON.stringify(errorJson, null, 2))
        if (attempt < MAX_RETRIES) {
          const delay = parseRetryDelay(errorJson)
          await new Promise((r) => setTimeout(r, delay))
          attempt++
          continue
        }
        return {
          mensagem: 'O assistente está sobrecarregado no momento. Aguarde alguns segundos e tente novamente.',
          intencao: null,
        }
      }

      if (!response.ok) {
        const err = await response.text()
        console.error('Gemini API error:', err)
        return {
          mensagem: 'Não consegui processar sua pergunta agora. Tente novamente em instantes.',
          intencao: null,
        }
      }

      const json: GeminiResponse = await response.json()
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

      let parsed: RespostaAgente
      try {
        parsed = JSON.parse(rawText.trim())
      } catch {
        // modelo às vezes inclui markdown fence mesmo pedindo sem
        const match = rawText.match(/\{[\s\S]*\}/)
        if (match) {
          parsed = JSON.parse(match[0])
        } else {
          return { mensagem: rawText || 'Não entendi sua pergunta. Pode reformular?', intencao: null }
        }
      }

      if (parsed.intencao && parsed.filtros !== undefined) {
        const resumoDados = await consultarDados(parsed.intencao as TipoIntencao, parsed.filtros ?? {})
        if (resumoDados) {
          parsed.resumoDados = resumoDados
          parsed.mensagem = `${parsed.mensagem}\n\n📊 ${resumoDados}`
        }
      }

      return parsed
    } catch (err) {
      console.error('Erro ao chamar Gemini:', err)
      return {
        mensagem: 'Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.',
        intencao: null,
      }
    }
  }

  return {
    mensagem: 'Não foi possível obter resposta após várias tentativas. Tente novamente em instantes.',
    intencao: null,
  }
}
