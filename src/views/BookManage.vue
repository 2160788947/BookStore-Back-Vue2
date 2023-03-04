<template>
    <div>
        <pageTable @load-table-data="loadTableData" ref="dataTable" row-key="id" @selection-change="selectionChange">
            <template slot="function-button">
                <div style="float:right;display: inline-block;">
                    <el-button type="primary" @click="add">新增</el-button>
                    <el-button type="warning" @click="delAll">批量删除</el-button>
                </div>
                <div class="search">
                    <div>书名<el-input v-model="searchdata.name" placeholder="输入书名搜索" /></div>
                    <div>作者<el-input v-model="searchdata.author" placeholder="输入作者搜索" /></div>
                    <div>出版社<el-input v-model="searchdata.publisher" placeholder="输入关键字搜索" /></div>
                    <div>
                        类别
                        <el-select v-model="searchdata.category" placeholder="请选择">
                            <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button icon="el-icon-search" circle @click="search()"></el-button>
                </div>
            </template>
            <template slot="tb-columns">
                <el-table-column align="center" label="" prop="img" width="140">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.img" style="width: 70px; height: 70px"
                            :src="'/resources/' + scope.row.img" fit="contain"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="240" align="center"></el-table-column>
                <el-table-column prop="author" label="作者" width="160" align="center"></el-table-column>
                <el-table-column prop="publisher" label="出版社" width="160" align="center"></el-table-column>
                <el-table-column align="center" label="类别" width="160">
                    <template slot-scope="scope">
                        {{ categorys[scope.row.category].name }}
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="价格" width="140" align="center"></el-table-column>
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
import Edit from '@/components/BookEdit.vue'

export default {
    name: "BookManage",
    components: { PageTable, Edit },
    data() {
        return {
            title: "新增",
            visible: false,
            defaultObj: {},
            categorys: [
                { id: 0, name: "尚未分类" },
                { id: 1, name: "侦探/悬疑/推理" },
                { id: 2, name: "军事" },
                { id: 3, name: "历史" },
                { id: 4, name: "科幻" },
                { id: 5, name: "魔幻/奇幻/玄幻" },
            ],
            searchdata: {
                name: "",
                author: "",
                publisher: "",
                category: 0,
            },
            ids: "",
        }
    },
    methods: {
        search(){
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
            this.title = "编辑"
            this.defaultObj = obj
        },
        delAll() {
            if (this.ids.length == 0) {
                this.$message.warning("请选择书籍")
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
            getRequest("/book/search", {
                ...filter,
                ...this.searchdata
            }).then((response) => {
                // res = result
                let data = {
                    data: response.data.data,
                    total: response.data.etc.total
                }
                callback(data)
            }).catch((error) => { 
                console.log(error.data)
            })

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
    width: 18%;
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