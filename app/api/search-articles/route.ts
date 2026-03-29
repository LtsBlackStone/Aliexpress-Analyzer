import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://www.dajiala.com/fbmain/monitor/v3/kw_search';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, period = 7, pages = 3, sort = 'time', mode = 'all', apiKey } = body;

    if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
      return NextResponse.json({ error: '请输入搜索关键词' }, { status: 400 });
    }

    const key = apiKey || process.env.DAJIALA_API_KEY || '';
    if (!key) {
      return NextResponse.json(
        { error: '未配置API密钥，请设置DAJIALA_API_KEY环境变量或在请求中提供apiKey参数' },
        { status: 400 }
      );
    }
    const sortType = sort === 'relevance' ? 1 : 2;
    const searchMode = mode === 'title' ? 2 : 1;

    const allArticles: any[] = [];

    for (let p = 1; p <= Math.min(pages, 5); p++) {
      const payload = {
        kw: keyword.trim(),
        sort_type: sortType,
        mode: searchMode,
        period,
        page: p,
        key,
        any_kw: '',
        ex_kw: '',
        verifycode: '',
        type: 1,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `API请求失败: ${response.status}` },
          { status: response.status }
        );
      }

      const result = await response.json();

      if (result.code === -1) {
        return NextResponse.json(
          { error: result.error || result.msg || 'API返回错误' },
          { status: 500 }
        );
      }

      const articles = result.data || [];
      if (articles.length === 0) break;

      allArticles.push(...articles);
    }

    return NextResponse.json({
      keyword: keyword.trim(),
      period,
      collected_at: new Date().toISOString(),
      total: allArticles.length,
      articles: allArticles,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '搜索请求失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
