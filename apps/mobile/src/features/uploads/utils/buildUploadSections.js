import {
  getHouseholdOptionalKeys,
  getOwnerDescription,
  getOwnerTitle,
  getPersonOptionalKeys,
  getSectionTemplate,
} from '@/features/uploads/config/uploadRequirementCatalog';

const cloneRequirements = (requirements = [], sectionId) =>
  requirements.map((requirement) => ({
    ...requirement,
    fullRequirementId: `${sectionId}__${requirement.id}`,
  }));

const createSection = ({ owner, scenarioKey, template }) => {
  const sectionId = `${owner}-${scenarioKey}`;

  return {
    id: sectionId,
    owner,
    scenarioKey,
    title: `${getOwnerTitle(owner)} · ${template.title}`,
    shortTitle: template.title,
    description: template.description.replace(
      /your|spouse|household/gi,
      getOwnerDescription(owner)
    ),
    requirements: cloneRequirements(template.requirements, sectionId),
  };
};

const addSectionIfEnabled = (sections, owner, key, enabled) => {
  if (!enabled) return;

  const template = getSectionTemplate(key);
  if (!template) return;

  sections.push(
    createSection({
      owner,
      scenarioKey: key,
      template,
    })
  );
};

export const buildUploadSections = (profile = {}) => {
  const user = profile.user || {};
  const spouse = profile.spouse || {};
  const household = profile.household || {};

  const userSections = [];
  const spouseSections = [];
  const householdSections = [];

  addSectionIfEnabled(userSections, 'user', 'employment', !!user.employment);
  addSectionIfEnabled(userSections, 'user', 'gigWork', !!user.gigWork);
  addSectionIfEnabled(userSections, 'user', 'business', !!user.business);

  getPersonOptionalKeys().forEach((key) => {
    addSectionIfEnabled(userSections, 'user', key, !!user[key]);
  });

  addSectionIfEnabled(spouseSections, 'spouse', 'employment', !!spouse.employment);
  addSectionIfEnabled(spouseSections, 'spouse', 'gigWork', !!spouse.gigWork);
  addSectionIfEnabled(spouseSections, 'spouse', 'business', !!spouse.business);

  getPersonOptionalKeys().forEach((key) => {
    addSectionIfEnabled(spouseSections, 'spouse', key, !!spouse[key]);
  });

  getHouseholdOptionalKeys().forEach((key) => {
    addSectionIfEnabled(householdSections, 'household', key, !!household[key]);
  });

  return {
    userSections,
    spouseSections,
    householdSections,
    allSections: [...userSections, ...spouseSections, ...householdSections],
  };
};

export default buildUploadSections;


