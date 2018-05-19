import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { RkComponent, RkText, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';

import { VictoryPie } from "victory-native";

import { Svg, Text as SvgText } from 'react-native-svg';
import { scale } from '../../utils/scale';
import DropdownHolder from '../../providers/dropdownHolder';
import * as dashboardProvider from '../../providers/dashboard';

export class DoughnutChart extends RkComponent {

  constructor(props) {
    super(props);

    this.size = 300;
    this.fontSize = 40;
    this.state = {
      selected: 0,
      isLoading: true
    }
  }

  componentDidMount() {
    this.getRange();
  }

  getRange() {
    dashboardProvider.getRanges(this.props.eventId).then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
				DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
			} else {
				if(responseJson.isSuccess) {
					this.setState({
						data: [
              {
                x: 1,
                y: responseJson.data.teenager.ratio,
                title: responseJson.data.teenager.ratio + '%',
                name: responseJson.data.teenager.min + "-" + responseJson.data.teenager.max + " " + responseJson.data.teenager.name,
                color: RkTheme.current.colors.charts.doughnut[0]
              },
              {
                x: 1,
                y: responseJson.data.young.ratio,
                title: responseJson.data.young.ratio + '%',
                name: responseJson.data.young.min + "-" + responseJson.data.young.max + " " + responseJson.data.young.name,
                color: RkTheme.current.colors.charts.doughnut[1]
              },
              {
                x: 1,
                y: responseJson.data.middle.ratio,
                title: responseJson.data.middle.ratio + '%',
                name: responseJson.data.middle.min + "-" + responseJson.data.middle.max + " " + responseJson.data.middle.name,
                color: RkTheme.current.colors.charts.doughnut[2]
              },
              {
                x: 1,
                y: responseJson.data.old.ratio,
                title: responseJson.data.old.ratio + '%',
                name: responseJson.data.old.min + "-" + responseJson.data.old.max + " " + responseJson.data.old.name,
                color: RkTheme.current.colors.charts.doughnut[3]
              }
            ],
            isLoading: false
					});
				} else {
					console.log(responseJson.message);
				}
			}
    }).catch((err) => { console.log(err) });
  }

  computeColors() {
    return this.state.data.map(i => i.color)
  }

  handlePress(e, props) {
    this.setState({
      selected: props.index
    })
  }

  render() {
    if(this.state.isLoading) {
      return (
        <View>
          <RkText rkType='header4'>AUDIENCE OVERVIEW</RkText>
        </View>
      )
    }
    return (
      <View>
        <RkText rkType='header4'>AUDIENCE OVERVIEW</RkText>
        <View style={{alignSelf: 'center'}}>
          <Svg width={scale(this.size)} height={scale(this.size)}>
            <VictoryPie
              labels={[]}
              width={scale(this.size)} height={scale(this.size)}
              colorScale={this.computeColors()}
              data={this.state.data}
              standalone={false}
              padding={scale(25)}
              innerRadius={scale(70)}
              events={[{
                target: "data",
                eventHandlers: {
                  onPressIn: (evt, props) => this.handlePress(evt, props)
                }
              }]}>
            </VictoryPie>
            <SvgText
              textAnchor="middle" 
              verticalAnchor="middle"
              x={scale(this.size / 2)}
              y={scale(this.size / 2 - this.fontSize / 2)}
              dy={scale(this.fontSize)}
              height={scale(this.fontSize)}
              fontSize={scale(this.fontSize)}
              fontFamily={RkTheme.current.fonts.family.regular}
              stroke={RkTheme.current.colors.text.base}
              fill={RkTheme.current.colors.text.base}>
              {this.state.data[this.state.selected].title}
            </SvgText>
          </Svg>
        </View>
        <View style={styles.legendContainer}>
          {this.state.data.map(item => {
            return (
              <View key={item.name} style={styles.legendItem}>
                <View style={[styles.itemBadge, {backgroundColor: item.color}]}/>
                <RkText rkType="primary3">{item.name}</RkText>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5
  }
}));