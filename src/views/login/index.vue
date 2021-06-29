<template>
  <div class="login-container">
    <div class="logo_position">
      <img src="~@/icons/log/logo.png" alt="广东安琪拉供应链" />
      <div class="logo_title">
        <span class="name">广东安琪拉供应链</span
        ><span class="engName">Guangdong Anqila Supply Chain</span>
      </div>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Hello,Welcome back</h3>
      </div>
      <div class="information">
        <el-form-item prop="username" class="input">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password" class="input">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-button
          :loading="loading"
          type="primary"
          class="login_container"
          @click.native.prevent="handleLogin"
          ><div class="login_title">
            <span>登</span><span>录</span>
          </div></el-button
        >
        <div class="operate">
          <span>注册账号</span
          ><el-checkbox v-model="isRemenberPassword" class="remenberPassword"
            >记住密码</el-checkbox
          >
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { apiRequest, sendMessage } from "@/api/pagesApi/openBilling";
import { getUserInfo, setUserInfo, removeUserInfo } from "@/utils/auth.js";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      isRemenberPassword: true,
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名称" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入用户密码" }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    let userInfo = getUserInfo() ? JSON.parse(getUserInfo()) : {};
    if (userInfo) {
      this.loginForm.username = userInfo.username;
      this.loginForm.password = userInfo.password;
    }
    if (this.loginForm.username === ""){
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    async handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 记住账号密码
          if (this.isRemenberPassword) {
            setUserInfo(this.loginForm);
          } else {
            removeUserInfo();
          }
          this.loading = true;
          const { username, password } = this.loginForm;
          apiRequest("login/ajaxLogin", {
            username: username.trim(),
            password: password
          }).then(res => {
            if (res.result) {
              this.$store.dispatch("user/login", res);
              this.$store.dispatch('permission/generateRoutes',res.data).then(accessRouter=>{
                this.$router.addRoutes(accessRouter)
              })
              sendMessage("登录成功");
            } else {
              sendMessage(res.msg, "error");
            }
            this.$router.push("/");
          });
          // this.$store
          //   .dispatch("user/login", this.loginForm)
          //   .then(() => {
          //     this.$router.push("/");
          //     console.log("login");
          //     // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          //     this.loading = false;
          //   })
          //   .catch(() => {
          //     this.loading = false;
          //   });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>

<style lang="scss">
.operate {
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
  color: #66b1ff;
  font-size: 14px;
  .remenberPassword {
    color: #66b1ff;
  }
}

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.information {
  margin: 90px 30px;
  padding: 50px;
  background: hsla(0, 0%, 98%, 0.69);
  box-shadow: 0 4px 8px 0 #d9d9d9;
}
.login_container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.login_title {
  width: 60px;
  display: flex;
  justify-content: space-between;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.9);
    border-radius: 5px;
    color: #333;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;

.logo_position {
  position: fixed;
  left: 50px;
  top: 60px;
  color: #fff;
  display: flex;
  align-items: center;
  img {
    width: 68px;
    height: 68px;
  }
  .logo_title {
    padding-left: 12px;
    display: flex;
    flex-direction: column;
    .name {
      font-size: 30px;
      padding-bottom: 5px;
    }
    .engName {
      font-size: 16px;
    }
  }
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-image: url("../../icons/log/bg.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 700px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin-top: 80px;
    .title {
      font-size: 64px;
      color: #fff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
