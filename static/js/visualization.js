// ── Config ────────────────────────────────────────────────────────────────────
const MARGIN = { top: 20, right: 30, bottom: 60, left: 130 };
const DOT_R  = 9;
const EXPLICIT_COLOR = '#7c3aed';  // purple
const IMPLICIT_COLOR = '#9ca3af';  // gray

const baseURL = window.location.pathname.includes('/asexualityinmedia')
  ? '/asexualityinmedia' : '';

let allCharacters = [];
let filteredCharacters = [];

// Create tooltip once
const tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('display', 'none');

// ── Data load ─────────────────────────────────────────────────────────────────
d3.json(`${baseURL}/data/characters.json`).then(data => {
  allCharacters       = data;
  filteredCharacters  = data;
  populateFilters(data);
  updateVisualization();
  updateCounts();
});

// ── Filters ───────────────────────────────────────────────────────────────────
function populateFilters(data) {
  const genres    = [...new Set(data.map(d => d.genre).filter(Boolean))].sort();
  const languages = [...new Set(data.map(d => d.language).filter(Boolean))].sort();

  genres.forEach(g =>
    d3.select('#genre-filter').append('option').attr('value', g).text(g));
  languages.forEach(l =>
    d3.select('#language-filter').append('option').attr('value', l).text(l));

  ['#genre-filter','#language-filter','#type-filter','#media-filter']
    .forEach(id => d3.select(id).on('change', applyFilters));
  d3.select('#search').on('input', applyFilters);
}

function applyFilters() {
  const genre    = d3.select('#genre-filter').property('value');
  const language = d3.select('#language-filter').property('value');
  const type     = d3.select('#type-filter').property('value');
  const media    = d3.select('#media-filter').property('value');
  const search   = d3.select('#search').property('value').toLowerCase();

  filteredCharacters = allCharacters.filter(d => {
    if (genre    !== 'all' && d.genre     !== genre)    return false;
    if (language !== 'all' && d.language  !== language) return false;
    if (type     !== 'all' && d.type      !== type)     return false;
    if (media    !== 'all' && d.mediaType !== media)    return false;
    if (search && !d.fullName?.toLowerCase().includes(search)
               && !d.title?.toLowerCase().includes(search)
               && !d.nickname?.toLowerCase().includes(search)) return false;
    return true;
  });

  updateVisualization();
  updateCounts();
}

// ── Chart ─────────────────────────────────────────────────────────────────────
function updateVisualization() {
  const container = document.getElementById('chart');
  container.innerHTML = '';

  if (filteredCharacters.length === 0) {
    container.innerHTML =
      '<p style="text-align:center;padding:3rem;color:#6b7280">No characters match your filters.</p>';
    return;
  }

  const W = container.clientWidth || 900;

  // Genres across ALL data so Y-axis doesn't shift when filtering
  const allGenres     = [...new Set(allCharacters.map(d => d.genre).filter(Boolean))].sort();
  const presentGenres = new Set(filteredCharacters.map(d => d.genre));
  const visGenres     = allGenres.filter(g => presentGenres.has(g));

  const H       = Math.max(420, visGenres.length * 90 + MARGIN.top + MARGIN.bottom);
  const innerW  = W - MARGIN.left - MARGIN.right;
  const innerH  = H - MARGIN.top - MARGIN.bottom;

  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', W)
    .attr('height', H);

  const g = svg.append('g')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

  // ── Scales ────────────────────────────────────────────────────────────────
  const years = filteredCharacters.map(d => d.year).filter(Boolean);
  const xMin  = Math.min(...years, 2000) - 3;
  const xMax  = Math.max(...years, 2024) + 3;
  const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, innerW]);

  const yScale = d3.scaleBand()
    .domain(visGenres)
    .range([0, innerH])
    .padding(0.35);

  const bandH = yScale.bandwidth();

  // ── Background bands ──────────────────────────────────────────────────────
  visGenres.forEach((genre, i) => {
    g.append('rect')
      .attr('x', 0)
      .attr('y', yScale(genre))
      .attr('width', innerW)
      .attr('height', bandH)
      .attr('fill', i % 2 === 0 ? 'rgba(124,58,237,0.04)' : 'transparent')
      .attr('rx', 4);
  });

  // ── Year grid lines ───────────────────────────────────────────────────────
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisBottom(xScale).tickSize(innerH).tickFormat('').ticks(12))
    .call(ax => {
      ax.select('.domain').remove();
      ax.selectAll('line')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-dasharray', '3,4');
    });

  // ── Axes ─────────────────────────────────────────────────────────────────
  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(12))
    .call(ax => {
      ax.select('.domain').attr('stroke', '#d1d5db');
      ax.selectAll('text').attr('fill', '#4b5563').attr('font-size', '11px');
      ax.selectAll('line').attr('stroke', '#d1d5db');
    });

  g.append('g')
    .call(d3.axisLeft(yScale).tickSize(0))
    .call(ax => {
      ax.select('.domain').remove();
      ax.selectAll('text')
        .attr('fill', '#374151')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('dx', '-10px');
    });

  // X label
  g.append('text')
    .attr('x', innerW / 2)
    .attr('y', innerH + 50)
    .attr('text-anchor', 'middle')
    .attr('fill', '#9ca3af')
    .attr('font-size', '12px')
    .text('Release Year');

  // ── Jitter (deterministic, avoids per-render randomness) ──────────────────
  const slotTotal = {};
  const slotIdx   = {};
  filteredCharacters.forEach(d => {
    const k = `${d.genre}-${d.year}`;
    slotTotal[k] = (slotTotal[k] || 0) + 1;
  });
  filteredCharacters.forEach(d => {
    const k = `${d.genre}-${d.year}`;
    slotIdx[k] = slotIdx[k] !== undefined ? slotIdx[k] + 1 : 0;
    d._si = slotIdx[k];
    d._st = slotTotal[k];
  });

  function yPos(d) {
    const band = yScale(d.genre);
    if (band === undefined) return innerH / 2;
    const center = band + bandH / 2;
    if (d._st === 1) return center;
    const spread = Math.min(bandH * 0.55, (d._st - 1) * (DOT_R * 2.4));
    return center - spread / 2 + d._si * (spread / (d._st - 1));
  }

  // ── Draw nodes ────────────────────────────────────────────────────────────
  const nodes = g.selectAll('.char-node')
    .data(filteredCharacters, d => d.id)
    .join('g')
    .attr('class', 'char-node')
    .attr('transform', d => `translate(${xScale(d.year)},${yPos(d)})`)
    .style('cursor', 'pointer');

  nodes.each(function(d) {
    const el      = d3.select(this);
    const color   = d.type === 'explicit' ? EXPLICIT_COLOR : IMPLICIT_COLOR;
    const opacity = d.canonStatus === 'speculated' ? 0.40 : 0.85;
    const stroke  = d.canonStatus === 'speculated' ? '3,2' : null;

    if (d.mediaType === 'Film') {
      // Diamond shape for films
      el.append('rect')
        .attr('x', -DOT_R * 0.78)
        .attr('y', -DOT_R * 0.78)
        .attr('width',  DOT_R * 1.55)
        .attr('height', DOT_R * 1.55)
        .attr('rx', 2)
        .attr('transform', 'rotate(45)')
        .attr('fill', color)
        .attr('fill-opacity', opacity)
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', stroke);
    } else {
      // Circle for TV
      el.append('circle')
        .attr('r', DOT_R)
        .attr('fill', color)
        .attr('fill-opacity', opacity)
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', stroke);
    }
  });

  // ── Hover ─────────────────────────────────────────────────────────────────
  nodes
    .on('mouseover', function(event, d) {
      d3.select(this).select('circle').attr('r', DOT_R + 3);
      d3.select(this).select('rect')
        .attr('x', -(DOT_R + 3) * 0.78)
        .attr('y', -(DOT_R + 3) * 0.78)
        .attr('width',  (DOT_R + 3) * 1.55)
        .attr('height', (DOT_R + 3) * 1.55);

      const allG   = d.genres?.join(' · ') || d.genre || '';
      const extras = [
        d.gender && d.race ? `${d.gender} · ${d.race}` : (d.gender || d.race || null),
        d.asexualSpectrum   ? `Ace: ${d.asexualSpectrum}` : null,
        d.aromanticSpectrum ? `Aro: ${d.aromanticSpectrum}` : null,
      ].filter(Boolean);

      tooltip.html(`
        <div class="tt-name">
          ${d.fullName}${d.nickname ? `<span class="tt-nick"> (${d.nickname})</span>` : ''}
        </div>
        <div class="tt-show">${d.title}</div>
        <div class="tt-badges">
          <span class="tt-badge tt-${d.type}">${d.type}</span>
          <span class="tt-badge tt-media">${d.mediaType || 'TV'}</span>
          ${d.canonStatus ? `<span class="tt-badge tt-canon">${d.canonStatus}</span>` : ''}
        </div>
        <div class="tt-meta">
          📅 ${d.year || '?'}
          ${d.language ? `&nbsp;·&nbsp; 🌐 ${d.language}` : ''}
          ${d.rating   ? `&nbsp;·&nbsp; ${d.rating}` : ''}
        </div>
        ${allG ? `<div class="tt-genres">${allG}</div>` : ''}
        ${extras.map(e => `<div class="tt-extra">${e}</div>`).join('')}
        ${d.description ? `<div class="tt-desc">${d.description}</div>` : ''}
        <div class="tt-click">Click for full profile →</div>
      `)
      .style('display', 'block');

      posTooltip(event);
    })
    .on('mousemove', posTooltip)
    .on('mouseout', function() {
      d3.select(this).select('circle').attr('r', DOT_R);
      d3.select(this).select('rect')
        .attr('x', -DOT_R * 0.78)
        .attr('y', -DOT_R * 0.78)
        .attr('width',  DOT_R * 1.55)
        .attr('height', DOT_R * 1.55);
      tooltip.style('display', 'none');
    })
    .on('click', (event, d) => {
      window.location.href = `${baseURL}/characters/${d.id}/`;
    });

  // Fade-in animation
  nodes.style('opacity', 0)
    .transition().duration(500).delay((d, i) => i * 15)
    .style('opacity', 1);
}

function posTooltip(event) {
  const el = document.querySelector('.tooltip');
  if (!el) return;
  const tw = el.offsetWidth, th = el.offsetHeight;
  let x = event.pageX + 16, y = event.pageY - th / 2;
  if (x + tw > window.innerWidth  - 10) x = event.pageX - tw - 16;
  if (y < 10) y = 10;
  if (y + th > window.innerHeight - 10) y = window.innerHeight - th - 10;
  tooltip.style('left', x + 'px').style('top', y + 'px');
}

function updateCounts() {
  d3.select('#total-count').text(allCharacters.length);
  d3.select('#visible-count').text(filteredCharacters.length);
}

window.addEventListener('resize', updateVisualization);
