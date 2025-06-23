document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.sidebar nav > ul > li > a');
    const contentBlocks = document.querySelectorAll('.content-block');
    const searchInput = document.querySelector('header input[type="search"]');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    let currentMatchIndex = -1;
    let matches = [];
    
    // 响应式菜单功能
    if (menuToggle && sidebar && sidebarOverlay) {
        // 汉堡菜单点击事件
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });
        
        // 遮罩层点击事件
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        });
        
        // 在小屏幕上点击导航链接后关闭侧边栏
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            });
        });
        
        // 窗口大小变化时处理
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    }

    // 生成子菜单的函数
    function generateSubmenus() {
        // 遍历每个内容区域
        contentBlocks.forEach(block => {
            const contentId = block.id.replace('-content', '');
            const submenu = document.getElementById(`${contentId}-submenu`);
            const h2Tags = block.querySelectorAll('h2');
            
            // 为每个h2标签创建子菜单项
            h2Tags.forEach((h2, index) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = h2.textContent;
                
                // 添加点击事件
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    // 显示对应的内容区域
                    contentBlocks.forEach(b => b.style.display = 'none');
                    block.style.display = 'block';
                    // 滚动到对应的h2标签
                    h2.scrollIntoView({ behavior: 'smooth' });
                });
                
                li.appendChild(a);
                submenu.appendChild(li);
            });
        });

        // 为主导航添加点击事件，控制子菜单的展开/折叠
        navLinks.forEach(link => {
            const submenu = link.parentElement.querySelector('.submenu');
            if (submenu) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isExpanded = submenu.classList.contains('expanded');
                    
                    // 折叠所有子菜单
                    document.querySelectorAll('.submenu').forEach(menu => {
                        menu.classList.remove('expanded');
                        menu.classList.remove('overflow');
                    });
                    
                    // 如果当前子菜单未展开，则展开它
                    if (!isExpanded) {
                        submenu.classList.add('expanded');
                        
                        // 检查子菜单是否需要滚动
                        setTimeout(() => {
                            if (submenu.scrollHeight > submenu.clientHeight) {
                                submenu.classList.add('overflow');
                            }
                        }, 300); // 等待展开动画完成
                    }
                });
            }
        });
    }

    // 初始化子菜单
    generateSubmenus();

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