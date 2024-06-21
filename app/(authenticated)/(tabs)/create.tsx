import { useState } from "react";
import { router } from "expo-router";
// import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// import { icons } from "../../constants";
// import { createVideoPost } from "../../lib/appwrite";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { useAuth } from "@/app/context/AuthContext";
import { Buffer } from 'buffer';
import Colors from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import { LinearGradient } from "expo-linear-gradient";
// import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { authState } = useAuth()
  const token = authState?.token
  const user = JSON.parse(Buffer.from(token!.split('.')[1], 'base64').toString())
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType: any) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (
      (form.prompt === "") ||
      (form.title === "") ||
      !form.thumbnail ||
      !form.video
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };

  return (
    <LinearGradient colors={["#f3f7f7", "#dee4f7"]}
      style={{ flex: 1, paddingTop: 50 }}>
      <ScrollView style={{ padding: 16, marginVertical: 6 }}>
        <Text style={{ fontFamily: 'mon-sb', fontSize: 24, color: Colors.dark }}>Create a post</Text>

        <FormField
          title="Title"
          value={form.title}
          placeholder="Give your post a descriptive title..."
          handleChangeText={(e: any) => setForm({ ...form, title: e })}
          otherStyles={{ marginTop: 20 }}
        />

        <View style={{ marginTop: 16, flexDirection: 'column', gap: 2 }}>
          <Text style={{ color: Colors.dark, fontFamily: "mon-sb" }}>
            Upload a valid ID
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.video ? (
              // <Video
              //   source={{ uri: form.video.uri }}
              //   className="w-full h-64 rounded-2xl"
              //   useNativeControls
              //   resizeMode={ResizeMode.COVER}
              //   isLooping
              // />
              <View>Video Here</View>
            ) : (
              <View style={{ height: 200, paddingHorizontal: 4, backgroundColor: Colors.lightGray, borderRadius: 10, borderColor: Colors.primary, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ borderStyle: 'dashed', borderWidth: 1, borderRadius: 8, borderColor: Colors.primary, width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons
                    name='cloud-upload-outline'
                    size={50}
                  // alt="upload"
                  // style={{ width: "50%", alignItems: 'center', height: "50%"}}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="Weight"
          value={form.prompt}
          placeholder="The weight of the item"
          handleChangeText={(e: any) => setForm({ ...form, prompt: e })}
          otherStyles={{ marginVertical: 14 }}
        />

        <FormField
          title="destination"
          value={form.prompt}
          placeholder="Where will you send this item"
          handleChangeText={(e: any) => setForm({ ...form, prompt: e })}
          otherStyles={{ marginVertical: 14 }}
        />


        <TouchableOpacity
          style={[defaultStyles.btn, { marginTop: 8 }]}
          onPress={submit}
          disabled={uploading}
        >
          <Text style={{ fontFamily: 'mon-sb', color: '#fff', fontSize: 16 }}>Submit & Publish</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default Create;
function createVideoPost(arg0: any) {
  throw new Error("Function not implemented.");
}

