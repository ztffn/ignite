import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '../theme/context';

interface TripCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const TripCard: React.FC<TripCardProps> = ({ 
  title, 
  subtitle, 
  imageUrl, 
  onPress, 
  style 
}) => {
  const { theme } = useAppTheme();

  const $container: ViewStyle = {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...style,
  };

  const $image: ImageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  };

  const $gradientOverlay: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  };

  const $bottomGradient: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
  };

  const $contentContainer: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 10,
  };

  const $title: TextStyle = {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  };

  const $subtitle: TextStyle = {
    fontSize: 16,
    color: 'rgba(209, 213, 219, 1)', // text-gray-300 equivalent
    lineHeight: 24,
  };

  const CardContent = () => (
    <View style={$contentContainer}>
      <Text style={$title}>{title}</Text>
      <Text style={$subtitle}>{subtitle}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={$container} onPress={onPress} activeOpacity={0.9}>
        <Image source={{ uri: imageUrl }} style={$image} resizeMode="cover" />
        <View style={$gradientOverlay} />
        <View style={$bottomGradient} />
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={$container}>
      <Image source={{ uri: imageUrl }} style={$image} resizeMode="cover" />
      <View style={$gradientOverlay} />
      <View style={$bottomGradient} />
      <CardContent />
    </View>
  );
};
