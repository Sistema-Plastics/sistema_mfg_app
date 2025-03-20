const buildTreeData = (job) => {
    if (!Array.isArray(job.JobAsmbl)) return [];  // If JobAsmbl is not an array, return empty array

    return job.JobAsmbl.map((jobAsmbl, jobAsmblIndex) => {
        const { AssemblySeq, Description, JobOper } = jobAsmbl;  // Destructuring for clarity

        const jobOperations = JobOper?.map((jobOper, jobOperIndex) => {
            const { OprSeq, OpDesc, JobOpDtl } = jobOper;  // Destructuring for clarity
            const jobOpDetails = JobOpDtl?.map((jobOpDtl, jobOpDtlIndex) => ({
                id: `JobOpDtl-${jobAsmblIndex}-${jobOperIndex}-${jobOpDtlIndex}`,
                label: `JobOpDtl: ${jobOpDtl.DetailDesc}`,
            })) || [];

            return {
                id: `JobOper-${jobAsmblIndex}-${jobOperIndex}`,
                label: `JobOper: ${OprSeq} - ${OpDesc}`,
                children: jobOpDetails,  // Nested job operation details
            };
        }) || [];

        return {
            id: `JobAsmbl-${jobAsmblIndex}`,
            label: `ASM: ${AssemblySeq}\t${Description.toUpperCase()}`,  // Better readability with uppercase description
            children: jobOperations,  // Children are the job operations
        };
    });
};
