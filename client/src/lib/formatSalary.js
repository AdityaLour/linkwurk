export const formatSalary = (salaryMin, salaryMax) => {
    if (salaryMax === 0) return 'Unpaid';
    if (salaryMin == null && salaryMax == null) return 'Salary not disclosed';
    if (salaryMin != null && salaryMax != null) return `₹${salaryMin.toLocaleString()} - ₹${salaryMax.toLocaleString()}`;
    if (salaryMin != null) return `From ₹${salaryMin.toLocaleString()}`;
    return `Up to ₹${salaryMax.toLocaleString()}`;
};