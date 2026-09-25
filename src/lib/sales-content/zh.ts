/**
 * Sotuv kontenti — XITOY tili.
 *
 * Narxlar o'zbekchadagi bilan bir xil (so'mda). Faqat matn tarjima qilingan.
 * O'zgarish avval uz.ts da, keyin bu yerda.
 */

import type { Package, SalesContent, ServiceGroup } from './types';

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: '品牌构建',
    intro: '从命名到完整的视觉系统。每项服务都可以单独选择。',
    items: [
      {
        id: 'naming',
        name: '命名',
        price: '10 000 000',
        duration: '10 天',
        lead: '好名字是客户对您企业的第一印象。只做一次，却能受益长久。',
        deliverables: [
          '契合您业务的专业名称',
          '命名的战略依据——为什么是这个名字',
          '竞争对手分析及名称近似度核查',
          '.uz 和 .com 域名、Telegram 与 Instagram 用户名查询',
          '乌兹别克斯坦商标数据库检索',
          '3 次免费修改',
        ],
        benefit: '您为推广这个名字花的每一分钱都留在自己手里——五年后不会收到「这个名字是我们的」这样的信。',
        audience: '适合刚开办企业，或现有名称不奏效的经营者',
        note: '名字选错，之后的商标、域名和广告都要多花三倍的钱。',
        proof: {
          label: '我们创作的名称',
          items: [
            'Savod', 'Fidda', 'Shirona', 'Belif', 'Unvan', 'Parfino', 'Naf', 'Revo', 'Petron', 'Estem',
            'Zayyan', 'Mercato', 'Geonest', 'Rutera', 'Sofmir', 'Arfadel', 'Melamus', 'Polentra', 'Viton',
          ],
        },
      },
      {
        id: 'logo',
        name: '标志设计',
        price: '8 000 000',
        duration: '7 天',
        lead: '在小屏幕和大广告牌上表现一致的标志。',
        deliverables: [
          '3 个方案，选定后做到完善',
          '全部格式：AI、EPS、SVG、PDF、PNG',
          '彩色、黑白与单色版本',
          '横版、竖版与紧凑（图标）变体',
          '最小尺寸与留白规范',
        ],
        benefit: '从名片到广告牌，从头像到包装——不必每次再付钱让设计师「改一下尺寸」。',
        audience: '适合没有标志，或标志陈旧、不够现代的企业',
      },
      {
        id: 'visual-identity',
        name: '视觉识别系统',
        price: '18 000 000',
        duration: '10 天',
        lead: '标志只是一个符号。视觉识别系统让品牌在任何地方都被认出来。',
        deliverables: [
          '色彩体系（Pantone、CMYK、RGB、HEX）',
          '字体体系：标题、正文、强调',
          '图形元素与图案',
          '摄影与插图风格',
          '10 种以上应用物料：名片、信笺、信封、工装、横幅、社交媒体模板',
        ],
        benefit: '您的广告不必每月从零开始自我介绍——每一次曝光都叠加在上一次之上。预算得以累积，而不是漏进破桶。',
        audience: '适合已有标志，但在各处呈现不一致的企业',
      },
      {
        id: 'brandbook',
        name: '品牌手册',
        price: '24 000 000',
        duration: '7 天',
        lead: '品牌规范集于一册。即使换了新设计师，体系也不会乱。',
        deliverables: [
          '60 页以上的 PDF 手册',
          '标志的使用与禁用规范（附错误示例）',
          '色彩与字体的完整规格',
          '各类物料的成品版式',
          '品牌语言与沟通语调（tone of voice）',
        ],
        benefit: '品牌依靠规范，而不是某个人。设计师离职、新人入职，品牌依然如一。',
        audience: '适合团队正在扩张、与多位设计师和印厂合作的企业',
        note: '与视觉识别系统一并选择时，两者会作为一个整体来打造。',
      },
    ],
  },
  {
    title: '包装',
    intro: '让顾客从货架上把您的产品拿起来的包装。',
    items: [
      {
        id: 'packaging',
        name: '包装设计（1 个 SKU）',
        price: '12 000 000',
        duration: '7 天',
        lead: '单个产品的完整包装设计——可直接交付印厂。',
        deliverables: [
          '考虑货架陈列效果的包装设计',
          '刀线图（dieline）及技术图纸',
          '3D 效果图（用于提案与电商平台）',
          '条形码、成分、保质期与标识的正确排布',
          '可直接交付印厂的文件',
        ],
        benefit: '产品自己会说话——店员无需多做解释。同时也有了提价的依据。',
        audience: '适合进入商超、电商平台或连锁渠道的生产商',
      },
      {
        id: 'packaging-extra',
        name: '每增加一个 SKU',
        price: '4 000 000 起',
        duration: '+3 天',
        lead: '第一款包装完成后，其余产品的费用更低。',
        deliverables: [
          '同一体系，并针对每款产品做适配',
          '区分口味、规格与品类的设计方案',
          '配套刀线图与印刷文件',
        ],
        benefit: '整条产品线在货架上如同一家人——买过一款的顾客也能认出其余产品。',
        audience: '适合拥有多个产品品类的生产商',
        note: '具体价格取决于包装形式的复杂程度。',
      },
    ],
  },
  {
    title: '法律保护',
    intro: '名字要真正属于您，就必须注册。这件事我们也一并承担。',
    items: [
      {
        id: 'trademark-search',
        name: '商标检索',
        price: '880 000',
        duration: '2 天',
        lead: '提前确认名称是否可用——这是最便宜的一道保险。',
        deliverables: [
          '官方数据库全面检索',
          '近似商标清单与风险等级',
          '注册成功可能性的结论',
          '所需类别由我们为您确定',
        ],
        benefit: '一天的检索，能保住您多年经营起来的名字。最便宜的保险。',
        audience: '适合已选定名称但尚未注册的经营者',
        note: '价格按单一类别计。命名服务已包含此项检索。',
        addon: { label: '每增加一个类别', price: '+440 000 苏姆' },
      },
      {
        id: 'trademark-standard',
        name: '商标注册（常规）',
        price: '5 000 000',
        duration: '7 个月',
        lead: '按常规程序办理商标注册。',
        deliverables: [
          '文件全程准备并提交',
          '正确选择注册类别',
          '全流程跟进至结束',
          '证书交到您手中',
        ],
        benefit: '名字在法律上归您所有——特许经营、出口与投标的通道随之打开。品牌成为资产。',
        audience: '适合不赶时间，但希望保护名称的经营者',
      },
      {
        id: 'trademark-express',
        name: '商标注册（加急）',
        price: '7 000 000',
        duration: '20–40 天',
        lead: '同样的工作，走加急通道。',
        deliverables: [
          '常规注册的全部工作',
          '加急审查',
          '周期由 7 个月缩短至 20–40 天',
        ],
        benefit: '当期限不等人时——约一个月而非七个月。不会因此丢掉合同。',
        audience: '适合受投标、电商平台或出口期限压力的企业',
      },
    ],
  },
];

const PACKAGES: Package[] = [
  {
    name: 'VIP',
    price: '70 000 000',
    separate: '85 000 000',
    saving: '15 000 000',
    audience: '适合进军出口、电商平台或连锁商超的生产商',
    features: ['命名', '标志设计', '视觉识别系统', '品牌手册', '商标注册', '包装（3 个 SKU）'],
    duration: '35–45 天',
  },
  {
    name: 'PREMIUM',
    price: '55 000 000',
    separate: '65 000 000',
    saving: '10 000 000',
    audience: '适合希望把品牌彻底理顺的成长型企业',
    features: ['命名', '标志设计', '视觉识别系统', '品牌手册', '商标注册'],
    duration: '30–35 天',
    featured: true,
    badge: '多数人的选择',
  },
  {
    name: '标准版',
    price: '20 000 000',
    separate: '23 000 000',
    saving: '3 000 000',
    audience: '适合刚起步、尚无品牌的企业',
    features: ['命名', '标志设计', '商标注册'],
    duration: '20–25 天',
  },
];

export const zh: SalesContent = {
  serviceGroups: SERVICE_GROUPS,
  packages: PACKAGES,
  faqs: [
    {
      q: '为什么要 800 万？Instagram 上 50 万就能做个标志。',
      a: '50 万的标志只是一张图。之后每做一个横幅、一款包装、一盒名片，您都要再付钱——因为文件不全、没有规范，每次都要重画。我们交付的标志包含全部格式、全部版本和使用规范，还附带商标检索，避免名字其实属于别人。差别不在价格，而在于之后您还要付多少。',
    },
    {
      q: '如果不满意怎么办？',
      a: '您不会一上来就看到成品。我们先提供 3 个方向，由您选定其中之一，之后才进入深化。未经您确认，不会进入下一阶段。在所选方向内也会进行修改。',
    },
    {
      q: '需要我做什么？会占用多少时间？',
      a: '开始时有一次简报——40 至 60 分钟的沟通，或以书面回答问题。之后每个阶段您查看提案并给出意见：通常 2 至 3 次，每次不超过半小时。其余由我们完成。',
    },
    {
      q: '可以分期付款吗？',
      a: '可以，分两期：签订合同时付 50%，项目交付时付 50%。即一半预付，一半在看到成果后支付。',
    },
    {
      q: '如果商标没通过呢？',
      a: '正因如此，我们在提交申请前会检索官方数据库并告知风险等级。风险高时会如实相告，并建议更换名称——我们不会明知有风险还拿您的钱去赌。',
    },
  ],
  whyUs: [
    {
      title: '合同与正规付款',
      desc: '工作以合同为起点：周期、范围与交付文件均白纸黑字写明。您面对的是法人实体，而不是随时可能消失的个人。',
    },
    {
      title: '商标注册也由我们负责',
      desc: '设计师画完标志就走了。我们会核查名称、完成注册，并把证书交到您手上——品牌在法律上归您所有。',
    },
    {
      title: '9 年，1000 多个项目',
      desc: '这里靠的是经验，而不是反复试错。哪种方案能在市场上奏效，我们心中有数。',
    },
    {
      title: '文件归您所有',
      desc: '所有源文件与规范都会交付给您。即使您不再与我们合作，品牌依然运转——不受任何人牵制。',
    },
  ],
  guarantees: [
    '合同：周期、范围与交付文件事先写明',
    '未经您确认，不进入下一阶段',
    '方案不止一个——从 3 个方向中选择',
    '命名服务含 3 次免费修改',
    '分阶段付款：看到成果再付',
  ],
  jobs: [
    {
      pain: '您的产品比竞品好，顾客却从货架上拿走了包装更好看的那一款。',
      gain: '产品自己会说话——店员无需多做解释。',
    },
    {
      pain: '您说「我们品质高」，可看起来很廉价。于是只能接受低价。',
      gain: '外观撑得起价格——您提价，客户也不会追问。',
    },
    {
      pain: '每次换一个设计师，每次换一种颜色。别人看了十次也记不住您。',
      gain: '每一次曝光都叠加在上一次之上——广告预算得以累积。',
    },
    {
      pain: '您的名称尚未注册。某天可能收到一封信：「这个名字是我们的。」',
      gain: '名字在法律上归您——特许经营、出口与投标的通道随之打开。',
    },
  ],
  processSteps: [
    { title: '简报与分析', desc: '研究您的业务、竞争对手与目标客群' },
    { title: '方案构思', desc: '提供 3 个方向，由您选定其一' },
    { title: '深化开发', desc: '对选定方向进行完善' },
    { title: '交付', desc: '全部文件与资料交到您手中' },
  ],
  priceFactors: [
    '产品品类数量（SKU）',
    '商标类别数量',
    '应用物料数量（名片、横幅、工装等）',
    '周期——加急执行加收 50%',
  ],
  ui: {
    currency: '苏姆',
    stats: { experience: '年经验', clients: '位客户', projects: '个项目' },
    payment: {
      contract: '签订合同时',
      delivery: '项目交付时',
    },
    notSure: '还不确定——需要咨询',
    eyebrows: {
      prices: '价格', task: '我们解决什么', services: '服务', process: '流程',
      factors: '影响因素', packages: '套餐', trust: '信任', difference: '差别',
      faq: '常见问题', talk: '沟通',
    },
    hero: {
      pre: '我们的价格', hi: '公开透明',
      sub: '对所有人一视同仁——我们公开行事。既不藏价格，也不藏做法。',
    },
    jobs: {
      pre: '我们真正', hi: '解决的问题',
      sub: '客户不是为了一个标志而来，而是为了在市场上被认真对待，并让自己的价格立得住脚。',
      now: '现在', withUs: '与我们合作后',
    },
    services: {
      pre: '可以', hi: '单项选择',
      sub: '不必一次全部做齐。现在需要什么就选什么——每项服务都是一份完整的工作，最后交付成品文件。',
      note: '价格仅含服务费用，官方规费另行缴纳。',
      showcase: '我们品牌手册的片段', cases: '该服务的案例',
      price: '价格', duration: '周期', cta: '提交需求',
      deliverables: '您将获得', benefit: '这能带来什么',
    },
    process: { pre: '我们如何', hi: '开展工作', paymentTitle: '付款阶段' },
    factors: { pre: '什么会影响', hi: '价格' },
    packages: {
      pre: '需要多项？套餐', hi: '更划算',
      sub: '比逐项单买更便宜，而且所有内容作为一个整体来打造。',
      separate: { pre: '单项合计', mid: '—— 节省', suf: '' },
      cta: '提交需求',
      note: '周期指设计工作。商标证书按官方程序另行核发。',
    },
    trust: { pre: '他们与我们', hi: '合作过' },
    difference: { pre: '为什么不找便宜', hi: '设计师', guaranteesTitle: '为降低您的风险' },
    faq: { pre: '常见', hi: '问题' },
    cta: {
      pre: '不确定哪个套餐', hi: '适合您？',
      sub: '20 分钟免费沟通即可告知。我们不推销——只给建议。',
      button: '预约沟通',
    },
    footnote: '价格截至 2026 年 9 月。最终价格根据项目规模确定。',
    modal: {
      title: '提交需求',
      titleDone: '谢谢',
      desc: '留下您的姓名和电话，我们会主动联系您。',
      descDone: '我们会尽快与您联系。',
      close: '关闭',
      name: '姓名',
      namePlaceholder: '您的姓名',
      phone: '电话 *',
      phonePlaceholder: '+998 90 123 45 67',
      service: '服务',
      submit: '提交',
      sending: '提交中…',
      phoneError: '请输入正确的电话号码',
      submitError: '出现错误，请重试。',
      packageSuffix: '套餐',
    },
  },
};
