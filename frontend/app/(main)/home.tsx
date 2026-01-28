import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import {
  getConversations,
  newConversation,
  testSocket,
} from "@/socket/socketEvents";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import ConversationItem from "@/components/ConversationItem";
import Loading from "@/components/Loading";
import { ConversationProps, ResponseProps } from "@/types";

const Home = () => {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  useEffect(() => {
    getConversations(processConversations);

    newConversation(newConversationHandler);

    getConversations(null);

    return () => {
      getConversations(processConversations, true);
      newConversation(newConversationHandler, true);
    };
  }, []);

  const processConversations = (res: ResponseProps) => {
    console.log("Res:", res);

    if (res.success) {
      setConversations(res.data);
    }
  };

  const newConversationHandler = (res: ResponseProps) => {
    console.log("New conversation response:", res);
    if (res.success && res.data?.isNew) {
      setConversations((prev) => [...prev, res.data]);
    }
  };

  // console.log("User:", user)

  // useEffect(() => {
  //   testSocket(testSocketCallbackHandler);
  //   testSocket(null);

  //   return () => {
  //     testSocket(testSocketCallbackHandler, true);
  //   };
  // });

  // const testSocketCallbackHandler = (data: any) => {
  //   console.log("Got response from testSocket event:", data);
  // };

  // const conversations = [
  //   {
  //     name: "Thanh Ngan",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Thanh Ngan",
  //       // attachement: { image: "url" },
  //       content: "Hey, how are you?",
  //       createdAt: "2026-01-15T11:30:00Z",
  //     },
  //   },
  //   {
  //     name: "Nhu Ngoc",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Nhu Ngoc",
  //       content: "Hey, I miss you very much!",
  //       createdAt: "2026-01-19T10:35:00Z",
  //     },
  //   },
  //   {
  //     name: "Project Team",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Minh Hoa",
  //       content: "Meeting rescheduled to 3 PM tomorrow.",
  //       createdAt: "2026-01-20T10:39:00Z",
  //     },
  //   },
  //   {
  //     name: "Family is the BEST",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Mom",
  //       content: "Happy Birthday !",
  //       createdAt: "2026-01-15T19:30:00Z",
  //     },
  //   },
  // ];

  let directConversations = conversations
    .filter((item: ConversationProps) => item.type === "direct")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  let groupConversations = conversations
    .filter((item: ConversationProps) => item.type === "group")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  // --Testing empty states--
  // let directConversations = [];
  // let groupConversations = [];

  const handleLogout = async () => {
    await signOut();
  };
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo
              size={19}
              color={colors.neutral200}
              textProps={{ numberOfLines: 1 }}
            >
              Welcome back,{" "}
              <Typo size={20} color={colors.white} fontWeight={"800"}>
                {currentUser?.name} 👍
              </Typo>
            </Typo>
          </View>

          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => router.push("/(main)/profileModal")}
          >
            <Icons.GearSixIcon
              color={colors.white}
              weight="fill"
              size={verticalScale(22)}
            />{" "}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingY._20 }}
          >
            <View style={styles.navBar}>
              <View style={styles.tabs}>
                <TouchableOpacity
                  onPress={() => setSelectedTab(0)}
                  style={[
                    styles.tabStyles,
                    selectedTab === 0 && styles.activeTabStyle,
                  ]}
                >
                  <Typo>Direct Message</Typo>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedTab(1)}
                  style={[
                    styles.tabStyles,
                    selectedTab === 1 && styles.activeTabStyle,
                  ]}
                >
                  <Typo>Group</Typo>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.coversationList}>
              {selectedTab === 0 &&
                directConversations.map((item: ConversationProps, index) => (
                  <ConversationItem
                    key={index}
                    item={item}
                    router={router}
                    showDivider={directConversations.length != index + 1}
                  />
                ))}

              {selectedTab === 1 &&
                groupConversations.map((item: ConversationProps, index) => (
                  <ConversationItem
                    key={index}
                    item={item}
                    router={router}
                    showDivider={groupConversations.length != index + 1}
                  />
                ))}
            </View>

            {!loading &&
              selectedTab == 0 &&
              directConversations.length == 0 && (
                <Typo style={{ textAlign: "center" }}>
                  You don't have any messages{" "}
                </Typo>
              )}

            {!loading && selectedTab == 1 && groupConversations.length == 0 && (
              <Typo style={{ textAlign: "center" }}>
                You haven't joined any groups yet{" "}
              </Typo>
            )}

            {loading && <Loading />}
          </ScrollView>
        </View>
      </View>

      <Button
        onPress={() =>
          router.push({
            pathname: "/(main)/newConversationModal",
            params: { isGroup: selectedTab },
          })
        }
        style={styles.floatingButton}
      >
        <Icons.PlusIcon
          color={colors.black}
          weight="bold"
          size={verticalScale(22)}
        />
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
    gap: spacingX._15,
    paddingTop: spacingX._15,
    paddingBottom: spacingX._20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._20,
  },

  navBar: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    paddingHorizontal: spacingX._10,
  },

  tabs: {
    flexDirection: "row",
    gap: spacingX._10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  tabStyles: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },

  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },
  coversationList: {
    paddingVertical: spacingY._20,
  },
  settingIcon: {
    padding: spacingX._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },

  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});
