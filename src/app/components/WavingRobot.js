import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

/**
 * Friendly, full-body robot mascot for the Home hero.
 * Every moving part uses React Native's native Animated driver, so the mascot
 * can float, nod, wave, step, blink, and pulse without an extra dependency.
 */
export default function WavingRobot() {
  const bob = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const headNod = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const leftArmMove = useRef(new Animated.Value(0)).current;
  const leftLegMove = useRef(new Animated.Value(0)).current;
  const rightLegMove = useRef(new Animated.Value(0)).current;
  const leftFootMove = useRef(new Animated.Value(0)).current;
  const rightFootMove = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;
  const chestPulse = useRef(new Animated.Value(0)).current;
  const antennaPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeLoop = (value, first, second, pause = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: first,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: second,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
            isInteraction: false,
          }),
          ...(pause ? [Animated.delay(pause)] : []),
        ]),
      );

    const animations = [
      makeLoop(bob, 760, 760),
      makeLoop(sway, 980, 980),
      makeLoop(headNod, 1150, 1150, 100),
      makeLoop(wave, 390, 390, 180),
      makeLoop(leftArmMove, 800, 800),
      makeLoop(leftLegMove, 700, 700),
      makeLoop(rightLegMove, 700, 700),
      makeLoop(leftFootMove, 700, 700),
      makeLoop(rightFootMove, 700, 700),
      Animated.loop(
        Animated.sequence([
          Animated.delay(1850),
          Animated.timing(blink, {
            toValue: 0.12,
            duration: 85,
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(blink, {
            toValue: 1,
            duration: 110,
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.delay(150),
        ]),
      ),
      makeLoop(chestPulse, 650, 650),
      makeLoop(antennaPulse, 850, 850),
    ];

    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [
    antennaPulse,
    bob,
    blink,
    chestPulse,
    headNod,
    leftArmMove,
    leftFootMove,
    leftLegMove,
    rightFootMove,
    rightLegMove,
    sway,
    wave,
  ]);

  const floating = bob.interpolate({ inputRange: [0, 1], outputRange: [1, -3] });
  const bodyTilt = sway.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] });
  const headTilt = headNod.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '5deg'] });
  const waveTilt = wave.interpolate({ inputRange: [0, 1], outputRange: ['-42deg', '-4deg'] });
  const leftArmTilt = leftArmMove.interpolate({ inputRange: [0, 1], outputRange: ['7deg', '-9deg'] });
  const leftLegTilt = leftLegMove.interpolate({ inputRange: [0, 1], outputRange: ['-9deg', '8deg'] });
  const rightLegTilt = rightLegMove.interpolate({ inputRange: [0, 1], outputRange: ['8deg', '-9deg'] });
  const leftFootTilt = leftFootMove.interpolate({ inputRange: [0, 1], outputRange: ['-5deg', '4deg'] });
  const rightFootTilt = rightFootMove.interpolate({ inputRange: [0, 1], outputRange: ['4deg', '-5deg'] });
  const glowOpacity = antennaPulse.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1] });
  const chestScale = chestPulse.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1.12] });

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Friendly robot mascot waving and moving"
    >
      <Animated.View style={[styles.groundShadow, { opacity: bob.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.12] }), transform: [{ scaleX: bob.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] }) }] }]} />
      <View style={styles.halo} />

      <Animated.View style={[styles.robot, { transform: [{ translateY: floating }, { scale: 0.9 }] }]}>
        {/* Antenna */}
        <Animated.View style={[styles.antenna, { transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -1] }) }] }]}>
          <View style={styles.antennaStem} />
          <Animated.View style={[styles.antennaTip, { opacity: glowOpacity, transform: [{ scale: glowOpacity }] }]} />
        </Animated.View>

        {/* Head: separate joint so the robot can nod and look around. */}
        <Animated.View style={[styles.headGroup, { transform: [{ rotate: headTilt }] }]}>
          <View style={styles.leftEar}><View style={styles.earLight} /></View>
          <View style={styles.rightEar}><View style={styles.earLight} /></View>
          <View style={styles.headShell}>
            <View style={styles.headHighlight} />
            <View style={styles.facePanel}>
              <View style={styles.eyes}>
                <Animated.View style={[styles.eye, { transform: [{ scaleY: blink }] }]} />
                <Animated.View style={[styles.eye, { transform: [{ scaleY: blink }] }]} />
              </View>
              <View style={styles.smile} />
              <View style={styles.cheekLeft} />
              <View style={styles.cheekRight} />
            </View>
          </View>
        </Animated.View>

        {/* Torso and shoulders */}
        <Animated.View style={[styles.torsoGroup, { transform: [{ rotate: bodyTilt }] }]}>
          <View style={styles.neck} />
          <View style={styles.bodyShell}>
            <View style={styles.bodyHighlight} />
            <View style={styles.chestPanel}>
              <Animated.View style={[styles.chestCore, { transform: [{ scale: chestScale }] }]} />
              <View style={styles.chestLine} />
            </View>
            <View style={styles.bodySeam} />
          </View>
        </Animated.View>

        {/* Left arm moves gently to balance the raised waving arm. */}
        <Animated.View style={[styles.leftArmPivot, { transform: [{ rotate: leftArmTilt }] }]}>
          <View style={styles.armUpper} />
          <View style={styles.armJoint} />
          <View style={styles.armForearm} />
          <View style={styles.handRest} />
        </Animated.View>

        {/* Right arm swings at the shoulder while the hand stays visible. */}
        <Animated.View style={[styles.waveArmPivot, { transform: [{ rotate: waveTilt }] }]}>
          <View style={styles.armUpper} />
          <View style={styles.armJoint} />
          <View style={styles.waveForearm} />
          <View style={styles.waveHand}>
            <View style={styles.fingerA} />
            <View style={styles.fingerB} />
            <View style={styles.fingerC} />
          </View>
        </Animated.View>

        {/* Legs and feet use opposing motion for a soft stepping bounce. */}
        <Animated.View style={[styles.leftLegPivot, { transform: [{ rotate: leftLegTilt }] }]}>
          <View style={styles.legStem} />
          <Animated.View style={[styles.foot, { transform: [{ rotate: leftFootTilt }] }]} />
        </Animated.View>
        <Animated.View style={[styles.rightLegPivot, { transform: [{ rotate: rightLegTilt }] }]}>
          <View style={styles.legStem} />
          <Animated.View style={[styles.foot, { transform: [{ rotate: rightFootTilt }] }]} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const C = {
  shell: '#F8FCFF',
  edge: '#AFC9D9',
  edgeDark: '#7899AE',
  navy: '#163B57',
  face: '#173C58',
  aqua: '#63E0CD',
  blue: '#82D7F4',
  blush: '#F49FA6',
};

const styles = StyleSheet.create({
  container: {
    width: 84,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  halo: {
    position: 'absolute',
    width: 76,
    height: 76,
    top: 13,
    borderRadius: 38,
    backgroundColor: 'rgba(215,246,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  groundShadow: {
    position: 'absolute',
    width: 42,
    height: 7,
    bottom: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(7,28,48,0.42)',
  },
  robot: {
    position: 'absolute',
    width: 84,
    height: 94,
    top: 1,
    left: 2,
  },
  antenna: { position: 'absolute', top: 0, left: 39, width: 12, height: 17, alignItems: 'center' },
  antennaStem: { position: 'absolute', top: 7, width: 3, height: 11, borderRadius: 2, backgroundColor: C.edgeDark },
  antennaTip: { position: 'absolute', top: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: C.aqua, borderWidth: 2, borderColor: C.shell },
  headGroup: { position: 'absolute', top: 11, left: 17, width: 52, height: 38, alignItems: 'center' },
  headShell: {
    position: 'absolute', top: 0, left: 4, width: 44, height: 36,
    borderRadius: 13, backgroundColor: C.shell, borderWidth: 1.5, borderColor: C.edge,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#08263B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 3, elevation: 3,
  },
  headHighlight: { position: 'absolute', top: 3, left: 10, width: 16, height: 3, borderRadius: 2, backgroundColor: '#FFFFFF', opacity: 0.9 },
  facePanel: { width: 34, height: 25, borderRadius: 8, backgroundColor: C.face, alignItems: 'center', justifyContent: 'center', paddingTop: 1 },
  eyes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 3 },
  eye: { width: 4, height: 6, borderRadius: 3, backgroundColor: C.aqua },
  smile: { width: 9, height: 4, borderBottomWidth: 1.5, borderColor: '#B6F5E9', borderRadius: 5 },
  cheekLeft: { position: 'absolute', left: 4, top: 15, width: 3, height: 2, borderRadius: 2, backgroundColor: C.blush, opacity: 0.8 },
  cheekRight: { position: 'absolute', right: 4, top: 15, width: 3, height: 2, borderRadius: 2, backgroundColor: C.blush, opacity: 0.8 },
  leftEar: { position: 'absolute', left: 0, top: 12, width: 6, height: 13, borderRadius: 3, backgroundColor: C.edgeDark, alignItems: 'center', justifyContent: 'center' },
  rightEar: { position: 'absolute', right: 0, top: 12, width: 6, height: 13, borderRadius: 3, backgroundColor: C.edgeDark, alignItems: 'center', justifyContent: 'center' },
  earLight: { width: 2, height: 6, borderRadius: 2, backgroundColor: C.aqua },
  neck: { position: 'absolute', top: 0, left: 17, width: 9, height: 8, borderRadius: 3, backgroundColor: C.edgeDark },
  torsoGroup: { position: 'absolute', top: 45, left: 23, width: 39, height: 37, alignItems: 'center' },
  bodyShell: {
    position: 'absolute', top: 3, left: 0, width: 39, height: 31, borderRadius: 11,
    backgroundColor: C.shell, borderWidth: 1.5, borderColor: C.edge,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#08263B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 2,
  },
  bodyHighlight: { position: 'absolute', top: 3, left: 8, width: 12, height: 2, borderRadius: 2, backgroundColor: '#FFFFFF' },
  chestPanel: { width: 20, height: 18, borderRadius: 6, backgroundColor: '#DDF5F7', borderWidth: 1, borderColor: '#C3E7EB', alignItems: 'center', justifyContent: 'center', gap: 2 },
  chestCore: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.aqua, borderWidth: 1, borderColor: '#FFFFFF' },
  chestLine: { width: 10, height: 2, borderRadius: 2, backgroundColor: '#8BC9D2' },
  bodySeam: { position: 'absolute', bottom: 3, left: 13, width: 12, height: 2, borderRadius: 2, backgroundColor: '#D5E7EF' },
  leftArmPivot: { position: 'absolute', left: 9, top: 48, width: 20, height: 29 },
  waveArmPivot: { position: 'absolute', left: 58, top: 42, width: 24, height: 37 },
  armUpper: { position: 'absolute', left: 5, top: 5, width: 9, height: 17, borderRadius: 5, backgroundColor: C.shell, borderWidth: 1.2, borderColor: C.edge },
  armJoint: { position: 'absolute', left: 4, top: 17, width: 11, height: 11, borderRadius: 6, backgroundColor: C.edge, borderWidth: 1, borderColor: C.shell },
  armForearm: { position: 'absolute', left: 5, top: 20, width: 9, height: 10, borderRadius: 5, backgroundColor: C.shell, borderWidth: 1, borderColor: C.edge },
  handRest: { position: 'absolute', left: 4, top: 27, width: 11, height: 10, borderRadius: 6, backgroundColor: C.shell, borderWidth: 1, borderColor: C.edge },
  waveForearm: { position: 'absolute', left: 5, top: 13, width: 10, height: 17, borderRadius: 5, backgroundColor: C.shell, borderWidth: 1.2, borderColor: C.edge },
  waveHand: { position: 'absolute', left: 3, top: 3, width: 15, height: 15, borderRadius: 8, backgroundColor: C.shell, borderWidth: 1.2, borderColor: C.edge, alignItems: 'center', justifyContent: 'center' },
  fingerA: { position: 'absolute', top: -5, left: 2, width: 4, height: 8, borderRadius: 3, backgroundColor: C.shell, borderWidth: 1, borderColor: C.edge },
  fingerB: { position: 'absolute', top: -6, left: 7, width: 4, height: 9, borderRadius: 3, backgroundColor: C.shell, borderWidth: 1, borderColor: C.edge },
  fingerC: { position: 'absolute', top: -3, right: -4, width: 4, height: 7, borderRadius: 3, backgroundColor: C.shell, borderWidth: 1, borderColor: C.edge },
  leftLegPivot: { position: 'absolute', left: 25, top: 74, width: 15, height: 19, alignItems: 'center' },
  rightLegPivot: { position: 'absolute', left: 44, top: 74, width: 15, height: 19, alignItems: 'center' },
  legStem: { position: 'absolute', top: 0, width: 7, height: 12, borderRadius: 4, backgroundColor: C.edgeDark, borderWidth: 1, borderColor: C.shell },
  foot: { position: 'absolute', top: 8, left: 0, width: 16, height: 8, borderRadius: 5, backgroundColor: C.shell, borderWidth: 1.2, borderColor: C.edge, shadowColor: '#08263B', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 1, elevation: 1 },
});
