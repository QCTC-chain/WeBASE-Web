<template>
  <div class="navMenu">
    <div v-if="isMicroApp && noShow" class="content-head-network">
      <span v-if="abnormalList.length > 0">
        <el-tooltip class="item" effect="dark" placement="bottom-end">
          <div slot="content">
            <span>{{ $t("text.group") }}</span>
            <span>{{ abnormalList }}</span>
            <span>{{ $t("text.groupConf4") }}</span>
            <span
              class="cursor-pointer font-color-2956a3"
              @click="goGroupMgmt"
              >{{ $t("text.groupMgmt") }}</span
            >
            <span>{{ $t("text.groupConf4_1") }}</span>
          </div>
          <i class="el-icon-warning-outline font-color-E6A23C"></i>
        </el-tooltip>
      </span>
      <el-dropdown trigger="click" @command="changeGroup" placement="bottom">
        <span class="el-dropdown-link" @click="groupVisible = !groupVisible">
          {{ this.$t("head.group") }}: {{ groupName
          }}<i
            :class="[groupVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
          ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <ul style="max-height: 220px; overflow-y: auto" class="text-center">
            <el-dropdown-item
              v-for="item in groupList"
              :key="item.group"
              :command="item"
            >
              <i
                class="wbs-icon-radio font-6"
                :style="{ color: groupStatusColor(item.groupStatus) }"
              ></i>
              {{ item.groupName }}
            </el-dropdown-item>
          </ul>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="font-color-9da2ab">&nbsp;/&nbsp;</span>
    </div>
    <div class="content-head-title">
      <span class="content-head-icon" v-if="false" @click="skip">
        <i class="wbs-icon-back"></i>
      </span>
      <span :class="{ 'font-color-9da2ab': headSubTitle }">{{ title }}</span>
      <span v-show="headSubTitle" class="font-color-9da2ab">/</span>
      <span>{{ headSubTitle }}</span>
      <el-tooltip
        effect="dark"
        placement="bottom-start"
        v-if="headTooltip"
        offset="0"
      >
        <div slot="content">{{ headTooltip }}</div>
        <i class="el-icon-info contract-icon font-15"></i>
      </el-tooltip>
      <a
        v-if="headHref"
        target="_blank"
        :href="headHref.href"
        class="font-color-fff font-12"
        >{{ headHref.content }}</a
      >
    </div>

    <div :class="['guideLine', { guideCheck: navContentShow }]" v-if="false">
      <el-button
        size="small"
        type=""
        icon="el-icon-tickets"
        @click="navShow"
      ></el-button>
    </div>
  </div>
</template>

<script>
import Bus from "@/bus";
import { groupStatus4, getGroupsInvalidIncluded } from "@/util/api";
export default {
  props: {
    icon: {
      type: Boolean,
    },
    headTitle: {
      type: String,
    },
    headSubTitle: {
      type: String,
    },
    headTooltip: {
      type: String,
    },
    headHref: {
      type: Object,
    },
  },
  watch: {
    headTitle: function (val) {
      this.title = val;
    },
    updateGroup: function (val) {
      this.getGroupList();
    },
  },
  data: function () {
    return {
      isMicroApp: window.__POWERED_BY_QIANKUN__ ? true : false,
      title: this.headTitle,
      groupName: "-",
      way: this.route || "",
      groupList: [],
      abnormalList: [],
      groupVisible: false,
      versionInfoVisible: false,
      navContentShow: false,
      noShow: true,
    };
  },
  watch: {
    navContentShow(newNav, oldNav) {
      Bus.$emit("navIfShow", newNav);
    },
  },
  beforeDestroy: function () {
    Bus.$off("closeContent");
    Bus.$off("deleteFront");
    Bus.$off("addFront");
    Bus.$off("changeHeadGroup");
  },
  mounted() {
    let that = this;
    Bus.$on("closeContent", () => {
      that.navContentShow = false;
    });
    this.currentRoute = this.$route.path;
    let pre = this.currentRoute.substring(1);
    console.log(pre);
    if (pre == "groupManagement" || pre === "node/chain") {
      this.noShow = false;
    }
    if (localStorage.getItem("groupName1")) {
      this.groupName = localStorage.getItem("groupName1");
    }
    this.getGroupList();
    Bus.$on("deleteFront", () => {
      that.groupName = "";
      that.getGroupList("delete");
    });
    Bus.$on("addFront", () => {
      that.getGroupList();
    });
    Bus.$on("changeHeadGroup", () => {
      that.getGroupList();
    });
    this.queryGroupStatus4();
  },
  methods: {
    skip: function () {
      if (this.route) {
        this.$router.push(this.way);
      } else {
        this.$router.go(-1);
      }
    },
    navShow() {
      this.navContentShow = !this.navContentShow;
    },
    getGroupList: function (type) {
      getGroupsInvalidIncluded()
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data && res.data.data.length) {
              this.groupList = res.data.data || [];
              if (this.updateGroupType === "update") {
                this.$nextTick((_) => {
                  this.groupName = res.data.data[0].groupName;
                  // localStorage.setItem("groupName1", res.data.data[0].groupName)
                  // localStorage.setItem("groupId1", res.data.data[0].groupId)
                  return;
                });
              }

              if (type || !localStorage.getItem("groupName1")) {
                this.groupName = res.data.data[0].groupName;
                // localStorage.setItem("groupName1", res.data.data[0].groupName)
                // localStorage.setItem("groupId1", res.data.data[0].groupId)
              } else if (localStorage.getItem("groupName1")) {
                this.groupName = localStorage.getItem("groupName1");
              }
            } else {
              this.groupList = [];
              // localStorage.setItem("groupName1", "")
              // localStorage.setItem("groupId1", "")
            }
          } else {
            this.groupList = [];
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
            // localStorage.setItem("groupName1", "")
            // localStorage.setItem("groupId1", "")
          }
        })
        .catch((err) => {
          this.groupList = [];
          // localStorage.setItem("groupName1", "")
          // localStorage.setItem("groupId1", "")
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    changeGroup: function (val) {
      this.groupName = val.groupName;
      localStorage.setItem("groupName1", val.groupName);
      localStorage.setItem("groupId1", val.groupId);
      this.$emit("changGroup", val.groupId);
      Bus.$emit("changGroup", val.groupId);
    },
    queryGroupStatus4() {
      groupStatus4(4)
        .then((res) => {
          if (res.data.code === 0) {
            var abnormalData = res.data.data;
            this.abnormalList = [];
            if (abnormalData) {
              abnormalData.forEach((item) => {
                this.abnormalList.push(item.groupId);
              });
            }
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    groupStatusColor(key) {
      switch (key) {
        case 1:
          return "rgb(88, 203, 125)";
          break;
        case 2:
          return "#E6A23C";
          break;
        case 3:
          return "#F56C6C";
          break;
        case 4:
          return "#F56C6C";
          break;
      }
    },
  },
};
</script>

<style scoped>
.navMenu {
  margin-top: 15px;
  margin-left: 25px;
  margin-right: 25px;
  width: 100%;
  display: inline-block;
  position: relative;
}
.content-head-title {
  display: inline-block;
  font-size: 16px;
  color: black;
  font-weight: bold;
}
.content-head-network {
  float: left;
  font-size: 16px;
  font-weight: bold;
  padding-top: 2px;
}
.guideLine {
  float: right;
  padding-right: 25px;
}
.guideLine button {
  color: rgb(96, 98, 102);
  border-color: #dcdfe6;
  background-color: #fff;
}
.guideCheck button {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-dropdown,
.el-icon-arrow-down,
.el-icon-arrow-up {
  font-size: 16px;
  font-weight: bold;
}
.el-dropdown-menu--medium .el-dropdown-menu__item {
  line-height: 30px;
  padding: 0 17px;
  font-size: 16px;
}
</style>
