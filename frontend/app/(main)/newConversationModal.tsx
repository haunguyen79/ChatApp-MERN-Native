import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/Input";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/Button";
import { verticalScale } from "@/utils/styling";

const NewConversationModal = () => {
  const { isGroup } = useLocalSearchParams();
  // console.log("isGroup: ", isGroup);

  const isGroupMode = isGroup == "1";
  const router = useRouter();
  const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const { user: currentUser } = useAuth();

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setGroupAvatar(result.assets[0]); // set the first selected image
    }
  };

  const toggleParticipant = (user: any) => {
    setSelectedParticipants((prev: any) => {
      if (prev.includes(user.id)) {
        return prev.filter((id: string) => id !== user.id);
      }
      return [...prev, user.id];
    });
  };

  const onSelectUser = (user: any) => {
    if (!currentUser) {
      Alert.alert("Authentication", "Please login to start a conversation");
      return;
    }

    if (isGroupMode) {
      toggleParticipant(user);
    } else {
      // Todo: Start new conversation
    }
  };

  const createGroup = async () => {
    if (!groupName.trim() || !currentUser || selectedParticipants.length < 2)
      return;

    //Todo: Create new Group
  };

  const contacts = [
    {
      id: "1",
      name: "Nguyen Thi Nhu Ngoc",
      avatar:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/545915028_1302536938318514_4565712119368961107_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGKjMJDIe_W7XUKshb1Lk9DScrh6I2xTA9JyuHojbFMD1OVdId_9BDj9rQkZwylbUTw7pc_rZ76ORfnzyvHAyIK&_nc_ohc=6_jfLr9aqsgQ7kNvwEgV74n&_nc_oc=AdkLZTKv1uVpARsKSgmu4E1cfOsL-bKSOnuCRllESb8x8SIm-Te4XQ-11OLquOkQv9E&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=g4wIdZMi5Grs2d2pi-cVqw&oh=00_AfrvZveUeobQ9azuZPvbJtT7ZfAWoT7vINsOzQuVD_W-yw&oe=69751CC6",
    },
    {
      id: "2",
      name: "Tran Nguyen Thanh Ngan",
      avatar:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/505537088_4073515819591775_661602474503356241_n.jpg?stp=cp6_dst-jpg_p417x417_tt6&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEBzsV7jmtVrfdEya0Ts7GpS2FKrlt-R0JLYUquW35HQtmbcbV2F40FS4lqtYA6ghAJIOGSWgiryPwdTmY3nT1j&_nc_ohc=T7sUacmV5d8Q7kNvwFyuxgS&_nc_oc=AdnMjRF7T0xSv4LAcoGK31FVm6qec6tTHlbf3l-PTFTeo7zi4OgNruB3ZMvJxoPmN9w&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=B_JD7uMGpBtd4nygnswOBg&oh=00_Afp-_4ymwRG8RyDaNKgDYwk41BZLPBqBoIsykzraUuewdA&oe=6975141E",
    },
    {
      id: "3",
      name: "Nguyen Thi Kim Linh",
      avatar:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/596402004_3692467710886150_6876632936745966116_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDpk--tCBT3OXBDfg0BoFFAmEZZ0j2kwoCYRlnSPaTCtBrr84401SQMyfGKVL9COTKNspWBCAPZzQA8AL0b__R&_nc_ohc=AByZYxkCuBQQ7kNvwHdN9Ed&_nc_oc=AdlXeKz6U8JV_FjmLBKWiMmc3s4zqL8K6L6ZfE-wgT_KZNxQIkceKZOHdjcElXrVZoo&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=d9pPBzJ9B4XH6AEUs4tOnQ&oh=00_AfpLnFrMdlPZLdkkF5zunLW1vCqvVSX5ITmeqpj8ZvFZrw&oe=69753ACA",
    },
  ];

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title={isGroupMode ? "New Group" : "Select User"}
          leftIcon={<BackButton color={colors.black} />}
        />

        {isGroupMode && (
          <View style={styles.groupInfoContainer}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={onPickImage}>
                <Avatar
                  uri={groupAvatar?.uri || null}
                  size={100}
                  isGroup={true}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.groupNameContainer}>
              <Input
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactList}
        >
          {contacts.map((user: any, index) => {
            const isSelected = selectedParticipants.includes(user.id);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactRow,
                  isSelected && styles.selectedContact,
                ]}
                onPress={() => onSelectUser(user)}
              >
                <Avatar size={45} uri={user.avatar} />
                <Typo fontWeight={"500"}>{user.name}</Typo>

                {
                  /* Selection Indicator */
                  isGroupMode && (
                    <View style={styles.selectionIndicator}>
                      <View
                        style={[styles.checkbox, isSelected && styles.checked]}
                      ></View>
                    </View>
                  )
                }
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {
          /* Create Group Button */
          isGroup && selectedParticipants.length >= 2 && (
            <View style={styles.createGroupButton}>
              <Button
                onPress={createGroup}
                disabled={!groupName.trim()}
                loading={isLoading}
              >
                <Typo fontWeight={"bold"} size={17}>
                  Create Group
                </Typo>
              </Button>
            </View>
          )
        }
      </View>
    </ScreenWrapper>
  );
};

export default NewConversationModal;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacingX._15,
    flex: 1,
  },
  groupInfoContainer: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
  avatarContainer: {
    marginBottom: spacingY._10,
  },
  groupNameContainer: {
    width: "100%",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  selectedContact: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._15,
  },
  contactList: {
    gap: spacingY._12,
    marginTop: spacingY._10,
    paddingTop: spacingY._10,
    paddingBottom: verticalScale(150),
  },
  selectionIndicator: {
    marginLeft: "auto",
    marginRight: spacingX._10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.primary,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  createGroupButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
});
