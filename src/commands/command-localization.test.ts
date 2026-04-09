import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import help from './help/index.js'
import config from './config/index.js'
import cost from './cost/index.js'
import diff from './diff/index.js'
import doctor from './doctor/index.js'
import effort from './effort/index.js'
import exit from './exit/index.js'
import exportCommand from './export/index.js'
import { context } from './context/index.js'

test('command descriptions are localized', () => {
  expect(help.description).toContain('帮助')
  expect(config.description).toContain('配置')
  expect(context.description).toContain('上下文')
  expect(cost.description).toContain('当前会话')
  expect(diff.description).toContain('未提交')
  expect(doctor.description).toContain('诊断')
  expect(effort.description).toContain('推理力度')
  expect(exit.description).toContain('退出')
  expect(exportCommand.description).toContain('导出')
})

test('interactive labels are localized in source', () => {
  const copyFile = readFileSync('src/commands/copy/copy.tsx', 'utf8')
  const themeFile = readFileSync('src/components/ThemePicker.tsx', 'utf8')
  expect(copyFile).toContain('完整回复')
  expect(themeFile).toContain('深色模式')
})

test('trust and teleport dialogs are localized in source', () => {
  const trustFile = readFileSync('src/components/TrustDialog/TrustDialog.tsx', 'utf8')
  const teleportFile = readFileSync('src/components/TeleportError.tsx', 'utf8')
  expect(trustFile).toContain('是，我信任此文件夹')
  expect(teleportFile).toContain('登录 Claude')
})

test('progress messages are localized', async () => {
  const { default: prComments } = await import('./pr_comments/index.js')
  expect(prComments.description).toContain('获取')
})

test('remaining command descriptions are localized in source', () => {
  const expectations: Array<[string, string]> = [
    ['src/commands/brief.ts', '仅简洁'],
    ['src/commands/advisor.ts', '配置'],
    ['src/commands/import-codex/index.ts', '导入 OpenAI Codex'],
    ['src/commands/bridge-kick.ts', '故障状态'],
    ['src/commands/files/index.ts', '所有文件'],
    ['src/commands/feedback/index.ts', '反馈'],
    ['src/commands/color/index.ts', '提示栏颜色'],
    ['src/commands/bridge/index.ts', '远程控制会话'],
    ['src/commands/extra-usage/index.ts', '额外使用额度'],
    ['src/commands/desktop/index.ts', 'Claude Desktop'],
    ['src/commands/hooks/index.ts', 'Hook 配置'],
    ['src/commands/heapdump/index.ts', 'JS 堆'],
    ['src/commands/fuck/index.ts', '清除本地 Claude Code 认证'],
    ['src/commands/install-github-app/index.ts', 'GitHub Actions'],
    ['src/commands/install.tsx', '原生构建版本'],
    ['src/commands/chrome/index.ts', '设置'],
    ['src/commands/install-slack-app/index.ts', 'Slack'],
    ['src/commands/mobile/index.ts', '二维码'],
    ['src/commands/mcp/index.ts', 'MCP 服务器'],
    ['src/commands/plan/index.ts', '计划模式'],
    ['src/commands/keybindings/index.ts', '快捷键配置文件'],
    ['src/commands/memory/index.ts', '记忆文件'],
    ['src/commands/permissions/index.ts', '允许/拒绝规则'],
    ['src/commands/output-style/index.ts', '已弃用'],
    ['src/commands/plugin/index.tsx', '插件'],
    ['src/commands/stats/index.ts', '使用统计'],
    ['src/commands/agents/index.ts', '代理配置'],
    ['src/commands/voice/index.ts', '语音模式'],
    ['src/commands/stickers/index.ts', '贴纸'],
    ['src/commands/remote-env/index.ts', '默认远程环境'],
    ['src/commands/resume/index.ts', '恢复之前的会话'],
    ['src/commands/skills/index.ts', '可用技能'],
    ['src/commands/reload-plugins/index.ts', '待生效的插件变更'],
    ['src/commands/rate-limit-options/index.ts', '速率限制'],
    ['src/commands/privacy-settings/index.ts', '隐私设置'],
    ['src/commands/vim/index.ts', '编辑模式'],
    ['src/commands/session/index.ts', '二维码'],
    ['src/commands/release-notes/index.ts', '发行说明'],
    ['src/commands/rename/index.ts', '重命名当前会话'],
    ['src/commands/tasks/index.ts', '后台任务'],
    ['src/commands/thinkback-play/index.ts', '播放'],
    ['src/commands/usage/index.ts', '使用限制'],
    ['src/commands/remove-model/index.ts', '移除自定义模型'],
    ['src/commands/tag/index.ts', '可搜索标签'],
    ['src/commands/ultraplan.tsx', '高级计划'],
    ['src/commands/thinkback/index.ts', '年度回顾'],
    ['src/commands/upgrade/index.ts', '升级到 Max'],
    ['src/commands/add-model/index.ts', '自定义模型添加到已保存的模型列表'],
    ['src/commands/statusline-bar/index.ts', '状态栏预设'],
    ['src/commands/review.ts', '网页端 Claude Code'],
  ]

  for (const [filePath, expected] of expectations) {
    const file = readFileSync(filePath, 'utf8')
    expect(file).toContain(expected)
  }
})
