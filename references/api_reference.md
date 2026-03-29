# 大家拉公众号搜索 API 参考

## 接口地址

```
POST https://www.dajiala.com/fbmain/monitor/v3/kw_search
```

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| kw | string | 是 | 搜索关键词 |
| key | string | 是 | API密钥 |
| sort_type | int | 否 | 排序类型：1=相关性排序，2=时间排序 |
| mode | int | 否 | 搜索模式：1=标题+正文，2=仅标题 |
| period | int | 否 | 时间范围（天数），如7表示最近7天 |
| page | int | 否 | 页码，从1开始 |
| any_kw | string | 否 | 任意包含的关键词（OR逻辑） |
| ex_kw | string | 否 | 排除的关键词 |
| type | int | 否 | 文章类型：1=普通文章 |
| verifycode | string | 否 | 验证码（通常为空） |

## 响应格式

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "title": "文章标题",
      "digest": "文章摘要",
      "content_url": "文章链接",
      "cover": "封面图URL",
      "datetime": "发布时间",
      "nickname": "公众号名称",
      "read_num": 10000,
      "like_num": 100,
      "comment_num": 50
    }
  ]
}
```

## 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 文章标题 |
| digest | string | 文章摘要 |
| content_url | string | 文章链接 |
| cover | string | 封面图URL |
| datetime | string | 发布时间 |
| nickname | string | 公众号名称 |
| read_num | int | 阅读量 |
| like_num | int | 点赞量 |
| comment_num | int | 评论量 |

## 常用搜索场景

### 热点追踪
- `period=1`: 最近24小时
- `sort_type=2`: 按时间排序
- `mode=1`: 全文搜索

### 深度分析
- `period=7`: 最近一周
- `sort_type=2`: 按时间排序
- 获取多页数据进行综合分析

### 精准搜索
- `mode=2`: 仅搜索标题
- `ex_kw`: 排除干扰关键词

## 脚本使用示例

```bash
# 基础搜索
python3 scripts/search_articles.py "AI应用" -o articles.json

# 指定时间范围和页数
python3 scripts/search_articles.py "AI应用" --period 7 --pages 5

# 按相关性排序
python3 scripts/search_articles.py "AI应用" --sort relevance

# 仅搜索标题
python3 scripts/search_articles.py "AI应用" --mode title
```

## 注意事项

1. 每页返回约10篇文章
2. 建议单次获取不超过5页
3. API 有频率限制，避免短时间内大量请求
4. 部分文章可能没有互动数据（read_num/like_num 为0或null）
