<template>
    <el-dialog :title="title" :visible="visible" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="封面" label-width="80px">
                <el-upload ref="img" class="avatar-uploader" action="http://localhost:8090/bookstore/book/uploadImg"
                    :data="this.form" :show-file-list="false" :on-change="displayImg" :on-success="handleAvatarSuccess"
                    :auto-upload="false" :before-upload="beforeAvatarUpload">
                    <img v-if="imgUrl" :src="imgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="书名" label-width="80px" prop="name">
                <el-input v-model="form.name" autocomplete="off" style="width:50%"></el-input>
            </el-form-item>
            <el-form-item label="作者" label-width="80px" prop="author">
                <el-input v-model="form.author" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="出版社" label-width="80px" prop="publisher">
                <el-input v-model="form.publisher" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="类别" label-width="80px" prop="category">
                <el-select v-model="form.category" placeholder="请选择类别">
                    <el-option v-for="(item, index) in categorys" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="价格" label-width="80px" prop="price">
                <el-input type="number" v-model="form.price" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="介绍" label-width="80px" prop="description">
                <quill-editor v-model="form.description" style="width:90%" :options="editorOption"></quill-editor>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>
</template>
<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<script>
import { postJsonRequest } from '@/api/axios'

// import {save,update} from "@/api/modules/dictype"
export default {
    name: "BookEdit",
    data() {
        return {
            form: {},
            categorys: [
                { id: 1, name: "侦探/悬疑/推理" },
                { id: 2, name: "军事" },
                { id: 3, name: "历史" },
                { id: 4, name: "科幻" },
                { id: 5, name: "魔幻/奇幻/玄幻" },
            ],
            flag: false,
            saveOrUpdate: false, //false= save  true = update
            imgUrl: "",
            rules: {
                name: [
                    { required: true, message: '请填写书籍名称', trigger: 'change' }
                ],
                author: [
                    { required: true, message: '请填写作者', trigger: 'change' }
                ],
                publisher: [
                    { required: true, message: '请填写出版社', trigger: 'change' }
                ],
                category: [
                    { required: true, message: '请选择类别', trigger: 'change' }
                ],
                price: [
                    { required: true, message: '请填写价格', trigger: 'change' }
                ],
            },
            editorOption: {
                placeholder: "",
                modules: {
                    toolbar: { // 菜单栏（工具栏），手动配置自己需要的富文本功能
                        container: [
                            ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
                            [{ indent: "-1" }, { indent: "+1" }], // 左右缩进
                            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
                            [{ align: [] }], //对齐方式
                            ["image", /*"video"*/], //上传图片、上传视频
                        ],
                    },
                    imageResize: { // 图片缩放比例
                        displayStyles: {
                            backgroundColor: 'black',
                            border: 'none',
                            color: 'white'
                        },
                        modules: ['Resize', 'DisplaySize', 'Toolbar'] // Resize 允许缩放， DisplaySize 缩放时显示像素 Toolbar 显示工具栏
                    }
                }
            },
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
            this.imgUrl = "/resources/" + this.form.img
            this.saveOrUpdate = true
        }
    },
    methods: {
        handleAvatarSuccess(res, file) {
            console.log(2)
            this.form.img = res.data
            console.log(this.form.img)
            this.SaveOrUpdate()
        },
        displayImg(file) {
            this.imgUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            let types = ['image/png', 'image/jpeg', 'image/jpg']
            const isImage = types.includes(file.type);
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isImage) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isImage && isLt2M;
        }
        ,
        handleClose() {
            this.close()
        },
        close() {
            this.flag = false
            this.$emit("close", this.flag)
        },
        SaveOrUpdate() {
            if (this.saveOrUpdate) {
                postJsonRequest("/book/update", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("更新书籍信息成功")
                }).catch(err => {
                    this.flag = false
                    this.$emit("close", this.flag)
                })
            } else {
                postJsonRequest("/book/save", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("新增书籍成功")
                }).catch(err => {
                    this.flag = false
                    this.$emit("close", this.flag)
                })
            }
        },
        save() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    console.log(this.imgUrl)
                    console.log(this.form.img)
                    if (this.imgUrl != "/resources/" + this.form.img) {
                        this.$refs["img"].submit()
                    } else {
                        this.SaveOrUpdate()
                    }
                } else {
                    return false;
                }
            });

        }
    }
}
</script>