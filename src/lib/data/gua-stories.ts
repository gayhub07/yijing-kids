// 从 gua-complete.ts 转换的故事数据，供页面使用
import { guaCompleteData, type GuaComplete } from './gua-complete'

// 故事列表格式（用于 /stories 页面）
export interface StoryListItem {
  id: number
  gua: string
  guaPinyin: string
  title: string
  summary: string
  level: 'beginner' | 'explorer' | 'advanced'
  emoji: string
}

// 故事详情格式（用于 /stories/[id] 页面）
export interface StoryDetail extends StoryListItem {
  content: string[]
  lesson: string
  // 额外的卦象信息
  symbol: string
  text: string
  textPinyin: string
  textMeaning: string
  lines: GuaComplete['lines']
  application: string
}

// 转换为故事列表
export const allStoriesList: StoryListItem[] = guaCompleteData.map((gua) => ({
  id: gua.id,
  gua: gua.name,
  guaPinyin: gua.namePinyin,
  title: gua.story.title,
  summary: gua.story.summary,
  level: gua.story.level,
  emoji: gua.story.emoji,
}))

// 转换为故事详情 Map
export const storiesDetailMap: Record<string, StoryDetail> = Object.fromEntries(
  guaCompleteData.map((gua) => [
    String(gua.id),
    {
      id: gua.id,
      gua: gua.name,
      guaPinyin: gua.namePinyin,
      title: gua.story.title,
      summary: gua.story.summary,
      level: gua.story.level,
      emoji: gua.story.emoji,
      content: gua.story.content,
      lesson: gua.story.lesson,
      symbol: gua.symbol,
      text: gua.text,
      textPinyin: gua.textPinyin,
      textMeaning: gua.textMeaning,
      lines: gua.lines,
      application: gua.application,
    },
  ]),
)

// 根据卦名获取故事
export function getStoryByGua(guaName: string): StoryDetail | undefined {
  const gua = guaCompleteData.find((g) => g.name === guaName)
  if (!gua) return undefined
  return storiesDetailMap[String(gua.id)]
}

// 获取所有卦象数据（用于其他用途）
export { guaCompleteData }
export type { GuaComplete, GuaLine }
