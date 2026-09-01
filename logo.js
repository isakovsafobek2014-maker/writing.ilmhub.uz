// js/components/logo.js

const LogoComponent = {
  render(size = 40, showSubtext = true) {
    const safeSize = (typeof size === 'number' && !isNaN(size)) ? size : 40;

    return `
      <div class="ilmhub-logo-header" style="display: inline-flex; align-items: center; gap: 12px; user-select: none;">
        <img 
          src="/assets/photo_2025-10-02_12-01-23.jpg" 
          alt="IlmHub Logo"
          onerror="console.error('Rasm yuklanmadi! Path xato:', this.src);"
          style="
            width: ${safeSize}px; 
            height: ${safeSize}px; 
            object-fit: cover; 
            border-radius: 10px; 
            flex-shrink: 0; 
            display: block;
          "
        />
        
        <div style="display: flex; flex-direction: column; justify-content: center; line-height: 1.1;">
          <span style="font-weight: 800; font-size: 21px; color: var(--text-primary, #0f172a); font-family: system-ui, -apple-system, sans-serif; letter-spacing: -0.4px;">
            ilmhub
          </span>
          ${showSubtext ? `
            <span style="font-weight: 600; font-size: 13px; color: #0052CC; font-family: system-ui, -apple-system, sans-serif; letter-spacing: 0.2px;">
              writing
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }
};