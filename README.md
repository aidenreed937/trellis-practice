# Trellis Practice 使用文档

这个仓库用于学习和实践 Trellis 工作流。当前仓库只包含 Trellis、Codex 和 agent 相关脚手架，还没有真实业务应用代码。后续 demo 项目会按 `.trellis/spec/` 中的 backend/frontend 规范逐步补齐。

## 开发者需要关注什么

### 1. Trellis 是项目记忆，不是临时笔记

重点目录：

```text
.trellis/
├── workflow.md          # Trellis 工作流说明
├── spec/                # 项目开发规范，AI 写代码前必须读取
├── tasks/               # 任务、PRD、上下文 jsonl
├── workspace/           # 开发者个人工作区和 journal
└── scripts/             # Trellis 辅助脚本
```

日常开发时，真正影响 AI 行为的是：

- `.trellis/spec/backend/`：后端目录结构、数据库、错误处理、日志、质量规范。
- `.trellis/spec/frontend/`：前端目录结构、组件、hook、状态管理、类型安全、质量规范。
- `.trellis/spec/guides/`：编码前的思考清单，比如跨层数据流和复用检查。
- `.trellis/tasks/<task>/prd.md`：当前任务的目标、范围和验收标准。
- `.trellis/tasks/<task>/*.jsonl`：注入给 AI 的实现、检查、调试上下文。

### 2. 先有任务，再写代码

建议每个有明确产出的工作都创建 Trellis task。这样后续 session 能恢复上下文，也能知道当时为什么做这些改动。

常用流程：

```bash
python3 ./.trellis/scripts/get_context.py
python3 ./.trellis/scripts/task.py create "Add todo demo" --slug add-todo-demo
python3 ./.trellis/scripts/task.py init-context .trellis/tasks/<task-dir> fullstack
python3 ./.trellis/scripts/task.py add-context .trellis/tasks/<task-dir> implement .trellis/spec/frontend/index.md "Frontend guidelines"
python3 ./.trellis/scripts/task.py start .trellis/tasks/<task-dir>
```

任务目录至少应该包含：

- `task.json`：任务元信息。
- `prd.md`：目标、需求、验收标准。
- `implement.jsonl`：实现阶段需要注入的上下文。
- `check.jsonl`：检查阶段需要注入的上下文。
- `debug.jsonl`：调试阶段需要注入的上下文。

### 3. 规范要写真实约定

`.trellis/spec/` 里的内容不是理想化规范，而是这个项目当前真实采用的做法。

后续如果 demo 项目引入了新的技术选择，要同步更新规范。例如：

- 引入 TanStack Query：更新 `frontend/hook-guidelines.md` 和 `frontend/state-management.md`。
- 引入数据库迁移工具：更新 `backend/database-guidelines.md`。
- 改变 API 错误格式：更新 `backend/error-handling.md` 和前端 API 处理规范。
- 添加跨层 DTO 或 schema 共享：同步更新 backend/frontend 相关规范，并检查 guides 是否需要补充提醒。

不要只改代码不改规范。否则下一次 AI session 很容易回到泛用写法。

## 日常使用流程

### 开始一次 session

进入仓库后先看当前状态：

```bash
cd /Users/mac/workspace/personal/learning/trellis-practice
python3 ./.trellis/scripts/get_context.py
```

关注输出里的几项：

- `CURRENT TASK`：是否已有正在进行的任务。
- `ACTIVE TASKS`：是否有未完成任务。
- `GIT STATUS`：工作区是否有未提交改动。
- `PACKAGES / Spec layers`：当前有哪些规范层。

如果有当前任务，先读：

```bash
cat .trellis/tasks/<task-dir>/prd.md
cat .trellis/tasks/<task-dir>/task.json
```

如果没有任务，先创建任务和 PRD，不要直接开始大改。

### 写代码前

根据任务类型读取对应规范：

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
cat .trellis/spec/frontend/index.md
cat .trellis/spec/backend/index.md
cat .trellis/spec/guides/index.md
```

然后按 index 里的 `Pre-Development Checklist` 读取具体文件。比如改前端状态管理，就读：

```bash
cat .trellis/spec/frontend/state-management.md
cat .trellis/spec/frontend/hook-guidelines.md
cat .trellis/spec/frontend/type-safety.md
```

如果任务跨越 API、service、database、component 三层以上，还要读：

```bash
cat .trellis/spec/guides/cross-layer-thinking-guide.md
```

### 开发中

保持改动小而可审查：

- 只做当前 PRD 要求的事。
- 不顺手重构不相关文件。
- 修改常量、配置、字段名之前先搜索引用。
- 有新约定就更新 `.trellis/spec/`。
- 有新坑点就补到对应 guideline 或 thinking guide。

搜索优先使用 `rg`：

```bash
rg "字段名或函数名"
rg --files
```

### 检查和收尾

当前仓库还没有应用代码和 `package.json`，所以暂时没有 `pnpm lint/test/build`。后续创建 demo app 后，优先跑受影响范围内的检查：

```bash
pnpm lint
pnpm test
pnpm build
```

Trellis task context 可以这样校验：

```bash
python3 ./.trellis/scripts/task.py validate .trellis/tasks/<task-dir>
```

任务完成后：

```bash
python3 ./.trellis/scripts/task.py finish
python3 ./.trellis/scripts/task.py archive <task-name> --no-commit
```

这里建议加 `--no-commit`，保持提交由开发者手动控制。

## Git 注意事项

这个仓库目前还没有首个 commit，所有初始化文件都处于未提交状态。

约定：

- 不自动 commit 或 push，除非明确要求。
- commit message 使用 Conventional Commits，例如 `docs: add developer usage guide`。
- 不使用 `git reset --hard`、`--force`、`--no-verify` 等破坏性操作。
- 归档 task 时使用 `--no-commit`，避免 Trellis 脚本自动提交。
- 如果工作区已有别人的改动，不要回滚；先确认是否和当前任务相关。

查看状态：

```bash
git status --short
```

## 包管理和运行环境

本项目约定：

- macOS
- zsh
- asdf 管理 Node.js、Go、Python、Rust、Java
- Node.js 包管理优先使用 `pnpm`
- 不使用 `npm` 或 `yarn` 安装依赖
- GitHub 相关操作优先使用 `gh`

后续如果要创建 Node.js demo app，优先使用：

```bash
pnpm init
pnpm add <package>
pnpm add -D <package>
```

不要运行：

```bash
npm install
yarn add <package>
```

## 常见注意点

### 不要把 Trellis 当成只读模板

Trellis 的价值在于持续更新项目知识。代码模式变了，就更新 spec；任务完成了，就归档 task；重要 session 完成后，再记录 journal。

### 不要假装已有代码存在

当前仓库还没有真实 app。文档和规范中如果引用未来路径，要明确它是计划中的 demo 结构。等真实代码落地后，再把示例改成真实文件路径。

### 不要让 PRD 过大

一个 task 应该能清楚说明目标和验收标准。如果需求开始包含多个独立功能，拆成多个 task。

### 不要遗漏 jsonl context

如果 task 没有 `implement.jsonl`、`check.jsonl`、`debug.jsonl`，Codex/Trellis hook 会认为上下文没有配置完整。创建任务后及时运行：

```bash
python3 ./.trellis/scripts/task.py init-context .trellis/tasks/<task-dir> <type>
```

### 归档后检查 context

归档会移动任务目录。归档后建议验证一次：

```bash
python3 ./.trellis/scripts/task.py validate .trellis/tasks/archive/<YYYY-MM>/<task-dir>
```

如果 jsonl 里有指向归档前任务路径的条目，需要改成归档后的路径。

## 推荐学习路径

1. 阅读 `AGENTS.md`，了解全局协作规则。
2. 阅读 `.trellis/workflow.md`，理解 Trellis 生命周期。
3. 阅读 `.trellis/spec/backend/index.md` 和 `.trellis/spec/frontend/index.md`。
4. 创建一个小 demo task，例如 todo list。
5. 写 PRD、初始化 context、启动 task。
6. 实现最小功能。
7. 运行检查，更新 spec，归档 task。
8. 手动 commit。

这个流程跑通一次后，再开始尝试 `/start`、`/brainstorm`、`/before-dev`、`/check` 等完整闭环。

## Fullstack scaffold

当前 demo 脚手架采用平台中立的 pnpm workspace monorepo：

```text
apps/
├── web/          # React + TypeScript + Vite
└── api/          # Node.js + TypeScript + Fastify + Kysely + SQLite
packages/
└── shared/       # API DTO、Zod schema、错误码契约
```

本地初始化：

```bash
pnpm install
pnpm db:reset
```

日常开发：

```bash
pnpm dev        # 同时运行 web 和 api
pnpm dev:web    # 只运行 Vite web
pnpm dev:api    # 只运行 Fastify api
```

质量检查：

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

数据库脚本：

```bash
pnpm db:migrate
pnpm db:seed
pnpm db:reset
```

本地 API 默认使用：

```text
API_PORT=3001
DATABASE_URL=file:./apps/api/data/dev.db
```

前端通过 Vite proxy 调用 `/api/*`，不在前端代码里硬编码完整 API origin。

GitHub Actions 只做 CI 质量门禁，不做 CD 自动部署。当前 MVP 明确不包含 Docker、Postgres、auth、preview deployment 和云平台集成。
