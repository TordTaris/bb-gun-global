document.getElementById('year').textContent = new Date().getFullYear();
const search = document.getElementById('venue-search');
const results = document.getElementById('venue-results');
document.getElementById('search-btn').addEventListener('click', () => {
  const query = search.value.trim();
  results.innerHTML = query
    ? '<div class="search-empty"><p class="eyebrow">NO VERIFIED LISTINGS YET</p><h3>We are building the network in your area.</h3><p>Try again later as local venues and compliance reviews are added.</p></div>'
    : '<div class="search-empty"><p>Please enter a city, country or venue name.</p></div>';
});
search.addEventListener('keydown', event => { if (event.key === 'Enter') document.getElementById('search-btn').click(); });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}