<template>
    <el-dialog :title="title" :visible="visible" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="form">
            <el-form-item label="订单编号" label-width="120px">
                <div>{{ form.no }}</div>
            </el-form-item>
            <el-form-item label="购买用户" label-width="120px">
                <div>{{ form.etc.user.nickname }}({{ form.etc.user.username }})</div>
            </el-form-item>
            <el-form-item label="物品清单" label-width="120px">
                <div v-for="(item, index) in form.etc.book" :key="index">{{ item.name }} 数量:{{ form.etc.nums[index] }}
                </div>
            </el-form-item>
            <el-form-item label="订单状态" label-width="120px">
                <div>
                    {{ status[form.status - 1].name }}
                    <el-button v-if="form.status == 2" type="text" style="text-indent:2rem" @click="deliver">发货
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="收货人姓名" label-width="120px">
                <div>{{ form.name }}</div>
            </el-form-item> 
            <el-form-item label="收货人手机号" label-width="120px">
                <div>{{ form.tel }}</div>
            </el-form-item> 
            <el-form-item label="收货地址" label-width="120px">
                <div>{{ form.address }}</div>
            </el-form-item>
            <el-form-item label="创建时间" label-width="120px">
                <div>{{ form.createTime }}</div>
            </el-form-item>
            <el-form-item label="备注" label-width="120px">
                <div v-if="!form.postscript">无</div>
                <div v-if="form.postscript">{{ form.postscript }}</div>
            </el-form-item>
            <el-form-item label="取消理由" label-width="120px">
                <div v-if="!form.cancelReason">无</div>
                <div v-if="form.cancelReason">{{ form.cancelReason }}</div>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import { postJsonRequest, postRequest } from '@/api/axios'
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
            status: [
                { id: 1, name: "待付款" },
                { id: 2, name: "待发货" },
                { id: 3, name: "待收货" },
                { id: 4, name: "待评价" },
                { id: 5, name: "待完成" },
                { id: 6, name: "已取消" },
                { id: 7, name: "待付款" },
            ],
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
        deliver() {
            postRequest("/order/deliver", { id: this.form.id }).then((response) => {
                this.flag = true
                this.$emit("close", this.flag)
            })
        },
        handleClose() {
            this.close()
        },
        close() {
            this.flag = false
            this.$emit("close", this.flag)
        },
    }
}
</script>