import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const InputBox = ({
  inputTitle,
  keyboardType,
  autoComplete,
  secureTextEntry = false,
  value,
  setValue,
  iconName,
}) => {
  return (
    <View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 17,
          color: "#174684",
          paddingTop: 5,
        }}
      >
        {inputTitle}
      </Text>
      <View style={styles.inputBox}>
        <Icon name={iconName} style={styles.icon} />
        <TextInput
          autoCorrect={false}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          value={value}
          name={iconName}
          onChangeText={(text) => setValue(text)}
          style={styles.input}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    height: 40,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 3,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    color: "#7995ab",
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#000",
  },
});

export default InputBox;
