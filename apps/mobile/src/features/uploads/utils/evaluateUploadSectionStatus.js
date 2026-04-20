const normalizeDocs = (uploadedDocuments = []) =>
  Array.isArray(uploadedDocuments) ? uploadedDocuments : [];

const getDocsForRequirement = (requirement, uploadedDocuments) => {
  const docs = normalizeDocs(uploadedDocuments);

  return docs.filter((doc) => {
    if (doc.status === 'deleted') return false;
    if (requirement.fullRequirementId && doc.requirementId === requirement.fullRequirementId) {
      return true;
    }

    if (
      Array.isArray(requirement.documentTypes) &&
      requirement.documentTypes.includes(doc.category)
    ) {
      return true;
    }

    if (
      Array.isArray(requirement.oneOfDocumentTypes) &&
      requirement.oneOfDocumentTypes.includes(doc.category)
    ) {
      return true;
    }

    return false;
  });
};

export const getRequirementState = (requirement, uploadedDocuments = [], profile = {}, owner = 'user') => {
  const docs = getDocsForRequirement(requirement, uploadedDocuments);
  const ownerProfile = profile?.[owner] || {};
  const isConditionalEnabled = requirement.conditionalKey
    ? !!ownerProfile[requirement.conditionalKey]
    : true;

  if (!isConditionalEnabled && !requirement.required) {
    return {
      status: 'not_applicable',
      uploadedCount: 0,
      documents: [],
    };
  }

  if (requirement.allowMarkNotApplicable && requirement.markedNotApplicable) {
    return {
      status: 'not_applicable',
      uploadedCount: 0,
      documents: [],
    };
  }

  const uploadedCount = docs.length;

  if (uploadedCount > 0) {
    return {
      status: 'complete',
      uploadedCount,
      documents: docs,
    };
  }

  if (requirement.required) {
    return {
      status: 'missing',
      uploadedCount: 0,
      documents: [],
    };
  }

  return {
    status: 'optional',
    uploadedCount: 0,
    documents: [],
  };
};

export const evaluateUploadSectionStatus = (
  section,
  uploadedDocuments = [],
  profile = {}
) => {
  const requirementStates = section.requirements.map((requirement) => ({
    ...requirement,
    evaluation: getRequirementState(
      requirement,
      uploadedDocuments.filter((doc) => doc.sectionId === section.id || doc.owner === section.owner),
      profile,
      section.owner
    ),
  }));

  const requiredRequirementStates = requirementStates.filter(
    (item) => item.required || item.conditionalKey
  );

  const totalRequired = requiredRequirementStates.length;
  const completedRequired = requiredRequirementStates.filter(
    (item) => item.evaluation.status === 'complete' || item.evaluation.status === 'not_applicable'
  ).length;

  let status = 'missing';

  if (totalRequired === 0) {
    status = 'not_applicable';
  } else if (completedRequired === totalRequired) {
    status = 'complete';
  } else if (completedRequired > 0) {
    status = 'partial';
  }

  return {
    status,
    totalRequired,
    completedRequired,
    missingRequired: Math.max(totalRequired - completedRequired, 0),
    requirementStates,
  };
};

export const buildChecklistSummary = (sections = [], uploadedDocuments = [], profile = {}) => {
  const evaluatedSections = sections.map((section) => {
    const evaluation = evaluateUploadSectionStatus(section, uploadedDocuments, profile);
    return {
      ...section,
      evaluation,
    };
  });

  const counts = {
    total: evaluatedSections.length,
    complete: evaluatedSections.filter((item) => item.evaluation.status === 'complete').length,
    partial: evaluatedSections.filter((item) => item.evaluation.status === 'partial').length,
    missing: evaluatedSections.filter((item) => item.evaluation.status === 'missing').length,
  };

  return {
    sections: evaluatedSections,
    counts,
  };
};

export default evaluateUploadSectionStatus;


