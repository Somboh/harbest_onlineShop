import React, { useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

//Carrusel horizontal con paginado y puntitos indicadores. Si solo hay una
//foto, los puntitos no se pintan (no aporta nada). Si no hay ninguna, se
//pinta el `placeholder` que recibimos por props.
export default function ProductImageCarousel({
  images,
  placeholder,
  height = 260,
  borderRadius = 28,
  dotColor = "#69C6BE",
  contentWidth,
}) {
  const { width: windowWidth } = useWindowDimensions();
  const width = contentWidth ?? windowWidth - 40;
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  if (safeImages.length === 0) {
    return (
      <View style={{ height, borderRadius, overflow: "hidden" }}>
        {placeholder}
      </View>
    );
  }

  const onScroll = (event) => {
    //Calculamos el índice activo con la posición de scroll. Redondeamos para
    //evitar saltos por offsets de subpíxel en algunos navegadores.
    const offsetX = event.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / width);
    if (idx !== active && idx >= 0 && idx < safeImages.length) {
      setActive(idx);
    }
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        onScroll={onScroll}
        scrollEventThrottle={32}
        style={{ height, borderRadius, overflow: "hidden" }}
      >
        {safeImages.map((img, i) => (
          <Image
            key={i}
            source={img}
            style={{ width, height, resizeMode: "cover" }}
          />
        ))}
      </ScrollView>

      {safeImages.length > 1 ? (
        <View style={styles.dotsRow}>
          {safeImages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === active ? dotColor : "rgba(0,0,0,0.18)",
                  width: i === active ? 18 : 6,
                },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dotsRow: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
