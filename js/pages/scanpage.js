'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Animated, TextInput, Vibration, Keyboard} from 'react-native';
import Camera from 'react-native-camera';
import {ActiveOpacity, ScanAction, screenWidth} from "../common/constants";
import colors from "../common/colors";
import {Icon, Divider, Button} from "react-native-elements";
import {IconType} from "../common/icons";
import {textInputStyle} from "../common/styles";
import {connect} from "react-redux";
import {doStartCharging} from "../redux/chargingactions";
import {ToastBS, validSerialNumber} from "../common/functions";
import {doStartBatteryTesting} from "../redux/batterytestingactions";

const SNCount = 16;
const ScanInterval = 3000; // 扫描成功后，间隔3s允许再次处理
class CPAScanPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scanOrInput: 'scan',
            torchMode: Camera.constants.TorchMode.off,
            sn: '',
            scanning: false,
            action: 0,
        };
    }

    componentWillMount() {
        this._animatedValue = new Animated.Value(0);
    }

    componentDidMount() {
        this.setState({
            action: this.props.navigation.state.params.action
        });

        this._timer = setInterval(() => {
            this._animatedValue.setValue(0);
            this._startScanStrip();
        }, 5000 + 30); // 添加30ms的延迟

        this._startScanStrip();
    }

    componentWillUnmount() {
        this._timer && clearInterval(this._timer);
        this._scanTimer && clearTimeout(this._scanTimer);
    }

    _switchView = (view) => {
        this.setState({
            scanOrInput: view,
        })
    };

    _startScanStrip = () => {
        Animated.sequence([
            Animated.timing(this._animatedValue, {
                toValue: Size - 4,
                duration: 2500,
            }),
            Animated.timing(this._animatedValue, {
                toValue: 0,
                duration: 2500,
            })
        ]).start();
    };

    _onSwitchTorch = (close=true) => {
        if (this.state.torchMode === Camera.constants.TorchMode.on) {
            this.setState({torchMode: Camera.constants.TorchMode.off});
        }
        else {
            if (close) {
                this.setState({torchMode: Camera.constants.TorchMode.on});
            }
        }
    };

    _onScanningStatusChanged = (status)=>{
        this.setState({scanning: status});
    };

    _onScanCompleted = (e) => {
        const {scanning} = this.state;

        if (!scanning) {
            this._onScanningStatusChanged(true);

            try {
                // 如果手电筒打开，关闭手电筒
                this._onSwitchTorch(false);
                Vibration.vibrate();

                let sn = e.data;

                // verify the serial number.
                if (validSerialNumber(sn)) {
                    this._startAction(sn);
                } else {
                    ToastBS('编号不正确！');
                }
            } catch (e) {
                ToastBS(`${e}`);
                console.log(e);
            }

            this._scanTimer = setTimeout(()=>{
                this._onScanningStatusChanged(false);
                this._scanTimer && clearTimeout(this._scanTimer);
            }, ScanInterval);
        }
    };

    _onInputCompleted = () => {
        // 如果键盘打开，隐藏键盘
        Keyboard.dismiss();

        let {sn} = this.state;
        this._startAction(sn);
    };

    _startAction = (sn) => {
        const {action} = this.state;
        if (action === ScanAction.Charging) {
            const {startCharging} = this.props;
            startCharging && startCharging(sn);
        } else {
            const {startBatteryTesting} = this.props;
            startBatteryTesting && startBatteryTesting(sn);
        }
    };

    _renderScanView = () => {
        return (
            <View style={styles.middleContainer}>
                <View style={styles.fillArea}/>
                <View style={[styles.rectangle, {flexDirection: 'column'}]}>
                    <Animated.View pointerEvents="box-none"
                                   style={[styles.scanStrip, {transform: [{translateY: this._animatedValue}]}]}>
                        <Divider style={styles.strip}/>
                    </Animated.View>

                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Divider style={styles.horizontalDivider}/>
                            <Divider style={styles.verticalDivider}/>
                        </View>

                        <View style={{flex: 1}}>
                            <Divider style={[styles.horizontalDivider, {alignSelf: 'flex-end'}]}/>
                            <Divider style={[styles.verticalDivider, {alignSelf: 'flex-end'}]}/>
                        </View>
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                        <View style={{flex: 1}}>
                            <Divider style={styles.verticalDivider}/>
                            <Divider style={styles.horizontalDivider}/>
                        </View>

                        <View style={{flex: 1}}>
                            <Divider style={[styles.verticalDivider, {alignSelf: 'flex-end'}]}/>
                            <Divider style={[styles.horizontalDivider, {alignSelf: 'flex-end'}]}/>
                        </View>
                    </View>
                </View>
                <View style={styles.fillArea}/>
            </View>
        );
    };

    _renderInputView = () => {
        const {sn} = this.state;

        return (
            <View style={[styles.middleContainer, styles.upperContainer]}>
                <TextInput underlineColorAndroid='transparent'
                           placeholder='请输入充电桩编号'
                           style={[textInputStyle, styles.textInput]}
                           keyboardType='numeric'
                           autoFocus={true}
                           value={sn}
                           onChangeText={(text) => {
                               this.setState({
                                   sn: text,
                               });
                           }}
                />
                <View style={styles.buttonContainer}>
                    <Button title="返回扫码"
                            buttonStyle={styles.button}
                            onPress={()=>this._switchView('scan')}/>
                    <Button title="确定"
                            buttonStyle={styles.button}
                            onPress={this._onInputCompleted}
                            disabled={sn.length < SNCount}
                            disabledStyle={{backgroundColor: colors.grey3}}/>
                </View>
            </View>
        );
    };

    render() {
        const {scanOrInput, torchMode} = this.state;

        return (
            <Camera ref={self => this._scanner = self}
                    torchMode={this.state.torchMode}
                    style={styles.camera}
                    onBarCodeRead={(e) => {
                        this._onScanCompleted(e);
                    }}
                    aspect={Camera.constants.Aspect.fill}>
                <View style={styles.container}>
                    <View style={[styles.fillArea, styles.textContainer]}>
                        <Text style={styles.text}>
                            { scanOrInput === 'scan' ? '将二维码放入扫描框内，即可自动扫描！' : '请输入充电桩编号，然后点击确认按钮！'}
                        </Text>
                    </View>

                    {
                        scanOrInput === 'scan' ?
                            this._renderScanView()
                            :
                            this._renderInputView()
                    }

                    <View style={[styles.fillArea, styles.lowerContainer]}>
                        {
                            scanOrInput === 'scan' ?
                                <View style={styles.scanContainer}>
                                    <TouchableOpacity onPress={()=>this._switchView('input')}
                                                      activeOpacity={ActiveOpacity}
                                                      style={styles.leftContainer}>
                                        <Icon type={IconType.Ionicon} name="md-hand" size={28} color={colors.white} style={styles.icon}/>
                                        <Text style={styles.buttonTitle}>
                                            输入编号
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={this._onSwitchTorch}
                                                      activeOpacity={ActiveOpacity}
                                                      style={styles.rightContainer}>
                                        <Icon type={IconType.MaterialCommunityIcon} name="flashlight" size={28}
                                              color={torchMode === Camera.constants.TorchMode.off ? colors.white : colors.yellow} />
                                        <Text style={styles.buttonTitle}>
                                            {torchMode === Camera.constants.TorchMode.off ? '打开手电筒' : '关闭手电筒'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                        }
                    </View>
                </View>
            </Camera>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        startCharging: (sn) => dispatch(doStartCharging(sn)),
        startBatteryTesting: (sn) => dispatch(doStartBatteryTesting(sn)),
    }
}

export default connect(state=>state, mapDispatchToProps)(CPAScanPage);

const Size = 250;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fillArea: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    camera: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.transparent,
    },
    middleContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        width: screenWidth,
        height: Size,
        backgroundColor: colors.transparent,
    },
    lowerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: screenWidth,
    },
    scanContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 1,
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'center',
    },
    textContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        width: screenWidth,
    },
    text: {
        color: colors.white,
        fontSize: 15,
    },
    buttonTitle: {
        fontSize: 14,
        color: colors.grey3,
        marginTop: 5,
    },
    rectangle: {
        height: Size,
        width: Size,
        backgroundColor: 'transparent',
    },
    scanStrip: {
        position: "absolute",
        backgroundColor: colors.transparent,
        elevation: 4,
        justifyContent: "flex-start",
        bottom: 0,
        left: 3,
        right: 3,
        top: 2,
    },
    strip: {
        width: Size-4,
        backgroundColor: colors.theme1,
    },
    horizontalDivider: {
        backgroundColor: colors.theme1,
        width: 20,
        height: 2,
    },
    verticalDivider: {
        backgroundColor: colors.theme1,
        height: 20,
        width: 2,
    },
    upperContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    buttonContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    textInput:{
        marginLeft: 35,
        marginRight: 35,
    },
    button: {
        width: screenWidth/2-50,
    },
});