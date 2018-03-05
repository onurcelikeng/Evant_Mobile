export const AvatarTypes = (theme) => {
  return ({
    _base: {
      container: {
        alignItems: 'center',
        flexDirection: 'row',
      },
      image: {
        width: 40,
        height: 40
      },
      badge: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: -2,
        right: -2
      },
      badgeText: {
        backgroundColor: 'transparent',
        fontSize: 9,
      }
    },
    big: {
      image: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 19,
        marginTop:25,
        borderColor:"#ffffff", 
        borderWidth:1.5,
      },
      container: {
        flexDirection: 'column'
      }
    },
    bigEdit: {
      image: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 19,      
        paddingVertical: 25
      },
      container: {
        flexDirection: 'column'
      }
    },
    small: {
      image: {
        width: 30,
        height: 30,
        borderRadius:15,
        marginHorizontal: 5
      }
    },
    circle: {
      image: {
        borderRadius: 20
      },
    }
  })
};