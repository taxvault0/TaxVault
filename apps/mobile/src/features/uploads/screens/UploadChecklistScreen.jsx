import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HouseholdProgressCard from '@/features/uploads/components/HouseholdProgressCard';
import ScenarioGroupSection from '@/features/uploads/components/ScenarioGroupSection';
import UploadFilterTabs from '@/features/uploads/components/UploadFilterTabs';
import buildUploadSections from '@/features/uploads/utils/buildUploadSections';
import { buildChecklistSummary } from '@/features/uploads/utils/evaluateUploadSectionStatus';

const demoProfile = {
  user: {
    employment: true,
    gigWork: true,
    business: false,
    rrsp: true,
    fhsa: false,
    investments: false,
    donations: true,
    medical: false,
    tuition: false,
    workFromHome: true,
  },
  spouse: {
    employment: true,
    gigWork: true,
    business: false,
    rrsp: false,
    fhsa: true,
    investments: false,
    donations: false,
    medical: true,
    tuition: false,
    workFromHome: false,
  },
  household: {
    childCare: false,
    dependants: true,
    rent: false,
  },
};

const demoDocuments = [
  {
    id: 'doc-1',
    owner: 'user',
    sectionId: 'user-employment',
    requirementId: 'user-employment__t4',
    category: 't4',
    fileName: 'my-t4.pdf',
    status: 'active',
  },
  {
    id: 'doc-2',
    owner: 'user',
    sectionId: 'user-gigWork',
    requirementId: 'user-gigWork__gig-receipts',
    category: 'gig_receipt',
    fileName: 'uber-fuel-receipt.pdf',
    status: 'active',
  },
  {
    id: 'doc-3',
    owner: 'user',
    sectionId: 'user-rrsp',
    requirementId: 'user-rrsp__rrsp-slip',
    category: 'rrsp',
    fileName: 'rrsp-slip.pdf',
    status: 'active',
  },
  {
    id: 'doc-4',
    owner: 'spouse',
    sectionId: 'spouse-fhsa',
    requirementId: 'spouse-fhsa__fhsa-slip',
    category: 'fhsa',
    fileName: 'spouse-fhsa.pdf',
    status: 'active',
  },
];

const filterSections = (sections, filter) => {
  switch (filter) {
    case 'mine':
      return sections.filter((item) => item.owner === 'user');
    case 'spouse':
      return sections.filter((item) => item.owner === 'spouse');
    case 'shared':
      return sections.filter((item) => item.owner === 'household');
    case 'missing':
      return sections.filter((item) => item.evaluation?.status !== 'complete');
    case 'all':
    default:
      return sections;
  }
};

const groupSections = (sections = []) => ({
  userSections: sections.filter((item) => item.owner === 'user'),
  spouseSections: sections.filter((item) => item.owner === 'spouse'),
  householdSections: sections.filter((item) => item.owner === 'household'),
});

const UploadChecklistScreen = ({ navigation, route }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const householdProfile = route?.params?.householdProfile || demoProfile;
  const uploadedDocuments = route?.params?.uploadedDocuments || demoDocuments;

  const builtSections = useMemo(
    () => buildUploadSections(householdProfile),
    [householdProfile]
  );

  const evaluated = useMemo(
    () =>
      buildChecklistSummary(
        builtSections.allSections,
        uploadedDocuments,
        householdProfile
      ),
    [builtSections, uploadedDocuments, householdProfile]
  );

  const filteredSections = useMemo(
    () => filterSections(evaluated.sections, activeFilter),
    [evaluated.sections, activeFilter]
  );

  const grouped = useMemo(
    () => groupSections(filteredSections),
    [filteredSections]
  );

  const missingLabels = useMemo(() => {
    const missingSections = evaluated.sections.filter(
      (item) => item.evaluation?.status !== 'complete'
    );
    return missingSections.slice(0, 4).map((item) => item.title);
  }, [evaluated.sections]);

  const handleSectionPress = (section) => {
    navigation?.navigate?.('UploadSectionDetail', {
      section,
      householdProfile,
      uploadedDocuments,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Tax Upload Checklist</Text>
        <Text style={styles.headerSubtitle}>
          Documents required based on your household tax profile
        </Text>

        <HouseholdProgressCard
          counts={evaluated.counts}
          profile={householdProfile}
        />

        <UploadFilterTabs
          activeFilter={activeFilter}
          onChange={setActiveFilter}
        />

        {!!missingLabels.length && (
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Items still need attention</Text>
            <Text style={styles.bannerText}>{missingLabels.join(' • ')}</Text>
          </View>
        )}

        <ScenarioGroupSection
          title="Your uploads"
          sections={grouped.userSections}
          onSectionPress={handleSectionPress}
        />

        <ScenarioGroupSection
          title="Spouse uploads"
          sections={grouped.spouseSections}
          onSectionPress={handleSectionPress}
        />

        <ScenarioGroupSection
          title="Household uploads"
          sections={grouped.householdSections}
          onSectionPress={handleSectionPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  banner: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9A3412',
  },
  bannerText: {
    fontSize: 13,
    color: '#9A3412',
    marginTop: 6,
  },
});

export default UploadChecklistScreen;


