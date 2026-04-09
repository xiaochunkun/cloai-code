import type { Command } from '../../commands.js'

const statuslineBar = {
  name: 'statusline-bar',
  description: '将内置状态栏预设安装到你的 Cloai 配置中',
  type: 'local',
  supportsNonInteractive: true,
  load: () => import('./statusline-bar.js'),
} satisfies Command

export default statuslineBar
