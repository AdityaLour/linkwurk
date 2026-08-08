export const formatSalary = (salaryMin, salaryMax) => {
    const isEmpty = (v) => v === null || v === undefined || v === '' || Number.isNaN(v);
    const min = isEmpty(salaryMin) ? null : Number(salaryMin);
    const max = isEmpty(salaryMax) ? null : Number(salaryMax);

    if (max === 0) return 'Unpaid';
    if (min === null && max === null) return 'Salary not disclosed';
    if (min !== null && max !== null) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min !== null) return `From ₹${min.toLocaleString()}`;
    return `Up to ₹${max.toLocaleString()}`;
};