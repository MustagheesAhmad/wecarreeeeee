import { useRemedies } from '@/context/RemedyContext';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Remedy = {
    id: string;
    profileImage: string | null;
    userName: string;
    remedyImage: string;
    remedyText: string;
};

export default function RemediesHome() {
    const { remedies } = useRemedies();
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRemedies, setFilteredRemedies] = useState<Remedy[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredRemedies(remedies);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredRemedies(
                remedies.filter(
                    (r) =>
                        r.userName.toLowerCase().includes(query) ||
                        r.remedyText.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, remedies]);

    const toggleExpanded = (id: string) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const renderItem = ({ item }: { item: Remedy }) => {
        const isExpanded = expandedIds.includes(item.id);
        const isLongText = item.remedyText.length > 100;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Image
                        source={
                            item.profileImage
                                ? { uri: item.profileImage }
                                : require('../../assets/images/profile-icon.png')
                        }
                        style={styles.cardProfileImage}
                    />
                    <Text style={styles.cardUserName}>{item.userName}</Text>
                </View>

                <Image
                    source={{ uri: item.remedyImage }}
                    style={styles.cardRemedyImage}
                    resizeMode="cover"
                />

                {isExpanded ? (
                    <Text style={styles.cardText}>{item.remedyText}</Text>
                ) : (
                    <Text style={styles.cardText} numberOfLines={3}>
                        {item.remedyText}
                    </Text>
                )}


                {isLongText && (
                    <TouchableOpacity onPress={() => toggleExpanded(item.id)}>
                        <Text style={styles.readMore}>
                            {isExpanded ? 'Read less' : 'Read more'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/ParentHome')}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Remedies</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={styles.searchContainer}>
                <AntDesign name="search1" size={18} color="#8B347B" style={{ marginHorizontal: 8 }} />
                <TextInput
                    autoFocus={false}
                    placeholder="Search for remedies"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#D6CBCB"
                    style={styles.searchInput}
                />

                <TouchableOpacity style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {/* Remedies List */}
            <FlatList
                data={filteredRemedies}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffcce5',

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#8B347B',
        height: 70,
        color: '#fff',
    },
    backText: {
        fontSize: 24,
        color: '#fff',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal:10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',

    },
    searchButton: {
        backgroundColor: '#8B347B',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginLeft: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    cardProfileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    cardUserName: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#4A0072',
    },
    cardRemedyImage: {
        width: 270,
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'center',
    },
    cardText: {
        fontSize: 14,
        color: '#555',
        paddingHorizontal: 10,
        textAlign: 'justify',
    },
    readMore: {
        marginTop: 4,
        fontSize: 14,
        color: '#8B347B',
        fontWeight: '500',
        paddingHorizontal: 8,
    },
   
});
