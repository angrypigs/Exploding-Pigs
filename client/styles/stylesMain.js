import { StyleSheet } from 'react-native';

export const stylesMain = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
        alignItems: 'center',
        textAlign: 'center',
        padding: 20,
        backgroundColor: 'rgba(13, 68, 31, 1)',
    },
    subcontainer: {
        width: '90%',
        borderRadius: 20,
        borderStyle: 'solid',
        flex: 1,
        justifyContent: 'center',
        gap: 20,
        alignItems: 'center',
        textAlign: 'center',
        padding: 20,
        backgroundColor: 'rgba(21, 101, 48, 1)',
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#a1e799ff',
    },
    input: {
        width: '90%',
        backgroundColor: '#a4d99aff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 32,
        fontSize: 16,
        color: '#9ab18eff',
        marginVertical: 5,
        textAlign: 'center',

        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    test: {
        backgroundColor: 'red',
        width: 50,
        height: 50,
    },
    testText: {
        fontSize: 20,
    },

    testGame: {
        top: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'red',
    },
});
