import { SelectedComponent } from "@/types/templates";
import { getIconSvg } from "./icon-registry";

/**
 * Merkezi section isim haritası
 * Tüm navigation template'leri bu haritayı kullanır
 */
export const SECTION_NAME_MAP: Record<string, string> = {
    'hero': 'Ana Sayfa',
    'experience': 'Deneyim',
    'education': 'Eğitim',
    'portfolio': 'Portfolio',
    'skills': 'Yetenekler',
    'languages': 'Diller',
    'contact': 'İletişim'
};

/**
 * Section icon haritası - icon registry kullanarak SVG iconlar döndürür
 * @param category - Section category
 * @param size - Icon size in pixels
 * @returns SVG icon HTML string
 */
export function getSectionIconSvg(category: string, size: number = 24): string {
    const iconMap: Record<string, { category: string; name: string }> = {
        'hero': { category: 'navigation', name: 'home' },
        'experience': { category: 'navigation', name: 'briefcase' },
        'education': { category: 'navigation', name: 'graduationCap' },
        'portfolio': { category: 'navigation', name: 'image' },
        'skills': { category: 'navigation', name: 'zap' },
        'languages': { category: 'navigation', name: 'globe' },
        'contact': { category: 'contact', name: 'mail' }
    };

    const iconConfig = iconMap[category] || { category: 'ui', name: 'info' };
    return getIconSvg(iconConfig.category as any, iconConfig.name as any, 'outline', size);
}

/**
 * Navigation menu item'larını oluşturur
 * @param selectedComponents - Seçilen component'ler
 * @param templateType - Navigation template tipi
 * @returns HTML string olarak menu item'ları
 */
export function generateNavigationMenuItems(
    selectedComponents: SelectedComponent[],
    templateType: 'classic' | 'minimal' | 'sidebar' | 'floating'
): string {
    // Navigation ve footer dışındaki tüm component'leri al
    const menuableComponents = selectedComponents.filter(
        comp => comp.category !== 'navigation' && comp.category !== 'footer'
    );

    switch (templateType) {
        case 'classic':
            return menuableComponents.map(comp => {
                const name = SECTION_NAME_MAP[comp.category] || comp.category;
                return `<li><a href="#${comp.category}" class="nav-link">${name}</a></li>`;
            }).join('');

        case 'minimal':
            return menuableComponents.map(comp => {
                const name = SECTION_NAME_MAP[comp.category] || comp.category;
                return `<li><a href="#${comp.category}" class="nav-minimal-link">${name}</a></li>`;
            }).join('');

        case 'sidebar':
            return menuableComponents.map((comp, index) => {
                const name = SECTION_NAME_MAP[comp.category] || comp.category;
                const iconSvg = getSectionIconSvg(comp.category, 20);
                const activeClass = index === 0 ? 'active' : '';
                return `
          <li>
            <a href="#${comp.category}" class="nav-sidebar-link ${activeClass}">
              <span class="nav-sidebar-icon">${iconSvg}</span>
              <span class="nav-sidebar-text">${name}</span>
            </a>
          </li>
        `;
            }).join('');

        case 'floating':
            return menuableComponents.map((comp, index) => {
                const name = SECTION_NAME_MAP[comp.category] || comp.category;
                const activeClass = index === 0 ? 'active' : '';
                return `
          <li>
            <a href="#${comp.category}" class="nav-floating-dot ${activeClass}" data-tooltip="${name}"></a>
          </li>
        `;
            }).join('');

        default:
            return '';
    }
}

/**
 * Section ID'den Türkçe isim döndürür
 * @param sectionId - Section ID (örn: 'hero', 'experience')
 * @returns Türkçe section ismi
 */
export function getSectionName(sectionId: string): string {
    return SECTION_NAME_MAP[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
}
