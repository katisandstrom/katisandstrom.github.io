const qs = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => [...root.querySelectorAll(s)];
const asset = (path = '') => String(path).replace(/^\/+/, '');
const mailHref = email => `mailto:${email}`;
const telHref = phone => `tel:${phone.replace(/[^+\d]/g, '')}`;

let profile = null;
let projects = [];
let currentProject = null;
let currentImage = 0;

async function loadData() {
  const [profileRes, projectsRes] = await Promise.all([
    fetch('data/profile.json', { cache: 'no-store' }),
    fetch('data/projects.json', { cache: 'no-store' })
  ]);
  if (!profileRes.ok || !projectsRes.ok) throw new Error('Kunde inte läsa portfolio-data.');
  profile = await profileRes.json();
  projects = await projectsRes.json();
  renderProfile();
  renderProjects();
}

function renderProfile() {
  qs('#eyebrow').textContent = profile.eyebrow;
  qs('#hero-title').textContent = profile.hero_title;
  qs('#hero-text').textContent = profile.hero_text;
  qs('#about-title').textContent = profile.about_title;
  qs('#tools-title').textContent = profile.tools_title;
  qs('#tools-text').textContent = profile.tools_text;
  qs('#year').textContent = new Date().getFullYear();

  const cv = asset(profile.cv_file);
  qs('#nav-cv').href = cv;
  qs('#cv-button').href = cv;

  const heroMeta = qs('#hero-meta');
  [profile.location, profile.role].forEach(text => {
    const span = document.createElement('span'); span.textContent = text; heroMeta.appendChild(span);
  });

  const stats = qs('#stats-grid');
  profile.stats.forEach(item => {
    const div = document.createElement('div'); div.className = 'stat';
    const strong = document.createElement('strong'); strong.textContent = item.value;
    const span = document.createElement('span'); span.textContent = item.label;
    div.append(strong, span); stats.appendChild(div);
  });

  const about = qs('#about-copy');
  profile.about.forEach(text => { const p = document.createElement('p'); p.textContent = text; about.appendChild(p); });
  const strengths = qs('#strength-list');
  profile.strengths.forEach(text => { const li = document.createElement('li'); li.textContent = text; strengths.appendChild(li); });

  const craft = qs('#craft-skills');
  ['Kap- & gersåg','Cirkelsåg','Skruvdragare','Slipmaskiner','Mätverktyg','Handverktyg'].forEach(addChip.bind(null, craft));

  const mosaic = qs('#tool-mosaic');
  profile.tool_images.forEach((src, i) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = asset(src); img.loading = 'lazy'; img.alt = `Verktyg och utrustning, bild ${i + 1}`;
    figure.appendChild(img); mosaic.appendChild(figure);
  });

  const timeline = qs('#experience-timeline');
  profile.experience.forEach(item => {
    const el = document.createElement('article'); el.className = 'timeline-item reveal';
    const period = document.createElement('div'); period.className = 'timeline-period'; period.textContent = item.period;
    const content = document.createElement('div');
    const h3 = document.createElement('h3'); h3.textContent = item.title;
    const place = document.createElement('p'); place.className = 'timeline-place'; place.textContent = item.place;
    const desc = document.createElement('p'); desc.className = 'timeline-description'; desc.textContent = item.description;
    content.append(h3, place, desc); el.append(period, content); timeline.appendChild(el);
  });

  profile.skills.forEach(addChip.bind(null, qs('#skills-list')));
  profile.languages.forEach(text => addListItem(qs('#languages-list'), text));
  profile.licenses.forEach(text => addListItem(qs('#licenses-list'), text));
  profile.courses.forEach(item => {
    const li = document.createElement('li');
    const year = document.createElement('strong'); year.textContent = item.year;
    const title = document.createElement('span'); title.textContent = item.title;
    li.append(year, title); qs('#courses-list').appendChild(li);
  });

  const contact = qs('#contact-actions');
  contact.appendChild(contactLink(mailHref(profile.email), profile.email, 'E-post'));
  contact.appendChild(contactLink(telHref(profile.phone), profile.phone, 'Telefon'));

  const featured = projects.find(p => p.featured && p.images?.length) || projects[0];
  if (featured) {
    qs('#hero-image').src = asset(featured.images[0]);
    qs('#hero-image').alt = `${featured.title}, ett projekt av Kati Sandström`;
    qs('#hero-project-name').textContent = featured.title;
  }
}

function renderProjects(filter = 'Alla') {
  const grid = qs('#project-grid'); grid.innerHTML = '';
  const categories = ['Alla', ...new Set(projects.map(p => p.category))];
  const filters = qs('#project-filters');
  if (!filters.childElementCount) {
    categories.forEach(category => {
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = `filter-button${category === 'Alla' ? ' active' : ''}`;
      btn.textContent = category;
      btn.addEventListener('click', () => {
        qsa('.filter-button', filters).forEach(b => b.classList.toggle('active', b === btn));
        renderProjects(category);
      });
      filters.appendChild(btn);
    });
  }
  const visible = filter === 'Alla' ? projects : projects.filter(p => p.category === filter);
  visible.forEach((project, index) => {
    const card = document.createElement('button');
    card.type = 'button'; card.className = `project-card reveal${project.featured ? ' featured' : ''}`;
    card.setAttribute('aria-label', `Öppna projekt: ${project.title}`);
    const media = document.createElement('div'); media.className = 'project-card-image';
    const img = document.createElement('img'); img.src = asset(project.images?.[0]); img.alt = project.title; img.loading = index < 4 ? 'eager' : 'lazy';
    media.appendChild(img);
    if ((project.images?.length || 0) > 1) { const count = document.createElement('span'); count.className = 'image-count'; count.textContent = `${project.images.length} bilder`; media.appendChild(count); }
    const copy = document.createElement('div'); copy.className = 'project-card-copy';
    const cat = document.createElement('span'); cat.className = 'category'; cat.textContent = project.category;
    const h3 = document.createElement('h3'); h3.textContent = project.title;
    const p = document.createElement('p'); p.textContent = project.summary;
    copy.append(cat, h3, p); card.append(media, copy);
    card.addEventListener('click', () => openProject(project)); grid.appendChild(card);
  });
  observeReveals();
}

function openProject(project) {
  currentProject = project; currentImage = 0;
  qs('#dialog-category').textContent = project.category;
  qs('#dialog-title').textContent = project.title;
  qs('#dialog-summary').textContent = project.summary;
  qs('#dialog-description').textContent = project.description;
  const tags = qs('#dialog-tags'); tags.innerHTML = ''; (project.tags || []).forEach(addChip.bind(null, tags));
  const thumbs = qs('#dialog-thumbnails'); thumbs.innerHTML = '';
  (project.images || []).forEach((src, index) => {
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = `thumb-button${index === 0 ? ' active' : ''}`; btn.setAttribute('aria-label', `Visa bild ${index + 1}`);
    const img = document.createElement('img'); img.src = asset(src); img.alt = '';
    btn.appendChild(img); btn.addEventListener('click', () => showImage(index)); thumbs.appendChild(btn);
  });
  showImage(0);
  const dialog = qs('#project-dialog'); dialog.showModal(); document.body.classList.add('dialog-open');
}

function showImage(index) {
  const images = currentProject?.images || [];
  if (!images.length) return;
  currentImage = (index + images.length) % images.length;
  const img = qs('#dialog-image'); img.src = asset(images[currentImage]); img.alt = `${currentProject.title}, bild ${currentImage + 1} av ${images.length}`;
  qs('#gallery-counter').textContent = `${currentImage + 1} / ${images.length}`;
  qs('#gallery-prev').hidden = images.length < 2; qs('#gallery-next').hidden = images.length < 2;
  qsa('.thumb-button', qs('#dialog-thumbnails')).forEach((b, i) => b.classList.toggle('active', i === currentImage));
}

function addChip(root, text) { const span = document.createElement('span'); span.className = 'chip'; span.textContent = text; root.appendChild(span); }
function addListItem(root, text) { const li = document.createElement('li'); li.textContent = text; root.appendChild(li); }
function contactLink(href, value, label) {
  const a = document.createElement('a'); a.className = 'contact-link'; a.href = href;
  const left = document.createElement('span'); left.textContent = value; const right = document.createElement('span'); right.textContent = `${label} ↗`;
  a.append(left, right); return a;
}

function observeReveals() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { qsa('.reveal').forEach(el => el.classList.add('visible')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .08 });
  qsa('.reveal:not(.visible)').forEach(el => io.observe(el));
}

function setupUI() {
  const toggle = qs('.menu-toggle'); const nav = qs('#main-nav');
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
  qsa('a', nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }));
  qs('#dialog-close').addEventListener('click', () => qs('#project-dialog').close());
  qs('#gallery-prev').addEventListener('click', () => showImage(currentImage - 1));
  qs('#gallery-next').addEventListener('click', () => showImage(currentImage + 1));
  qs('#project-dialog').addEventListener('close', () => document.body.classList.remove('dialog-open'));
  qs('#project-dialog').addEventListener('click', e => { if (e.target === qs('#project-dialog')) qs('#project-dialog').close(); });
  document.addEventListener('keydown', e => {
    if (!qs('#project-dialog').open) return;
    if (e.key === 'ArrowLeft') showImage(currentImage - 1);
    if (e.key === 'ArrowRight') showImage(currentImage + 1);
  });
}

setupUI();
loadData().then(observeReveals).catch(err => {
  console.error(err);
  const grid = qs('#project-grid');
  grid.innerHTML = '<p>Portfolion kunde inte laddas. Öppna sidan via en webbserver eller GitHub Pages.</p>';
  observeReveals();
});
