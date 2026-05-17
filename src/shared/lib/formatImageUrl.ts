// shared/lib/formatAvatarUrl.ts
import { MEDIA_BASE_URL } from '@/shared/lib/config';

export const formatImageUrl = (avatar: string | null | undefined): string | undefined => {
    if (!avatar) return undefined;
    if (avatar.startsWith('http')) return avatar;
    return `${MEDIA_BASE_URL}${avatar}`;
};
