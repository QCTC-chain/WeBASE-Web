<template>
  <div>
    <el-form
      :model="modifyForm"
      :rules="rules"
      ref="modifyForm"
      label-width="90px"
      class="demo-ruleForm"
    >
      <el-form-item :label="'CPU(核)'" prop="cpus">
        <el-input
          v-model="modifyForm.cpus"
          :placeholder="$t('text.input')"
          type="number"
          maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('nodes.memory') + '(MB)'" prop="memory">
        <el-input
          v-model="modifyForm.memory"
          :placeholder="$t('text.input')"
          type="number"
          maxlength="16"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="text-right sure-btn" style="margin-top: 10px">
      <el-button @click="close">{{ this.$t("text.cancel") }}</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="submit('modifyForm')"
        >{{ this.$t("text.sure") }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { setResource } from "@/util/api";
export default {
  name: "ModifyNodeSetting",

  components: {},

  props: {
    modifyNodeSetting: {
      type: Object,
    },
  },

  data() {
    return {
      loading: false,
      modifyForm: {
        cpus: this.modifyNodeSetting.cpus,
        memory: this.modifyNodeSetting.memory,
      },
      settingData: this.modifyNodeSetting,
    };
  },
  computed: {
    rules() {
      let data = {
        cpus: [
          {
            required: true,
            message: this.$t("rule.inputCPU"),
            trigger: "blur",
          },
        ],
        memory: [
          {
            required: true,
            message: this.$t("rule.inputMemory"),
            trigger: "blur",
          },
        ],
      };
      return data;
    },
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {
    close() {
      this.$emit("nodeModifyClose");
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.settingData);
        if (valid) {
          const data = {
            frontId: this.settingData.frontId,
            cpus: this.modifyForm.cpus,
            memory: this.modifyForm.memory,
          };
          setResource(data)
            .then((res) => {
              if (res.data.code === 0 || res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "设置成功",
                });
                this.$emit("nodeModifySuccess");
              } else {
                this.$message({
                  type: "error",
                  message: this.$chooseLang(res.data.code),
                });
              }
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err.data || this.$t("text.systemError"),
              });
            });
        } else {
          return false;
        }
      });
    },
    queryConsensusNodeId() {
      this.loading = true;
      let reqData = {
        groupId: localStorage.getItem("groupId1"),
        nodeType: this.modifyForm.nodeType,
        nodeId: this.modifyNode.nodeId,
        fromAddress: this.modifyForm.adminRivateKey,
      };
      consensusNodeId(reqData)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("text.updateSuccessMsg"),
            });
            this.$emit("nodeModifySuccess");
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    changeRivateKey(val) {
      this.adminRivateKey = val;
    },
    getUserData: function () {
      let reqData = {
        groupId: localStorage.getItem("groupId1"),
        pageNumber: 1,
        pageSize: 1000,
      };
      let query = {};
      if (localStorage.getItem("root") === "developer") {
        query.account = localStorage.getItem("user");
      }
      getUserList(reqData, query)
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.length === 0) {
              this.ruleTest = this.$t("text.ruleAddUser");
            }
            this.adminRivateKeyList = [];
            res.data.data.forEach((value) => {
              if (value.hasPk === 1) {
                this.adminRivateKeyList.push(value);
              }
            });
            if (this.adminRivateKeyList.length)
              this.modifyForm.adminRivateKey =
                this.adminRivateKeyList[0]["address"];
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
  },
};
</script>

<style scoped>
.sure-btn >>> .el-button {
  padding: 9px 16px;
}

.info {
  padding-left: 30px;
  color: #f00;
}
</style>
