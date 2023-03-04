<template>
    <div>
        <pageTable @load-table-data="loadTableData" ref="dataTable" row-key="id" @selection-change="selectionChange">
            <template slot="function-button">
                <div style="float:right;display: inline-block;">
                    <el-button type="warning" @click="delAll">批量删除</el-button>
                </div>
            </template>
            <template slot="tb-columns">
                <el-table-column prop="etc.book.name" label="书籍" width="240" align="center"></el-table-column>
                <el-table-column prop="etc.user.username" label="评论用户" width="160" align="center"></el-table-column>

                <el-table-column prop="comment" label="评论" width="200" align="center"></el-table-column>
                <el-table-column label="追评" width="200" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.additional">{{ scope.row.additional }}</div>
                        <div v-if="!scope.row.additional">无</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="评论时间" width="200" align="center"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </template>
        </pageTable>
        <Edit :title=title :visible=visible v-if="visible" :defaultObj=defaultObj @close="close"></Edit>
    </div>
</template>
<script>
import { getRequest, postRequest } from '@/api/axios'
import PageTable from '@/components/PageTable'
import Edit from '@/components/UserEdit.vue'

export default {
    name: "BookManage",
    components: { PageTable, Edit },
    data() {
        return {
            title: "新增",
            visible: false,
            defaultObj: {},
            ids: "",
        }
    },
    methods: {
        selectionChange(selection) {
            var ids = []
            for (var item of selection) {
                ids.push(item.id)
            }
            this.ids = ids.join(",")
        },
        delAll() {
            if (this.ids.length == 0) {
                this.$message.warning("请选择评论")
            } else {
                this.del(this.ids)
            }
        },
        del(ids) {
            this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                postRequest("/evaluation/delete", { ids: ids }).then((response) => {
                    this.$message.success("删除成功")
                    this.$refs.dataTable.loadTableData("reload")
                })
            }).catch(() => {
            })
        },
        close(val) {
            this.visible = false
            if (val) {
                //flush
                this.$refs.dataTable.loadTableData('reload')
            }
        },
        loadTableData(filter, callback) {
            getRequest("/evaluation/page", {
                ...filter,
            }).then((response) => {
                console.log(response.data)
                // res = result
                let data = {
                    data: response.data.data,
                    total: response.data.etc.total
                }
                callback(data)
            }).catch((error) => { })
        }
    }
}
</script>
<style scoped>
.el-header,
.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}

.formItem {
    vertical-align: middle;
}
</style>