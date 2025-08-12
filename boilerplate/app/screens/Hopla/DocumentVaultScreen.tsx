import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { useDocumentStore } from '../../store';
import { useSafeAreaInsetsStyle } from '../../utils/useSafeAreaInsetsStyle';

export const DocumentVaultScreen = () => {
  const { documents, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useDocumentStore();
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"]);

  const categories = ['passport', 'visa', 'booking', 'ticket', 'insurance', 'other'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
      <View style={[$topContainerInsets, { marginBottom: 30 }]}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
          Document Vault
        </Text>
        <Text style={{ fontSize: 16, color: '#666' }}>
          Keep all your travel documents organized
        </Text>
      </View>

      <Card style={{ marginBottom: 20 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                style={{ 
                  padding: 10, 
                  backgroundColor: !selectedCategory ? '#007AFF' : '#f0f0f0', 
                  borderRadius: 20 
                }}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={{ 
                  color: !selectedCategory ? 'white' : '#333', 
                  fontWeight: '600' 
                }}>
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity 
                  key={category}
                  style={{ 
                    padding: 10, 
                    backgroundColor: selectedCategory === category ? '#007AFF' : '#f0f0f0', 
                    borderRadius: 20 
                  }}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={{ 
                    color: selectedCategory === category ? 'white' : '#333', 
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Card>

      {filteredDocuments.length === 0 ? (
        <Card style={{ marginBottom: 20 }}>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 15, textAlign: 'center' }}>
              No documents found
            </Text>
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first travel document'}
            </Text>
            <TouchableOpacity style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8 }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>
                Upload Document
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        filteredDocuments.map((doc) => (
          <Card key={doc.id} style={{ marginBottom: 15 }}>
            <View style={{ padding: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1 }}>
                  {doc.name}
                </Text>
                <View style={{ 
                  padding: 6, 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: 12 
                }}>
                  <Text style={{ 
                    fontSize: 12, 
                    color: '#666',
                    textTransform: 'capitalize'
                  }}>
                    {doc.type}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                {doc.fileSize} bytes • {doc.mimeType}
              </Text>
              <Text style={{ fontSize: 12, color: '#999' }}>
                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
              </Text>
            </View>
          </Card>
        ))
      )}

      <TouchableOpacity style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8, marginTop: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Upload New Document
        </Text>
      </TouchableOpacity>
    </Screen>
  );
};
