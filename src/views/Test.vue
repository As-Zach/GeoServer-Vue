<template>
    <div class="add-file-right" style="height: 70px; margin-left: 100px; margin-top: 15px">
        <div class="add-file-right-img" style="margin-left: 70px">
            上传文件：
        </div>
        <input @change="uploadCode($event)" type="file" id="fileInput">
        <el-input v-model="input" placeholder="Please input" >
        <el-button slot="append" icon="el-icon-folder" type="success" @click="fileurl"></el-button>
        </el-input>
    </div>
</template>

<script>
    export default {

        data() {

            return {
                form: {
                    imgSavePath: ''
                },
                input: "",

                filePath: "",
                fileName: "",
            };
        },
        methods: {
            preview(event) {
                let files = document.getElementById(this.id).files[0]
                this.imgDataUrl = this.getObjectURL(files)
                console.log(imgDataUrl)
                this.$emit('sendImgUrl', this.imgDataUrl, this.id)
            },
            getObjectURL(file) {
                let url = '';
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                }
                return url;
            },
            // 导出
            uploadCode(event) {
                //此处校验文件后缀
                let file = event.target.files[0].name; // (利用console.log输出看file文件对象)json
                console.log(file)
                let num = file.split('.');
                let mun = num[num.length - 1];
                if (mun === 'txt') {
                    let _that = this;
                    const selectedFile = event.target.files[0]
                    // 读取文件名
                    const name = selectedFile.name
                    // 读取文件大小
                    const size = selectedFile.size
                    // FileReader对象，h5提供的异步api，可以读取文件中的数据。
                    const reader = new FileReader()
                    // readAsText是个异步操作，只有等到onload时才能显示数据。
                    reader.readAsText(selectedFile)
                    reader.onload = function () {
                        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可,此处this指向reader，_that指向vue data，this.result就是文件的内容
                        _that.coder.setValue(this.result)
                    }
                } else {
                    this.$message({
                        message: '请重新点击选择文件传入符合标准的文件',
                        type: 'success'
                    });
                }
            },

            getFile(obj) {

                var fileObj = document.getElementById("filePath").files[0];
                this.filePath = fileObj.path;
                this.fileName = fileObj.name;
                console.log(this.filePath);
                console.log(this.fileName);
            },
            fileurl() {
                // axios({
                //     url: "http://localhost:8083/findfile",
                //     method: "post",
                //     contentType: "application/json",
                //     data: this.input
                // }).then(function (response) {
                //     console.log(this.input);
                // });
                var that = this;
                // axios.get('http://localhost:8083/findfile').then(function (response) {
                //     console.log(response)
                // })
                // axios.post('http://localhost:8083/findfile',this.input).then(function (response) {
                //     console.log(response)
                // })
        //         let res = [
        // { TENANT_ID_: "001", company_code: "00", company_name: "大坝1", id: "1", pid: "987" },
        // { TENANT_ID_: "0010", company_code: "010", company_name: "大坝1-1", id: "1-1", pid: "987-1" },
        // { TENANT_ID_: "0011", company_code: "010", company_name: "大坝1-1", id: "1-1", pid: "987-1" },
        // { TENANT_ID_: "00101", company_code: "010", company_name: "大坝1-1.1", id: "1-1.1", pid: "987-1.1" },
        // { TENANT_ID_: "002", company_code: "00", company_name: "大坝2", id: "2", pid: "999" },
        // { TENANT_ID_: "0020", company_code: "010", company_name: "大坝2-1", id: "2-1", pid: "999-1" },
        // { TENANT_ID_: "0012", company_code: "010", company_name: "大坝1-1", id: "1-1", pid: "987-1" },
        // { TENANT_ID_: "00201", company_code: "010", company_name: "大坝2-1.1", id: "2-1.1", pid: "999-1.1" }
        // ]
        
        let res=[
            {id:"00",text:"GeoServer"},
            {id:"000",text:"test"},
            {id:"001",text:"DEM"},
            {id:"002",text:"map"},
            {id:"003",text:"city"},
            {id:"0000",text:"beijing"},
            {id:"0001",text:"hainan"},
            {id:"0002",text:"hebei"},
            {id:"0010",text:"hebei(3857)"},
            {id:"0020",text:"world"},
            {id:"0030",text:"test"},
        ]

        let arr = []

        res.map(item => {
        item.children = []
        if (item.id.length === 2) {
            arr.push(item)
        } else if (item.id.length === 3) {
        let index = arr.findIndex(findChild => findChild.id === item.id.substring(0, 2))
        arr[index].children.push(item)
        } else if (item.id.length === 4) {
        let firstIndex = arr.findIndex(findChild => findChild.id === item.id.substring(0, 2))
        let secondIndex = arr[firstIndex].children.findIndex(findChild => findChild.id === item.id.substring(0, 3))
        arr[firstIndex].children[secondIndex].children.push(item)
        }
        })
        console.log('arr', arr)
            }
        },
    };
</script>