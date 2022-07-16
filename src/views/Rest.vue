<template>
    <div>
        <div>
            <el-form>
                <el-form-item label="选择WorkSpace">
                    <el-select v-model="WorkSpace" size="mini" placeholder="WorkSpace">
                        <el-option v-for="item in ws" :value="item" :key="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button type="primary" :loading="loading.uploadLoading" @click="publishtif">Tiff自动部署
            </el-button>
            <el-button type="primary" :loading="loading.uploadLoading" @click="publishshp">Shp自动部署
            </el-button>
            <el-button slot="append" icon="el-icon-folder" type="success" @click="fileurl"></el-button>
            
        </div>

    </div>


</template>

<script>
    export default {
        name: "Rest",
        data() {
            return {
                WorkSpace:"",
                ws:[
                    'DEW',
                    'map',
                    'test',
                    'city'
                ],
                form: {
                    imgSavePath: ''
                },
                loading: {
                    uploadLoading: false,
                },
                input: "",
                urlfile: "",
                importDataDisabled: false,
                importDataBtnIcon: 'el-icon-upload2',
                token: localStorage.getItem('token')
            }
        },
        watch: {
            '$route'(to, from) {
                // 路由发生变化重新获取路由传输数据
                this.WorkSpace = this.$route.query.name;
                console.log(this.WorkSpace)
            }
        },
        mounted() {
            window.addEventListener('message', event => {
                if (event.data.message) {
                    this.form.imgSavePath = event.data.message
                }
                // console.log("html接收消息=====",event)
            });
        },
        methods: {
            publishshp() {
                var that = this;
                this.loading.uploadLoading = true
                axios.get('http://localhost:8083/publishshp').then((response) => {
                    console.log(response)
                    this.loading.uploadLoading = false
                    this.$message({
                        message: 'Shp文件自动发布成功!!!',
                        type: 'success'
                    });
                })
            },
            publishtif() {
                var that = this;
                this.loading.uploadLoading = true
                axios.get('http://localhost:8083/publishtif').then((response) => {
                    console.log(response)
                    this.loading.uploadLoading = false
                    this.$message({
                        message: 'Shp文件自动发布成功!!!',
                        type: 'success'
                    });
                })
            },
            selectFolder() {
                window.parent.postMessage({
                    selectFolder: "selectFolder"
                }, "*")
            },
            fileurl() {
                var input="F:\\Document\\Graduation Project\\MapData\\MapData\\"+this.WorkSpace
                axios.post('http://localhost:8083/findfile', input).then(function (response) {
                    console.log(response)
                })
            },

        }
    }
</script>

<style>

</style>