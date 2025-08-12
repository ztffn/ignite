import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useDocumentStore, useTripStore } from '../../store';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const DocumentVaultScreen = () => {
  const { documents, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, getFilteredDocuments, getDocumentStats } = useDocumentStore();
  const { selectedTrip } = useTripStore();

  const filteredDocuments = getFilteredDocuments();
  const stats = getDocumentStats();

  const documentCategories = ['passport', 'visa', 'booking', 'ticket', 'insurance', 'other'];

  const renderDocument = ({ item: doc }: { item: any }) => (
    <TouchableOpacity 
      style={{ 
        padding: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee'
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5 }}>
        {doc.name}
      </Text>
      <Text style={{ color: '#666', marginBottom: 5 }}>
        {doc.type} • {doc.fileSize} bytes
      </Text>
      <Text style={{ color: '#666', fontSize: 12 }}>
        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
      </Text>
      {doc.tags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
          {doc.tags.map((tag: string, index: number) => (
            <View key={index} style={{ backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginRight: 5 }}>
              <Text style={{ fontSize: 10 }}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Screen preset="fixed">
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Document Vault
        </Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Categories</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <TouchableOpacity 
              onPress={() => setSelectedCategory(null)}
              style={{ 
                paddingHorizontal: 12, 
                paddingVertical: 6, 
                borderRadius: 16, 
                backgroundColor: selectedCategory === null ? '#007AFF' : '#f0f0f0'
              }}
            >
              <Text style={{ color: selectedCategory === null ? 'white' : '#333' }}>All</Text>
            </TouchableOpacity>
            {documentCategories.map((category) => (
              <TouchableOpacity 
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={{ 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 16, 
                  backgroundColor: selectedCategory === category ? '#007AFF' : '#f0f0f0'
                }}
              >
                <Text style={{ color: selectedCategory === category ? 'white' : '#333' }}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button text="Upload Document" style={{ marginBottom: 20 }} />
      </View>

      {documents.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20 }}>
            No documents yet. Start building your travel vault!
          </Text>
          <Button text="Upload First Document" />
        </View>
      ) : (
        <FlatList
          data={filteredDocuments}
          renderItem={renderDocument}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ListHeaderComponent={
            <View style={{ paddingVertical: 10 }}>
              <Text style={{ fontSize: 14, color: '#666' }}>
                {filteredDocuments.length} of {stats.total} documents
              </Text>
            </View>
          }
        />
      )}
    </Screen>
  );
};
