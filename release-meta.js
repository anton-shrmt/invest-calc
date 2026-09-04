// В production этот файл создаётся scripts/build_release.mjs из проверяемого GITHUB_SHA.
window.CALCULATOR_RELEASE = { sha: 'local', builtAt: null };
window.dispatchEvent(new Event('release-ready'));
