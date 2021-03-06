import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Platform,
    TouchableOpacity,
    Modal
} from 'react-native';
import styles, {aWidth} from './styles';
import {gotoNavigation, mapApp} from "../../Common/functions";


export class AlertSelected extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            show: false,
            title: "",
            start: null,
            end: null,
        };

        this.entityList = [];//数据源
        this.callback = function () {
        };//回调方法
    }

    _renderItem(item, i) {
        return (
            <View style={styles.tipContentView} key={i}>
                <View style={{height: 0.5, backgroundColor: '#a9a9a9', width: aWidth}}/>
                <TouchableOpacity onPress={this._choose.bind(this, i)} key={i}>
                    <View style={styles.item}>
                        <Text style={{
                            color: '#333333',
                            fontSize: 17,
                            textAlign: "center",
                        }}>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.state.show}
                onShow={() => {}}
                onRequestClose={() => {}}>
                {/*遮罩层*/}
                <View style={styles.mask}/>

                <TouchableOpacity style={{flex: 1}} onPress={this._out}/>
                <View style={styles.contentContainer}>
                    <View style={styles.content}>
                        <View style={styles.tipTitleView}>
                            <Text style={styles.tipTitleText}>{this.state.title}</Text>
                        </View>
                        {
                            this.entityList.map((item, i) => this._renderItem(item, i))
                        }
                    </View>
                    <TouchableHighlight
                        style={[styles.button, styles.cancelButton]}
                        underlayColor={'#f0f0f0'}
                        onPress={this._cancel}
                    >
                        <Text style={styles.buttonText}>取消</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        );
    }

    _out = () => {
        this.setState({
            ...this.state,
            show: false
        })
    };

    //取消
    _cancel = () => {
        this._out();
    };

    //选择
    _choose(i) {
        this._out();
        this.callback && this.callback(i, this.state.params);
    };

    /*
     * title: 标题
     * entityList：选择项数据  数组
     * tipTextColor: 字体颜色
     * callback：回调方法
     */
    show(title: string, entityList: Array, callback: Object, params: Object) {
        this.entityList = entityList;
        this.callback = callback;

        if (entityList && entityList.length > 0) {
            this.setState({
                title: title,
                show: true,
                params: params,
            });
        }
    }
}

/*
* show the selector for select one map to navigation.
* */
const selectedArr = [{key:1, title:"百度地图"}, {key:2, title:"高德地图"}];
export function showMapSelector(selector: Object, params: Object) {
    if (selector === null || selector === undefined)
        return;

    selector.show("请选择导航地图", selectedArr, callbackSelected, params);
}

// 回调
function callbackSelected(i, params){
    let theMap = 'cp:cancel';
    switch (i) {
        case 0:
            theMap = mapApp.bdMap;
            break;
        case 1:
            theMap = mapApp.gdMap;
            break;
        default:
            break;
    }

    let {start, end} = params;
    if (theMap !== 'cp:cancel') {
        if (end === null || end === undefined)
        {
            alert('目的地无法解析，无法进行导航！');
            return;
        }

        gotoNavigation(theMap,
            start,
            end,
            (succeed, msg)=>{
                alert(msg);
            });
    }
}