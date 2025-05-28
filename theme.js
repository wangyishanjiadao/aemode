// 主题切换功能
document.addEventListener('DOMContentLoaded', () => {
    // 获取主题切换按钮
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // 应用保存的主题
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);
    
    // 添加切换事件
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // 更新主题
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 更新UI
        updateThemeUI(newTheme);
    });
    
    // 更新主题切换按钮的UI
    function updateThemeUI(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = '切换到亮色模式';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = '切换到暗色模式';
        }
    }
});