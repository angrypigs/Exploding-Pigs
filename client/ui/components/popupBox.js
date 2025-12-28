import { StyleSheet, Text, View } from 'react-native';
import { stylesMain } from '../../styles/stylesMain';
import CloseButton from '../components/closeButton';

export default function PopupBox({ children, title = '', onExit = null }) {
    const headerFlag = title !== '' || onExit;
    return (
        <View style={styles.vignette}>
            <View style={styles.box}>
                {headerFlag && (
                    <View style={styles.header}>
                        {title !== '' && <Text style={stylesMain.text}>{title}</Text>}
                        {onExit !== null && <CloseButton onPress={onExit} />}
                    </View>
                )}
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    vignette: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#00000077',
        zIndex: 1000,
    },
    box: {
        position: 'absolute',
        left: '10%',
        right: '10%',
        top: '10%',
        bottom: '10%',
        borderColor: '#05300dff',
        borderRadius: 10,
        borderWidth: 3,
        padding: 20,
        backgroundColor: '#156915ff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: '#197d19ff',
        borderBottomColor: '#082708ff',
    },
});
