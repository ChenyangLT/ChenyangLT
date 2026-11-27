// scripts/build.mjs —— 生成 GitHub 主页用的 SVG（横幅 + 数据卡）
// 用法：node scripts/build.mjs              只重建横幅，不联网
//      GH_TOKEN=xxx node scripts/build.mjs  同时刷新数据卡（CI 里自动跑）
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT = join(ROOT, 'assets');

const USER = 'ChenyangLT';
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";

const PALETTE = {
  dark: {
    bg1: '#0b0f19', bg2: '#101a2e', grid: 'rgba(255,255,255,0.038)',
    text: '#e8eefc', muted: '#8b98ad', faint: '#5d6b82',
    a1: '#818cf8', a2: '#22d3ee', a3: '#f472b6',
    nameA: '#c7d2fe', nameB: '#a5b4fc', nameC: '#67e8f9',
    panel: '#0f1626', panelStroke: 'rgba(255,255,255,0.09)',
    heat: ['#161d2c', '#312e81', '#4f46e5', '#818cf8', '#c7d2fe'],
    glow: 0.6,
  },
  light: {
    bg1: '#ffffff', bg2: '#f4f6fc', grid: 'rgba(15,23,42,0.045)',
    text: '#0f172a', muted: '#5b6779', faint: '#8a94a6',
    a1: '#4f46e5', a2: '#0891b2', a3: '#db2777',
    nameA: '#4f46e5', nameB: '#6366f1', nameC: '#0ea5e9',
    panel: '#ffffff', panelStroke: '#dfe4ee',
    heat: ['#eaeef4', '#c7d2fe', '#818cf8', '#4f46e5', '#312e81'],
    glow: 0.28,
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ------------------------------------------------------------------ 横幅 */
function hero(variant) {
  const c = PALETTE[variant];
  const W = 1180, H = 300;

  const termX = 700, termY = 56, termW = 420, termH = 196;
  const term = [
    ['$ ', 'whoami', c.text],
    ['', 'ChenyangLT', c.a1],
    ['$ ', 'ls ~/projects', c.text],
    ['', 'MusicBell  HoneySky  ECHO  meditrack', c.muted],
    ['$ ', 'echo $STATUS', c.text],
    ['', 'vibing · one commit at a time', c.a2],
  ];
  const lines = term.map(([p, t, fill], i) => {
    const y = termY + 74 + i * 23;
    const prompt = p ? '<tspan fill="' + c.a2 + '">' + esc(p) + '</tspan>' : '';
    return '    <text x="' + (termX + 26) + '" y="' + y + '" font-family="' + MONO + '" font-size="13.5" fill="' + fill + '">' + prompt + esc(t) + '</text>';
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="ChenyangLT">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.bg1}"/>
      <stop offset="1" stop-color="${c.bg2}"/>
    </linearGradient>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c.nameA}"/>
      <stop offset="0.55" stop-color="${c.nameB}"/>
      <stop offset="1" stop-color="${c.nameC}"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c.a1}" stop-opacity="0"/>
      <stop offset="0.12" stop-color="${c.a1}"/>
      <stop offset="0.6" stop-color="${c.a2}"/>
      <stop offset="1" stop-color="${c.a2}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="gA"><stop offset="0" stop-color="${c.a1}" stop-opacity="0.55"/><stop offset="1" stop-color="${c.a1}" stop-opacity="0"/></radialGradient>
    <radialGradient id="gB"><stop offset="0" stop-color="${c.a2}" stop-opacity="0.45"/><stop offset="1" stop-color="${c.a2}" stop-opacity="0"/></radialGradient>
    <radialGradient id="gC"><stop offset="0" stop-color="${c.a3}" stop-opacity="0.35"/><stop offset="1" stop-color="${c.a3}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M34 0H0V34" fill="none" stroke="${c.grid}" stroke-width="1"/>
    </pattern>
    <style>
      .b1{animation:drift1 19s ease-in-out infinite}
      .b2{animation:drift2 24s ease-in-out infinite}
      .b3{animation:drift3 29s ease-in-out infinite}
      .cursor{animation:blink 1.1s steps(1,end) infinite}
      @keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(34px,-22px)}}
      @keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,18px)}}
      @keyframes drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,26px)}}
      @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
      @media (prefers-reduced-motion: reduce){.b1,.b2,.b3,.cursor{animation:none}}
    </style>
    <clipPath id="frame"><rect width="${W}" height="${H}"/></clipPath>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <g opacity="${c.glow}">
      <circle class="b1" cx="150" cy="40" r="200" fill="url(#gA)"/>
      <circle class="b2" cx="620" cy="300" r="230" fill="url(#gB)"/>
      <circle class="b3" cx="1080" cy="30" r="180" fill="url(#gC)"/>
    </g>

    <text x="72" y="98" font-family="${MONO}" font-size="12.5" letter-spacing="3.4" fill="${c.a1}">// HELLO, WORLD</text>
    <text x="70" y="170" font-family="${SANS}" font-size="64" font-weight="800" letter-spacing="-1.6" fill="url(#name)">ChenyangLT</text>
    <text x="72" y="209" font-family="${SANS}" font-size="20" fill="${c.muted}">高中生 · Vibe Coder · 喜欢把顺手的小工具做出来</text>

    <rect x="72" y="232" width="300" height="2" rx="1" fill="url(#rule)"/>

    <text x="72" y="266" font-family="${MONO}" font-size="12.5" fill="${c.faint}">chenyang-blog.pages.dev</text>
    <circle cx="253" cy="262" r="2.5" fill="${c.faint}"/>
    <text x="267" y="266" font-family="${MONO}" font-size="12.5" fill="${c.faint}">since 2023</text>

    <rect x="${termX}" y="${termY}" width="${termW}" height="${termH}" rx="14" fill="${c.panel}" stroke="${c.panelStroke}" stroke-width="1"/>
    <circle cx="${termX + 22}" cy="${termY + 21}" r="5" fill="#ff5f57"/>
    <circle cx="${termX + 40}" cy="${termY + 21}" r="5" fill="#febc2e"/>
    <circle cx="${termX + 58}" cy="${termY + 21}" r="5" fill="#28c840"/>
    <text x="${termX + termW / 2}" y="${termY + 26}" text-anchor="middle" font-family="${MONO}" font-size="11.5" fill="${c.faint}">zsh — chenyang@github</text>
    <line x1="${termX}" y1="${termY + 42}" x2="${termX + termW}" y2="${termY + 42}" stroke="${c.panelStroke}"/>
${lines}
    <rect class="cursor" x="${termX + 26 + 238}" y="${termY + 74 + 5 * 23 - 10}" width="7" height="14" fill="${c.a2}" opacity="0.9"/>
  </g>
</svg>
`;
}

/* ------------------------------------------------------------------ 数据 */
const LEVEL = (n) => (n <= 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4);
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

async function gql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + (process.env.GH_TOKEN || process.env.GITHUB_TOKEN),
      'Content-Type': 'application/json',
      'User-Agent': 'profile-build',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchStats() {
  const q = `query($login: String!) {
    user(login: $login) {
      followers { totalCount }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
        totalCount
        nodes { name stargazerCount }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }`;
  const { user } = await gql(q, { login: USER });

  let stars = 0;
  for (const r of user.repositories.nodes) stars += r.stargazerCount;

  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const headers = { Authorization: 'Bearer ' + token, 'User-Agent': 'profile-build', Accept: 'application/vnd.github+json' };
  const repos = user.repositories.nodes.filter((r) => r.name !== USER);
  const langs = {};
  for (const r of repos) {
    try {
      const res = await fetch('https://api.github.com/repos/' + USER + '/' + r.name + '/languages', { headers });
      if (!res.ok) continue;
      const data = await res.json();
      for (const [k, v] of Object.entries(data)) langs[k] = (langs[k] || 0) + v;
    } catch (e) { /* 单个仓库失败不影响整体 */ }
  }
  const totalBytes = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
  const topLangs = Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, bytes]) => ({ name, pct: (bytes / totalBytes) * 100 }));

  const cal = user.contributionsCollection.contributionCalendar;
  return {
    totalContributions: cal.totalContributions,
    weeks: cal.weeks.map((w) => w.contributionDays.map((d) => d.contributionCount)),
    dates: cal.weeks.map((w) => w.contributionDays.map((d) => d.date)),
    repos: user.repositories.totalCount,
    stars,
    followers: user.followers.totalCount,
    langs: topLangs,
  };
}

const LANG_COLOR = {
  'C#': '#178600', Python: '#3572A5', Kotlin: '#A97BFF', JavaScript: '#f1e05a',
  Java: '#b07219', HTML: '#e34c26', PowerShell: '#012456', TypeScript: '#3178c6',
  CSS: '#563d7c', 'C++': '#f34b7d', C: '#555555', Batchfile: '#C1F12E', Shell: '#89e051',
};

/* ------------------------------------------------------------------ 数据卡 */
function statsCard(variant, s) {
  const c = PALETTE[variant];
  const W = 1180, H = 272;

  const cell = 10, step = 13;
  const x0 = 44, y0 = 100;
  const weeks = s.weeks;

  let cells = '';
  let months = '';
  let prev = -1;
  weeks.forEach((days, wi) => {
    const m = Number(s.dates[wi][0].slice(5, 7));
    if (m !== prev) {
      if (wi > 0) {
        months += '  <text x="' + (x0 + wi * step) + '" y="' + (y0 - 12) + '" font-family="' + MONO + '" font-size="10" fill="' + c.faint + '">' + MONTHS[m - 1] + '</text>\n';
      }
      prev = m;
    }
    days.forEach((n, di) => {
      cells += '<rect x="' + (x0 + wi * step) + '" y="' + (y0 + di * step) + '" width="' + cell + '" height="' + cell + '" rx="2.6" fill="' + c.heat[LEVEL(n)] + '"/>\n';
    });
  });

  const nums = [
    ['CONTRIBUTIONS', s.totalContributions],
    ['PUBLIC REPOS', s.repos],
    ['STARS EARNED', s.stars],
    ['FOLLOWERS', s.followers],
  ];
  const numSvg = nums.map(([label, val], i) => {
    const x = 790 + (i % 2) * 200;
    const y = 118 + Math.floor(i / 2) * 78;
    return '  <text x="' + x + '" y="' + y + '" font-family="' + SANS + '" font-size="34" font-weight="800" fill="' + c.text + '">' + val + '</text>\n' +
      '  <text x="' + x + '" y="' + (y + 20) + '" font-family="' + MONO + '" font-size="10.5" letter-spacing="1.6" fill="' + c.faint + '">' + label + '</text>\n';
  }).join('');

  const barY = 214, barW = 660;
  let barX = 44;
  const bars = s.langs.map((l, i) => {
    const w = Math.max(3, (l.pct / 100) * barW);
    const seg = '<rect x="' + barX + '" y="' + barY + '" width="' + w + '" height="8" rx="' + (i === 0 ? 4 : 0) + '" fill="' + (LANG_COLOR[l.name] || c.a1) + '"/>\n';
    barX += w;
    return seg;
  }).join('');

  const legend = s.langs.map((l, i) => {
    const x = 44 + i * 130;
    return '  <circle cx="' + x + '" cy="240" r="3.5" fill="' + (LANG_COLOR[l.name] || c.a1) + '"/>\n' +
      '  <text x="' + (x + 10) + '" y="244" font-family="' + MONO + '" font-size="11" fill="' + c.muted + '">' + esc(l.name) + ' ' + l.pct.toFixed(0) + '%</text>\n';
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="GitHub 数据">
  <defs>
    <linearGradient id="sbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.bg1}"/><stop offset="1" stop-color="${c.bg2}"/>
    </linearGradient>
    <linearGradient id="srule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c.a1}" stop-opacity="0.9"/><stop offset="1" stop-color="${c.a2}" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sbg)"/>
  <text x="44" y="46" font-family="${MONO}" font-size="12" letter-spacing="3.2" fill="${c.a1}">// GITHUB · LAST 12 MONTHS</text>
  <text x="${W - 44}" y="46" text-anchor="end" font-family="${MONO}" font-size="11" fill="${c.faint}">更新于 ${new Date().toISOString().slice(0, 10)}</text>
  <rect x="44" y="58" width="${W - 88}" height="1" fill="url(#srule)" opacity="0.5"/>

${months}${cells}
  <text x="44" y="${barY - 10}" font-family="${MONO}" font-size="10.5" letter-spacing="1.6" fill="${c.faint}">LANGUAGES</text>
  <rect x="44" y="${barY}" width="${barW}" height="8" rx="4" fill="${c.heat[0]}"/>
${bars}${legend}
${numSvg}</svg>
`;
}

/* ------------------------------------------------------------------ main */
async function main() {
  await mkdir(OUT, { recursive: true });
  for (const v of ['dark', 'light']) {
    await writeFile(join(OUT, 'hero-' + v + '.svg'), hero(v), 'utf8');
  }
  console.log('✓ hero-dark.svg / hero-light.svg');

  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('· 没有 GH_TOKEN，跳过数据卡');
    return;
  }
  try {
    const s = await fetchStats();
    for (const v of ['dark', 'light']) {
      await writeFile(join(OUT, 'stats-' + v + '.svg'), statsCard(v, s), 'utf8');
    }
    console.log('✓ stats-dark.svg / stats-light.svg', JSON.stringify({
      contributions: s.totalContributions, repos: s.repos, stars: s.stars,
      langs: s.langs.map((l) => l.name + ' ' + l.pct.toFixed(1) + '%'),
    }));
  } catch (e) {
    console.error('✗ 数据卡生成失败：' + e.message);
  }
}

main();
