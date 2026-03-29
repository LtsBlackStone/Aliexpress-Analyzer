import {
  WeChatArticle,
  TitleAnalysis,
  TopicCategory,
  InteractionStats,
  AnalysisResult,
} from '@/types/wechat';

const EMOTION_WORDS = [
  '震惊', '没想到', '竟然', '居然', '惊人',
  '紧急', '最后', '限时', '马上', '立刻',
  '揭秘', '真相', '内幕', '秘密', '独家',
  '终于', '果然', '原来如此', '太强了', '绝了',
  '必看', '重磅', '突发', '疯狂', '颠覆',
];

const QUESTION_PATTERNS = [
  /？/, /\?/, /为什么/, /如何/, /怎么/, /怎样/,
  /哪些/, /哪个/, /什么/, /多少/, /是否/, /能不能/,
];

function hasNumber(text: string): boolean {
  return /\d/.test(text);
}

function hasQuestion(text: string): boolean {
  return QUESTION_PATTERNS.some((p) => p.test(text));
}

function hasEmotion(text: string): boolean {
  return EMOTION_WORDS.some((w) => text.includes(w));
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function analyzeTitles(articles: WeChatArticle[]): TitleAnalysis {
  if (articles.length === 0) {
    return {
      avgLength: 0,
      lengthDistribution: [],
      hasNumberRate: 0,
      hasQuestionRate: 0,
      hasEmotionRate: 0,
      avgReadsWithNumber: 0,
      avgReadsWithoutNumber: 0,
      avgReadsWithQuestion: 0,
      avgReadsWithoutQuestion: 0,
    };
  }

  const lengths = articles.map((a) => a.title.length);
  const avgLength = lengths.reduce((s, l) => s + l, 0) / lengths.length;

  const ranges = [
    { range: '1-10字', min: 1, max: 10 },
    { range: '11-15字', min: 11, max: 15 },
    { range: '16-20字', min: 16, max: 20 },
    { range: '21-25字', min: 21, max: 25 },
    { range: '26-30字', min: 26, max: 30 },
    { range: '30字以上', min: 31, max: Infinity },
  ];

  const lengthDistribution = ranges.map(({ range, min, max }) => {
    const group = articles.filter(
      (a) => a.title.length >= min && a.title.length <= max
    );
    return {
      range,
      count: group.length,
      avgReads:
        group.length > 0
          ? Math.round(
              group.reduce((s, a) => s + (a.read_num || 0), 0) / group.length
            )
          : 0,
    };
  });

  const withNumber = articles.filter((a) => hasNumber(a.title));
  const withoutNumber = articles.filter((a) => !hasNumber(a.title));
  const withQuestion = articles.filter((a) => hasQuestion(a.title));
  const withoutQuestion = articles.filter((a) => !hasQuestion(a.title));
  const withEmotion = articles.filter((a) => hasEmotion(a.title));

  return {
    avgLength: Math.round(avgLength * 10) / 10,
    lengthDistribution,
    hasNumberRate: Math.round((withNumber.length / articles.length) * 100),
    hasQuestionRate: Math.round((withQuestion.length / articles.length) * 100),
    hasEmotionRate: Math.round((withEmotion.length / articles.length) * 100),
    avgReadsWithNumber:
      withNumber.length > 0
        ? Math.round(
            withNumber.reduce((s, a) => s + (a.read_num || 0), 0) /
              withNumber.length
          )
        : 0,
    avgReadsWithoutNumber:
      withoutNumber.length > 0
        ? Math.round(
            withoutNumber.reduce((s, a) => s + (a.read_num || 0), 0) /
              withoutNumber.length
          )
        : 0,
    avgReadsWithQuestion:
      withQuestion.length > 0
        ? Math.round(
            withQuestion.reduce((s, a) => s + (a.read_num || 0), 0) /
              withQuestion.length
          )
        : 0,
    avgReadsWithoutQuestion:
      withoutQuestion.length > 0
        ? Math.round(
            withoutQuestion.reduce((s, a) => s + (a.read_num || 0), 0) /
              withoutQuestion.length
          )
        : 0,
  };
}

export function categorizeTopics(
  articles: WeChatArticle[],
  keyword: string
): TopicCategory[] {
  const categoryKeywords: Record<string, string[]> = {
    '知识科普': ['科普', '入门', '基础', '概念', '原理', '是什么', '了解'],
    '案例分析': ['案例', '实战', '实践', '经验', '分享', '总结', '复盘'],
    '观点评论': ['观点', '看法', '评论', '分析', '思考', '讨论', '争议'],
    '工具教程': ['教程', '工具', '使用', '指南', '攻略', '方法', '技巧', '怎么用'],
    '行业资讯': ['发布', '更新', '上线', '官方', '消息', '新闻', '动态', '最新'],
    '趋势预测': ['趋势', '未来', '预测', '前景', '方向', '2024', '2025', '2026'],
  };

  const categories: Record<string, WeChatArticle[]> = {};

  for (const article of articles) {
    const text = `${article.title} ${article.digest || ''}`;
    let matched = false;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((kw) => text.includes(kw))) {
        if (!categories[category]) categories[category] = [];
        categories[category].push(article);
        matched = true;
        break;
      }
    }

    if (!matched) {
      if (!categories['其他']) categories['其他'] = [];
      categories['其他'].push(article);
    }
  }

  return Object.entries(categories)
    .map(([name, arts]) => ({
      name,
      count: arts.length,
      percentage: Math.round((arts.length / articles.length) * 100),
      avgReads:
        arts.length > 0
          ? Math.round(
              arts.reduce((s, a) => s + (a.read_num || 0), 0) / arts.length
            )
          : 0,
      articles: arts.sort((a, b) => (b.read_num || 0) - (a.read_num || 0)).slice(0, 3),
    }))
    .sort((a, b) => b.avgReads - a.avgReads);
}

export function analyzeInteractions(
  articles: WeChatArticle[]
): InteractionStats {
  if (articles.length === 0) {
    return {
      totalArticles: 0,
      readRange: { min: 0, max: 0 },
      avgReads: 0,
      medianReads: 0,
      avgLikeRate: 0,
      avgCommentRate: 0,
      excellentLikeRate: 0,
      goodLikeRate: 0,
      normalLikeRate: 0,
    };
  }

  const reads = articles.map((a) => a.read_num || 0);
  const totalReads = reads.reduce((s, r) => s + r, 0);

  const likeRates = articles
    .filter((a) => (a.read_num || 0) > 0)
    .map((a) => ((a.like_num || 0) / a.read_num) * 100);

  const commentRates = articles
    .filter((a) => (a.read_num || 0) > 0)
    .map((a) => ((a.comment_num || 0) / a.read_num) * 100);

  const excellentCount = likeRates.filter((r) => r > 1).length;
  const goodCount = likeRates.filter((r) => r >= 0.5 && r <= 1).length;
  const normalCount = likeRates.filter((r) => r < 0.5).length;
  const totalWithReads = likeRates.length || 1;

  return {
    totalArticles: articles.length,
    readRange: { min: Math.min(...reads), max: Math.max(...reads) },
    avgReads: Math.round(totalReads / articles.length),
    medianReads: Math.round(median(reads)),
    avgLikeRate:
      likeRates.length > 0
        ? Math.round(
            (likeRates.reduce((s, r) => s + r, 0) / likeRates.length) * 100
          ) / 100
        : 0,
    avgCommentRate:
      commentRates.length > 0
        ? Math.round(
            (commentRates.reduce((s, r) => s + r, 0) / commentRates.length) *
              100
          ) / 100
        : 0,
    excellentLikeRate: Math.round((excellentCount / totalWithReads) * 100),
    goodLikeRate: Math.round((goodCount / totalWithReads) * 100),
    normalLikeRate: Math.round((normalCount / totalWithReads) * 100),
  };
}

export function analyzeArticles(
  articles: WeChatArticle[],
  keyword: string,
  period: number
): AnalysisResult {
  const uniqueAccounts = new Set(articles.map((a) => a.nickname)).size;
  const totalReads = articles.reduce((s, a) => s + (a.read_num || 0), 0);
  const topArticles = [...articles]
    .sort((a, b) => (b.read_num || 0) - (a.read_num || 0))
    .slice(0, 10);

  return {
    keyword,
    period,
    totalArticles: articles.length,
    uniqueAccounts,
    totalReads,
    titleAnalysis: analyzeTitles(articles),
    topicCategories: categorizeTopics(articles, keyword),
    interactionStats: analyzeInteractions(articles),
    topArticles,
  };
}

export function generateReportMarkdown(result: AnalysisResult): string {
  const { titleAnalysis, topicCategories, interactionStats, topArticles } = result;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let md = `# 公众号关键词分析报告：${result.keyword}\n\n`;
  md += `> 分析时间：${dateStr}\n`;
  md += `> 数据来源：微信公众号\n\n---\n\n`;

  // 数据概览
  md += `## 数据概览\n\n`;
  md += `| 指标 | 数值 |\n|------|------|\n`;
  md += `| 搜索关键词 | ${result.keyword} |\n`;
  md += `| 分析文章数 | ${result.totalArticles} 篇 |\n`;
  md += `| 时间范围 | 最近 ${result.period} 天 |\n`;
  md += `| 涉及公众号 | ${result.uniqueAccounts} 个 |\n`;
  md += `| 总阅读量 | ${result.totalReads.toLocaleString()} |\n`;
  md += `| 平均阅读量 | ${interactionStats.avgReads.toLocaleString()} |\n`;
  md += `| 中位数阅读量 | ${interactionStats.medianReads.toLocaleString()} |\n`;
  md += `| 最高阅读量 | ${interactionStats.readRange.max.toLocaleString()} |\n\n`;

  // 标题分析
  md += `---\n\n## 一、标题分析\n\n`;
  md += `### 1.1 标题特征统计\n\n`;
  md += `| 特征 | 统计 | 与阅读量关系 |\n|------|------|--------------|\n`;
  md += `| 平均长度 | ${titleAnalysis.avgLength}字 | - |\n`;
  md += `| 包含数字 | ${titleAnalysis.hasNumberRate}% | 平均阅读 ${titleAnalysis.avgReadsWithNumber.toLocaleString()} |\n`;
  md += `| 问句形式 | ${titleAnalysis.hasQuestionRate}% | 平均阅读 ${titleAnalysis.avgReadsWithQuestion.toLocaleString()} |\n`;
  md += `| 情绪词汇 | ${titleAnalysis.hasEmotionRate}% | - |\n\n`;

  if (titleAnalysis.lengthDistribution.length > 0) {
    md += `### 1.2 标题长度分布\n\n`;
    md += `| 长度范围 | 文章数 | 平均阅读量 |\n|----------|--------|------------|\n`;
    for (const d of titleAnalysis.lengthDistribution) {
      if (d.count > 0) {
        md += `| ${d.range} | ${d.count} | ${d.avgReads.toLocaleString()} |\n`;
      }
    }
    md += '\n';
  }

  // 话题归类
  md += `---\n\n## 二、话题归类\n\n`;
  md += `### 2.1 主题分布\n\n`;
  md += `| 话题类型 | 文章数 | 占比 | 平均阅读 |\n|----------|--------|------|----------|\n`;
  for (const cat of topicCategories) {
    md += `| ${cat.name} | ${cat.count} | ${cat.percentage}% | ${cat.avgReads.toLocaleString()} |\n`;
  }
  md += '\n';

  if (topicCategories.length > 0) {
    md += `### 2.2 热门话题详解\n\n`;
    for (const cat of topicCategories.slice(0, 3)) {
      md += `#### ${cat.name}\n`;
      md += `- **文章数**：${cat.count}\n`;
      md += `- **平均阅读**：${cat.avgReads.toLocaleString()}\n`;
      md += `- **代表文章**：\n`;
      for (const a of cat.articles.slice(0, 2)) {
        md += `  - [${a.title}](${a.content_url}) - 阅读 ${(a.read_num || 0).toLocaleString()}\n`;
      }
      md += '\n';
    }
  }

  // 互动数据
  md += `---\n\n## 三、互动数据洞察\n\n`;
  md += `### 3.1 数据分布\n\n`;
  md += `- 文章总数：${interactionStats.totalArticles} 篇\n`;
  md += `- 阅读量范围：${interactionStats.readRange.min.toLocaleString()} - ${interactionStats.readRange.max.toLocaleString()}\n`;
  md += `- 平均阅读量：${interactionStats.avgReads.toLocaleString()}\n`;
  md += `- 中位数阅读量：${interactionStats.medianReads.toLocaleString()}\n`;
  md += `- 平均点赞率：${interactionStats.avgLikeRate}%\n`;
  md += `- 平均评论率：${interactionStats.avgCommentRate}%\n\n`;

  md += `### 3.2 点赞率分布\n\n`;
  md += `- 优秀（>1%）：${interactionStats.excellentLikeRate}% 的文章\n`;
  md += `- 良好（0.5-1%）：${interactionStats.goodLikeRate}% 的文章\n`;
  md += `- 一般（<0.5%）：${interactionStats.normalLikeRate}% 的文章\n\n`;

  // Top 文章
  md += `---\n\n## 附录：Top 10 高阅读量文章\n\n`;
  md += `| 排名 | 标题 | 公众号 | 阅读 | 点赞 | 点赞率 |\n|------|------|--------|------|------|--------|\n`;
  topArticles.forEach((a, i) => {
    const likeRate =
      (a.read_num || 0) > 0
        ? (((a.like_num || 0) / a.read_num) * 100).toFixed(1)
        : '0.0';
    md += `| ${i + 1} | [${a.title}](${a.content_url}) | ${a.nickname} | ${(a.read_num || 0).toLocaleString()} | ${(a.like_num || 0).toLocaleString()} | ${likeRate}% |\n`;
  });

  md += `\n---\n\n> 报告生成时间：${dateStr}\n> 数据来源：大家拉公众号搜索API\n`;

  return md;
}
