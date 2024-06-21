import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

// import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[{gap: 16}, otherStyles]}>
      <Text style={{color: Colors.dark, fontFamily: 'mon-sb'}}>{title}</Text>

      <View style={{height: 50, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.lightGray, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={{flex: 1, color: '#000', fontFamily: 'mon-sb'}}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={!showPassword ? "eye" : "eye-off"}
              // name='eye'
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
