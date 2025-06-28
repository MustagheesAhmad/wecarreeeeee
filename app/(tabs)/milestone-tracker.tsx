import { useMilestones } from '@/context/MilestoneContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MilestoneTracker() {
    const { milestones, deleteMilestone } = useMilestones();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/ParentHome')}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Milestone Tracker</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={milestones}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={require('../../assets/images/baby-icon.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />

                        <View style={styles.cardContent}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.name}>{item.name}</Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor: item.isOngoing ? '#FCE4EC' : '#E1F5E8',
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            { color: item.isOngoing ? '#D81B60' : '#388E3C' },
                                        ]}
                                    >
                                        {item.isOngoing ? 'Pending' : 'Completed'}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.desc}>{item.description}</Text>
                            {!item.isOngoing && (
                                <Text style={styles.date}>Achieved on: {item.achievedDate}</Text>
                            )}
                        </View>
                        <View style={styles.menuWrapper}>
                            <TouchableOpacity
                                onPress={() =>
                                    setSelectedId((prev) => (prev === item.id ? null : item.id))
                                }
                            >
                                <Ionicons name="ellipsis-vertical" size={18} color="#8B347B" />
                            </TouchableOpacity>

                            {selectedId === item.id && (
                                <View style={styles.popupWrapper}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            deleteMilestone(item.id);
                                            setSelectedId(null);
                                        }}
                                        style={styles.deleteBox}
                                    >
                                        <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    router.push('/add-milestone');
                }}
            >
                <Text style={styles.addButtonText}>Add Milestone</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffcce5' },

    header: {
        height: 70,
        backgroundColor: '#8B347B',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#F4EDF4',
        padding: 12,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 15,
        alignItems: 'flex-start',
        position: 'relative',
    },
    image: { width: 24, height: 24 },
    cardContent: { flex: 1, marginLeft: 12 },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: { fontWeight: 'bold', fontSize: 16, color: '#999' },
    desc: { color: '#999', marginTop: 4 },
    date: { fontSize: 13, color: '#999', marginTop: 4 },

    statusBadge: {
        paddingHorizontal: 8,
        marginHorizontal: 30,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    menuWrapper: {
        position: 'absolute',
        top: 15,
        right: 10,
        alignItems: 'flex-end',
        zIndex: 10,
    },


    popupWrapper: {
        marginTop: 5,
    },


    deleteBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d33',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    deleteText: {
        color: '#d33',
        fontWeight: 'bold',
        fontSize: 13,
    },

    addButton: {
        backgroundColor: '#8B347B',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 135,
        marginHorizontal: 15,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
