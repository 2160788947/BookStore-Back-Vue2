<template>
    <div class="login">
        <div class="logindata">
            <div class="title">
                <h2>Welcome</h2>
            </div>
            <div class="formdata">
                <el-form ref="form" :model="form" :rules="rules">
                    <el-form-item prop="username">
                        <el-input v-model="form.username" clearable placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="form.password" clearable placeholder="请输入密码" show-password></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tool">
                <div>
                    <el-checkbox v-model="checked" @change="remenber">记住密码</el-checkbox>
                </div>
            </div>
            <div class="button">
                <el-button type="primary" @click="login">登录</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import { postJsonRequest } from '@/api/axios';
import md5 from 'js-md5';

export default {
    name: "Login",
    data: function () {
        return {
            form: {
                password: "",
                username: "",
            },
            checked: false,
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                ],
            },
        };
    },
    mounted: function () {
        if (localStorage.getItem("login")) {
            this.form = JSON.parse(localStorage.getItem("login"))
            this.checked = true
        }
    },
    methods: {
        login: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    postJsonRequest('/user/adminLogin', { username: this.form.username, password: md5(md5(this.form.password)) })
                        .then((response) => {
                            this.$message.success("登录成功")
                            this.$store.commit("changeLogin", { token: response.data.data.token });
                            this.$router.push('/index');
                            this.remenber(this.checked)
                        }).catch((error) => {
                            console.log(error)
                            this.$message.error(error.data);
                        })
                } else {
                    return false;
                }
            });

        },
        remenber(data) {
            this.checked = data
            if (this.checked) {
                localStorage.setItem("login", JSON.stringify(this.form))
            } else {
                localStorage.removeItem("login")
            }
        },
    },
};
</script>
  
<style scoped>
.login {
    width: 100%;
    height: 100%;
    background-image: url("../assets/background.png");
    background-size: 100% 100%;
    background-position: center center;
    overflow: auto;
    background-repeat: no-repeat;
    position: fixed;
    line-height: 100%;
    padding-top: 150px;
}

.title {
    margin-bottom: 20px;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
    font-weight: bolder;
    color: white;
    text-shadow: 2px 2px 4px #000000;
}

.logindata {
    width: 400px;
    height: 300px;
    transform: translate(-50%);
    margin-left: 50%;
}

.tool {
    display: flex;
    justify-content: space-between;
    color: #606266;
}

.button {
    margin-top: 10px;
    text-align: center;
}

.button>.el-button {
    width: 40%;
}
</style>
  
  