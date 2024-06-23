import { useEffect, useState } from "react";
import { router } from "expo-router";
// import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


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




const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};



const Create = () => {
  const { authState } = useAuth()
  const token = authState?.token
  const user = JSON.parse(Buffer.from(token!.split('.')[1], 'base64').toString())
  const [form, setForm] = useState<any>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);




  useEffect(() => {
    loadImages();
  }, []);




  // Save image to file system
  const saveImage = async (uri: string) => {
    await ensureDirExists();
    const filename = new Date().getTime() + '.jpeg';
    const dest = imgDir + filename;
    await FileSystem.copyAsync({ from: uri, to: dest });
    setImages([...images, dest]);
  };

  // Upload image to server
  const uploadImage = async (uri: string) => {
    setUploading(true);

    await FileSystem.uploadAsync('http://192.168.1.52:8888/upload.php', uri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file'
    });

    setUploading(false);
  };

  // Delete image from file system
  const deleteImage = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };




  // Load images from file system
  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if (files.length > 0) {
      setImages(files.map((f) => imgDir + f));
    }
  };

  // Select image from library or camera
  const selectImage = async (useLibrary: boolean) => {
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75
    };

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    // Save image if not cancelled
    if (!result.canceled) {
      saveImage(result.assets[0].uri);
    }


  }
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

          <TouchableOpacity style={{position: 'absolute', left: "43%", bottom: 20, zIndex: 1}}>
            <Ionicons name="refresh" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => selectImage(false)}>
            {images ? (
              <Image
                source={{ uri: images[(images.length - 1)] }}
                style={{width: "100%", height: 200, borderRadius: 10}}
                resizeMode='cover'
              />
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
          // onPress={}
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

