export interface ArticleSection {
  id: string
  title: string
  content: string[]
}

export interface Article {
  slug: string
  title: string
  description: string
  excerpt: string
  category: string
  publishedAt: string
  readingMinutes: number
  sections: ArticleSection[]
  related: string[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'quanto-custa-completar-album-copa-2026',
    title: 'Quanto custa completar o álbum da Copa do Mundo 2026?',
    description:
      'Entenda a matemática por trás de completar o álbum da Copa 2026: por que comprar pacotinho até o fim sai caro, quanto a troca economiza e como planejar seu orçamento.',
    excerpt:
      'A conta de completar o álbum só comprando pacotinho assusta. Veja por que isso acontece e como a troca derruba o custo final.',
    category: 'Coleção',
    publishedAt: '2026-05-20',
    readingMinutes: 7,
    sections: [
      {
        id: 'por-que-caro',
        title: 'Por que completar só comprando pacotinho sai tão caro',
        content: [
          'A pergunta que todo colecionador faz é simples: quanto vou gastar para completar o álbum? A resposta incomoda, e o motivo é matemático. Cada pacotinho traz figurinhas sorteadas aleatoriamente. No começo, quase tudo é novidade — você cola página após página rapidamente. Mas conforme o álbum enche, a chance de o próximo pacote trazer justamente uma das figurinhas que ainda faltam despenca.',
          'É o chamado "problema do colecionador". As últimas figurinhas são as mais difíceis: quando faltam só 20 ou 30 números, a maioria das figurinhas que você abre é repetida. Você continua gastando, mas o álbum quase não avança. Por isso, o custo de completar 90% do álbum é uma fração do custo de completar os últimos 10% apenas comprando pacote.',
        ],
      },
      {
        id: 'a-conta',
        title: 'Fazendo a conta de forma realista',
        content: [
          'Para estimar seu gasto, você precisa de três números: quantas figurinhas o álbum tem no total, quantas vêm em cada pacote e o preço do pacote na sua região. Esses valores mudam de edição para edição e de país para país, então confirme os números atuais na banca ou no site oficial da Panini antes de fazer sua conta.',
          'Como exemplo ilustrativo: imagine um álbum com cerca de 700 figurinhas, pacotes com 5 figurinhas cada. Só para preencher o álbum "no papel" seriam 140 pacotes — mas isso assume zero repetidas, o que nunca acontece. Na prática, por causa das repetidas, costuma-se gastar várias vezes esse número de pacotes para fechar tudo sozinho. É aí que a conta vira centenas de reais.',
          'A lição não é desistir: é entender que existe um ponto de virada. Até certo momento, comprar pacote é eficiente. Depois desse ponto, cada figurinha nova que falta custa caro demais por pacote — e a troca passa a ser o caminho mais inteligente.',
        ],
      },
      {
        id: 'troca-economiza',
        title: 'Quanto a troca realmente economiza',
        content: [
          'A troca resolve exatamente o problema das últimas figurinhas. Suas repetidas, que não têm valor nenhum coladas no álbum, viram moeda. Você troca o que sobra pelo que falta numa relação que pode ser de um para um — eliminando completamente o custo aleatório do pacote para aquelas peças finais.',
          'Na prática, colecionadores que combinam compra de pacote no começo com troca na reta final gastam uma fração do que gastariam só no pacote. Cada figurinha trocada é uma figurinha que você não precisou "caçar" abrindo dezenas de pacotes.',
        ],
      },
      {
        id: 'planejar',
        title: 'Como planejar seu orçamento',
        content: [
          'Defina um teto de gasto mensal em pacotes e respeite. Use a fase inicial (quando o álbum enche rápido) para comprar, e comece a separar as repetidas desde o primeiro dia — elas são seu capital de troca.',
          'Quando perceber que a maioria dos pacotes está vindo repetida, pare de comprar por impulso e foque em trocar. É o momento de marcar o que falta numa plataforma como o trocai e encontrar quem tem exatamente esses números na sua cidade.',
        ],
      },
    ],
    related: ['figurinhas-mais-raras-album-copa-2026', 'onde-trocar-figurinhas', 'como-organizar-figurinhas-repetidas'],
  },
  {
    slug: 'figurinhas-mais-raras-album-copa-2026',
    title: 'As figurinhas mais raras e difíceis do álbum da Copa 2026',
    description:
      'Quais figurinhas são realmente raras na Copa 2026, por que algumas valem mais nas trocas e como reconhecer as peças mais disputadas do álbum.',
    excerpt:
      'Nem toda figurinha vale o mesmo. Entenda o que torna uma peça rara e quais costumam ser as mais disputadas nas trocas.',
    category: 'Coleção',
    publishedAt: '2026-05-22',
    readingMinutes: 6,
    sections: [
      {
        id: 'o-que-e-raro',
        title: 'O que torna uma figurinha "rara"',
        content: [
          'Raridade no mundo das figurinhas tem dois lados: a raridade de fabricação (quantas existem) e a raridade de demanda (quantas pessoas querem). Uma figurinha pode ser difícil de achar simplesmente porque foi impressa em menor quantidade, ou pode ser muito procurada porque é de um jogador famoso — e às vezes as duas coisas se somam.',
          'Na prática das trocas, o que importa é a combinação. Uma figurinha comum de um craque mundialmente conhecido pode ser mais "valiosa" numa troca do que uma figurinha tecnicamente mais escassa de um jogador pouco conhecido, simplesmente porque muito mais gente a quer.',
        ],
      },
      {
        id: 'tipos-disputados',
        title: 'Os tipos de figurinha mais disputados',
        content: [
          'Figurinhas especiais — as douradas, brilhantes, holográficas ou com acabamento metálico — costumam ser as mais cobiçadas. Elas geralmente são distribuídas com menor frequência nos pacotes e têm apelo visual, o que aumenta a procura.',
          'Escudos e logos de seleções, figurinhas de craques de renome (os "rostos" da competição) e peças de edição limitada também entram na lista das mais difíceis. Em toda Copa há ainda aquelas figurinhas que, por motivos de distribuição regional, simplesmente aparecem menos em algumas cidades — virando "lendas urbanas" entre os colecionadores locais.',
        ],
      },
      {
        id: 'como-saber',
        title: 'Como descobrir quais são as raras da sua edição',
        content: [
          'A própria Panini costuma indicar quais figurinhas são especiais pelo acabamento e pela numeração. Comunidades de colecionadores (grupos, fóruns e redes sociais) rapidamente identificam quais números estão "sumidos" em cada região — vale acompanhar.',
          'Uma dica prática: observe o que mais aparece nas listas de "procuro" das pessoas. Se um número aparece repetidamente como faltante para muita gente e raramente como repetida, ele é, na prática, raro na sua área — independentemente do que diz a tabela oficial.',
        ],
      },
      {
        id: 'estrategia',
        title: 'Estratégia: não entregue uma rara por uma comum',
        content: [
          'Saber o que é raro protege você na hora da troca. Uma figurinha especial pode valer duas ou três comuns numa negociação justa. Se você tem uma rara repetida, ela é um trunfo: use-a para destravar várias figurinhas que faltam, não a entregue por qualquer coisa.',
          'Ao mesmo tempo, seja justo. A melhor comunidade de trocas é aquela em que os dois lados saem satisfeitos. Reconhecer o valor das peças — para os dois lados — é o que mantém as trocas acontecendo.',
        ],
      },
    ],
    related: ['figurinhas-legendarias-douradas', 'quanto-custa-completar-album-copa-2026', 'onde-trocar-figurinhas'],
  },
  {
    slug: 'figurinhas-legendarias-douradas',
    title: 'Figurinhas legendárias e douradas: o que são e como conseguir',
    description:
      'O que são as figurinhas douradas, legendárias e brilhantes do álbum da Copa, por que elas são tão procuradas e as melhores formas de consegui-las.',
    excerpt:
      'As douradas e legendárias são o sonho de todo colecionador. Veja o que são, por que somem dos pacotes e como conquistá-las.',
    category: 'Coleção',
    publishedAt: '2026-05-25',
    readingMinutes: 6,
    sections: [
      {
        id: 'o-que-sao',
        title: 'O que são as figurinhas especiais',
        content: [
          'Em quase toda edição de álbum da Copa existem figurinhas com acabamento diferente do comum: fundo dourado, efeito holográfico, brilho metálico ou texturas especiais. São as figurinhas que reservamos para o fim, as que dão aquele orgulho quando finalmente colam no álbum.',
          'Elas existem por dois motivos: valorizam a coleção (dão ao álbum um "topo" a ser conquistado) e incentivam a compra continuada, já que aparecem com menos frequência nos pacotes. Algumas edições trazem também figurinhas "legendárias" dedicadas a ídolos históricos do futebol, que viram peças de desejo.',
        ],
      },
      {
        id: 'por-que-dificeis',
        title: 'Por que elas são tão difíceis de achar',
        content: [
          'A escassez é proposital. As figurinhas especiais costumam ter uma taxa de aparição muito menor que as comuns — você pode abrir dezenas de pacotes sem ver nenhuma. Isso cria a percepção (real) de que são raras e alimenta a procura.',
          'Como muita gente quer e poucas circulam, elas se tornam o item mais cobiçado nas trocas. É comum que uma dourada repetida "valha" várias figurinhas comuns numa negociação.',
        ],
      },
      {
        id: 'como-conseguir',
        title: 'As melhores formas de conseguir as douradas',
        content: [
          'Comprar muito pacote na esperança de tirar uma dourada é o caminho mais caro e incerto. As três estratégias que realmente funcionam são: trocar (oferecer suas repetidas especiais ou um conjunto de comuns por uma dourada que falta), acompanhar comunidades de colecionadores onde elas circulam, e ter paciência — guardar suas repetidas especiais para usá-las como moeda forte.',
          'Numa plataforma de trocas, marque exatamente quais especiais faltam para você. Assim, quem tem uma repetida dela e precisa do que você tem encontra você diretamente, sem você precisar caçar pacote por pacote.',
        ],
      },
      {
        id: 'cuidado-golpes',
        title: 'Cuidado com golpes e falsificações',
        content: [
          'Justamente por serem valiosas, as figurinhas especiais são as mais falsificadas. Desconfie de douradas "soltas" vendidas muito abaixo do esperado e aprenda a reconhecer os sinais de uma figurinha original — acabamento, qualidade de impressão e numeração corretos.',
          'Na hora de trocar uma peça especial, prefira encontros em local público e confira a figurinha com calma antes de fechar. Se algo parecer estranho, não tem problema recusar a troca.',
        ],
      },
    ],
    related: ['figurinhas-mais-raras-album-copa-2026', 'como-identificar-figurinhas-falsas', 'onde-trocar-figurinhas'],
  },
  {
    slug: 'onde-trocar-figurinhas',
    title: 'Onde trocar figurinhas: app, grupos de WhatsApp, bancas e eventos',
    description:
      'Comparamos as principais formas de trocar figurinhas da Copa 2026 — aplicativos, grupos de WhatsApp, bancas e eventos — com as vantagens e desvantagens de cada uma.',
    excerpt:
      'App, grupo de WhatsApp, banca ou evento? Comparamos cada forma de trocar figurinhas para você escolher a melhor.',
    category: 'Trocas',
    publishedAt: '2026-05-28',
    readingMinutes: 7,
    sections: [
      {
        id: 'apps',
        title: 'Aplicativos e plataformas de troca',
        content: [
          'A grande vantagem de uma plataforma dedicada é o cruzamento automático. Você marca o que tem, o que falta e o que está repetido, e o sistema encontra sozinho quem é o "par perfeito" para você: alguém que precisa do que sobra para você e tem o que falta. Não precisa publicar listas nem ficar conferindo número por número manualmente.',
          'É também a forma que escala melhor: quanto mais gente usa, mais matches aparecem. A desvantagem é depender de haver outros colecionadores cadastrados na sua região — por isso plataformas que filtram por cidade e distância, como o trocai, fazem diferença.',
        ],
      },
      {
        id: 'whatsapp',
        title: 'Grupos de WhatsApp e Telegram',
        content: [
          'Os grupos são populares porque quase todo mundo já usa o WhatsApp. Você entra, publica sua lista de "tenho" e "preciso" e espera alguém responder. Funcionam bem para comunidades pequenas e já estabelecidas, como a turma da escola ou do bairro.',
          'A desvantagem é o trabalho manual: as listas se perdem no meio das mensagens, ninguém cruza as coleções por você e é fácil uma troca combinada se desencontrar. Em grupos grandes, vira uma enxurrada de mensagens difícil de acompanhar.',
        ],
      },
      {
        id: 'bancas',
        title: 'Bancas e papelarias',
        content: [
          'Muitas bancas e papelarias viram pontos informais de troca durante a Copa, às vezes com caixinhas de repetidas para os clientes. É ótimo para trocas rápidas e presenciais, sem combinar nada online.',
          'O alcance, porém, é limitado ao fluxo de pessoas daquele local e ao acaso de alguém ter justamente a figurinha que você precisa naquele momento. Funciona como complemento, não como estratégia principal.',
        ],
      },
      {
        id: 'eventos',
        title: 'Eventos e encontros de colecionadores',
        content: [
          'Encontros organizados — em escolas, shoppings, clubes ou eventos de colecionadores — concentram muita gente trocando ao mesmo tempo. É a forma mais divertida e social, e rende muitas trocas de uma vez.',
          'A limitação é a frequência: eventos acontecem de tempos em tempos, não todo dia. O ideal é usá-los como mutirão pontual e manter as trocas do dia a dia por um canal mais constante.',
        ],
      },
      {
        id: 'conclusao',
        title: 'Qual escolher?',
        content: [
          'Não precisa escolher só uma. A combinação que mais funciona: use uma plataforma para encontrar matches certeiros perto de você no dia a dia, participe de um grupo da sua comunidade para as trocas mais próximas e aproveite eventos como mutirões. As bancas entram para aquelas trocas de oportunidade.',
          'Seja qual for o canal, os princípios de uma boa troca são os mesmos: combine os detalhes antes, conheça o valor das peças e priorize segurança nos encontros presenciais.',
        ],
      },
    ],
    related: ['seguranca-trocas-presenciais', 'quanto-custa-completar-album-copa-2026', 'como-organizar-figurinhas-repetidas'],
  },
  {
    slug: 'como-identificar-figurinhas-falsas',
    title: 'Como identificar figurinhas falsas ou piratas',
    description:
      'Aprenda a reconhecer figurinhas falsas da Copa 2026 — qualidade de impressão, brilho, numeração e adesivo — e como se proteger de golpes nas trocas e compras.',
    excerpt:
      'Figurinhas piratas circulam, especialmente as douradas. Veja os sinais para reconhecer uma falsa e não cair em golpe.',
    category: 'Segurança',
    publishedAt: '2026-06-01',
    readingMinutes: 6,
    sections: [
      {
        id: 'por-que-existem',
        title: 'Por que existem figurinhas falsas',
        content: [
          'Onde há demanda e valor, aparecem falsificações. As figurinhas piratas miram principalmente as peças mais procuradas — douradas, especiais e de craques famosos — porque é nelas que o falsificador ganha mais. Quanto mais cobiçada a figurinha, maior a chance de existir uma versão falsa circulando.',
          'A boa notícia é que, com atenção a alguns detalhes, dá para reconhecer a maioria das falsificações sem precisar ser especialista.',
        ],
      },
      {
        id: 'sinais',
        title: 'Os sinais de uma figurinha falsa',
        content: [
          'Qualidade de impressão: figurinhas originais têm cores nítidas e bem alinhadas. Falsas costumam ter cores borradas, desbotadas ou com pontos visíveis quando você olha de perto.',
          'Acabamento das especiais: o brilho dourado ou holográfico das originais é uniforme e bem feito. Nas falsas, o efeito costuma ser opaco, "plastificado" ou irregular.',
          'Numeração e fontes: confira se a numeração, o tipo de letra e os logos batem com os das figurinhas que você sabe que são originais. Erros de grafia, fontes diferentes ou números mal posicionados são bandeira vermelha.',
          'Papel e adesivo: o papel e a cola das originais têm um padrão. Figurinhas falsas frequentemente usam papel mais fino, brilhante demais ou com adesivo de qualidade diferente.',
        ],
      },
      {
        id: 'protecao',
        title: 'Como se proteger nas trocas e compras',
        content: [
          'Desconfie de preços bons demais, especialmente em lotes de douradas ou especiais vendidos avulsos e baratos. Falsificadores costumam vender em volume e abaixo do mercado.',
          'Compre pacotes lacrados de fontes confiáveis (bancas, papelarias, lojas oficiais). Para trocas, prefira encontros presenciais em local público, onde você pode examinar a figurinha com calma antes de fechar.',
          'Se você está recebendo uma figurinha cara numa troca, compare lado a lado com uma original que você já tenha. A diferença, quando existe, costuma saltar aos olhos quando as duas estão juntas.',
        ],
      },
      {
        id: 'o-que-fazer',
        title: 'O que fazer se receber uma falsa',
        content: [
          'Se desconfiar durante o encontro, não feche a troca — você não é obrigado a aceitar. Recusar educadamente é melhor do que levar uma peça falsa para casa.',
          'Se já tiver fechado e descobrir depois, registre quem fez a troca. Em plataformas com avaliação, deixar um aviso ajuda a comunidade a se proteger. A reputação é o que mantém as trocas seguras para todo mundo.',
        ],
      },
    ],
    related: ['figurinhas-legendarias-douradas', 'seguranca-trocas-presenciais', 'figurinhas-mais-raras-album-copa-2026'],
  },
  {
    slug: 'como-organizar-figurinhas-repetidas',
    title: 'Como organizar e proteger suas figurinhas repetidas',
    description:
      'Um método simples para organizar suas figurinhas repetidas, mantê-las em bom estado e transformá-las na sua melhor moeda de troca.',
    excerpt:
      'Suas repetidas são dinheiro parado. Veja como organizá-las e protegê-las para fechar trocas mais rápido e melhores.',
    category: 'Coleção',
    publishedAt: '2026-06-04',
    readingMinutes: 5,
    sections: [
      {
        id: 'por-que-importa',
        title: 'Por que organizar as repetidas muda tudo',
        content: [
          'Figurinha repetida colada na carteira ou jogada no fundo da mochila é dinheiro parado — e que ainda se estraga. Quem organiza as repetidas fecha trocas mais rápido, evita perder peças e consegue avaliar na hora se uma troca é boa.',
          'A diferença entre o colecionador que demora meses e o que completa rápido raramente é sorte: é organização. Saber exatamente o que você tem para oferecer é metade de uma boa troca.',
        ],
      },
      {
        id: 'metodo',
        title: 'Um método simples de organização',
        content: [
          'Separe em três grupos desde o início: as que já estão no álbum, as que faltam (anote os números) e as repetidas. Mantenha as repetidas em ordem numérica — assim, quando alguém pedir o número 247, você acha em segundos.',
          'Para guardar, use um porta-figurinhas, um envelope plástico ou uma pasta com divisórias. O importante é que fiquem planas, juntas e em ordem. Separe ainda as especiais (douradas e brilhantes) num bolso à parte: elas são suas peças mais valiosas e merecem cuidado extra.',
        ],
      },
      {
        id: 'proteger',
        title: 'Como manter as figurinhas em bom estado',
        content: [
          'Figurinha dobrada, rasgada ou com marca de caneta perde valor e dificilmente é aceita numa troca. Evite deixá-las soltas, expostas ao sol ou à umidade. O plástico protege contra dobras e líquidos.',
          'Cuidado especial com figurinhas que já foram coladas e retiradas: a cola atrás "mata" a aderência e marca a peça. Na dúvida, olhe contra a luz — marcas de cola aparecem. Mantenha suas repetidas sempre como vieram do pacote.',
        ],
      },
      {
        id: 'moeda',
        title: 'Transformando repetidas em trocas',
        content: [
          'Com as repetidas organizadas e a lista do que falta em mãos, o passo final é encontrar quem combina com você. Numa plataforma de trocas, basta marcar tudo uma vez e o sistema mostra quem tem o que você precisa e precisa do que você tem.',
          'Atualize sua lista sempre que abrir pacotes novos. Quanto mais atual estiver o que você tem e o que falta, melhores e mais rápidos serão os matches.',
        ],
      },
    ],
    related: ['quanto-custa-completar-album-copa-2026', 'onde-trocar-figurinhas', 'guia-iniciantes-colecao-copa-2026'],
  },
  {
    slug: 'guia-iniciantes-colecao-copa-2026',
    title: 'Guia para iniciantes: começando sua coleção da Copa 2026',
    description:
      'Está começando a colecionar figurinhas da Copa 2026? Este guia cobre o básico: álbum, pacotes, como marcar o que falta e os primeiros passos para trocar.',
    excerpt:
      'Nunca colecionou figurinhas? Comece por aqui: álbum, pacotes, organização e os primeiros passos para trocar com segurança.',
    category: 'Coleção',
    publishedAt: '2026-06-08',
    readingMinutes: 6,
    sections: [
      {
        id: 'comecar',
        title: 'Por onde começar',
        content: [
          'O ponto de partida é o álbum, vendido em bancas, papelarias e lojas. Ele traz os espaços numerados para cada figurinha e geralmente vem com alguns pacotes de brinde. Não precisa comprar tudo de uma vez: comece com o álbum e alguns pacotes e vá no seu ritmo.',
          'Colecionar é um hobby, não uma corrida. Defina desde o início quanto pretende gastar por mês e encare o álbum como um projeto de semanas. Isso evita gastar demais por impulso logo no começo.',
        ],
      },
      {
        id: 'pacotes',
        title: 'Como funcionam os pacotes',
        content: [
          'Cada pacote traz um punhado de figurinhas sorteadas aleatoriamente. No início, quase tudo é novidade e o álbum enche rápido — é a parte mais gostosa. Conforme você avança, começam a aparecer as repetidas: figurinhas que você já tem.',
          'As repetidas não são lixo: elas são sua moeda de troca. Por isso, separe-as desde o primeiro pacote. Quem guarda e organiza as repetidas desde o começo larga na frente na hora de completar.',
        ],
      },
      {
        id: 'marcar',
        title: 'Marcando o que você tem e o que falta',
        content: [
          'Depois de colar as novas, anote em algum lugar o que ainda falta — os números dos espaços vazios. Pode ser num papel, no bloco de notas do celular ou num app de coleção. Ter essa lista à mão é o que permite trocar sem ficar folheando o álbum inteiro toda vez.',
          'Mantenha também a lista das suas repetidas. Com as duas listas (falta / repetida) você está pronto para a próxima fase: trocar.',
        ],
      },
      {
        id: 'primeiras-trocas',
        title: 'Suas primeiras trocas',
        content: [
          'Comece trocando com quem você já conhece — colegas de escola, amigos, vizinhos. É a forma mais simples e segura de aprender como funciona. Combine sempre o que vai entrar de cada lado antes de fechar.',
          'Quando quiser ir além do seu círculo, uma plataforma de troca ajuda a encontrar colecionadores próximos que têm o que você precisa. O trocai, por exemplo, cruza sua lista com a de outras pessoas da sua cidade e mostra os melhores matches. Para trocas com gente nova, prefira sempre locais públicos e movimentados.',
        ],
      },
    ],
    related: ['como-organizar-figurinhas-repetidas', 'quanto-custa-completar-album-copa-2026', 'seguranca-trocas-presenciais'],
  },
  {
    slug: 'seguranca-trocas-presenciais',
    title: 'Segurança em trocas presenciais: o guia completo',
    description:
      'Tudo que você precisa saber para fazer trocas de figurinhas presenciais com segurança: onde marcar, como combinar, o que conferir e cuidados com crianças.',
    excerpt:
      'Trocar pessoalmente é parte da diversão — desde que com cuidado. O guia completo de segurança para encontros de troca.',
    category: 'Segurança',
    publishedAt: '2026-06-12',
    readingMinutes: 6,
    sections: [
      {
        id: 'local',
        title: 'Escolha bem o local do encontro',
        content: [
          'A regra de ouro é simples: marque sempre em local público e movimentado. Shoppings, praças com gente, cafés, a entrada da escola ou da banca são ótimas opções. Lugares com câmeras e fluxo de pessoas são naturalmente mais seguros.',
          'Evite locais isolados, residências de desconhecidos e horários noturnos, especialmente na primeira troca com alguém que você não conhece. Se a outra pessoa insistir em um lugar estranho, prefira remarcar ou cancelar.',
        ],
      },
      {
        id: 'combinar',
        title: 'Combine tudo antes de sair de casa',
        content: [
          'Antes do encontro, deixe claro por mensagem: quais figurinhas vão entrar de cada lado, em que quantidade e em que estado. Combinar por escrito evita mal-entendidos e dá a você um registro do que foi acordado.',
          'Confirme dia, horário e local com antecedência e avise alguém de confiança para onde você vai — vale tanto para adultos quanto, principalmente, para crianças e adolescentes.',
        ],
      },
      {
        id: 'conferir',
        title: 'O que conferir na hora da troca',
        content: [
          'Confira cada figurinha que vai receber: se é o número certo, se está em bom estado (sem dobras, rasuras ou marcas de cola) e, no caso das especiais, se é original. Olhar contra a luz ajuda a flagrar marcas de cola e impressões suspeitas.',
          'Não tenha pressa nem vergonha de examinar com calma. Uma troca justa é aquela em que os dois lados conferem e concordam. Se algo não bater com o combinado, você pode renegociar ou desistir ali mesmo.',
        ],
      },
      {
        id: 'criancas',
        title: 'Cuidados especiais com crianças',
        content: [
          'Boa parte dos colecionadores são crianças e adolescentes. Para elas, a recomendação é firme: trocas presenciais sempre com acompanhamento de um adulto, em locais conhecidos e públicos.',
          'Pais e responsáveis podem ajudar definindo regras claras — onde pode trocar, com quem e em que horários — e acompanhando os encontros com pessoas novas. Assim o hobby continua sendo o que deve ser: diversão.',
        ],
      },
      {
        id: 'reputacao',
        title: 'Use a reputação a seu favor',
        content: [
          'Em plataformas com avaliação e histórico, dá para ver com quem você está negociando antes de marcar. Prefira pessoas com trocas bem avaliadas e, depois de cada troca, deixe sua própria avaliação — honesta.',
          'Esse sistema de reputação é o que constrói uma comunidade confiável. Quanto mais gente avalia, mais fácil fica identificar os bons colecionadores e evitar problemas.',
        ],
      },
    ],
    related: ['como-identificar-figurinhas-falsas', 'onde-trocar-figurinhas', 'guia-iniciantes-colecao-copa-2026'],
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}

export function getRelated(slug: string): Article[] {
  const article = getArticle(slug)
  if (!article) return []
  return article.related
    .map(getArticle)
    .filter((a): a is Article => Boolean(a))
}
