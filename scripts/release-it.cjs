/* eslint-disable no-template-curly-in-string */
module.exports = {
  git: {
    requireBranch: 'master',
    commitMessage: 'chore: release v${version}',
    requireCommits: true,
    tagName: 'v${version}',
    tagAnnotation: `release date: ${new Date().toLocaleString()}`
  },
  github: {
    release: true
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: {
        name: 'conventionalcommits',
        types: [
          {
            type: 'feat',
            section: '✨ Features | 新功能'
          },
          {
            type: 'fix',
            section: '🐛 Bug Fixes | Bug 修复'
          },
          {
            type: 'chore',
            section: '🚀 Chore | 构建/工程依赖/工具',
            hidden: true
          },
          {
            type: 'docs',
            section: '📝 Documentation | 文档'
          },
          {
            type: 'style',
            section: '💄 Styles | 样式'
          },
          {
            type: 'refactor',
            section: '♻️ Code Refactoring | 代码重构'
          },
          {
            type: 'perf',
            section: '⚡ Performance Improvements | 性能优化'
          },
          {
            type: 'test',
            section: '✅ Tests | 测试',
            hidden: true
          },
          {
            type: 'revert',
            section: '⏪ Revert | 回退',
            hidden: true
          },
          {
            type: 'build',
            section: '📦‍ Build System | 打包构建'
          },
          {
            type: 'ci',
            section: '👷 Continuous Integration | CI 配置'
          }
        ]
      },
      infile: 'CHANGELOG.md',
      header: '# CHANGE_LOGS',
      ignoreRecommendedBump: true
    }
  },
  hooks: {
    'after:release': 'node ./scripts/update-dev-branch.js'
  }
}
