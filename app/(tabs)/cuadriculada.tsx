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

// Interfaces del modelo de datos
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


const API_URL = 'http://localhost:3000';

const CATEGORIA_COLOR: Record<string, string> = {
    teclado: '#4ecdc4',
    percusion: '#f9a825',
    cuerda: '#ef5350',
    viento: '#ab47bc',
    electronico: '#42a5f5',
};

export default function Cuadriculada() {
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargarInstrumentos = useCallback(async () => {
        setCargando(true);
        setError('');
        try {
            // Traemos un número alto directamente para evitar el doble fetch asincrónico
            const res = await fetch(`${API_URL}/api/instrumentos?cantidad=50&from=0`);
            if (!res.ok) throw new Error();
            const data: ApiResponse = await res.json();

            setInstrumentos(data.datos || []);
        } catch (err) {
            setError('No se pudo conectar al servidor.');
        } finally {
            setCargando(false);
        }
    }, []);

    // Carga inicial al montar el componente
    useEffect(() => {
        cargarInstrumentos();
    }, [cargarInstrumentos]);

    // Renderizador de cada tarjeta (Card) de instrumento
    const renderInstrumento = ({ item }: { item: Instrumento }) => (
        <Pressable
            style={styles.card}
            onPress={() => {
                // Navegación nativa de Expo Router hacia el detalle del instrumento
                router.push(`/instrumento/${item.id}` as any);
            }}
        >
            <View style={styles.imageWrap}>
                <Image
                    source={{
                        uri: item.imagen || 'https://placehold.co/150x150/1a1a1a/4ecdc4?text=♪',
                    }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.cardInfo}>
                <Text style={styles.cardNombre} numberOfLines={2}>
                    {item.nombre}
                </Text>

                <View style={styles.cardTags}>
                    <View
                        style={[
                            styles.tag,
                            { borderColor: CATEGORIA_COLOR[item.categoria] ?? '#888' },
                        ]}
                    >
                        <Text
                            style={[
                                styles.tagText,
                                { color: CATEGORIA_COLOR[item.categoria] ?? '#888' },
                            ]}
                        >
                            {item.categoria}
                        </Text>
                    </View>

                    <Text style={styles.tagTipo}>{item.tipoSonido}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Inicio</Text>
                </Pressable>

                <Text style={styles.titulo}>Instrumentos</Text>

                <Pressable style={styles.crearButton} onPress={() => router.push('/crear')}>
                    <Text style={styles.crearButtonText}>＋</Text>
                </Pressable>
            </View>

            {/* CUERPO PRINCIPAL */}
            {error ? (
                <View style={styles.estadoContainer}>
                    <Text style={[styles.estadoTexto, styles.errorTexto]}>{error}</Text>
                </View>
            ) : cargando && instrumentos.length === 0 ? (
                <View style={styles.estadoContainer}>
                    <ActivityIndicator size="large" color="#4ecdc4" />
                    <Text style={styles.spinnerTexto}>Cargando...</Text>
                </View>
            ) : (
                <FlatList
                    data={instrumentos}
                    renderItem={renderInstrumento}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2} // Reemplaza al 'display: grid' de CSS
                    columnWrapperStyle={styles.gridRow}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.estadoContainer}>
                            <Text style={styles.estadoTexto}>No hay instrumentos.</Text>
                        </View>
                    }
                    ListFooterComponent={
                        cargando ? (
                            <ActivityIndicator size="small" color="#4ecdc4" style={{ marginVertical: 20 }} />
                        ) : null
                    }
                />
            )}
        </View>
    );
}

// ESTILOS (Migrados directos de tu archivo .css original)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a', // var(--bg)
    },
    header: {
        paddingTop: 60, // Espacio para la barra de estado del celular
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#151515', // var(--bg2)
        borderBottomWidth: 1,
        borderColor: '#222', // var(--border)
    },
    backButton: {
        color: '#4ecdc4', // var(--teal)
        fontSize: 14.5,
        fontWeight: '500',
    },
    titulo: {
        fontSize: 24,
        fontWeight: '400',
        color: '#fff', // var(--text)
    },
    crearButton: {
        backgroundColor: '#51cf66', // var(--green)
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    crearButtonText: {
        color: '#0a0a0a',
        fontSize: 18,
        fontWeight: '700',
    },
    listContainer: {
        padding: 10,
    },
    gridRow: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 0.485, // Distribuye proporcionalmente las 2 columnas del grid
        marginBottom: 12,
        backgroundColor: '#151515', // var(--card)
        borderWidth: 1,
        borderColor: '#222', // var(--border)
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageWrap: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cardInfo: {
        padding: 10,
        gap: 6,
    },
    cardNombre: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        lineHeight: 18,
    },
    cardTags: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 7,
        paddingVertical: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    tagTipo: {
        fontSize: 11,
        color: '#888', // var(--text-dim)
        fontStyle: 'italic',
    },
    estadoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    estadoTexto: {
        color: '#888',
        fontStyle: 'italic',
        fontSize: 15,
        textAlign: 'center',
    },
    spinnerTexto: {
        color: '#4ecdc4',
        marginTop: 10,
        fontSize: 14,
    },
    errorTexto: {
        color: '#ef5350',
    },
});