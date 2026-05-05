# Agent Instructions

Before making changes in this repo, run:

```powershell
context-pack --cwd . --changed-only --no-tree
```

Read `.context-pack/memory.md` before inspecting source files.

Use the memory file as repo orientation, but verify details against current code before editing.

If `.context-pack/memory.md` is older than 7 days and repo development has continued, refresh it with:

```powershell
context-pack --cwd . --refresh-memory
```

Before committing or refreshing context-pack memory, make sure it did not capture anything sensitive from `.local/kubeconfig.yaml`:

```powershell
rg "password|token|secret|key|kubeconfig|192\\.168|REMOTE" .context-pack/memory.md
```
