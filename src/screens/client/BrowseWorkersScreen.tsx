import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Searchbar, SegmentedButtons } from 'react-native-paper';
import { useWorkers } from '../../hooks/useWorkers';
import { WorkerCard } from '../../components/client/WorkerCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ServiceType } from '../../types/database.types';
import { colors, spacing, typography } from '../../lib/theme';

export const BrowseWorkersScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType | undefined>(undefined);
  const { data: workers, isLoading, refetch } = useWorkers(serviceType, searchQuery);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleServiceTypeChange = (value: string) => {
    setServiceType(value === 'all' ? undefined : (value as ServiceType));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search workers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Service Type Filter */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={serviceType || 'all'}
          onValueChange={handleServiceTypeChange}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'domestic_worker', label: 'Domestic' },
            { value: 'gardener', label: 'Gardener' },
            { value: 'plumber', label: 'Plumber' },
            { value: 'handyman', label: 'Handyman' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Workers List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {workers && workers.length === 0 ? (
          <EmptyState
            icon="account-search"
            message="No workers found"
            description={
              searchQuery
                ? 'Try adjusting your search or filters'
                : 'No workers available at the moment'
            }
          />
        ) : (
          workers?.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onPress={() =>
                navigation.navigate('BrowseWorkers', {
                  screen: 'WorkerProfile',
                  params: { workerId: worker.id },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: colors.background,
  },
  filterContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  segmentedButtons: {
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
});

