<template>
  <div style="height: 100%">
    <newMain v-if="deployType == 0"></newMain>
    <mains v-if="deployType == 1"></mains>
  </div>
</template>

<script>
import newMain from "./newMain";
import mains from "./main";
import { getDeployType } from "@/util/api";
export default {
  name: "index",
  components: {
    newMain,
    mains,
  },
  data: function () {
    return {
      deployType: null,
    };
  },
  created: function () {
    localStorage.removeItem("selectData");
    this.getConfigType();

    localStorage.setItem("groupName1", "");
    localStorage.setItem("groupId1", "");
    localStorage.setItem("folderList", "");
    // localStorage.setItem("user", res.data.data.account);
    // localStorage.setItem("root", res.data.data.roleName);
    // localStorage.setItem("token", res.data.data.token);
    sessionStorage.setItem("accountStatus", 2);
    sessionStorage.setItem("reload", 1);
    localStorage.setItem("config", 0);
    localStorage.setItem("nodeVersionChange1", "");
    localStorage.setItem("selectData", "");
    localStorage.setItem("solcName", "");
    localStorage.setItem("versionId", null);
  },
  methods: {
    getConfigType: function () {
      getDeployType()
        .then((res) => {
          if (res.data.code == 0) {
            localStorage.setItem("deployType1", res.data.data);
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }

          if (localStorage.getItem("deployType1")) {
            this.deployType = localStorage.getItem("deployType1");
          } else {
            this.deployType = 0;
          }
        })
        .catch((err) => {
          this.$message({
            message: this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
  },
};
</script>

<style></style>
