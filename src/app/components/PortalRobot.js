import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

/**
 * Animated LabSpace mascot.
 * The robot first emerges from the circular portal, then continuously cycles
 * through running, jumping, and dancing. All motion uses React Native Animated
 * with the native driver; no additional dependency is required.
 */
export default function PortalRobot() {
  const entrance = useRef(new Animated.Value(0)).current;
  const portalPulse = useRef(new Animated.Value(0)).current;
  const portalSpin = useRef(new Animated.Value(0)).current;
  const run = useRef(new Animated.Value(0)).current;
  const jump = useRef(new Animated.Value(0)).current;
  const dance = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;
  const chestPulse = useRef(new Animated.Value(0)).current;
  const antennaPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const portalAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(portalPulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(portalPulse, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
      ]),
    );

    const spinAnimation = Animated.loop(
      Animated.timing(portalSpin, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    );

    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(1900),
        Animated.timing(blink, { toValue: 0.08, duration: 75, useNativeDriver: true, isInteraction: false }),
        Animated.timing(blink, { toValue: 1, duration: 120, useNativeDriver: true, isInteraction: false }),
        Animated.delay(180),
      ]),
    );

    const chestAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(chestPulse, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
        Animated.timing(chestPulse, { toValue: 0, duration: 650, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      ]),
    );

    const antennaAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(antennaPulse, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
        Animated.timing(antennaPulse, { toValue: 0, duration: 520, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      ]),
    );

    const runCycle = Animated.sequence([
      Animated.timing(run, { toValue: 1, duration: 190, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(run, { toValue: 0, duration: 190, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]);
    const runAnimation = Animated.loop(runCycle, { iterations: 8 });

    const jumpCycle = Animated.sequence([
      Animated.timing(jump, { toValue: 1, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true, isInteraction: false }),
      Animated.timing(jump, { toValue: 0, duration: 360, easing: Easing.in(Easing.quad), useNativeDriver: true, isInteraction: false }),
      Animated.delay(100),
    ]);
    const jumpAnimation = Animated.loop(jumpCycle, { iterations: 3 });

    const danceCycle = Animated.sequence([
      Animated.timing(dance, { toValue: 1, duration: 310, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(dance, { toValue: 0, duration: 310, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]);
    const danceAnimation = Animated.loop(danceCycle, { iterations: 7 });

    const movementRoutine = Animated.loop(
      Animated.sequence([runAnimation, jumpAnimation, danceAnimation]),
    );

    const entranceAnimation = Animated.parallel([
      Animated.timing(entrance, {
        toValue: 1,
        duration: 1050,
        easing: Easing.out(Easing.back(1.25)),
        useNativeDriver: true,
        isInteraction: false,
      }),
    ]);

    portalAnimation.start();
    spinAnimation.start();
    blinkAnimation.start();
    chestAnimation.start();
    antennaAnimation.start();
    entranceAnimation.start(({ finished }) => {
      if (finished) movementRoutine.start();
    });

    return () => {
      [portalAnimation, spinAnimation, blinkAnimation, chestAnimation, antennaAnimation, entranceAnimation, movementRoutine].forEach((animation) => animation.stop());
    };
  }, [antennaPulse, blink, chestPulse, dance, entrance, jump, portalPulse, portalSpin, run]);

  const portalScale = portalPulse.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.08] });
  const portalOpacity = portalPulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.95] });
  const portalRotation = portalSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const robotScale = entrance.interpolate({ inputRange: [0, 0.72, 1], outputRange: [0.24, 1.02, 0.94] });
  const robotEntranceY = entrance.interpolate({ inputRange: [0, 1], outputRange: [20, -2] });
  const robotOpacity = entrance.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0, 0.7, 1] });
  const runBob = run.interpolate({ inputRange: [0, 1], outputRange: [0, -3.5] });
  const jumpLift = jump.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
  const danceTilt = dance.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '8deg'] });
  const bodyRunTilt = run.interpolate({ inputRange: [0, 1], outputRange: ['5deg', '-7deg'] });
  const headMotion = Animated.add(Animated.add(run, dance), jump);
  const headTilt = headMotion.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '14deg'] });
  const rightArmTilt = headMotion.interpolate({ inputRange: [0, 1], outputRange: ['-32deg', '45deg'] });
  const leftArmTilt = headMotion.interpolate({ inputRange: [0, 1], outputRange: ['28deg', '-42deg'] });
  const legLeftTilt = headMotion.interpolate({ inputRange: [0, 1], outputRange: ['-25deg', '22deg'] });
  const legRightTilt = headMotion.interpolate({ inputRange: [0, 1], outputRange: ['25deg', '-22deg'] });
  const antennaGlow = antennaPulse.interpolate({ inputRange: [0, 1], outputRange: [0.62, 1] });
  const chestScale = chestPulse.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1.18] });
  const shadowScale = jump.interpolate({ inputRange: [0, 1], outputRange: [1, 0.62] });
  const shadowOpacity = jump.interpolate({ inputRange: [0, 1], outputRange: [0.24, 0.1] });

  return (
    <View style={styles.container} accessible accessibilityLabel="Robot mascot emerging from a portal, then running, jumping, and dancing">
      <Animated.View style={[styles.portalOuter, { opacity: portalOpacity, transform: [{ scale: portalScale }, { rotate: portalRotation }] }]}>
        <View style={styles.portalInner} />
        <View style={styles.portalDashTop} />
        <View style={styles.portalDashBottom} />
      </Animated.View>
      <Animated.View style={[styles.portalCore, { opacity: portalOpacity, transform: [{ scale: portalScale }] }]} />

      <Animated.View style={[styles.groundShadow, { opacity: shadowOpacity, transform: [{ scaleX: shadowScale }] }]} />

      <Animated.View
        style={[
          styles.robot,
          {
            opacity: robotOpacity,
            transform: [
              { translateY: Animated.add(robotEntranceY, Animated.add(jumpLift, runBob)) },
              { scale: robotScale },
              { rotate: danceTilt },
            ],
          },
        ]}
      >
        <Animated.View style={[styles.antenna, { transform: [{ translateY: runBob }] }]}>
          <View style={styles.antennaStem} />
          <Animated.View style={[styles.antennaTip, { opacity: antennaGlow, transform: [{ scale: antennaGlow }] }]} />
        </Animated.View>

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

        <View style={styles.neck} />
        <Animated.View style={[styles.torsoGroup, { transform: [{ rotate: bodyRunTilt }] }]}>
          <View style={styles.bodyShell}>
            <View style={styles.bodyHighlight} />
            <View style={styles.chestPanel}>
              <Animated.View style={[styles.chestCore, { transform: [{ scale: chestScale }] }]} />
              <View style={styles.chestLine} />
            </View>
            <View style={styles.bodySeam} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.leftArmPivot, { transform: [{ rotate: leftArmTilt }] }]}>
          <View style={styles.armUpper} />
          <View style={styles.armJoint} />
          <View style={styles.armForearm} />
          <View style={styles.handRest} />
        </Animated.View>
        <Animated.View style={[styles.rightArmPivot, { transform: [{ rotate: rightArmTilt }] }]}>
          <View style={styles.armUpper} />
          <View style={styles.armJoint} />
          <View style={styles.waveForearm} />
          <View style={styles.waveHand} />
        </Animated.View>

        <Animated.View style={[styles.leftLegPivot, { transform: [{ rotate: legLeftTilt }] }]}>
          <View style={styles.legStem} />
          <View style={styles.foot} />
        </Animated.View>
        <Animated.View style={[styles.rightLegPivot, { transform: [{ rotate: legRightTilt }] }]}>
          <View style={styles.legStem} />
          <View style={styles.foot} />
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
  container: { width: 88, height: 94, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  portalOuter: { position: 'absolute', width: 76, height: 76, top: 9, borderRadius: 38, borderWidth: 2, borderColor: 'rgba(128,224,244,0.9)', alignItems: 'center', justifyContent: 'center', shadowColor: '#72DFF0', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 10, elevation: 5 },
  portalInner: { width: 62, height: 62, borderRadius: 31, borderWidth: 1, borderColor: 'rgba(210,250,255,0.48)', backgroundColor: 'rgba(85,203,230,0.15)' },
  portalDashTop: { position: 'absolute', top: -3, width: 14, height: 3, borderRadius: 2, backgroundColor: '#B6F7FF' },
  portalDashBottom: { position: 'absolute', bottom: -3, width: 14, height: 3, borderRadius: 2, backgroundColor: '#79DFF0' },
  portalCore: { position: 'absolute', width: 52, height: 52, top: 21, borderRadius: 26, backgroundColor: 'rgba(63,190,220,0.12)' },
  groundShadow: { position: 'absolute', width: 42, height: 7, bottom: 4, borderRadius: 10, backgroundColor: 'rgba(7,28,48,0.42)' },
  robot: { position: 'absolute', width: 84, height: 94, top: 0, left: 2 },
  antenna: { position: 'absolute', top: 0, left: 39, width: 12, height: 17, alignItems: 'center' },
  antennaStem: { position: 'absolute', top: 7, width: 3, height: 11, borderRadius: 2, backgroundColor: C.edgeDark },
  antennaTip: { position: 'absolute', top: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: C.aqua, borderWidth: 2, borderColor: C.shell },
  headGroup: { position: 'absolute', top: 11, left: 17, width: 52, height: 38, alignItems: 'center' },
  headShell: { position: 'absolute', top: 0, left: 4, width: 44, height: 36, borderRadius: 13, backgroundColor: C.shell, borderWidth: 1.5, borderColor: C.edge, alignItems: 'center', justifyContent: 'center', shadowColor: '#08263B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 3, elevation: 3 },
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
  neck: { position: 'absolute', top: 43, left: 38, width: 9, height: 8, borderRadius: 3, backgroundColor: C.edgeDark },
  torsoGroup: { position: 'absolute', top: 45, left: 23, width: 39, height: 37, alignItems: 'center' },
  bodyShell: { position: 'absolute', top: 3, left: 0, width: 39, height: 31, borderRadius: 11, backgroundColor: C.shell, borderWidth: 1.5, borderColor: C.edge, alignItems: 'center', justifyContent: 'center', shadowColor: '#08263B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 2 },
  bodyHighlight: { position: 'absolute', top: 3, left: 8, width: 12, height: 2, borderRadius: 2, backgroundColor: '#FFFFFF' },
  chestPanel: { width: 20, height: 18, borderRadius: 6, backgroundColor: '#DDF5F7', borderWidth: 1, borderColor: '#C3E7EB', alignItems: 'center', justifyContent: 'center', gap: 2 },
  chestCore: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.aqua, borderWidth: 1, borderColor: '#FFFFFF' },
  chestLine: { width: 10, height: 2, borderRadius: 2, backgroundColor: '#8BC9D2' },
  bodySeam: { position: 'absolute', bottom: 3, left: 13, width: 12, height: 2, borderRadius: 2, backgroundColor: '#D5E7EF' },
  leftArmPivot: { position: 'absolute', left: 9, top: 48, width: 20, height: 29 },
  rightArmPivot: { position: 'absolute', left: 58, top: 42, width: 24, height: 37 },
  armUpper: { position: 'absolute', left: 5, top: 5, width: 9, height: 17, borderRadius: 5, backgroundColor: C.shell, borderWidth: 1.2, borderColor: C.edge },
  armJoint: { position: 'absolute', left: 4, top: 17, width: 11, height: 11, borderRadius: 6, backgroundColor: C.edge, borderWidth: 1, borderColor: C.shell },
  armForearm: { position: 'absolute', left: 5, top: 20, width: 9, height: 10, borderRadius: 5, backgroundColor: C.shell, borderWidth: 1, borderColor: C.edge },
  handRest: { position: 'absolute', left: 4, top: 27, width: 11, height: 10, borderRadius: 6, backgroundColor: C.shell, borderWidth: 1, borderColor: C.edge },
  waveForearm: { position: 'absolute', left: 5, top: 13, width: 10, height: 17, borderRadius: 5, backgroundColor: C.shell, borderWidth: 1.2, borderColor: C.edge },
  waveHand: { position: 'absolute', left: 3, top: 3, width: 15, height: 15, borderRadius: 8, backgroundColor: C.shell, borderWidth: 1.2, borderColor: C.edge },
  leftLegPivot: { position: 'absolute', left: 25, top: 74, width: 15, height: 19, alignItems: 'center' },
  rightLegPivot: { position: 'absolute', left: 44, top: 74, width: 15, height: 19, alignItems: 'center' },
  legStem: { position: 'absolute', top: 0, width: 7, height: 12, borderRadius: 4, backgroundColor: C.edgeDark, borderWidth: 1, borderColor: C.shell },
  foot: { position: 'absolute', top: 8, left: 0, width: 16, height: 8, borderRadius: 5, backgroundColor: C.shell, borderWidth: 1.2, borderColor: C.edge, shadowColor: '#08263B', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 1, elevation: 1 },
});
