#!/usr/bin/env python3
"""
微信公众号关键词搜索脚本
调用大家拉 API 根据关键词搜索最近一周的公众号文章
"""

import argparse
import json
import os
import sys
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


API_URL = "https://www.dajiala.com/fbmain/monitor/v3/kw_search"
DEFAULT_API_KEY = os.environ.get("DAJIALA_API_KEY", "")


def search_articles(
    keyword: str,
    api_key: str = None,
    sort_type: int = 1,
    mode: int = 1,
    period: int = 7,
    page: int = 1,
    any_kw: str = "",
    ex_kw: str = "",
) -> dict:
    """
    搜索微信公众号文章

    Args:
        keyword: 搜索关键词
        api_key: API密钥（可选，默认使用环境变量或内置key）
        sort_type: 排序类型 (1=相关性, 2=时间)
        mode: 搜索模式 (1=标题+正文, 2=仅标题)
        period: 时间范围（天数）
        page: 页码
        any_kw: 任意包含关键词（OR逻辑）
        ex_kw: 排除关键词

    Returns:
        API响应数据
    """
    key = api_key or DEFAULT_API_KEY

    payload = {
        "kw": keyword,
        "sort_type": sort_type,
        "mode": mode,
        "period": period,
        "page": page,
        "key": key,
        "any_kw": any_kw,
        "ex_kw": ex_kw,
        "verifycode": "",
        "type": 1
    }

    data = json.dumps(payload).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    req = Request(API_URL, data=data, headers=headers, method='POST')

    try:
        with urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode('utf-8'))
    except HTTPError as e:
        return {"error": f"HTTP Error: {e.code} - {e.reason}", "code": -1}
    except URLError as e:
        return {"error": f"URL Error: {e.reason}", "code": -1}
    except Exception as e:
        return {"error": str(e), "code": -1}


def fetch_all_pages(
    keyword: str,
    api_key: str = None,
    pages: int = 3,
    period: int = 7,
    sort_type: int = 2,
    mode: int = 1,
) -> list:
    """
    获取多页文章数据

    Args:
        keyword: 搜索关键词
        api_key: API密钥
        pages: 获取页数
        period: 时间范围（天数）
        sort_type: 排序类型
        mode: 搜索模式

    Returns:
        所有文章列表
    """
    all_articles = []

    for p in range(1, pages + 1):
        print(f"正在获取第 {p}/{pages} 页...", file=sys.stderr)
        result = search_articles(
            keyword=keyword,
            api_key=api_key,
            sort_type=sort_type,
            mode=mode,
            period=period,
            page=p,
        )

        if result.get("code") == -1:
            print(f"错误: {result.get('error')}", file=sys.stderr)
            break

        articles = result.get("data", [])
        if not articles:
            print(f"第 {p} 页没有更多文章", file=sys.stderr)
            break

        all_articles.extend(articles)
        print(f"第 {p} 页获取到 {len(articles)} 篇文章", file=sys.stderr)

    return all_articles


def main():
    parser = argparse.ArgumentParser(
        description='根据关键词搜索微信公众号文章',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  %(prog)s "AI" --period 7 --pages 3
  %(prog)s "人工智能" --sort time --mode title
  %(prog)s "Claude" -o articles.json
        """
    )
    parser.add_argument('keyword', help='搜索关键词')
    parser.add_argument('--key', help='API密钥（默认使用环境变量DAJIALA_API_KEY）')
    parser.add_argument('--period', type=int, default=7,
                        help='时间范围（天数）(默认: 7)')
    parser.add_argument('--pages', type=int, default=3,
                        help='获取页数 (默认: 3)')
    parser.add_argument('--sort', choices=['relevance', 'time'], default='time',
                        help='排序方式: relevance=相关性, time=时间 (默认: time)')
    parser.add_argument('--mode', choices=['all', 'title'], default='all',
                        help='搜索模式: all=标题+正文, title=仅标题 (默认: all)')
    parser.add_argument('--output', '-o', help='输出文件路径（默认输出到stdout）')
    parser.add_argument('--any-kw', default='', help='任意包含关键词（OR逻辑）')
    parser.add_argument('--ex-kw', default='', help='排除关键词')

    args = parser.parse_args()

    sort_type = 1 if args.sort == 'relevance' else 2
    mode = 2 if args.mode == 'title' else 1

    articles = fetch_all_pages(
        keyword=args.keyword,
        api_key=args.key,
        pages=args.pages,
        period=args.period,
        sort_type=sort_type,
        mode=mode,
    )

    output_data = {
        "keyword": args.keyword,
        "period": args.period,
        "collected_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total": len(articles),
        "articles": articles
    }

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        print(f"\n已保存 {len(articles)} 篇文章到 {args.output}", file=sys.stderr)
    else:
        print(json.dumps(output_data, ensure_ascii=False, indent=2))

    print(f"\n共获取 {len(articles)} 篇文章", file=sys.stderr)


if __name__ == '__main__':
    main()
