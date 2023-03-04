<template>
    <el-dialog :title="title" :visible="visible" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="form" :rules="rules">
            <el-form-item label="用户名" label-width="80px" prop="username">
                <el-input v-model="form.username" autocomplete="off" style="width:30%" :disabled="this.saveOrUpdate">
                </el-input>
            </el-form-item>
            <el-form-item label="昵称" label-width="80px" prop="nickname">
                <el-input v-model="form.nickname" autocomplete="off" style="width:40%"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="80px">
                <el-input v-model="password" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="权限" label-width="80px" prop="privilege">
                <el-select v-model="form.privilege" placeholder="请选择类别">
                    <el-option v-for="(item, index) in privileges" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { postJsonRequest } from '@/api/axios'
import md5 from 'js-md5';
// import {save,update} from "@/api/modules/dictype"
export default {
    name: "BookEdit",
    data() {
        return {
            form: {},
            privileges: [{ id: 0, name: "普通用户" }],
            flag: false,
            saveOrUpdate: false, //false= save  true = update
            password: "",
            rules: {
                username: [
                    { required: true, message: '请填写用户名', trigger: 'change' }
                ],
                nickname: [
                    { required: true, message: '请填写昵称', trigger: 'change' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'change' }
                ],
                privilege: [
                    { required: true, message: '请设置权限', trigger: 'change' }
                ],
            }
        }
    },
    props: {
        title: {
            type: String,
            default: "新增"
        },
        visible: {
            type: Boolean,
            default: false
        },
        defaultObj: {
            type: Object
        }
    },
    mounted() {
        if (JSON.stringify(this.defaultObj) == "{}") {
            this.saveOrUpdate = false
        } else {
            this.form = JSON.parse(JSON.stringify(this.defaultObj))
            this.saveOrUpdate = true
        }
    },
    methods: {
        handleClose() {
            this.close()
        },
        close() {
            this.flag = false
            this.$emit("close", this.flag)
        },
        save() {
            if (this.password.length != 0) {
                this.form.password = md5(md5(this.password))
            }
            if (this.saveOrUpdate) {
                postJsonRequest("/user/update", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("更新用户信息成功")
                }).catch(err => {
                    this.flag = false
                    this.$emit("close", this.flag)
                })
            } else {
                postJsonRequest("/user/save", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("新增用户成功")
                }).catch(err => {
                    this.flag = false
                    this.$emit("close", this.flag)
                    this.$message.error(err.data)
                })
            }
        }
    }
}
</script>