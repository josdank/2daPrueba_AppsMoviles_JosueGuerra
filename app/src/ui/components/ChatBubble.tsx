
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function ChatBubble({ message, isMine }: any) {
  return (
    <View style={{
      alignSelf: isMine ? 'flex-end' : 'flex-start',
      backgroundColor: isMine ? '#48C9B0' : '#000000ff',
      borderRadius: 12,
      padding: 8,
      marginVertical: 4,
      maxWidth: '80%'
    }}>
      <Text style={{ color: '#fff' }}>{message.contenido}</Text>
    </View>
  );
}
