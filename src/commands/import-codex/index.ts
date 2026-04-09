import type { Command } from '../../commands.js'

export default {
  type: 'local',
  name: 'import-codex',
  description: '导入 OpenAI Codex CLI 的凭据和模型',
  supportsNonInteractive: false,
  load: () => import('./import-codex.js'),
} satisfies Command
