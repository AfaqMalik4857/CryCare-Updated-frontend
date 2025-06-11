import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const HomeSlider = ({ images }) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);
        setActiveIndex(index);
      },
    }
  );

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
        return nextIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <View style={styles.carouselContainer}>
      {/* FlatList for the Image Carousel */}
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onScroll={onScroll}
        scrollEventThrottle={16} // Improve scroll performance
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image
              source={item.source}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* Indicator Dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
                { opacity },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  imageWrapper: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  carouselImage: {
    width: 370,
    height: 170,
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#174684",
  },
  inactiveDot: {
    backgroundColor: "#ccc",
  },
});

export default HomeSlider;
