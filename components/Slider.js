import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Text,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const ImageCarousel = ({ images }) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(index);
  };

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
            <Text style={styles.imageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Indicator Dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  imageWrapper: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  carouselImage: {
    width: 340,
    height: 150,
    borderRadius: 10,
  },
  imageText: {
    color: "#174684",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#174684",
  },
  inactiveDot: {
    backgroundColor: "#ccc",
  },
});
