<script setup lang="ts">


interface CountryData {
    country:string,
    win:number
    br:string
}

interface LabelData {
    country:string
    detail:Array<CountryData>
}



const data:Array<LabelData> = []

//todo:编写获取数据部分和 vue store交互部分


</script>


<template>
    <div class="flex heatmap-contian">
        <div class="flex" id="heat-mapx">
            <div class="flex br-heatmap-y" id="br-heatmap-y">
            </div>
            <div id="heat-map">
                <div class="flex heatmap-table">
                    <div class="flex heatmap-table-col"
                        v-for="item of data"
                        :key="item.country"
                    >
                        <div class="heatmap-table-cell"
                            v-for="cell of item.detail"
                            :key="cell.win"
                            ></div>
                        <div class="heatmap-table-country">{{ item.country }}</div>
                    </div>
                </div>
            </div>
            <div id="color-bar">
            </div>
        </div>
        <div id="heat-map-y">

        </div>
    </div>
</template>

<style>
.flex{
    display: flex;
}

.heatmap-contian{
    display: flex;
    height: auto;
}
.br-heatmap-y{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 20px;
    min-width: 90px;
}
.br-heatmap-y > div {
    height: 26px;
}
.heat-mapx{
    display: flex;
}

.heatmap-table{
    flex-flow: row;
}

.heatmap-table-col{
    flex-flow: column;
    align-items: center;
}

.heatmap-table-cell{
    width: 48px;
    height: 24px;
    transition: 0.3s;
    border: solid 1px;
    background-color: aqua;
}
.heatmap-table-cell:hover{
    transform: scale(1.3);
}
.heatmap-table-country{
    margin-top: 14px;
    font-size: 13px;
}
</style>