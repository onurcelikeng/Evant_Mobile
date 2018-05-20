import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableWithoutFeedback,TextInput,StyleSheet, Dimensions } from 'react-native'

import LineChart from './lineChart';


const colors = {
  chartBlue:'#4286F5',
  chartRed:'#DC4437',
  chartYellow:'#F5B400',
  chartBlueOpacity:'rgba(66, 134, 245,0.3)',
  chartRedOpacity:null,//'rgba(220, 68, 55, 0)',
  chartYellowOpacity:null,//'rgba(245, 180, 0, 0)',
}

export class UserDistribution extends React.Component {
    static navigationOptions = {
        title: 'Line Chart',
        headerStyle: { backgroundColor: '#E75604',borderBottomWidth: 0 },
        headerTitleStyle: { color: '#FFF' },
    }

    constructor(props) {
        super(props);

        var chart = {
            values: [
                [28,48,40,19,96,27,100]
            ],
            colors: {
                labelsColor : [colors.chartBlue],
                fillColor : [colors.chartBlueOpacity],
                strokeColor : [colors.chartBlue],
                axisColor : 'rgba(216, 216, 216, 1)',
                axisTextColor: 'gray',
            },
            options: {
                strokeWidth: 1,
                margin: {
                    left: 40,
                    right: 10,
                    top: 10,
                    bottom: 20
                },
                labelWidth: 50,
            },
            showAxis: false,
            labels: ['LABEL A'],
            selected: null,
            axis: ['10/09', '11/09', '12/09', '13/09', '14/09', '15/09','16/09'],
        }

        let count = [
            0,
            0,
            0,
        ];

        chart.values.forEach((data,index) => {
            data.forEach((elem) => {
                count[index] += elem;
            });
        });

        this.state = {
            chart : chart,
            count: count,
        }

        this.selectChart = this.selectChart.bind(this);
    }

    selectChart(index) {
        let chart = this.state.chart;
        this.setState({chart:chart});
    }

    getChartWidth(){
        return Dimensions.get('window').width - 16-2;
    }


    render() {
        const {chart,count} = this.state;
        const labels = count.map((elem, index) => {
            let value = elem;
            let color = {color : chart.colors.labelsColor[index]};
            let borderColor = {borderColor : chart.colors.labelsColor[index]};
            let border = {};
            if(index==1){
                border= {borderLeftWidth : 0.5,borderRightWidth : 0.5};
            }

            return (
                <View key={index} style={[styles.listItemRow,border]}>
                    <Text style={[styles.listItemRowText,styles.listItemRowTextTitle,color]}>{chart.labels[index]}</Text>
                    <View style={[styles.listItemRowSeparator,borderColor]}></View>
                    <Text style={[styles.listItemRowTextValue]}>{value} €</Text>
                </View>
            )
        })

        let subtitle = "Du " + chart.axis[0] + " au " + chart.axis[chart.axis.length-1];
        let buttonRemoveSelected = null;

        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ScrollView style={styles.card}>
                    <LineChart onPressItem={this.selectChart} height={200} width={this.getChartWidth()} chart={chart}/>
                </ScrollView>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    card: {
      borderRadius : 1,
      borderWidth : 0.5,
      borderColor: 'lightgray',
      backgroundColor : '#FFF',
      margin: 8,
    },
    listHeaderText: {
      fontSize: 16,
    },
    listHeader: {
  	  display: 'flex',
      paddingTop: 10,
      paddingBottom: 20,
      paddingLeft: 15,
      paddingBottom: 10,
      borderBottomWidth:0.5,
      borderColor:'lightgray',
    },
    listSubtitle: {
  	  display: 'flex',
      paddingTop: 8,
      paddingBottom: 20,
      paddingLeft: 15,
      paddingBottom: 8,
      borderTopWidth:0.5,
      borderColor:'lightgray',
      flexDirection: 'row',
    },
    listSubtitleText: {
      fontSize: 13,
      textAlign: 'center',
      flex: 1,
    },
    listSubtitleButton: {
      alignSelf: 'flex-end',
    },
    listSubtitleButtonText: {
      color : 'blue',
      fontSize: 13,
    },
    listItemColumn: {
      borderTopWidth:0.5,
      borderColor:'lightgray',
      display: 'flex',
      flexDirection: 'row',
    },
    listItemRow: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      borderColor: 'lightgray',
      borderBottomWidth: 0.5,
    },
    listItemRowText: {
      textAlign: 'center'
    },
    listItemRowTextTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
      paddingTop: 3,
      paddingBottom: 3,
      flex: 1,
    },
    listItemRowSeparator: {
      borderTopWidth: 2,
    },
    listItemRowTextValue: {
      textAlign: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      fontSize: 14,
    },
});