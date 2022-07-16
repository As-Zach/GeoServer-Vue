<template>
    <div>
        <el-button type="primary" icon="el-icon-search" @click="publishtif">自动部署</el-button>
        <el-upload :show-file-list="false" :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError"
            :on-change="handleChange" action="/upload" :headers="{ 'Authorization': token }"
            :disabled="importDataDisabled" style="display: inline-flex;margin-right: 8px">
            <el-button :disabled="importDataDisabled" type="success" :icon="importDataBtnIcon">
                {{"选择文件夹"}}
            </el-button>
        </el-upload>

        <el-form ref="form" :model="form" label-width="10px" style="width: 100%">
            <el-form-item label="">
                <!-- webkitdirectory代表选择文件夹 -->
                <input type="file" id="file" hidden @change="fileChange" webkitdirectory>
                <el-input placeholder="文件夹目录" v-model="form.imgSavePath" class="input-with-select">
                    <el-button slot="append" icon="el-icon-folder" type="success" @click="btnChange"></el-button>
                </el-input>
            </el-form-item>
        </el-form>

    </div>

</template>

<script>
    export default {
        name: "Rest",
        data() {
            return {
                form: {
                    imgSavePath: ''
                },
                importDataDisabled: false,
                importDataBtnIcon: 'el-icon-upload2',
                token: localStorage.getItem('token')
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
            //上传文件
            onError(err, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
            },
            onSuccess(response, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
            },
            beforeUpload() {
                this.importDataBtnText = '正在导入';
                this.importDataBtnIcon = 'el-icon-loading';
                this.importDataDisabled = true;
            },
            handleChange(file, fileList) {
                this.fileList = fileList;
                console.log(JSON.parse(JSON.stringify(fileList)))
            },
            fileChange(e) {
                try {
                    var fu = document.getElementById('file')
                    if (fu == null) return
                    if (fu) {
                        if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
                            fu.select();
                            console.log(document.selection.createRange().text)
                            return document.selection.createRange().text;
                        } else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
                            if (fu.files) {
                                return fu.files.item(0).getAsDataURL();
                            }
                            return fu.value;
                        }
                        return fu.value;
                    }
                    let url = window.webkitURL.createObjectURL(fu.files[0]);
                    console.log("文件夹路径", fu.files[0].webkitRelativePath, fu.value, fu.files[0].path)
                    var webkitRelativePath = fu.files[0].webkitRelativePath
                    var path = fu.files[0].path
                    var zhenshi = path.substring(0, path.indexOf(webkitRelativePath.split("/")[webkitRelativePath.split(
                        "/").length - 1]) - 1)
                    console.log("真实路径", zhenshi.replace(/\\/g, '/'))
                    this.form.imgSavePath = zhenshi.replace(/\\/g, '/')
                } catch (error) {
                    console.debug('choice file err:', error)
                }
            },
            btnChange() {
                var file = document.getElementById('file')
                console.log(file)
                file.click()
            },
            publishtif() {
                var that = this;
                axios.get('http://localhost:8083/publishtif').then(function (response) {
                    console.log(response)
                })
            },
            selectFolder() {
                window.parent.postMessage({
                    selectFolder: "selectFolder"
                }, "*")
            }
        }
    }
</script>

<style>

</style>