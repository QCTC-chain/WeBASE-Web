<template>
  <div>
    <!-- <contents  @changGroup="changGroup" :headTitle="$t('title.systemManager')" :headSubTitle="$t('title.permission')"  :headTooltip="$t('title.permissionTips')" :headHref="headHref">
        </contents> -->
    <nav-menu
      :headTitle="$t('title.systemManager')"
      :headSubTitle="$t('title.permission')"
      :headTooltip="$t('title.permissionTips')"
    ></nav-menu>
    <div
      v-if="nodeVersionChange == 1"
      class="module-wrapper"
      style="padding: 20px 40px"
    >
      <el-tabs @tab-click="handleClick" v-model="activeName">
        <el-tab-pane :label="$t('title.committeeMgmt')">
          <committeeMgmt ref="committeeMgmt"></committeeMgmt>
        </el-tab-pane>
        <el-tab-pane :label="$t('title.developerMgmt')">
          <developerMgmt ref="developerMgmt"></developerMgmt>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="module-wrapper" style="padding: 20px 20px 0px">
      <permission ref="permission"></permission>
    </div>
  </div>
</template>

<script>
import NavMenu from "../../components/navs/navMenu.vue";
import contents from "@/components/contentHead";
import committeeMgmt from "@/views/committeeMgmt/index";
import developerMgmt from "@/views/developerMgmt/index";
import permission from "@/views/permission/index";
import Bus from "@/bus";

export default {
  name: "newPermission",
  components: {
    contents,
    committeeMgmt,
    developerMgmt,
    permission,
    "nav-menu": NavMenu,
  },
  data() {
    return {
      // handleClick:'',
      // changGroup:'',
      activeName: 0,
      nodeVersionChange: localStorage.getItem("nodeVersionChange1"),
      // nodeVersionChange: ""
    };
  },
  computed: {
    headHref() {
      let data = {
        href: "https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/design/security_control/chain_governance.html",
        content: this.$t("title.permissionHref"),
      };
      return data;
    },
  },
  methods: {
    handleClick() {
      if (this.activeName == 0) {
        this.$refs.committeeMgmt.adminRivateKeyList = [];
        if (localStorage.getItem("groupId1")) {
          this.$refs.committeeMgmt.queryGetThreshold();
          this.$refs.committeeMgmt.getUserData();
          this.$refs.committeeMgmt.queryCommitteeList();
          this.$refs.committeeMgmt.queryVoteRecordList();
        }
      } else {
        if (localStorage.getItem("groupId1")) {
          this.$refs.developerMgmt.queryOperatorList();
          this.$refs.developerMgmt.getUserData();
        }
      }
    },
    changGroup() {
      if (this.activeName == 0) {
        if (localStorage.getItem("groupId1")) {
          this.$refs.committeeMgmt.adminRivateKeyList = [];
          this.$refs.committeeMgmt.queryGetThreshold();
          this.$refs.committeeMgmt.getUserData();
          this.$refs.committeeMgmt.queryCommitteeList();
          this.$refs.committeeMgmt.queryVoteRecordList();
        }
      } else {
        if (localStorage.getItem("groupId1")) {
          this.$refs.developerMgmt.queryOperatorList();
          this.$refs.developerMgmt.getUserData();
        }
      }
    },
  },
  mounted() {
    Bus.$on("changGroup", (item) => {
      // 处理页面直接刷新，主页面的数据(nodeVersionChange1)未完全准备完成的情况，延时再取一次
      if (this.$refs.committeeMgm) {
        this.changGroup();
      } else {
        setTimeout(() => {
          this.nodeVersionChange = localStorage.getItem("nodeVersionChange1");
          setTimeout(() => {
            this.changGroup();
          }, 100);

        }, 300);
      }
    });
  },
  destroyed() {
    Bus.$off("changGroup");
  },
};
</script>

<style></style>
