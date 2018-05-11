import ScratchStorage from 'scratch-storage';

import defaultProjectAssets from './default-project';

const PROJECT_SERVER = 'http://localhost:8082';
const ASSET_SERVER = 'https://cdn.assets.scratch.mit.edu';

/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class Storage extends ScratchStorage {
    constructor () {
        super();
        this.addWebSource(
            [this.AssetType.Project],
            projectAsset => {
                fetch(`${PROJECT_SERVER}/projects/${projectAsset.assetId}`)
                    .then(response => response.json())
                    .then(myJson => {
                        console.log("JSON",myJson);
                    });
                return `${PROJECT_SERVER}/projects/${projectAsset.assetId}`.data;
            }
        );
        this.addWebSource(
            [this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound],
            asset => `${ASSET_SERVER}/internalapi/asset/${asset.assetId}.${asset.dataFormat}/get/`
        );
        this.addWebSource(
            [this.AssetType.Sound],
            asset => `static/extension-assets/scratch3_music/${asset.assetId}.${asset.dataFormat}`
        );
        defaultProjectAssets.forEach(asset => this.cache(
            this.AssetType[asset.assetType],
            this.DataFormat[asset.dataFormat],
            asset.data,
            asset.id
        ));
    }
}

const storage = new Storage();

export default storage;
