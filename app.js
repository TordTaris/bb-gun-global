import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const supabase = createClient(
  'https://jtckadonwzdlzxyiighv.supabase.co',
  'sb_publishable_qu8VnT7l-rSZ4wpNwR6eFA_lzSurBgf'
);
const $ = id => document.getElementById(id);
$('year').textContent = new Date().getFullYear();

const products = [
  { id:'pistol', name:'BB Pistol', category:'Pistol', description:'Illustrative BB pistol replica category. Check local classification, age restrictions and permitted use.', image:'https://commons.wikimedia.org/wiki/Special:FilePath/Airsoft_pistol.jpg' },
  { id:'rifle', name:'BB Rifle', category:'Rifle', description:'Illustrative BB rifle replica category. Image is a visual reference, not a product offer or legal classification.', image:'https://commons.wikimedia.org/wiki/Special:FilePath/AirsoftG36.jpg' },
  { id:'smg', name:'BB SMG', category:'SMG', description:'Illustrative compact airsoft replica category. Local rules and permitted use vary by country.', image:'https://commons.wikimedia.org/wiki/Special:FilePath/Airsoftguns.jpg' },
  { id:'sniper', name:'BB Sniper-style replica', category:'Sniper', description:'Illustrative long-format replica category. This platform does not assess specifications, performance or legality.', image:'https://commons.wikimedia.org/wiki/Special:FilePath/Airsoftguns.jpg' }
];
const categories = ['All', 'Pistol', 'Rifle', 'SMG', 'Sniper'];
let activeCategory = 'All';
let mode = 'signin';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function setMessage(id, message, isError = false) {
  const node = $(id);
  if (!node) return;
  node.textContent = message;
  node.dataset.state = isError ? 'error' : 'success';
}
function renderCategories() {
  $('market-categories').innerHTML = categories.map(category =>
    '<button type="button" class="category-chip ' + (activeCategory === category ? 'active' : '') +
    '" data-category="' + category + '">' + category + '</button>'
  ).join('');
}
function renderProducts(query = '') {
  const normalized = query.trim().toLowerCase();
  const rows = products.filter(product =>
    (activeCategory === 'All' || product.category === activeCategory) &&
    (product.name + ' ' + product.category + ' ' + product.description).toLowerCase().includes(normalized)
  );
  $('market-products').innerHTML = rows.length ? rows.map(product => `
    <article class="product-card">
      <div class="product-photo">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)} illustrative image" loading="lazy" referrerpolicy="no-referrer">
        <span>ILLUSTRATIVE REFERENCE</span>
      </div>
      <div class="product-copy"><small>BB GUN CATEGORY / ${escapeHtml(product.category.toUpperCase())}</small>
        <h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p>
        <details><summary>Information &amp; responsible use</summary><p>Images are illustrative only. No stock, price, purchase, rental or fulfilment is offered. Confirm applicable laws and safety requirements with local authorities and the venue.</p></details>
        <span class="status-pill">INFORMATION ONLY · SALES DISABLED</span>
      </div>
    </article>`).join('') : '<div class="empty-state"><span>⌕</span><strong>No matching categories</strong><p>Try another search or select All.</p></div>';
  $('market-products').querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
    img.closest('.product-photo')?.classList.add('image-missing');
    img.remove();
  }, { once:true }));
}

document.querySelectorAll('.auth-tab').forEach(button => button.addEventListener('click', () => {
  mode = button.dataset.mode;
  document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.toggle('active', tab === button));
  $('auth-submit').innerHTML = (mode === 'signup' ? 'Create account' : 'Sign in') + ' <span>↗</span>';
  $('auth-password').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
}));
async function refreshSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) setMessage('auth-message', error.message, true);
  const session = data?.session;
  $('auth-panel').hidden = !!session;
  $('member-panel').hidden = !session;
  $('member-email').textContent = session?.user?.email || '';
  return session || null;
}
$('auth-form').addEventListener('submit', async event => {
  event.preventDefault();
  const button = $('auth-submit');
  button.disabled = true;
  setMessage('auth-message', 'Connecting securely…');
  const email = $('auth-email').value.trim();
  const password = $('auth-password').value;
  const result = mode === 'signup'
    ? await supabase.auth.signUp({ email, password })
    : await supabase.auth.signInWithPassword({ email, password });
  button.disabled = false;
  if (result.error) return setMessage('auth-message', result.error.message, true);
  setMessage('auth-message', mode === 'signup' && !result.data.session
    ? 'Account created. Check your email to confirm your address.'
    : 'You are signed in.');
  await refreshSession();
});
$('signout-btn').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) setMessage('auth-message', error.message, true);
  else { setMessage('auth-message', 'Signed out.'); await refreshSession(); }
});
supabase.auth.onAuthStateChange(() => { refreshSession(); });

$('partner-form').addEventListener('submit', async event => {
  event.preventDefault();
  const session = await refreshSession();
  if (!session) {
    setMessage('partner-message', 'Please sign in before submitting an application.', true);
    $('account').scrollIntoView({ behavior:'smooth' });
    return;
  }
  const country = $('partner-country').value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) return setMessage('partner-message', 'Enter a valid two-letter country code.', true);
  const row = {
    user_id: session.user.id,
    organization_name: $('partner-name').value.trim(),
    partner_type: $('partner-type').value,
    country_code: country,
    website_url: $('partner-website').value.trim() || null
  };
  const { error } = await supabase.from('partner_applications').insert(row);
  if (error) setMessage('partner-message', error.message, true);
  else { $('partner-form').reset(); setMessage('partner-message', 'Application submitted for review. This is not transaction approval.'); }
});

async function fetchVenues(query = '') {
  const root = $('venue-results');
  const { data, error } = await supabase.from('venue_directory')
    .select('venue_name,venue_type,country_code,city,region')
    .eq('is_published', true).eq('compliance_status', 'approved').order('venue_name');
  if (error) {
    root.innerHTML = '<div class="empty-state"><strong>Directory temporarily unavailable</strong><p>We could not load approved listings. Please try again later.</p></div>';
    return;
  }
  const q = query.trim().toLowerCase();
  const rows = (data || []).filter(venue =>
    [venue.venue_name, venue.venue_type, venue.country_code, venue.city, venue.region]
      .some(value => String(value || '').toLowerCase().includes(q))
  );
  root.innerHTML = rows.length ? rows.map((venue, index) => `
    <article class="venue-card"><span class="venue-number">${String(index + 1).padStart(2,'0')}</span>
      <div><small>${escapeHtml((venue.venue_type || 'VENUE').replaceAll('_',' ').toUpperCase())}</small>
      <h3>${escapeHtml(venue.venue_name)}</h3><p>${escapeHtml([venue.city,venue.region,venue.country_code].filter(Boolean).join(', '))}</p>
      <span class="status-pill">COMPLIANCE APPROVED LISTING</span></div>
    </article>`).join('')
    : '<div class="empty-state"><span>◎</span><strong>No approved venues found</strong><p>Listings appear only after review and publication.</p></div>';
}
$('search-btn').addEventListener('click', () => fetchVenues($('venue-search').value));
$('venue-search').addEventListener('keydown', event => { if (event.key === 'Enter') fetchVenues($('venue-search').value); });
$('market-search').addEventListener('input', event => renderProducts(event.target.value));
$('market-categories').addEventListener('click', event => {
  const category = event.target.dataset.category;
  if (!category) return;
  activeCategory = category;
  renderCategories();
  renderProducts($('market-search').value);
});

renderCategories();
renderProducts();
await refreshSession();
await fetchVenues();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
