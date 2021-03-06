import {StyleSheet} from 'react-native';
import {NavButtonMarginN, NavButtonMarginW} from '../../Common/styles';
import colors from '../../Common/colors';

const styles = StyleSheet.create({
    navButton:{
        marginLeft: NavButtonMarginN,
        marginRight: NavButtonMarginW,
    },
    container: {
        flexDirection: 'row'
    },
    text: {
        fontSize: 16,
        color: colors.white,
    },
    iconContainer: {
        marginLeft: 5,
        marginRight: 2,
        justifyContent: 'center',
    },
});

export default styles;