export const formatDescription = (text: string): string => {
    return text
        .replace(/\\n/g, '<br />')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};