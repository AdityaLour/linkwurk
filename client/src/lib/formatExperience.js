export const formatExperience = (value) => {
    if (!value) return '';
    if (value === 'Fresher') return 'Fresher';
    return `${value} years`;
};