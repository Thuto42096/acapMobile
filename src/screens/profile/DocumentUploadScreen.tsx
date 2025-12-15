import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Text, Card, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useDocuments, useUploadDocument, useDeleteDocument, useImagePicker } from '../../hooks/useDocuments';
import { DocumentType } from '../../types/database.types';
import { colors } from '../../lib/theme';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DOCUMENT_TYPES: { type: DocumentType; label: string; icon: string }[] = [
  { type: 'id', label: 'ID Document', icon: 'card-account-details' },
  { type: 'certificate', label: 'Certificates', icon: 'certificate' },
  { type: 'police_clearance', label: 'Police Clearance', icon: 'shield-check' },
];

export const DocumentUploadScreen = ({ navigation }: any) => {
  const { profile } = useAuth();
  const { data: documents, isLoading } = useDocuments(profile?.id || '');
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();
  const { pickImage } = useImagePicker();
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);

  const handleUpload = async (documentType: DocumentType) => {
    try {
      setUploadingType(documentType);
      const imageUri = await pickImage();
      
      if (!imageUri) {
        setUploadingType(null);
        return;
      }

      if (!profile?.id) {
        throw new Error('User not authenticated');
      }

      await uploadMutation.mutateAsync({
        workerId: profile.id,
        documentType,
        imageUri,
      });

      Alert.alert('Success', 'Document uploaded successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload document');
    } finally {
      setUploadingType(null);
    }
  };

  const handleDelete = (documentId: string, documentUrl: string, documentType: string) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete this ${documentType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync({ documentId, documentUrl });
              Alert.alert('Success', 'Document deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete document');
            }
          },
        },
      ]
    );
  };

  const getVerificationBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: colors.warning },
      verified: { label: 'Verified', color: colors.success },
      rejected: { label: 'Rejected', color: colors.error },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Chip mode="outlined" style={{ backgroundColor: config.color + '20', borderColor: config.color }}>
        {config.label}
      </Chip>
    );
  };

  const getDocumentsByType = (type: DocumentType) => {
    return documents?.filter(doc => doc.document_type === type) || [];
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading documents..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoText}>
            Upload your documents for verification. Accepted formats: JPG, PNG. 
            All documents will be reviewed by our team.
          </Text>
        </Card.Content>
      </Card>

      {DOCUMENT_TYPES.map(({ type, label, icon }) => {
        const docs = getDocumentsByType(type);
        const isUploading = uploadingType === type;

        return (
          <Card key={type} style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
                  <Text style={styles.title}>{label}</Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => handleUpload(type)}
                  disabled={isUploading || uploadMutation.isPending}
                  loading={isUploading}
                  icon="upload"
                  compact
                >
                  Upload
                </Button>
              </View>

              {docs.length > 0 ? (
                docs.map((doc) => (
                  <View key={doc.id} style={styles.documentItem}>
                    <Image source={{ uri: doc.document_url }} style={styles.thumbnail} />
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentDate}>
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </Text>
                      {getVerificationBadge(doc.verification_status)}
                    </View>
                    <Button
                      mode="text"
                      onPress={() => handleDelete(doc.id, doc.document_url, label)}
                      disabled={deleteMutation.isPending}
                      textColor={colors.error}
                    >
                      Delete
                    </Button>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No {label.toLowerCase()} uploaded yet</Text>
              )}
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  infoCard: {
    margin: 16,
    backgroundColor: colors.primary + '10',
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginTop: 8,
    gap: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  documentInfo: {
    flex: 1,
    gap: 4,
  },
  documentDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

