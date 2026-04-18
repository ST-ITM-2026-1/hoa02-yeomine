document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-mode');

      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));

        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');

          if (filterValue === 'all' || filterValue === category) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  fetchGitHubData();
});

async function fetchGitHubData() {
  const username = 'yeomine';
  const profileContainer = document.getElementById('github-profile-container');
  const reposContainer = document.getElementById('github-repos-container');

  if (!profileContainer || !reposContainer) return;

  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`);
    if (!profileRes.ok) throw new Error('failed to fetch profile');
    const profileData = await profileRes.json();

    profileContainer.innerHTML = `
      <div class="github-profile">
        <img src="${profileData.avatar_url}" alt="GitHub Avatar" class="github-avatar">
        <div class="github-info">
          <h2>${profileData.name || profileData.login}</h2>
          <p class="github-bio">${profileData.bio || 'Passionate ITM student bridging technology and finance.'}</p>
          
          <div class="github-badges">
            <div class="stat-badge">
              <span class="badge-icon">📂</span>
              <span class="badge-value">${profileData.public_repos}</span>
              <span class="badge-label">Repos</span>
            </div>
            <div class="stat-badge">
              <span class="badge-icon">👥</span>
              <span class="badge-value">${profileData.followers}</span>
              <span class="badge-label">Followers</span>
            </div>
            <div class="stat-badge">
              <span class="badge-icon">🤝</span>
              <span class="badge-value">${profileData.following}</span>
              <span class="badge-label">Following</span>
            </div>
          </div>
          
          <a href="${profileData.html_url}" target="_blank" class="github-link-btn">
            View full profile on GitHub
          </a>
        </div>
      </div>
    `;

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated`,
    );
    if (!reposRes.ok) throw new Error('failed to fetch repositories');
    const reposData = await reposRes.json();

    let reposHTML = '';
    reposData.forEach((repo) => {
      const langIcon =
        repo.language === 'JavaScript'
          ? 'JavaScript'
          : repo.language === 'Python'
            ? 'Python'
            : repo.language === 'HTML'
              ? 'HTML'
              : repo.language === 'C++'
                ? 'C++'
                : repo.language === 'Dart'
                  ? 'Flutter'
                  : repo.language || 'N/A';

      reposHTML += `
        <div class="repo-card project-card">
          <div class="repo-header">
            <h3>${repo.name}</h3>
            <span class="lang-badge">${langIcon}</span>
          </div>
          <p class="repo-desc">${repo.description || 'No description provided.'}</p>
          
          <div class="repo-meta-grid">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="meta-icon">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              ${repo.stargazers_count}
            </div>
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="meta-icon">
                <circle cx="12" cy="18" r="3"></circle>
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="18" cy="6" r="3"></circle>
                <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
                <path d="M12 12v3"></path>
              </svg>
              ${repo.forks_count}
            </div>
          </div>
          <a href="${repo.html_url}" target="_blank" class="repo-link github-link">
            View Repo
          </a>
        </div>
      `;
    });

    reposContainer.innerHTML = reposHTML;
  } catch (error) {
    profileContainer.innerHTML = `<p class="error-text">Failed to load GitHub data.</p>`;
    reposContainer.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchGitHubData();
});
