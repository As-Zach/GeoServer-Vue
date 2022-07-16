<template>
    <div>
        <h2>Basic Tree</h2>
        <Tree :data="data" :selectLeafOnly="true" @selectionChange="selection=$event"></Tree>
        <p v-if="selection">Selected: {{selection.text}}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selection: null,
                data: this.getTree()
            };
        },
        methods: {
            getTree() {
                let res=[]
                let arr = []
                axios.get('http://localhost:8083/treelist').then((response) => {
                    console.log(response)
                    res = response.data                   
                    res.map(item => {
                        item.children = []
                        if (item.id.length === 2) {
                            arr.push(item)
                        } else if (item.id.length === 3) {
                            let index = arr.findIndex(findChild => findChild.id === item.id.substring(0, 2))
                            arr[index].children.push(item)
                        } else if (item.id.length === 4) {
                            let firstIndex = arr.findIndex(findChild => findChild.id === item.id.substring(0, 2))
                            let secondIndex = arr[firstIndex].children.findIndex(findChild => findChild.id === item
                                .id.substring(0, 3))
                            arr[firstIndex].children[secondIndex].children.push(item)
                        }else if (item.id.length === 5) {
                            let firstIndex = arr.findIndex(findChild => findChild.id === item.id.substring(0, 2))
                            let secondIndex = arr[firstIndex].children.findIndex(findChild => findChild.id === item
                                .id.substring(0, 3))
                            let thirdIndex = arr[firstIndex].children[secondIndex].children.findIndex(findChild => findChild.id === item
                                .id.substring(0, 4))
                            arr[firstIndex].children[secondIndex].children[thirdIndex].children.push(item)
                        }
                    })    
                    console.log(arr)      
                })
                return arr               
            },
            getData() {
                return [{
                    id: 1,
                    text: "GeoServer",
                    children: [{
                            id: 11,
                            text: "华北地区",
                            state: "closed",
                            children: [{
                                    id: 111,
                                    text: "地表影像",
                                    children: [
                                        {
                                        id: 1111,
                                        text: "北京市",
                                    },{
                                        id: 1111,
                                        text: "河北省",
                                    },{
                                        id: 1111,
                                        text: "山西省",
                                    }
                                ]
                                },
                                {
                                    id: 112,
                                    text: "数字高程",
                                    children: [{
                                        id: 1111,
                                        text: "L10.tif",
                                    },{
                                        id: 1111,
                                        text: "L7.tif",
                                    }]
                                },
                                {
                                    id: 112,
                                    text: "矢量数据",
                                    children: [{
                                        id: 1111,
                                        text: "铁路图",
                                    },{
                                        id: 1111,
                                        text: "河流图",
                                    }]
                                }
                            ]
                        },
                        {
                            id: 12,
                            text: "西南地区",
                            children: [{
                                        id: 111,
                                        text: "栅格数据",
                                        children: [{
                                        id: 1111,
                                        text: "elevation",
                                    }]
                                    },{
                                        id: 111,
                                        text: "三维模型",
                                        children: [{
                                        id: 1111,
                                        text: "油气站场模型",
                                    },{
                                        id: 1111,
                                        text: "城镇模型",
                                    }]
                                    }]
                        },
                        {
                            id: 13,
                            text: "世界地图",
                            children: [{
                                    id: 13,
                                    text: "OSM地图"
                                },
                                {
                                    id: 122,
                                    text: "Bing Map"
                                }
                            ]
                        },
                        
                    ]
                }];
            }
        }
    };
</script>