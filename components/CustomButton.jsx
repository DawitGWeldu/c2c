import Colors from "@/constants/Colors";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[{ containerStyles }, (
        isLoading ? { opacity: 50 } : {}
      )]}
      disabled={isLoading}
    >
      <Text style={[{color: Colors, fontFamily: 'mon-sb', backgroundColor: '#fff', fontSize: 20} , {textStyles}]}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
