document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('project-list');
    const username = '2sthise';
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`;

    // GitHub API Fetch
    if (projectList) {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`GitHub API Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 로딩 메시지 제거
                projectList.innerHTML = '';

                if (data.length === 0) {
                    projectList.innerHTML = '<p class="loading">표시할 프로젝트가 없어요</p>';
                    return;
                }

                // 프로젝트 카드 생성
                data.forEach(repo => {
                    // 비공개 리포지토리는 API에서 안 보일 수 있음
                    const card = document.createElement('div');
                    card.className = 'card';

                    const description = repo.description || '설명이 없는 프로젝트입니다.';
                    const lang = repo.language || 'Code';
                    const date = new Date(repo.updated_at).toLocaleDateString('ko-KR');

                    card.innerHTML = `
                        <h3>${repo.name}</h3>
                        <p>${description}</p>
                        <a href="${repo.html_url}" target="_blank" class="card-link">View Project &rarr;</a>
                        <div class="card-stats">
                            <span>● ${lang}</span>
                            <span>Updated: ${date}</span>
                        </div>
                    `;
                    projectList.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error fetching repos:', error);
                projectList.innerHTML = `
                    <div class="loading">
                        <p>데이터를 불러오는데 실패했어요</p>
                        <small>${error.message}</small>
                    </div>
                `;
            });
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.textContent = '전송 중...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                content: document.getElementById('content').value
            };

            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || '메시지가 성공적으로 전송되었습니다!');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('메시지 전송에 실패했습니다. 서버 상태를 확인해주세요.');
            })
            .finally(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
});
