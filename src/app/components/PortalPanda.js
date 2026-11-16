import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

/**
 * Panda mascot emerging from the existing circular portal.
 * The circular portal remains in place while a panda emerges and waves hello.
 * All animation uses React Native Animated with the native driver.
 */
export default function PortalRobot() {
  const entrance = useRef(new Animated.Value(0)).current;
  const portalPulse = useRef(new Animated.Value(0)).current;
  const portalSpin = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const bodySway = useRef(new Animated.Value(0)).current;
  const headSway = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const portalAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(portalPulse, {
          toValue: 1,
          duration: 1150,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(portalPulse, {
          toValue: 0,
          duration: 1150,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
      ]),
    );

    const spinAnimation = Animated.loop(
      Animated.timing(portalSpin, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    );

    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(2300),
        Animated.timing(blink, { toValue: 0.08, duration: 85, useNativeDriver: true, isInteraction: false }),
        Animated.timing(blink, { toValue: 1, duration: 130, useNativeDriver: true, isInteraction: false }),
        Animated.delay(220),
      ]),
    );

    const waveCycle = Animated.sequence([
      Animated.timing(wave, { toValue: 1, duration: 430, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(wave, { toValue: 0, duration: 430, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]);
    const waveAnimation = Animated.loop(waveCycle);

    const swayAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bodySway, { toValue: 1, duration: 1050, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
        Animated.timing(bodySway, { toValue: 0, duration: 1050, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      ]),
    );

    const headAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(headSway, { toValue: 1, duration: 820, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
        Animated.timing(headSway, { toValue: 0, duration: 820, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      ]),
    );

    const entranceAnimation = Animated.timing(entrance, {
      toValue: 1,
      duration: 1150,
      easing: Easing.out(Easing.back(1.18)),
      useNativeDriver: true,
      isInteraction: false,
    });

    portalAnimation.start();
    spinAnimation.start();
    blinkAnimation.start();
    entranceAnimation.start(({ finished }) => {
      if (finished) {
        waveAnimation.start();
        swayAnimation.start();
        headAnimation.start();
      }
    });

    return () => {
      [portalAnimation, spinAnimation, blinkAnimation, entranceAnimation, waveAnimation, swayAnimation, headAnimation].forEach((animation) => animation.stop());
    };
  }, [blink, bodySway, entrance, headSway, portalPulse, portalSpin, wave]);

  const portalScale = portalPulse.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.075] });
  const portalOpacity = portalPulse.interpolate({ inputRange: [0, 1], outputRange: [0.52, 0.94] });
  const portalRotation = portalSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const pandaScale = entrance.interpolate({ inputRange: [0, 0.72, 1], outputRange: [0.22, 1.035, 0.97] });
  const pandaY = entrance.interpolate({ inputRange: [0, 1], outputRange: [23, -1] });
  const pandaOpacity = entrance.interpolate({ inputRange: [0, 0.22, 1], outputRange: [0, 0.8, 1] });
  const waveRotation = wave.interpolate({ inputRange: [0, 1], outputRange: ['18deg', '-48deg'] });
  const bodyRotation = bodySway.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] });
  const bodyLift = bodySway.interpolate({ inputRange: [0, 1], outputRange: [1, -1.5] });
  const headRotation = headSway.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '5deg'] });
  const shadowScale = bodySway.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.06] });

  return (
    <View style={styles.container} accessible accessibilityLabel="Panda mascot emerging from a circular portal and waving hello">
      <Animated.View style={[styles.portalOuter, { opacity: portalOpacity, transform: [{ scale: portalScale }, { rotate: portalRotation }] }]}>
        <View style={styles.portalInner} />
        <View style={styles.portalDashTop} />
        <View style={styles.portalDashBottom} />
      </Animated.View>
      <Animated.View style={[styles.portalCore, { opacity: portalOpacity, transform: [{ scale: portalScale }] }]} />
      <Animated.View style={[styles.groundShadow, { transform: [{ scaleX: shadowScale }] }]} />

      <Animated.View
        style={[
          styles.panda,
          {
            opacity: pandaOpacity,
            transform: [{ translateY: Animated.add(pandaY, bodyLift) }, { scale: pandaScale }],
          },
        ]}
      >
        <Animated.View style={[styles.headGroup, { transform: [{ rotate: headRotation }] }]}>
          <View style={styles.earLeft} />
          <View style={styles.earRight} />
          <View style={styles.head}>
            <View style={styles.patchLeft}>
              <Animated.View style={[styles.eye, { transform: [{ scaleY: blink }] }]} />
            </View>
            <View style={styles.patchRight}>
              <Animated.View style={[styles.eye, { transform: [{ scaleY: blink }] }]} />
            </View>
            <View style={styles.nose} />
            <View style={styles.mouthLeft} />
            <View style={styles.mouthRight} />
            <View style={styles.blushLeft} />
            <View style={styles.blushRight} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.bodyGroup, { transform: [{ rotate: bodyRotation }] }]}>
          <View style={styles.body}>
            <View style={styles.belly} />
          </View>
        </Animated.View>

        <View style={styles.leftArmPivot}>
          <View style={styles.arm} />
          <View style={styles.paw} />
        </View>
        <Animated.View style={[styles.rightArmPivot, { transform: [{ rotate: waveRotation }] }]}>
          <View style={styles.arm} />
          <View style={styles.paw}>
            <View style={styles.pawToeOne} />
            <View style={styles.pawToeTwo} />
          </View>
        </Animated.View>

        <View style={styles.leftLeg}>
          <View style={styles.foot} />
        </View>
        <View style={styles.rightLeg}>
          <View style={styles.foot} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 88, height: 94, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  portalOuter: { position: 'absolute', width: 76, height: 76, top: 9, borderRadius: 38, borderWidth: 2, borderColor: 'rgba(128,224,244,0.9)', alignItems: 'center', justifyContent: 'center', shadowColor: '#72DFF0', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 10, elevation: 5 },
  portalInner: { width: 62, height: 62, borderRadius: 31, borderWidth: 1, borderColor: 'rgba(210,250,255,0.48)', backgroundColor: 'rgba(85,203,230,0.15)' },
  portalDashTop: { position: 'absolute', top: -3, width: 14, height: 3, borderRadius: 2, backgroundColor: '#B6F7FF' },
  portalDashBottom: { position: 'absolute', bottom: -3, width: 14, height: 3, borderRadius: 2, backgroundColor: '#79DFF0' },
  portalCore: { position: 'absolute', width: 52, height: 52, top: 21, borderRadius: 26, backgroundColor: 'rgba(63,190,220,0.12)' },
  groundShadow: { position: 'absolute', width: 40, height: 6, bottom: 5, borderRadius: 10, backgroundColor: 'rgba(7,28,48,0.25)' },
  panda: { position: 'absolute', width: 84, height: 92, top: 1, left: 2 },
  headGroup: { position: 'absolute', top: 12, left: 17, width: 52, height: 43, alignItems: 'center' },
  earLeft: { position: 'absolute', left: 2, top: 0, width: 17, height: 17, borderRadius: 9, backgroundColor: '#202A35', borderWidth: 2, borderColor: '#111A23' },
  earRight: { position: 'absolute', right: 2, top: 0, width: 17, height: 17, borderRadius: 9, backgroundColor: '#202A35', borderWidth: 2, borderColor: '#111A23' },
  head: { position: 'absolute', top: 5, width: 47, height: 39, borderRadius: 23, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderColor: '#E2E8EF', alignItems: 'center', justifyContent: 'center', shadowColor: '#14283A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.13, shadowRadius: 3, elevation: 2 },
  patchLeft: { position: 'absolute', top: 10, left: 8, width: 12, height: 16, borderRadius: 8, backgroundColor: '#202A35', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '19deg' }] },
  patchRight: { position: 'absolute', top: 10, right: 8, width: 12, height: 16, borderRadius: 8, backgroundColor: '#202A35', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-19deg' }] },
  eye: { width: 4, height: 5, borderRadius: 3, backgroundColor: '#FFFFFF' },
  nose: { position: 'absolute', top: 25, width: 7, height: 5, borderRadius: 4, backgroundColor: '#202A35' },
  mouthLeft: { position: 'absolute', top: 29, left: 21, width: 5, height: 4, borderBottomWidth: 1.3, borderRightWidth: 1.1, borderColor: '#202A35', borderBottomRightRadius: 5 },
  mouthRight: { position: 'absolute', top: 29, right: 21, width: 5, height: 4, borderBottomWidth: 1.3, borderLeftWidth: 1.1, borderColor: '#202A35', borderBottomLeftRadius: 5 },
  blushLeft: { position: 'absolute', top: 26, left: 5, width: 6, height: 3, borderRadius: 3, backgroundColor: '#F3B7B8', opacity: 0.8 },
  blushRight: { position: 'absolute', top: 26, right: 5, width: 6, height: 3, borderRadius: 3, backgroundColor: '#F3B7B8', opacity: 0.8 },
  bodyGroup: { position: 'absolute', top: 51, left: 27, width: 32, height: 34, alignItems: 'center' },
  body: { position: 'absolute', top: 0, width: 31, height: 32, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderColor: '#E2E8EF', alignItems: 'center', justifyContent: 'center', shadowColor: '#14283A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  belly: { width: 19, height: 22, borderRadius: 11, backgroundColor: '#F7F9FC', borderWidth: 0.8, borderColor: '#EDF0F4' },
  leftArmPivot: { position: 'absolute', left: 14, top: 54, width: 17, height: 28, transform: [{ rotate: '24deg' }] },
  rightArmPivot: { position: 'absolute', left: 55, top: 48, width: 19, height: 32 },
  arm: { position: 'absolute', top: 7, left: 5, width: 10, height: 21, borderRadius: 6, backgroundColor: '#202A35', borderWidth: 1, borderColor: '#111A23' },
  paw: { position: 'absolute', top: 0, left: 2, width: 16, height: 16, borderRadius: 9, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderColor: '#DCE3EA', alignItems: 'center', justifyContent: 'center' },
  pawToeOne: { position: 'absolute', top: 2, left: 4, width: 3, height: 4, borderRadius: 2, backgroundColor: '#303A46' },
  pawToeTwo: { position: 'absolute', top: 2, right: 4, width: 3, height: 4, borderRadius: 2, backgroundColor: '#303A46' },
  leftLeg: { position: 'absolute', left: 27, top: 77, width: 14, height: 14, transform: [{ rotate: '-5deg' }] },
  rightLeg: { position: 'absolute', left: 43, top: 77, width: 14, height: 14, transform: [{ rotate: '5deg' }] },
  foot: { position: 'absolute', bottom: 0, width: 15, height: 9, borderRadius: 6, backgroundColor: '#202A35', borderWidth: 1, borderColor: '#111A23' },
});
