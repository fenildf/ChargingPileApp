'use strict';

import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import CPASearchBar from "../components/searchbar";
import {
    MapView,
    MapTypes,
    Geolocation
} from 'react-native-baidu-map';
import colors from "../common/colors";
import {ScreenKey, screenWidth} from "../common/constants";
import CPAActionButton from "../components/actionbutton";
import {IconType} from "../common/icons";
import {Icon} from "react-native-elements";
import WaitingNotice from "../components/waitingnotice";
import {connect} from "react-redux";
import {getCurrentPosition} from "../redux/actions";

let position = null;
let defaultCurrentPosition = {longitude:116.404185, latitude: 39.91491};  // 北京天安门的坐标
const CountDown = 15 * 60; // 计时时间15分钟
class CPAStationMapPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            subscribe: false,
            lastCountDownDate: null, // 计时时间
            countdown: 0,
            showtime: '',
            charging: false,
            station: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps ...');
        console.log(nextProps);
        console.log('componentWillReceiveProps end ...');
    }

    _navigateTo = (screenKey) => {
        const {navigate} = this.props.navigation;
        navigate && navigate(screenKey);
    };

    _renderMapView = () => {
        const {zoomControlsVisible, trafficEnabled, baiduHeatMapEnabled,
            zoom, mapType, center, markers, marker, currentLocation, dispatch} = this.props;

        return (
            <View style={styles.container}>
                <MapView
                    {...this.props}
                    style={styles.map}
                    onMarkerClick={(e) => {
                        //this._showStationBriefInfo(e)
                    }}
                    onMapClick={(e) => {
                    }}
                    onMapLoaded={currentLocation} />

                <CPAActionButton icon={<Icon type={IconType.Ionicon} name="md-funnel" size={25} color={colors.green} />}
                                 onAction={()=>this._navigateTo(ScreenKey.Filter)} text="筛选" position={styles.filterButton} />
                <CPAActionButton icon={<Icon type={IconType.Ionicon} name="md-heart" size={25} color={colors.red}/>}
                                 onAction={()=>this._navigateTo(ScreenKey.Collect)} text="收藏" position={styles.collectButton} />
                <CPAActionButton icon={<Icon type={IconType.MaterialIcon} name="traffic" size={25} color={colors.grey3}/>}
                                 onAction={()=>{}} text="路况" position={styles.trafficButton} />

                <CPAActionButton icon={<Icon type={IconType.Ionicon} name="md-locate" size={25} color={colors.grey3}/>}
                                 onAction={currentLocation} showText={false} position={styles.locateButton}
                                 containerStyle={styles.actionButtonContainer} btnStyle={styles.actionButtonStyle} />
                <CPAActionButton icon={<Icon type={IconType.SimpleLineIcon} name="question" size={25} color={colors.grey3}/>}
                                 onAction={()=>{}} showText={false} position={styles.questionButton}
                                 containerStyle={styles.actionButtonContainer} btnStyle={styles.actionButtonStyle} />
            </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <CPASearchBar onSearch={()=>this._navigateTo(ScreenKey.SearchStation)}
                              navToLocatingCity={()=>this._navigateTo(ScreenKey.LocatingCity)}
                              navToStationList={()=>this._navigateTo(ScreenKey.StationList)} />

                {
                    this._renderMapView()
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        zoomControlsVisible: state.zoomControlsVisible,
        trafficEnabled: state.trafficEnabled,
        baiduHeatMapEnabled: state.baiduHeatMapEnabled,
        zoom: state.zoom,
        mapType: state.mapType,
        center: state.center,
        markers: state.markers,
        marker: state.marker,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        currentLocation: () => dispatch(getCurrentPosition())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CPAStationMapPage);

const Size = 39;
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    map: {
        flex: 1,
    },
    icon: {
        position: "absolute",
        backgroundColor: "transparent",
        elevation: 4,
    },
    location: {
        justifyContent: "flex-end",
        alignItems: 'flex-start',
        bottom: 6,
        left: 6,
        right: 0,
        top: 0,
    },
    iconContainer: {
        width: Size,
        height: Size,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.2,
        borderColor: colors.grey4,
    },
    traffic: {
        justifyContent: "flex-end",
        alignItems: 'flex-end',
        bottom: 2*Size+20,
        left: 0,
        right: 6,
        top: 0,
    },
    refresh: {
        justifyContent: "flex-end",
        alignItems: 'flex-start',
        bottom: 6+Size,
        left: 6,
        right: 0,
        top: 0,
    },
    banner: {
        bottom: 0,
        left: 5,
        right: 5,
        top: 10,
        position: 'absolute',
        width: screenWidth - 10,
        height: 90,
        backgroundColor: colors.primary1,
        //borderRadius: 10,
        zIndex: 9999,
    },
    bannerContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    bannerTextColor: {
        color: colors.white,
    },
    bannerTitle: {
        fontSize: 16,
    },
    bannerAddress: {
        fontSize: 12,
    },
    bannerText: {
        fontSize: 16,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
    },
    titleLeftContainer: {
        flex: 1,
        paddingLeft: 10,
    },
    titleRightContainer: {
        width: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    time: {
        fontSize: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        backgroundColor: colors.tintColor2,
        borderRadius: 15,
    },
    divider: {
        backgroundColor: colors.white,
    },
    chargingBanner: {
        bottom: 0,
        left: 5,
        right: 5,
        top: 10,
        position: 'absolute',
        width: screenWidth - 10,
        height: 50,
        backgroundColor: colors.primary1,
        zIndex: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    chargingInfoLeftContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chargingInfoRightContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.tintColor2,
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    chargingBannerText: {
        fontSize: 16,
    },
    filterButton: {
        justifyContent: "flex-start",
        alignItems: 'flex-end',
        bottom: 0,
        left: 0,
        right: 10,
        top: 20,
    },
    collectButton: {
        justifyContent: "flex-start",
        alignItems: 'flex-end',
        bottom: 0,
        left: 0,
        right: 10,
        top: 70,
    },
    trafficButton: {
        justifyContent: "flex-start",
        alignItems: 'flex-end',
        bottom: 0,
        left: 0,
        right: 10,
        top: 120,
    },
    locateButton: {
        justifyContent: "flex-end",
        alignItems: 'flex-start',
        bottom: 20,
        left: 10,
        right: 0,
        top: 0,
    },
    actionButtonContainer: {
        height: 35,
        width: 35,
    },
    actionButtonStyle: {
        borderRadius: 35/2,
    },
    questionButton: {
        justifyContent: "flex-end",
        alignItems: 'flex-start',
        bottom: 65,
        left: 10,
        right: 0,
        top: 0,
    }
});

