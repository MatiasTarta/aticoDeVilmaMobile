import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface Instrumento {
    id: number;
    nombre: string;
    tipoSonido: string;
    escala: string;
    categoria: string;
    imagen: string;
    link: string;
}

interface ApiResponse {
    total: number;
    cantidad: number;
    from: number;
    datos: Instrumento[];
}

const API_URL =
    process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:3000';

const CATEGORIA_COLOR: Record<string, string> = {
    teclado: '#4ecdc4',
    percusion: '#f9a825',
    cuerda: '#ef5350',
    viento: '#ab47bc',
    electronico: '#42a5f5',
};

export default function Cuadriculada() {
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const cargarInstrumentos = useCallback(async () => {
        try {
            console.log('INICIO');
            console.log('API_URL:', API_URL);

            const res = await fetch(
                `${API_URL}/api/instrumentos?cantidad=1&from=0`
            );

            console.log('FETCH TERMINÓ');

            const text = await res.text();

            console.log('RESPUESTA CRUDA:');
            console.log(text);

        } catch (err) {
            console.error('ERROR REAL:', err);
        }
    }, []);

    useEffect(() => {
        cargarInstrumentos();
    }, [cargarInstrumentos]);

    const renderInstrumento = ({
        item,
    }: {
        item: Instrumento;
    }) => (
        <Pressable
            style={styles.card}
            onPress={() => {
                console.log('Instrumento:', item.id);

                // habilitar cuando exista la pantalla
                // router.push(`/instrumento/${item.id}` as any);
            }}
        >
            <Image
                source={{
                    uri:
                        item.imagen ||
                        'https://placehold.co/300x300/1a1a1a/4ecdc4?text=♪',
                }}
                style={styles.image}
            />

            <View style={styles.info}>
                <Text style={styles.nombre}>
                    {item.nombre}
                </Text>

                <View style={styles.tags}>
                    <View
                        style={[
                            styles.tag,
                            {
                                borderColor:
                                    CATEGORIA_COLOR[item.categoria] ?? '#888',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.tagText,
                                {
                                    color:
                                        CATEGORIA_COLOR[item.categoria] ?? '#888',
                                },
                            ]}
                        >
                            {item.categoria}
                        </Text>
                    </View>

                    <Text style={styles.tipo}>
                        {item.tipoSonido}
                    </Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.back}>
                        ← Inicio
                    </Text>
                </Pressable>

                <Text style={styles.title}>
                    Instrumentos
                </Text>

                <Pressable
                    style={styles.addButton}
                    onPress={() => {
                        console.log('Crear');
                        // router.push('/crear');
                    }}
                >
                    <Text style={styles.addText}>+</Text>
                </Pressable>
            </View>

            {error ? (
                <Text style={styles.error}>
                    {error}
                </Text>
            ) : loading ? (
                <ActivityIndicator
                    size="large"
                    color="#4ecdc4"
                    style={{ marginTop: 50 }}
                />
            ) : (
                <FlatList
                    data={instrumentos}
                    renderItem={renderInstrumento}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            No hay instrumentos
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },

    header: {
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    back: {
        color: '#4ecdc4',
        fontSize: 14,
    },

    title: {
        color: '#e8e0d5',
        fontSize: 28,
        fontStyle: 'italic',
    },

    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#51cf66',
        justifyContent: 'center',
        alignItems: 'center',
    },

    addText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0a0a0a',
    },

    list: {
        padding: 10,
    },

    card: {
        flex: 1,
        margin: 6,
        backgroundColor: '#151515',
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#222',
    },

    image: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#1a1a1a',
    },

    info: {
        padding: 10,
    },

    nombre: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },

    tags: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    tag: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginRight: 6,
    },

    tagText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    tipo: {
        color: '#999',
        fontSize: 11,
        fontStyle: 'italic',
    },

    empty: {
        color: '#777',
        textAlign: 'center',
        marginTop: 50,
    },

    error: {
        color: '#ef5350',
        textAlign: 'center',
        marginTop: 50,
    },
});