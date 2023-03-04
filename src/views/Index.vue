<template>
    <div id="app">
        <!-- 侧边栏 -->
        <el-container style="border: 1px solid rgb(238, 238, 238);">
            <el-aside width="250px">
                <!-- 侧边导航 -->
                <h3>X-Web</h3>
                <el-menu class="el-menu-vertical-demo" background-color="#222e3c" text-color="#fff" router
                    :default-active="$route.path">
                    <el-menu-item index="/index">
                        <i class="el-icon-eleme"></i>
                        <span>首页</span>
                    </el-menu-item>
                    <el-submenu index="manage">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">管理</span>
                        </template>
                        <el-menu-item index="/bookmanage">书籍管理</el-menu-item>
                        <el-menu-item index="/usermanage">用户管理</el-menu-item>
                        <el-menu-item index="/ordermanage">订单管理</el-menu-item>
                        <el-menu-item index="/commentmanage">评论管理</el-menu-item>
                    </el-submenu>
                    <!-- <el-menu-item index="4">
                        <i class="el-icon-warning"></i>
                        <span slot="title">关于</span>
                    </el-menu-item> -->
                </el-menu>
            </el-aside>
            <!-- 显示界面 -->
            <el-container>
                <el-header>
                    <el-row :gutter="20">
                        <el-col :span="22">&nbsp;</el-col>
                        <el-col :span="2">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    {{ user.nickname }}({{ user.username }})<i
                                        class="el-icon-setting el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>个人信息</el-dropdown-item>
                                    <el-dropdown-item @click.native.prevent="quit">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                    </el-row>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<style scoped>
.el-container {
    height: 100%;
}

.el-aside {
    background-color: #222e3c;
    color: #fff;
}

.el-header {
    background-color: #fff;
    color: #444;
    line-height: 60px;
}

.el-aside h3 {
    text-indent: 2rem;
}

.el-main {
    background-color: #f7f7fc;

}

::v-deep .el-header {
    z-index: 99;
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 20%);
}
</style>
<script>
import { getRequest } from '@/api/axios';

export default {
    name: "Index",
    data: function () {
        return {
            user: [],
        }
    },
    methods: {
        quit: function () {
            this.$message.warning("已退出登录")
            localStorage.removeItem('token')
            this.$router.push('/login')
        }
    },
    mounted: function () {
        getRequest("/user/person").then((response) => {
            this.user = response.data.data
        })
    }
};
</script>
  