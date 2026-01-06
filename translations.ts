
import { AppLanguage } from './types';

export const translations = {
  [AppLanguage.EN]: {
    contactUrl: "https://www.razaofinal.com/contact-us",
    onboarding: {
      title: "Welcome to DeepScribe",
      subtitle: "Your Private Strategic Brain Trust",
      desc: "To ensure your privacy and keep this service free for everyone, DeepScribe uses your own Google Gemini API key. Your data never touches our servers.",
      cta: "Select Your API Key",
      billingNote: "Note: You must select an API key from a project with billing enabled (even if you stay within the free tier).",
      billingLink: "Learn more about Gemini API billing",
      freeTierTitle: "The Power of Free",
      freeTierInfo: "The Google Gemini Free Tier allows for approx. 50+ hours of audio transcription per month and up to 1,500 daily interactions. For standard professional use, this tool is effectively free forever.",
      benefits: [
        "100% Private: Data stays in your browser.",
        "Zero Cost: Use your own project's free tier.",
        "Secure: Direct connection to Google's AI."
      ]
    },
    nav: {
      home: "Home",
      newTranscription: "New Transcription",
      myDocuments: "My Documents",
      liveConversation: "Live Conversation",
      configuration: "Configuration",
      marketingStudio: "Marketing Studio",
      helpGuide: "Help & Guide",
      legalPrivacy: "Legal & Privacy",
      version: "DeepScribe v2.1.0",
      poweredBy: "Powered by Gemini 2.5 Flash"
    },
    dashboard: {
      title: "Turn Voice Notes into",
      subtitle: "Strategic Assets",
      desc: "DeepScribe is your private brainstorming partner. Record your thoughts offline, structure the chaos, and uncover new insights.",
      steps: [
        { title: "1. Capture Anywhere", desc: "Offline? Use your phone's native recorder. Online? Use our Live Session." },
        { title: "2. Structure Automatically", desc: "Upload your file. We transform audio into summaries, topics, and clean transcriptions." },
        { title: "3. Enrichment & Research", desc: "Chat with your notes. Ask the AI to research topics and challenge assumptions." }
      ],
      scienceBanner: {
        tag: "The Science of Thinking",
        title: "Walking increases creative output by 60%.",
        desc: "DeepScribe is built on the principles of Cognitive Offloading and the Incubation Effect.",
        cta: "Read the Research"
      },
      actions: {
        upload: { title: "Upload Audio File", desc: "Process a pre-recorded voice note or meeting from your phone.", cta: "Start Processing" },
        live: { title: "Start Live Session", desc: "Brainstorm in real-time with the AI assistant right here.", cta: "Open Mic" }
      },
      recent: "Recent Documents",
      viewAll: "View All"
    },
    generator: {
      title: "Upload Audio",
      desc: "Select a voice note or conversation recording. We'll handle the summary, topics, and full transcription.",
      outputLang: "Output Language:",
      cta: "Select Audio File",
      error: "Failed to process audio. Please check your API key and file format.",
      stages: {
        read: { label: "Reading audio file...", sub: "Preparing high-fidelity stream" },
        analyze: { label: "Analyzing audio context...", sub: "Detecting speakers and nuances" },
        structure: { label: "Structuring strategic document...", sub: "Formatting transcription and insights" },
        enrich: { label: "Performing web research...", sub: "Enriching topics with live data" }
      }
    },
    live: {
      title: "Conversational Mode",
      desc: "Talk to your documents or brainstorm ideas in real-time. When you finish, we will automatically generate a summary and transcription for you.",
      statusListening: "Listening...",
      statusThinking: "AI Thinking",
      ctaStart: "Start Live Session",
      ctaFinish: "Finish & Generate Doc",
      errorConversational: "No significant conversation recorded to generate a document.",
      errorFailed: "Failed to generate document from conversation.",
      tipsTitle: "Interaction Tips",
      tips: [
        { title: "Direct the AI:", text: "Say 'Just listen for a while' if you want to rant, or 'Brainstorm with me' for active feedback." },
        { title: "Interrupt Anytime:", text: "If Gemini talks too much, just say 'Wait, let me finish' or simply start talking over it." },
        { title: "It's a Conversation:", text: "Treat it like a person. You can ask it to repeat, summarize, or change topics." }
      ],
      stages: {
        extract: { label: "Extracting transcript...", sub: "Cleaning conversational noise" },
        analyze: { label: "Deep Context Analysis...", sub: "Identifying strategic topics" },
        structure: { label: "Generating Executive Summary...", sub: "Formatting for professional use" },
        finalize: { label: "Finalizing Document...", sub: "Saving to your personal brain trust" }
      }
    },
    history: {
      title: "My Documents",
      searchPlaceholder: "Search by title, insight...",
      btnBackup: "Backup",
      btnRestore: "Restore",
      btnRestoreBackup: "Restore Backup",
      emptyState: "No documents yet.",
      emptyStateDesc: "Upload an audio file to generate your first transcription.",
      noMatches: "No matches found for",
      clearSearch: "Clear search",
      cardDelete: "Delete",
      cardOpen: "Open",
      deleteConfirmTitle: "Delete Document?",
      deleteConfirmDesc: "Are you sure? This action is permanent.",
      deleteConfirmCancel: "Cancel",
      deleteConfirmYes: "Yes, Delete",
      restoreSuccess: (count: number) => `Successfully restored ${count} documents.`,
      restoreError: "Failed to parse backup file.",
      restoreInvalid: "Invalid backup file format."
    },
    viewer: {
      btnBack: "Back",
      btnEdit: "Edit",
      btnSave: "Save",
      btnExport: "Export",
      exportGoogleDocs: "Copy for Google Docs",
      exportHtml: "Download HTML File",
      exportDialogue: "Copy Dialogue Only",
      browserUnsupported: "Browser not supported",
      dialogueCopied: "Dialogue copied!",
      exportSuccess: "Full document copied for Google Docs!",
      analysisLabel: "Analyze",
      explainLabel: "Explain",
      summarizeLabel: "Summarize",
      labels: {
        summary: "Executive Summary",
        topics: "Key Topics",
        transcription: "Full Transcription",
        dialogue: "Assistant Dialogue History",
        generated: "Generated by DeepScribe",
        research: "Research & Elaboration",
        title: "Meeting Document"
      },
      chatPlaceholder: "Ask a question...",
      chatInitial: "Hi! Ask me anything about this document."
    },
    settings: {
      title: "System Configuration",
      adminTitle: "Admin Activation",
      adminDesc: "Enter your registered administrator email to unlock the Marketing Studio and global management tools permanently.",
      adminPlaceholder: "Enter administrator identifier...",
      adminVerify: "Verify",
      labelTranscription: "Transcription & Summarization Instruction",
      labelEnrichment: "Topic Enrichment Template",
      labelLive: "Live Conversational Persona",
      adminUnlocked: "Marketing Studio Unlocked",
      adminUnlockedDesc: "Permanent administrator access confirmed for",
      adminDeactivate: "Deactivate Admin Mode",
      adminConfirmDeactivate: "This will hide the Marketing Studio. Continue?",
      adminSuccess: "Admin Mode Activated Permanently for this browser.",
      adminInvalid: "Invalid identification key.",
      btnSave: "Save Configuration",
      btnSaved: "Saved!"
    },
    marketing: {
      title: "Marketing Studio",
      adminVerified: "Verified Admin:",
      tabs: {
        analytics: "Signal Verifier",
        social: "Content Factory",
        images: "Asset Engine",
        branding: "Visual Identity"
      },
      analytics: {
        title: "Measurement Stream",
        diagnosticMic: "Voice Capability",
        diagnosticKey: "AI Engine Key",
        diagnosticStorage: "Local Storage",
        pulseLabel: "Active Signal Pulse",
        btnTest: "TEST SIGNAL FLOW",
        btnControl: "Open GA4 Control"
      },
      images: {
        accordionTitle: "Prompt Accordion",
        clearBtn: "Clear",
        btnGenerate: "GENERATE ASSET",
        statusGenerating: "Synthesizing...",
        previewTitle: "Asset Preview",
        previewDesc: "Your strategic visuals will appear here."
      }
    },
    legal: {
      title: "Legal, Privacy & Ownership",
      subtitle: "Terms of use, liability, and intellectual property rights.",
      ownershipTitle: "Ownership & Contact",
      ownershipDesc1: "DeepScribe is a proprietary tool developed and owned by RF Strategy.",
      ownershipDesc2: "We provide this tool to the community to foster better thinking and productivity. If you have suggestions or feedback, we would love to hear from you.",
      contactLabel: "Contact us at:",
      disclaimerTitle: "Disclaimer of Warranties",
      disclaimerBold: "THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.",
      disclaimerPoint1: "Experimental Technology: This application relies on AI (Google Gemini). AI models can make mistakes. Transcriptions and research may contain inaccuracies.",
      disclaimerPoint2: "No Professional Advice: Content is for informational purposes only. It does not constitute legal, medical, or financial advice.",
      privacyTitle: "Privacy Policy",
      privacyDesc: "Your privacy is paramount. RF Strategy does not collect, store, or have access to your personal data or audio recordings.",
      privacyPoint1: "Local Storage: All documents are stored locally on your device's browser.",
      privacyPoint2: "Data Processing: Data is sent directly to Google via the Gemini API. This is governed by Google's Privacy Policy.",
      liabilityTitle: "Limitation of Liability",
      liabilityDesc1: "In no event shall RF Strategy be liable for any claim or damages arising from the use of the software.",
      liabilityDesc2: "Data Loss: You are responsible for backing up your data using the provided feature.",
      liabilityDesc3: "API Costs: You are responsible for costs associated with your Google AI Studio keys."
    },
    help: {
      title: "DeepScribe Mastery Guide",
      subtitle: "Strategic intelligence from voice notes, explained.",
      goldenPath: {
        tag: "The 4-Step Golden Path",
        steps: [
          { title: "Capture", text: "Record a voice note or use Live Session for real-time AI brainstorming." },
          { title: "Structure", text: "Upload the audio. DeepScribe builds an executive summary." },
          { title: "Enrich", text: "The AI performs web research, categorizing sources into Recent and Historic." },
          { title: "Discuss", text: "Use the Assistant to challenge assumptions or extract specific data points." }
        ]
      },
      science: {
        title: "The Methodology of DeepScribe",
        subtitle: "The Science of Thinking Better.",
        intro: "DeepScribe isn't just a transcription tool; it's a cognitive architecture designed to maximize your strategic output by leveraging the way the human brain actually processes ideas.",
        p1: {
          title: "1. The Movement Spark (Stanford Research)",
          text: "A landmark study by Stanford University (Oppezzo & Schwartz, 2014) proved that walking increases creative output by an average of 60%. Physical movement triggers a 'soft fascination' state that allows the subconscious mind to bridge neural gaps that remain closed while sitting at a desk."
        },
        p2: {
          title: "2. Cognitive Offloading",
          text: "The human 'Working Memory' is limited. By capturing thoughts instantly via voice, you engage in 'Cognitive Offloading.' This clears your mental RAM, allowing your prefrontal cortex to focus on synthesizing new patterns rather than simply trying to remember the old ones."
        },
        p3: {
          title: "3. The Incubation Effect",
          text: "Breakthroughs often happen when we stop actively thinking about a problem. By recording your 'chaos' and letting DeepScribe structure it later, you leverage the Incubation Effect—allowing your mind to work on the solution in the background while the system handles the heavy lifting of organization."
        },
        conclusion: "DeepScribe turns your messy, unfiltered insights into professional assets, ensuring your most valuable thoughts are never lost to the 'voice note void'."
      },
      strategic: {
        title: "Strategic Intelligence",
        enrichment: { title: "Web Enrichment Layers", text: "Every topic is cross-referenced with the live web. Sources are sorted into Recent and Historic." },
        multilingual: { title: "Multilingual Mastery", text: "The system detects languages. Use the Language Pill in Chat to override dictation." }
      },
      live: {
        title: "Mastering Live Conversations",
        directing: { title: "Directing the AI", text: "Command it verbally: 'Gemini, just listen for a few minutes'." },
        interruptions: { title: "Handling Interruptions", text: "Say 'Wait' or 'Let me finish'. It is trained to detect these cues." }
      },
      powerUser: {
        title: "Power User Tools",
        selection: { title: "Smart Selection Menu", text: "Highlight text to instantly Analyze, Explain, or Summarize." },
        dictation: { title: "Voice Waves", text: "Click the Mic icon once for continuous smart listening." }
      },
      costs: {
        title: "Costs, Limits & Privacy",
        text: "DeepScribe runs on the Google Gemini Free Tier. Currently, this includes: 15 requests/min, 1,500 requests/day, and 1 million tokens/min (approx. 5 hours of audio). This is more than enough for intensive professional use without any costs."
      },
      moreHelp: "Need more help?",
      moreHelpDesc: "DeepScribe is maintained by RF Strategy to foster better thinking.",
      btnFeedback: "Feedback & Support"
    }
  },
  [AppLanguage.PT]: {
    contactUrl: "https://www.razaofinal.com/contact-us",
    onboarding: {
      title: "Bem-vindo ao DeepScribe",
      subtitle: "O Seu Cérebro Estratégico Privado",
      desc: "Para garantir a sua privacidade e manter este serviço gratuito, o DeepScribe utiliza a sua própria chave API do Google Gemini. Os seus dados nunca tocam nos nossos servidores.",
      cta: "Selecionar Chave API",
      billingNote: "Nota: Deve selecionar uma chave API de um projeto com faturação ativa (mesmo que permaneça no escalão gratuito).",
      billingLink: "Saiba mais sobre a faturação da API Gemini",
      freeTierTitle: "O Poder do Gratuito",
      freeTierInfo: "O Escalão Gratuito do Google Gemini permite aprox. 50+ horas de transcrição de áudio por mês e até 1.500 interações diárias. Para uso profissional comum, esta ferramenta é efetivamente gratuita para sempre.",
      benefits: [
        "100% Privado: Os dados ficam no seu navegador.",
        "Custo Zero: Use o escalão gratuito do seu projeto.",
        "Seguro: Ligação direta à IA da Google."
      ]
    },
    nav: {
      home: "Início",
      newTranscription: "Nova Transcrição",
      myDocuments: "Os Meus Documentos",
      liveConversation: "Conversa em Direto",
      configuration: "Configuração",
      marketingStudio: "Estúdio de Marketing",
      helpGuide: "Ajuda e Guia",
      legalPrivacy: "Legal e Privacidade",
      version: "DeepScribe v2.1.0",
      poweredBy: "Tecnologia Gemini 2.5 Flash"
    },
    dashboard: {
      title: "Transforme Notas de Voz em",
      subtitle: "Ativos Estratégicos",
      desc: "O DeepScribe é o seu parceiro privado de reflexão. Grave os seus pensamentos offline, organize o caos e descubra novas perspetivas.",
      steps: [
        { title: "1. Capture em qualquer lugar", desc: "Sem internet? Use o gravador do telemóvel. Online? Use a nossa Sessão em Direto." },
        { title: "2. Organize Automaticamente", desc: "Carregue o seu ficheiro. Transformamos o áudio em resumos, tópicos e transcrições limpas." },
        { title: "3. Enriquecimento e Pesquisa", desc: "Converse com as suas notas. Peça à IA para pesquisar tópicos e desafiar ideias." }
      ],
      scienceBanner: {
        tag: "A Ciência do Pensamento",
        title: "Caminhar aumenta a criatividade em 60%.",
        desc: "O DeepScribe baseia-se nos princípios de Descarga Cognitiva e no Efeito de Incubação.",
        cta: "Ler a Investigação"
      },
      actions: {
        upload: { title: "Carregar Ficheiro de Áudio", desc: "Processe uma nota de voz ou reunião gravada no seu telemóvel.", cta: "Iniciar Processamento" },
        live: { title: "Sessão em Direto", desc: "Faça um brainstorming em tempo real com o assistente de IA.", cta: "Abrir Microfone" }
      },
      recent: "Documentos Recentes",
      viewAll: "Ver Todos"
    },
    generator: {
      title: "Carregar Áudio",
      desc: "Selecione uma nota de voz ou gravação de conversa. Tratamos do resumo, tópicos e transcrição completa.",
      outputLang: "Língua de Saída:",
      cta: "Selecionar Ficheiro de Áudio",
      error: "Erro ao processar áudio. Verifique a sua chave API e o formato do ficheiro.",
      stages: {
        read: { label: "A ler ficheiro de áudio...", sub: "A preparar transmissão de alta fidelidade" },
        analyze: { label: "A analisar contexto do áudio...", sub: "A detetar interlocutores e nuances" },
        structure: { label: "A estruturar documento estratégico...", sub: "A formatar transcrição e insights" },
        enrich: { label: "A realizar pesquisa na web...", sub: "A enriquecer tópicos com dados em tempo real" }
      }
    },
    live: {
      title: "Modo de Conversa",
      desc: "Converse com os seus documentos ou faça brainstorming em tempo real. No final, geramos automaticamente um resumo e transcrição.",
      statusListening: "A ouvir...",
      statusThinking: "IA a pensar",
      ctaStart: "Iniciar Sessão em Direto",
      ctaFinish: "Terminar e Gerar Documento",
      errorConversational: "Nenhuma conversa significativa gravada para gerar um documento.",
      errorFailed: "Falha ao gerar documento a partir da conversa.",
      tipsTitle: "Dicas de Interação",
      tips: [
        { title: "Oriente a IA:", text: "Diga 'Apenas ouve durante um bocado' se quiser apenas desabafar, ou 'Brainstorming comigo' para feedback ativo." },
        { title: "Interrompa quando quiser:", text: "Se o Gemini falar demais, diga apenas 'Espera, deixa-me terminar' ou comece simplesmente a falar por cima." },
        { title: "É uma conversa:", text: "Trate-o como uma pessoa. Pode pedir para repetir, resumir ou mudar de assunto." }
      ],
      stages: {
        extract: { label: "A extrair transcrição...", sub: "A limpar ruído de conversa" },
        analyze: { label: "Análise Profunda de Contexto...", sub: "A identificar tópicos estratégicos" },
        structure: { label: "A gerar Resumo Executivo...", sub: "A formatar para uso profissional" },
        finalize: { label: "A finalizar Documento...", sub: "A guardar no seu cérebro digital" }
      }
    },
    history: {
      title: "Os Meus Documentos",
      searchPlaceholder: "Pesquisar por título, insight...",
      btnBackup: "Backup",
      btnRestore: "Restaurar",
      btnRestoreBackup: "Restaurar Backup",
      emptyState: "Sem documentos ainda.",
      emptyStateDesc: "Carregue um ficheiro de áudio para gerar a sua primeira transcrição.",
      noMatches: "Sem resultados para",
      clearSearch: "Limpar pesquisa",
      cardDelete: "Eliminar",
      cardOpen: "Abrir",
      deleteConfirmTitle: "Eliminar Documento?",
      deleteConfirmDesc: "Tem a certeza? Esta ação é permanente.",
      deleteConfirmCancel: "Cancelar",
      deleteConfirmYes: "Sim, Eliminar",
      restoreSuccess: (count: number) => `Restaurados ${count} documentos.`,
      restoreError: "Erro ao ler ficheiro de backup.",
      restoreInvalid: "Ficheiro de backup inválido."
    },
    viewer: {
      btnBack: "Voltar",
      btnEdit: "Editar",
      btnSave: "Guardar",
      btnExport: "Exportar",
      exportGoogleDocs: "Copiar para Google Docs",
      exportHtml: "Descarregar Ficheiro HTML",
      exportDialogue: "Copiar Apenas Diálogo",
      browserUnsupported: "Navegador não suportado",
      dialogueCopied: "Diálogo copiado!",
      exportSuccess: "Documento completo copiado para o Google Docs!",
      analysisLabel: "Analisar",
      explainLabel: "Explicar",
      summarizeLabel: "Resumir",
      labels: {
        summary: "Resumo Executivo",
        topics: "Principais Tópicos",
        transcription: "Transcrição Completa",
        dialogue: "Histórico do Assistente",
        generated: "Gerado por DeepScribe",
        research: "Pesquisa e Elaboração",
        title: "Documento de Transcrição"
      },
      chatPlaceholder: "Faça uma pergunta...",
      chatInitial: "Olá! Pergunte-me qualquer coisa sobre este documento."
    },
    settings: {
      title: "Configuração do Sistema",
      adminTitle: "Ativação de Administrador",
      adminDesc: "Insira o seu email de administrador registado para desbloquear o Estúdio de Marketing e ferramentas globais permanentemente.",
      adminPlaceholder: "Insira identificador de administrador...",
      adminVerify: "Verificar",
      labelTranscription: "Instruções de Transcrição e Resumo",
      labelEnrichment: "Modelo de Enriquecimento de Tópicos",
      labelLive: "Persona de Conversa em Direto",
      adminUnlocked: "Estúdio de Marketing Desbloqueado",
      adminUnlockedDesc: "Acesso permanente confirmado para",
      adminDeactivate: "Desativar Modo Admin",
      adminConfirmDeactivate: "Isto irá ocultar o Estúdio de Marketing. Continuar?",
      adminSuccess: "Modo Admin ativado permanentemente para este navegador.",
      adminInvalid: "Chave de identificação inválida.",
      btnSave: "Guardar Configuração",
      btnSaved: "Guardado!"
    },
    marketing: {
      title: "Estúdio de Marketing",
      adminVerified: "Admin Verificado:",
      tabs: {
        analytics: "Verificador de Sinais",
        social: "Fábrica de Conteúdo",
        images: "Motor de Ativos",
        branding: "Identidade Visual"
      },
      analytics: {
        title: "Fluxo de Medição",
        diagnosticMic: "Capacidade de Voz",
        diagnosticKey: "Chave do Motor IA",
        diagnosticStorage: "Armazenamento Local",
        pulseLabel: "Pulso de Sinal Ativo",
        btnTest: "TESTAR FLUXO DE SINAIS",
        btnControl: "Abrir Controlo GA4"
      },
      images: {
        accordionTitle: "Acordeão de Prompts",
        clearBtn: "Limpar",
        btnGenerate: "GERAR ATIVO",
        statusGenerating: "A sintetizar...",
        previewTitle: "Pré-visualização do Ativo",
        previewDesc: "Os seus visuais estratégicos aparecerão aqui."
      }
    },
    legal: {
      title: "Legal, Privacidade e Propriedade",
      subtitle: "Termos de utilização, responsabilidade e direitos de propriedade intelectual.",
      ownershipTitle: "Propriedade e Contacto",
      ownershipDesc1: "O DeepScribe é uma ferramenta proprietária desenvolvida e detida pela RF Strategy.",
      ownershipDesc2: "Fornecemos esta ferramenta à comunidade para promover um melhor pensamento e produtividade. Se tiver sugestões ou feedback, adoraríamos ouvir a sua opinião.",
      contactLabel: "Contacte-nos em:",
      disclaimerTitle: "Isenção de Garantias",
      disclaimerBold: "O SOFTWARE É FORNECIDO 'TAL COMO ESTÁ', SEM GARANTIAS DE QUALQUER TIPO.",
      disclaimerPoint1: "Tecnologia Experimental: Esta aplicação depende de IA (Google Gemini). Modelos de IA podem cometer erros. Transcrições e pesquisas podem conter imprecisões.",
      disclaimerPoint2: "Sem Aconselhamento Profissional: O conteúdo gerado é apenas para fins informativos. Não constitui aconselhamento jurídico, médico ou financeiro.",
      privacyTitle: "Política de Privacidade",
      privacyDesc: "A sua privacidade é fundamental. A RF Strategy não recolhe, armazena ou tem acesso aos seus dados pessoais ou gravações áudio.",
      privacyPoint1: "Armazenamento Local: Todos os documentos são guardados localmente no navegador do seu dispositivo.",
      privacyPoint2: "Processamento de Dados: Os dados são enviados diretamente para a Google via API Gemini. Isto é regido pela Política de Privacidade da Google.",
      liabilityTitle: "Limitação de Responsabilidade",
      liabilityDesc1: "Em nenhum caso a RF Strategy será responsável por qualquer reclamação ou danos resultantes do uso do software.",
      liabilityDesc2: "Perda de Dados: É responsável por fazer cópias de segurança (backup) dos seus dados usando a funcionalidade fornecida.",
      liabilityDesc3: "Custos de API: É responsável por quaisquer custos associados às chaves do Google AI Studio que fornecer."
    },
    help: {
      title: "Guia de Mestria DeepScribe",
      subtitle: "Inteligência estratégica a partir de notas de voz, explicada de forma simples.",
      goldenPath: {
        tag: "O Caminho Dourado em 4 Passos",
        steps: [
          { title: "Capturar", text: "Grave uma nota de voz ou use a Sessão em Direto para brainstorming com IA." },
          { title: "Estruturar", text: "Carregue o áudio. O DeepScribe cria um resumo executivo automático." },
          { title: "Enriquecer", text: "A IA faz pesquisa na web, separando fontes Recentes e Históricas." },
          { title: "Discutir", text: "Use o Assistente para desafiar ideias ou extrair dados específicos." }
        ]
      },
      science: {
        title: "A Metodologia DeepScribe",
        subtitle: "A Ciência de Pensar Melhor.",
        intro: "O DeepScribe não é apenas uma ferramenta de transcrição; é uma arquitetura cognitiva concebida para maximizar a sua produção estratégica, aproveitando a forma como o cérebro humano realmente processa as ideias.",
        p1: {
          title: "1. A Faísca do Movimento (Estudo de Stanford)",
          text: "Um estudo marcante da Universidade de Stanford (Oppezzo & Schwartz, 2014) provou que caminhar aumenta a produção criativa numa média de 60%. O movimento físico desencadeia um estado de 'fascinação suave' que permite à mente subconsciente preencher lacunas neurais que permanecem fechadas enquanto se está sentado a uma secretária."
        },
        p2: {
          title: "2. Descarga Cognitiva",
          text: "A 'Memória de Trabalho' humana é limitada. Ao capturar pensamentos instantaneamente via voz, está a realizar uma 'Descarga Cognitiva'. Isto limpa a sua RAM mental, permitindo que o seu córtex pré-frontal se foque na síntese de novos padrões, em vez de simplesmente tentar recordar os antigos."
        },
        p3: {
          title: "3. O Efeito de Incubação",
          text: "Os avanços acontecem frequentemente quando paramos de pensar ativamente num problema. Ao gravar o seu 'caos' e deixar o DeepScribe estruturá-lo mais tarde, aproveita o Efeito de Incubação — permitindo que a sua mente trabalhe na solução em segundo plano enquanto o sistema trata do trabalho pesado da organização."
        },
        conclusion: "O DeepScribe transforma as suas ideias desorganizadas em ativos profissionais, garantindo que os seus pensamentos mais valiosos nunca se percam no 'vazio das notas de voz'."
      },
      strategic: {
        title: "Inteligência Estratégica",
        enrichment: { title: "Camadas de Enriquecimento Web", text: "Cada tópico é cruzado com a web em tempo real. As fontes são divididas em Recentes e Históricas." },
        multilingual: { title: "Domínio Multilingue", text: "O sistema deteta línguas automaticamente. Pode mudar a língua de ditado no Chat." }
      },
      live: {
        title: "Dominar Conversas em Direto",
        directing: { title: "Orientar a IA", text: "Dê ordens verbais: 'Gemini, apenas ouve durante uns minutos'." },
        interruptions: { title: "Lidar com Interrupções", text: "Diga 'Espera' ou 'Deixa-me terminar'. A IA está treinada para parar logo." }
      },
      powerUser: {
        title: "Ferramentas Avançadas",
        selection: { title: "Menu de Seleção Inteligente", text: "Sublinhe texto para Analisar, Explicar ou Resumir instantaneamente." },
        dictation: { title: "Ondas de Voz", text: "Clique no ícone do microfone para ditado contínuo e inteligente." }
      },
      costs: {
        title: "Custos, Limites e Privacidade",
        text: "O DeepScribe funciona no Escalão Gratuito do Google Gemini. Atualmente, isto inclui: 15 pedidos/min, 1.500 pedidos/dia e 1 milhão de tokens/min (aprox. 5 horas de áudio). Isto é mais do que suficiente para uma utilização profissional intensiva sem quaisquer custos."
      },
      moreHelp: "Precisa de mais ajuda?",
      moreHelpDesc: "O DeepScribe é mantido pela RF Strategy para promover um melhor pensamento.",
      btnFeedback: "Feedback e Suporte"
    }
  }
};
