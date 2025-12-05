import { Site } from "@prisma/client";

export interface ContentSnapshot {
    name: string | null;
    jobTitle: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    summary: string | null;
    experience: any;
    education: any;
    skills: any;
    languages: any;
}

export function isContentSynced(currentSite: Site, snapshot: any): boolean {
    if (!snapshot) return false;

    // cvContent'i karşılaştır
    // Artık tüm bilgiler cvContent JSON alanında tutuluyor
    const currentContent = currentSite.cvContent;
    
    if (!currentContent) {
        // cvContent yoksa ama snapshot varsa, sync değil
        return false;
    }

    // JSON karşılaştırması yap
    // Her iki tarafı da normalize et
    const normalizedCurrent = JSON.stringify(currentContent);
    const normalizedSnapshot = JSON.stringify(snapshot);

    return normalizedCurrent === normalizedSnapshot;
}

export interface DiffItem {
    field: string;
    label: string;
    oldValue: string;
    newValue: string;
}

export function getDiffs(currentSite: Site, snapshot: any): DiffItem[] {
    if (!snapshot) return [];

    const diffs: DiffItem[] = [];
    
    const currentContent = currentSite.cvContent as any;
    
    if (!currentContent) {
        return [{
            field: 'cvContent',
            label: 'CV İçeriği',
            oldValue: JSON.stringify(snapshot, null, 2),
            newValue: '(Boş)'
        }];
    }

    // Helper to normalize values
    const normalize = (val: any) => {
        if (val === null || val === undefined) return "";
        return String(val).trim();
    };

    // Helper to normalize JSON fields
    const normalizeJson = (val: any) => {
        if (!val) return [];
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            } catch {
                return [];
            }
        }
        return val;
    };

    // Simple fields mapping
    const fieldLabels: Record<string, string> = {
        name: 'Ad Soyad',
        jobTitle: 'Ünvan',
        email: 'Email',
        phone: 'Telefon',
        location: 'Konum',
        linkedinUrl: 'LinkedIn URL',
        githubUrl: 'GitHub URL',
        summary: 'Özet'
    };

    // Check simple fields - now from cvContent
    for (const [field, label] of Object.entries(fieldLabels)) {
        const currentVal = normalize(currentContent[field]);
        const snapVal = normalize(snapshot[field]);

        if (currentVal !== snapVal) {
            diffs.push({
                field,
                label,
                oldValue: snapVal || '(Boş)',
                newValue: currentVal || '(Boş)'
            });
        }
    }

    // Check complex fields
    const complexFields: Record<string, string> = {
        experience: 'İş Deneyimi',
        education: 'Eğitim',
        skills: 'Yetenekler',
        languages: 'Diller'
    };

    for (const [field, label] of Object.entries(complexFields)) {
        const currentVal = normalizeJson(currentContent[field]);
        const snapVal = normalizeJson(snapshot[field]);

        if (JSON.stringify(currentVal) !== JSON.stringify(snapVal)) {
            let oldStr = '';
            let newStr = '';

            if (field === 'skills' || field === 'languages') {
                oldStr = Array.isArray(snapVal) ? snapVal.join(', ') : '';
                newStr = Array.isArray(currentVal) ? currentVal.join(', ') : '';
            } else {
                // For objects like experience/education, just show count or simple summary
                oldStr = `${Array.isArray(snapVal) ? snapVal.length : 0} kayıt`;
                newStr = `${Array.isArray(currentVal) ? currentVal.length : 0} kayıt`;

                // If counts are same, maybe content changed. 
                // Let's try to be a bit more descriptive if possible, or just JSON stringify for now if it's not too huge
                if (oldStr === newStr) {
                    oldStr = JSON.stringify(snapVal, null, 2);
                    newStr = JSON.stringify(currentVal, null, 2);
                }
            }

            diffs.push({
                field,
                label,
                oldValue: oldStr || '(Boş)',
                newValue: newStr || '(Boş)'
            });
        }
    }

    return diffs;
}
