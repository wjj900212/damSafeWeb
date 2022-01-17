export function addModels(viewer,Cesium) {
    function getInstances() {

        let instances = [];
    
        let arr = [{
            longitude: 115.9701562,
            latitude: 40.4717338
    
        }, {
            longitude: 115.9702420,
            latitude: 40.4714202
        }, {
            longitude: 115.9703411,
            latitude: 40.4710875
        }, {
            longitude: 115.9704276,
            latitude: 40.4707604
        }, {
            longitude: 115.9704276,
            latitude: 40.4704652
        }, {
            longitude: 115.9701761,
            latitude: 40.4704135
        }, {
            longitude: 115.9698934,
            latitude: 40.4703678
        }, {
            longitude: 115.9694802,
            latitude: 40.4703103
        }, {
            longitude: 115.9691675,
            latitude: 40.4702665
        }, {
            longitude: 115.9696227,
            latitude: 40.4712424
        }, {
            longitude: 115.9694309,
            latitude: 40.4712424
        }]
    
        for (let y = 0; y < arr.length; ++y) {
            let item = arr[y];
            let { longitude, latitude } = item;
            let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 493);
    
            let heading = Math.random();
            let pitch = 0;
            let roll = 0;
            let scale = item.scale ? item.scale : (Math.random() * .5 + 0.85) / 100;
    
            let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, new Cesium.HeadingPitchRoll(heading, pitch, roll));
    
            Cesium.Matrix4.multiplyByUniformScale(modelMatrix, scale, modelMatrix);
    
            instances.push({ modelMatrix: modelMatrix });
    
        }
    
        return instances;
    
    }
    
    function createCollection() {
    
        let instances = getInstances();    
        viewer.scene.primitives.add(    
            new Cesium.ModelInstanceCollection({    
                url: "./static/model/tree/scene.gltf",
                heightReference : 1,    
                instances: instances    
            })
    
        );
    
        let  position = Cesium.Cartesian3.fromDegrees(115.9695762,40.4709466, 493);
        let heading = Cesium.Math.toRadians(90.7);
        let pitch = 0;
        let roll = 0;
        let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        //刚开始加入默认datasources显示不出来
        let dataSource = new Cesium.CustomDataSource('model');
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        let entity = dataSource.entities.add({
            position : position,
            orientation,
            model : {
                uri: "./static/model/yanqing/5.gltf",
                scale:0.75,
                // minimumPixelSize : 128,
                // distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0, 1000),
                heightReference:0,
                // maximumScale : 2
            }
        });

        viewer.dataSources.add(dataSource);
    }  
    
    createCollection()
}

