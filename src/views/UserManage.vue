<template>
    <div>
        <pageTable @load-table-data="loadTableData" ref="dataTable" row-key="id" @selection-change="selectionChange">
            <template slot="function-button">
                <div style="float:right;display: inline-block;">
                    <el-button type="primary" @click="add">新增</el-button>
                    <el-button type="warning" @click="delAll">批量删除</el-button>
                </div>
            </template>
            <template slot="tb-columns">
                <el-table-column prop="username" label="用户名" width="240" align="center"></el-table-column>
                <el-table-column prop="nickname" label="昵称" width="240" align="center"></el-table-column>
                <el-table-column align="center" label="权限" width="240">
                    <template slot-scope="scope">
                        {{ privileges[scope.row.privilege].name }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
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
            tableData: [],
            ids: "",
            privileges: [{ id: 0, name: "普通用户" }]
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
        add() {
            this.visible = true
            this.title = "新增"
            this.defaultObj = {}
        },
        edit(obj) {
            this.visible = true
            this.title = "编辑"
            this.defaultObj = obj
        },
        delAll() {
            if (this.ids.length == 0) {
                this.$message.warning("请选择用户")
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
                postRequest("/user/delete", { ids: ids }).then((response) => {
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
            getRequest("/user/page", {
                ...filter,
                privilege: 0
            }).then((response) => {
                // res = result
                let data = {
                    data: response.data.data.records,
                    total: response.data.data.total
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