import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ImageBackground } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import Timeline from 'react-native-timeline-listview'

export default class AddEvent extends React.Component {

    constructor(props) {
        super(props);
        this.onEventPress = this.onEventPress.bind(this);
        this.renderSelected = this.renderSelected.bind(this);
        this.data = [
            {
              time: '09:00', 
              title: 'Archery Training', 
              description: 'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
              lineColor:'#009688', 
              icon: require('../../assets/icons/archery.png'),
              imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg'
            },
            {
              time: '10:45', 
              title: 'Play Badminton', 
              description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.', 
              icon: require('../../assets/icons/badminton.png'),
              imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg'
            },
            {
              time: '12:00', 
              title: 'Lunch', 
              icon: require('../../assets/icons/lunch.png'),
            },
            {
              time: '14:00', 
              title: 'Watch Soccer', 
              description: 'Team sport played between two teams of eleven players with a spherical ball. ',
              lineColor:'#009688', 
              icon: require('../../assets/icons/soccer.png'),
              imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg'
            },
            {
              time: '16:30', 
              title: 'Go to Fitness center', 
              description: 'Look out for the Best Gym & Fitness Centers around me :)', 
              icon: require('../../assets/icons/dumbbell.png'),
              imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg'
            },
            {
                time: '09:00', 
                title: 'Archery Training', 
                description: 'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
                lineColor:'#009688', 
                icon: require('../../assets/icons/archery.png'),
                imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg'
              },
              {
                time: '10:45', 
                title: 'Play Badminton', 
                description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.', 
                icon: require('../../assets/icons/badminton.png'),
                imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg'
              },
              {
                time: '12:00', 
                title: 'Lunch', 
                icon: require('../../assets/icons/lunch.png'),
              },
              {
                time: '14:00', 
                title: 'Watch Soccer', 
                description: 'Team sport played between two teams of eleven players with a spherical ball. ',
                lineColor:'#009688', 
                icon: require('../../assets/icons/soccer.png'),
                imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg'
              },
              {
                time: '16:30', 
                title: 'Go to Fitness center', 
                description: 'Look out for the Best Gym & Fitness Centers around me :)', 
                icon: require('../../assets/icons/dumbbell.png'),
                imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg'
              },
              {
              time: '09:00', 
              title: 'Archery Training', 
              description: 'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
              lineColor:'#009688', 
              icon: require('../../assets/icons/archery.png'),
              imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg'
            },
            {
              time: '10:45', 
              title: 'Play Badminton', 
              description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.', 
              icon: require('../../assets/icons/badminton.png'),
              imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg'
            },
            {
              time: '12:00', 
              title: 'Lunch', 
              icon: require('../../assets/icons/lunch.png'),
            },
            {
              time: '14:00', 
              title: 'Watch Soccer', 
              description: 'Team sport played between two teams of eleven players with a spherical ball. ',
              lineColor:'#009688', 
              icon: require('../../assets/icons/soccer.png'),
              imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg'
            },
            {
              time: '16:30', 
              title: 'Go to Fitness center', 
              description: 'Look out for the Best Gym & Fitness Centers around me :)', 
              icon: require('../../assets/icons/dumbbell.png'),
              imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg'
            }       
        ]
        this.state = {selected: null}
    }

    onEventPress(data){
        this.setState({selected: data})
      }
    
      renderSelected(){
          if(this.state.selected)
            return <Text style={{marginTop:10}}>Selected event: {this.state.selected.title} at {this.state.selected.time}</Text>
      }
    
      render() {
        return (
          <ImageBackground source={require("../../assets/images/background.jpg")} style={styles.container}>
            <Timeline 
              style={styles.list}
              data={this.data}
              circleSize={20}
              circleColor='rgba(0,0,0,0)'
              lineColor='rgb(45,156,219)'
              timeContainerStyle={{minWidth:52, marginTop: -5}}
              timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
              descriptionStyle={{color:'gray'}}
              options={{
                style:{paddingTop:5}
              }}
              innerCircle={'icon'}
              onEventPress={this.onEventPress}                    
              separator={false}
              detailContainerStyle={{marginBottom: 20, paddingLeft: 5, paddingRight: 5, backgroundColor: "#BBDAFF", borderRadius: 10}}
              columnFormat='two-column'
            />
          </ImageBackground>
        );
      }
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        backgroundColor:'white'
      },
      list: {
        flex: 1,
      },
      title:{
        fontSize:16,
        fontWeight: 'bold'
      },
      descriptionContainer:{
        flexDirection: 'row',
        paddingRight: 50
      },
      image:{
        width: 50,
        height: 50,
        borderRadius: 25
      },
      textDescription: {
        marginLeft: 10,
        color: 'gray'
      }
    });