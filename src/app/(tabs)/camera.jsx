import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useTheme } from "@/utils/theme";
import { Zap, Image as ImageIcon } from "lucide-react-native";
import Card from "@/components/Card";
import ClassificationResultCard from "@/components/ClassificationResultCard";

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [mode, setMode] = useState("camera"); // "camera" or "gallery"
  const [classification, setClassification] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestCameraPermission = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      return granted;
    }
    return true;
  };

  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Error converting image:", err);
      throw err;
    }
  };

  const classifyWaste = async (imageBase64) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/waste/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
        }),
      });

      if (!response.ok) {
        throw new Error("Classification failed");
      }

      const data = await response.json();
      setClassification(data.classification);
    } catch (err) {
      console.error("Classification error:", err);
      setError("Failed to classify waste. Please try again.");
      Alert.alert("Error", "Failed to classify waste. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        const base64 = await convertImageToBase64(photo.uri);
        await classifyWaste(base64);
      } catch (err) {
        console.error("Camera error:", err);
        setError("Failed to take picture");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
        const base64 = await convertImageToBase64(result.assets[0].uri);
        await classifyWaste(base64);
      }
    } catch (err) {
      console.error("Image picker error:", err);
      setError("Failed to pick image");
    }
  };

  const handleFeedback = async (isCorrect) => {
    try {
      setLoading(true);
      if (classification?.id) {
        const response = await fetch(
          `/api/waste/history/${classification.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              is_correct: isCorrect,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Feedback submission failed");
        }

        Alert.alert(
          "Thanks!",
          isCorrect
            ? "Great! Your feedback helps improve accuracy."
            : "We'll use your feedback to improve our AI model.",
        );
      }
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setClassification(null);
    setCapturedImage(null);
    setError(null);
  };

  if (!permission?.granted && mode === "camera") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
          paddingHorizontal: 20,
        }}
      >
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Text
          style={{
            fontFamily: "Roboto_500Medium",
            fontSize: 18,
            color: theme.colors.text.primary,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Camera Permission Required
        </Text>
        <Text
          style={{
            fontFamily: "Roboto_400Regular",
            fontSize: 14,
            color: theme.colors.text.secondary,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          We need access to your camera to classify waste items.
        </Text>
        <TouchableOpacity
          onPress={requestCameraPermission}
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto_500Medium",
              fontSize: 16,
              color: "white",
            }}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (classification) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 0,
          }}
          showsVerticalScrollIndicator={false}
        >
          {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={{
                width: "100%",
                height: 300,
                marginBottom: 16,
              }}
              contentFit="cover"
            />
          )}

          <View style={{ paddingHorizontal: 16 }}>
            <ClassificationResultCard
              classification={classification}
              onFeedback={handleFeedback}
              loading={loading}
            />

            <TouchableOpacity
              onPress={handleReset}
              style={{
                marginTop: 16,
                marginHorizontal: 16,
                paddingVertical: 14,
                paddingHorizontal: 16,
                backgroundColor: theme.isDark
                  ? "rgba(9, 177, 75, 0.15)"
                  : "#E8F5E8",
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto_500Medium",
                  fontSize: 16,
                  color: theme.colors.primary,
                }}
              >
                Classify Another Item
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {mode === "camera" ? (
        <CameraView style={{ flex: 1 }} ref={cameraRef} ratio="1:1">
          {/* Top Header */}
          <View
            style={{
              paddingTop: insets.top + 12,
              paddingHorizontal: 16,
              paddingBottom: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto_700Bold",
                fontSize: 28,
                color: "white",
                marginBottom: 4,
              }}
            >
              Classify Waste
            </Text>
            <Text
              style={{
                fontFamily: "Roboto_400Regular",
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              Point at waste to identify and get disposal tips
            </Text>
          </View>

          {/* Bottom Controls */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: insets.bottom + 16,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={handlePickImage}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 14,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 12,
                }}
              >
                <ImageIcon size={18} color="white" />
                <Text
                  style={{
                    fontFamily: "Roboto_500Medium",
                    fontSize: 14,
                    color: "white",
                    marginLeft: 8,
                  }}
                >
                  Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTakePicture}
                disabled={loading}
                style={{
                  flex: 1.5,
                  paddingVertical: 14,
                  backgroundColor: theme.colors.primary,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Zap size={18} color="white" />
                    <Text
                      style={{
                        fontFamily: "Roboto_500Medium",
                        fontSize: 14,
                        color: "white",
                        marginTop: 4,
                      }}
                    >
                      Analyze
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity
              onPress={() => setMode("camera")}
              style={{
                marginBottom: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto_500Medium",
                  fontSize: 14,
                  color: "white",
                }}
              >
                Back to Camera
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
