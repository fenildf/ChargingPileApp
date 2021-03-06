import {StyleSheet} from 'react-native';
import {screenWidth} from "../../Common/styles";
import colors from '../../Common/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
    },
    infoContainer: {
    },
    vcodeContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    vcodeButton: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.tintColor,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    vcodeButtonSent: {
        borderColor: colors.grey3,
    },
    vcodeTextInput: {
        flex: 1,
    },
    vcodeText: {
        color: colors.tintColor,
    },
    vcodeTextSent: {
        color: colors.grey3,
    },
    textInput:{
        borderWidth: 0.5,
        borderColor: '#C3C3C3',
        marginTop: 10,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    button: {
        width: screenWidth-20,
    },
    text: {
        marginTop: 15,
        color: '#00FFFF',
        fontSize: 15,
    },
    userAgreementContainer: {
        alignItems: 'center',
    },
    userAgreement: {
        textDecorationLine : 'underline',
    },
    disabled: {
        backgroundColor: colors.grey3,
    },
});

export default styles;