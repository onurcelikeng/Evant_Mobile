import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {Actions} from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './sliderEntry.style';

let moment = require('moment');

export default class SliderEntry extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data: { photoUrl }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: photoUrl }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: photoUrl }}
              style={styles.image}
            />
        );
    }

    render () {
        const { data: { title, start, eventId }, even } = this.props;

        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { Actions.eventDetail({id: eventId, obj: this.props.data}) }}
              >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    { this.image }
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={2}
                    >
                        { moment(start).format('lll') }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}