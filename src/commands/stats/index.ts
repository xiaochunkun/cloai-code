import type { Command } from '../../commands.js'

const stats = {
  type: 'local-jsx',
  name: 'stats',
  description: '显示你的 Claude Code 使用统计与活动情况',
  load: () => import('./stats.js'),
} satisfies Command

export default stats
