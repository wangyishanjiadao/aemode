document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.sidebar nav a');
    const contentBlocks = document.querySelectorAll('.content-block');
    const searchInput = document.querySelector('header input[type="search"]');
    let currentMatchIndex = -1;
    let matches = [];

    // 创建导航按钮
    const navButtons = document.createElement('div');
    navButtons.className = 'search-nav';
    navButtons.innerHTML = `
        <button class="nav-up" disabled>&uarr;</button>
        <button class="nav-down" disabled>&darr;</button>
    `;
    document.body.appendChild(navButtons);

    // 侧边栏导航功能
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetContent = this.getAttribute('data-content');

            contentBlocks.forEach(block => {
                block.style.display = 'none';
            });

            const targetBlock = document.getElementById(`${targetContent}-content`);
            if (targetBlock) {
                targetBlock.style.display = 'block';
            }
        });
    });

    // 搜索功能
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        matches = [];
        
        if (searchTerm) {
            // 搜索所有内容块中的h2标签
            contentBlocks.forEach(block => {
                const h2s = block.querySelectorAll('h2');
                h2s.forEach(h2 => {
                    if (h2.textContent.toLowerCase().includes(searchTerm)) {
                        // 保存匹配项及其所属内容块ID
                        matches.push({
                            element: h2,
                            contentId: block.id.replace('-content', '')
                        });
                    }
                });
            });

            if (matches.length > 0) {
                currentMatchIndex = 0;
                scrollToMatch(currentMatchIndex);
            }
        } else {
            resetSearch();
        }
        updateNavButtons();
    });

    // 回车键显示所有结果
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            if (matches.length > 0) {
                showAllMatches();
            }
        }
    });

    // 导航按钮事件
    navButtons.querySelector('.nav-up').addEventListener('click', () => {
        if (currentMatchIndex > 0) {
            currentMatchIndex--;
            scrollToMatch(currentMatchIndex);
        }
        updateNavButtons();
    });

    navButtons.querySelector('.nav-down').addEventListener('click', () => {
        if (currentMatchIndex < matches.length - 1) {
            currentMatchIndex++;
            scrollToMatch(currentMatchIndex);
        }
        updateNavButtons();
    });

    function scrollToMatch(index) {
        if (matches[index]) {
            const match = matches[index];
            // 切换到匹配项所在的内容分类
            contentBlocks.forEach(block => {
                block.style.display = 'none';
            });
            const targetBlock = document.getElementById(`${match.contentId}-content`);
            if (targetBlock) {
                targetBlock.style.display = 'block';
                // 滚动到匹配项
                match.element.scrollIntoView({ behavior: 'smooth' });
                // 移除之前的高亮
                document.querySelectorAll('.highlight').forEach(el => {
                    el.classList.remove('highlight');
                });
                // 添加新高亮
                match.element.classList.add('highlight');
            }
        }
    }

    function updateNavButtons() {
        const upBtn = navButtons.querySelector('.nav-up');
        const downBtn = navButtons.querySelector('.nav-down');
        
        upBtn.disabled = currentMatchIndex <= 0 || matches.length === 0;
        downBtn.disabled = currentMatchIndex >= matches.length - 1 || matches.length === 0;
    }

    function showAllMatches() {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        resultsContainer.innerHTML = '<h3>搜索结果:</h3>';
        
        matches.forEach((match, index) => {
            const result = document.createElement('div');
            result.className = 'search-result';
            // 显示分类名称和匹配内容
            result.innerHTML = `
                <div class="category">${match.contentId}</div>
                <div class="content">${match.element.textContent}</div>
            `;
            result.addEventListener('click', () => {
                currentMatchIndex = index;
                scrollToMatch(currentMatchIndex);
            });
            resultsContainer.appendChild(result);
        });

        // 移除旧的结果容器
        const oldResults = document.querySelector('.search-results');
        if (oldResults) oldResults.remove();
        
        document.body.appendChild(resultsContainer);
    }

    function resetSearch() {
        currentMatchIndex = -1;
        matches = [];
        document.querySelectorAll('.highlight').forEach(el => {
            el.classList.remove('highlight');
        });
        const results = document.querySelector('.search-results');
        if (results) results.remove();
    }
});