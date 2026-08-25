Spec directory and instructions for using spec-kit with this project.

Steps to use spec-kit locally (manual):

1. Clone spec-kit locally:

```bash
git clone https://github.com/github/spec-kit tools/spec-kit
cd tools/spec-kit
npm install
```

2. Read spec-kit README in `tools/spec-kit` for usage. Depending on the version, you may run the CLI directly, or run a local example. This project contains simple markdown specs under `specs/` that follow the common pattern used by spec-kit (frontmatter + examples).

3. A minimal workflow I will follow when teaching:
  - Write a spec file in `specs/` (human-readable, machine-friendly frontmatter).
  - Implement backend code (FastAPI) and unit tests that satisfy the spec.
  - Optionally use spec-kit tools to render and validate specs once you've installed it.

If you want, I can attempt to clone and run `spec-kit` in this workspace for you, but I will need your confirmation first.
