<template>
    <div>
        <pageTable @load-table-data="loadTableData" ref="dataTable" row-key="id" @selection-change="selectionChange">
            <template slot="function-button">
                <div style="float:right;display: inline-block;">
                </div>
                <div class="search">
                    <div>订单编号<el-input v-model="searchdata.no" placeholder="输入订单编号搜索" /></div>
                    <div>购买用户<el-input v-model="searchdata.username" placeholder="输入用户名搜索(需精确)" /></div>
                    <div>
                        订单状态
                        <el-select v-model="searchdata.status" placeholder="请选择">
                            <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button icon="el-icon-search" circle @click="search()"></el-button>
                </div>
            </template>
            <template slot="tb-columns">
                <el-table-column prop="no" label="订单编号" width="240" align="center"></el-table-column>
                <el-table-column prop="etc.user.username" label="购买用户" width="180" align="center"></el-table-column>
                <el-table-column prop="totalprice" label="总价" width="180" align="center"></el-table-column>
                <el-table-column label="订单状态" width="180" align="center">
                    <template slot-scope="scope">
                        {{ status[scope.row.status].name }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="edit(scope.row)">查看</el-button>
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
import Edit from '@/components/OrderEdit.vue'

export default {
    name: "BookManage",
    components: { PageTable, Edit },
    data() {
        return {
            title: "新增",
            visible: false,
            defaultObj: {},
            tableData: [],
            status: [
                { id: 0, name: "尚未选择" },
                { id: 1, name: "待付款" },
                { id: 2, name: "待发货" },
                { id: 3, name: "待收货" },
                { id: 4, name: "待评价" },
                { id: 5, name: "已完成" },
                { id: 6, name: "已取消" },
                { id: 7, name: "待退款" },
            ],
            searchdata: {
                no: "",
                username: "",
                status: 0,
            },
            ids: "",
        }
    },
    methods: {
        search() {
            this.$refs.dataTable.loadTableData('reload')
        },
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
            this.title = "查看"
            this.defaultObj = obj
        },
        delAll() {
            if (this.ids.length == 0) {
                this.$message.warning("请选择订单")
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
                postRequest("/book/delete", { ids: ids }).then((response) => {
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
            getRequest("/order/page", {
                ...filter,
                ...this.searchdata
            }).then((response) => {
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

.search>div {
    width: 25%;
    display: inline-block;
    margin-left: 20px;
    font-size: 14px;
}

.search>div>.el-input,
.search>div>.el-select {
    width: 75%;
    margin-left: 10px;
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