import React, {Component} from 'react';
import {View} from 'react-native';
import styles from './styles';
import {TabNavigator} from 'react-navigation';
import HomePage from "../../../CustomPages/HomePage/index";
import MePage from "../../../CustomPages/MePage/index";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import colors from '../../../Common/colors';


const CPATabNavigator = TabNavigator(
    {
        Home: {
            screen: HomePage,
            navigationOptions:{
                title:'找桩',
                tabBarIcon:({tintColor}) => {
                    return (
                        <Icon name="home" size={16} color={tintColor} />
                    );
                },
            },
        },
        /*Scan:{
            screen: ScanPage,
            navigationOptions: {
                title: '扫一扫',
                tabBarIcon:({tintColor}) => {
                    return (
                        <Icon name="camera" size={16} color={tintColor} />
                    );
                },
            }
        },*/
        Me: {
            screen: MePage,
            navigationOptions: {
                title: '我的',
                tabBarIcon: ({tintColor}) => {
                    return (
                        <Icon name="user" size={16} color={tintColor}/>
                    );
                },
            },
        },
    },
    {
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: true,

        tabBarOptions:{
            activeTintColor: colors.tintColor,
            showIcon:true,
            tabStyle:{
                flexDirection:'row',
                backgroundColor: colors.theme1,
                marginBottom: 1,
            },
            labelStyle: {
                fontSize: 15,
            }
        },
    }
);


class CPATabScreen extends Component{
    render() {
        return (
            <View style={styles.container}>
                <CPATabNavigator style={styles.navigator}
                                 screenProps={{nav: this.props.navigation}}
                />
            </View>
        );
    }
}

export default CPATabScreen;