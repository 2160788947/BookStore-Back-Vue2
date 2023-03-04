<template>
    <div class="Information">

        <el-row :gutter="30">
            <el-col :span="18">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-card class="data" shadow="never">
                            <img class="icon" :src="icon_url[0]">
                            <el-statistic title="商城用户">
                                <template slot="formatter">
                                    {{ userCount }}
                                </template>
                            </el-statistic>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card class="data" shadow="never">
                            <img class="icon" :src="icon_url[1]">
                            <el-statistic title="已完成订单">
                                <template slot="formatter">
                                    {{ orderCount }}
                                </template>
                            </el-statistic>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card class="data" shadow="never">
                            <img class="icon" :src="icon_url[2]">
                            <el-statistic title="评论">
                                <template slot="formatter">
                                    {{ commentCount }}
                                </template>
                            </el-statistic>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <!-- <el-card shadow="never">
                        <el-calendar v-model="date"> </el-calendar>
                    </el-card> -->
                    <el-table :data="orderList" style="width: 100%">
                        <el-table-column prop="no" label="订单编号" width="180">
                        </el-table-column>
                        <el-table-column prop="etc.user.username" label="购买用户" width="180">
                        </el-table-column>
                        <el-table-column prop="totalprice" label="总价" width="180">
                        </el-table-column>
                        <el-table-column label="订单状态" width="180">
                            <template slot-scope="scope">
                                <div style="color:red">
                                    待发货
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间">
                        </el-table-column>
                    </el-table>
                </el-row>

            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <img class="side" :src="side_url">
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<style scoped>
.el-calendar__header {
    font-size: 12px;
}

::v-deep .el-calendar-table .el-calendar-day {
    height: 50px;
    text-align: center;
    padding: 0px;
    line-height: 50px;
}

.el-card {
    /* box-shadow: none !important;
    border: 1px solid rgb(238, 238, 238); */
    margin-bottom: 20px;
}

::v-deep .el-card__body {
    padding: 20px;
}

.icon {
    display: inline-block;
    width: 30%;
}

.side {
    width: 100%;
}

.el-card {
    position: relative;
}

.data .el-statistic {
    display: inline-block;
    width: 70%;
    height: 100%;
    position: absolute;
    top: 30%;
}
</style>
<script>
import { getRequest } from '@/api/axios';

export default {
    name: "Information",
    data: function () {
        return {
            date: new Date(),
            userCount: 0,
            commentCount: 0,
            orderCount: 0,
            icon_url: [require("../assets/用户.png"), require("../assets/订单.png"), require("../assets/评论.png")],
            side_url: require("../assets/side.png"),
            orderList: [],
            Status: "需发货",
        }
    },
    methods: {
        getStatus: function (index) {
            return "需发货"
        }
    },
    mounted: function () {
        getRequest("/user/getCount").then((response) => {
            this.userCount = response.data.data
        })
        getRequest("/evaluation/getCount").then((response) => {
            this.commentCount = response.data.data
        })
        getRequest("/order/getCount").then((response) => {
            var count = response.data.data.count
            this.orderCount += count[4]+count[5]
        })
        getRequest("/order/totalOrder", { status: 2 }).then((response) => {
            this.orderList = response.data.data
        })
    }
};
</script>

